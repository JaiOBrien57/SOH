const express = require("express");
const app = express();
const cors = require("cors");
const fetch = require("node-fetch");
var bodyParser = require("body-parser");

//Setting up the app background vars
app.use(cors());
app.disable("etag");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

//Setup postgresSQL database vars
const {Client} = require("pg")

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "Jindalee1!",
  database: "backend"
})

client.connect()

//Setup the Dear API
const dearHeaders = {
  'Content-Type': 'application/json',
  'api-auth-accountid': '17c87b52-bd17-44ca-a461-3eb522ef708d',
  'api-auth-applicationkey': 'de744903-23ba-5a16-a198-fab8bd7e207e'
}
const SaleURL = "https://inventory.dearsystems.com/ExternalApi/v2/sale"
const SaleOrderURL = "https://inventory.dearsystems.com/ExternalApi/v2/sale/order"


//Recieve parts list
app.get("/api/allparts", (req, res) => {
  async function getAllParts(){
    const partsRequest = await fetch("https://api.renewablemobile.com.au/dear/product?fields=ID,SKU,Name&AdditonalAttribute6=EXACT(Part)", {method: "GET", headers: {"auth":"Jindalee1!"}})
    const partsResponse = await partsRequest.json()

    //Sending results back
    res.json(partsResponse).status(200)
    console.log("Renewed Devices Avail List has Been Fetched and Formatted")
    res.json("ERROR").status(500)
    console.log("Avail list fetch fail:",error)
  }
  
})

//Receive avail list
app.get("/api/renewedDevicesList", (req, res) => {
  async function getAvailList(){
  try{
    //Get the avail list
      const availRequest = await fetch("https://api.renewablemobile.com.au/dear/productavailability?fields=ID,SKU,Name,Available,Location,Bin&Name=LIKE(Renewed)&includeproduct=true",{method: "GET", headers: {"auth":"Jindalee1!"}})
      const availResponse = await availRequest.json()

    //Loop through to get the list formatted for Dealer Cage and Refurb Cage QTY
    //Get the unique array from avail SKU'S
    var availUnique = []
    var cacheArray = []
    availResponse.Items.forEach(element => {
      var SKU = element.SKU
      var Name = element.Name
      var IDDear = element.ID
      var PriceTier1 = element.Product.PriceTier1
      var Brand = element.Product.AdditionalAttribute1
      var Model = element.Product.AdditionalAttribute2
      var AVGCost = element.Product.AverageCost
      var PriceTierAVGCost = element.Product.PriceTier6
      if (Model == null || Model == "") {
        Model="UNKOWN"
      }
      var GB = element.Product.AdditionalAttribute3
      var Colour = element.Product.AdditionalAttribute4
      var Connectivity = element.Product.AdditionalAttribute5
      var Battery = element.Product.AdditionalAttribute6
      var Grade = element.Product.AdditionalAttribute7
    
      if (Model.includes("iPad")) {
        var FinalModel = Brand+" "+Model+" "+GB+" "+Connectivity
      }if (!Model.includes("iPad")) {
        var FinalModel = Brand+" "+Model+" "+GB
      }

      if (Battery == "New Battery") {
        Battery = "100%"
      }

    
      if(!cacheArray.includes(SKU) && Name.includes("Renewed")){
        cacheArray.push(SKU)
        availUnique.push({"SKU":SKU,"Name":Name,"ID":IDDear,"DealerPrice":PriceTier1,"FinalModel":FinalModel,"Grade":Grade,"Battery":Battery,"AVGCost":AVGCost,"Colour":Colour,"AVGPriceTier":PriceTierAVGCost})
      }

    })

    //Sum the unique against full array
    var availFormatted = []
    availUnique.forEach(element => {
      var SKU = element.SKU
      var Name = element.Name
      var IDDear = element.ID
      var CageQTY = 0
      var RefurbCageTwoQTY = 0
      var TotalQTY = 0
      var DealerPrice = element.DealerPrice
      var FinalModel = element.FinalModel
      var Grade = element.Grade
      var Battery = element.Battery
      var AVGCost = element.AVGCost
      var Colour = element.Colour
      var PriceTierAVGCost = element.AVGPriceTier

      availResponse.Items.forEach(elementTwo => {
        var SKUBulk = elementTwo.SKU
        var AvailableQTYBulk = parseInt(elementTwo.Available)
        var LocationBulk = elementTwo.Location
        var BinBulk = elementTwo.Bin
        
        if(SKU == SKUBulk && LocationBulk == "BNE - Main Warehouse" && BinBulk == "Cage" && AvailableQTYBulk > 0){
          CageQTY = CageQTY+AvailableQTYBulk
        }

        if(SKU == SKUBulk && LocationBulk == "BNE - CAGE - Refurb 2 (106.2)" && AvailableQTYBulk > 0){
          RefurbCageTwoQTY = RefurbCageTwoQTY+AvailableQTYBulk
        } 

      })

      TotalQTY = CageQTY+RefurbCageTwoQTY

      if(CageQTY != "" || RefurbCageTwoQTY != ""){
        availFormatted.push({"IDDear":IDDear,"SKU":SKU,"Name":Name,"AvailableCage":CageQTY,"AvailableRefurbCage":RefurbCageTwoQTY,"DealerPrice":DealerPrice,"TotalQTY":TotalQTY,"FinalModel":FinalModel,"Grade":Grade,"Battery":Battery,"AVGCost":AVGCost,"Colour":Colour,"AVGPriceTier":PriceTierAVGCost})
      }

    });

    //Sort the array by name
    availFormatted.sort((a,b)=>{if (a.FinalModel < b.FinalModel) {
      return -1;
    }
    if (a.FinalModel > b.FinalModel) {
      return 1;
    }
    return 0;})

    //Query the SQL Database
    const SQLRes = await client.query(`SELECT * FROM public."SOH_Pricing_Management" ORDER BY "Model" ASC `)
    const SQLRows = await SQLRes.rows

    const FinalArrayWithSQLData = []
    availFormatted.forEach((row)=>{
      const IDDear = row.IDDear
      const SKU = row.SKU
      const Name = row.Name
      const AvailableCage = row.AvailableCage
      const AvailableRefurbCage = row.AvailableRefurbCage
      const DealerPrice = row.DealerPrice
      const TotalQTY = row.TotalQTY
      const FinalModel = row.FinalModel
      const Grade = row.Grade
      const Battery = row.Battery
      const AVGCost = row.AVGCost
      const Colour = row.Colour
      const AVGPriceTier = row.AVGPriceTier
      let Checker = false
      let BXT_Lowest_Price = ""

      SQLRows.forEach((rowSQL)=>{
        const ModelSQL = rowSQL.Model
        const BXTLowestSQL = rowSQL.BXT_Lowest_Price

        if(Checker === false && ModelSQL === FinalModel){
          BXT_Lowest_Price = BXTLowestSQL
          Checker = true
        }
      })

      //Run the for each for the extra Bulk Trader Price Tier ***Check Email
      if(AVGCost/DealerPrice < 40)

      FinalArrayWithSQLData.push({"IDDear":IDDear,"SKU":SKU,"Name":Name,"AvailableCage":AvailableCage,"AvailableRefurbCage":AvailableRefurbCage,"DealerPrice":DealerPrice,"TotalQTY":TotalQTY,"FinalModel":FinalModel,"Grade":Grade,"Battery":Battery,"AVGCost":AVGCost,"Colour":Colour,"AVGPriceTier":AVGPriceTier,"BXT_Lowest_Price":BXT_Lowest_Price})

    })



    //Sending results back
      res.json(FinalArrayWithSQLData).status(200)
      console.log("Renewed Devices Avail List has Been Fetched and Formatted")
    }catch(error){
      res.json("ERROR").status(500)
      console.log("Avail list fetch fail:",error)
    }
  }
  getAvailList()
});


//Receive Faulty device list from cage, cage2
app.get("/api/faultyDeviceList", (req, res) => {
  async function getAvailList(){
  try{
    //Get the avail list
      const availRequest = await fetch("https://api.renewablemobile.com.au/dear/productavailability?fields=ID,SKU,Name,Available,Location,Bin&Name=LIKE(Major Fault)&includeproduct=true",{method: "GET", headers: {"auth":"Jindalee1!"}})
      const availResponse = await availRequest.json()

    //Loop through to get the list formatted for Dealer Cage and Refurb Cage QTY
    //Get the unique array from avail SKU'S
    var availUnique = []
    var cacheArray = []
    availResponse.Items.forEach(element => {
      var SKU = element.SKU
      var Name = element.Name
      var IDDear = element.ID
      var PriceTier1 = element.Product.PriceTier1
      var Brand = element.Product.AdditionalAttribute1
      var Model = element.Product.AdditionalAttribute2
      var AVGCost = element.Product.AverageCost
      var PriceTierAVGCost = element.Product.PriceTier6
      if (Model == null || Model == "") {
        Model="UNKOWN"
      }
      var GB = element.Product.AdditionalAttribute3
      var Colour = element.Product.AdditionalAttribute4
      var Connectivity = element.Product.AdditionalAttribute5
      var Battery = element.Product.AdditionalAttribute6
      var Grade = element.Product.AdditionalAttribute7
    
      if (Model.includes("iPad")) {
        var FinalModel = Brand+" "+Model+" "+GB+" "+Connectivity
      }if (!Model.includes("iPad")) {
        var FinalModel = Brand+" "+Model+" "+GB
      }

      if (Battery == "New Battery") {
        Battery = "100%"
      }

    
      if(!cacheArray.includes(SKU) && Name.includes("Major Fault")){
        cacheArray.push(SKU)
        availUnique.push({"SKU":SKU,"Name":Name,"ID":IDDear,"DealerPrice":PriceTier1,"FinalModel":FinalModel,"Grade":Grade,"Battery":Battery,"AVGCost":AVGCost,"Colour":Colour,"AVGPriceTier":PriceTierAVGCost})
      }

    })

    //Sum the unique against full array
    var availFormatted = []
    availUnique.forEach(element => {
      var SKU = element.SKU
      var Name = element.Name
      var IDDear = element.ID
      var CageQTY = 0
      var RefurbCageTwoQTY = 0
      var TotalQTY = 0
      var DealerPrice = element.DealerPrice
      var FinalModel = element.FinalModel
      var Grade = element.Grade
      var Battery = element.Battery
      var AVGCost = element.AVGCost
      var Colour = element.Colour
      var PriceTierAVGCost = element.AVGPriceTier

      availResponse.Items.forEach(elementTwo => {
        var SKUBulk = elementTwo.SKU
        var AvailableQTYBulk = parseInt(elementTwo.Available)
        var LocationBulk = elementTwo.Location
        var BinBulk = elementTwo.Bin
        
        if(SKU == SKUBulk && LocationBulk == "BNE - Main Warehouse" && BinBulk == "Cage" && AvailableQTYBulk > 0){
          CageQTY = CageQTY+AvailableQTYBulk
        }

      })

      TotalQTY = CageQTY

      if(CageQTY != "" || RefurbCageTwoQTY != ""){
        availFormatted.push({"IDDear":IDDear,"SKU":SKU,"Name":Name,"AvailableCage":CageQTY,"DealerPrice":DealerPrice,"TotalQTY":TotalQTY,"FinalModel":FinalModel,"Grade":Grade,"Battery":Battery,"AVGCost":AVGCost,"Colour":Colour,"AVGPriceTier":PriceTierAVGCost})
      }

    });

    //Sort the array by name
    availFormatted.sort((a,b)=>{if (a.FinalModel < b.FinalModel) {
      return -1;
    }
    if (a.FinalModel > b.FinalModel) {
      return 1;
    }
    return 0;})


    //Sending results back
      res.json(availFormatted).status(200)
      console.log("Faulty Devices Avail List has Been Fetched and Formatted")
    }catch{
      res.json("ERROR").status(500)
      console.log("Avail list fetch fail")
    }
  }
  getAvailList()
});


//Get Request from frontend for pushing sale
app.post("/api/saleSelect", (req, res) => {
  async function runSelectReq(){
  //Get the select table of data
  const SelectTableData = req.body;
  //Make Sale in dear
  const saleBody = {"Customer":"Test Order"}
  const DearReq = await fetch(SaleURL,{method: "POST", headers: dearHeaders,body: JSON.stringify(saleBody)})
  const DearRes = await DearReq.json()
  const DearResCode = await DearReq.status
  const NewSaleID = DearRes.ID
  console.log("New Sale, ID:",NewSaleID,DearResCode)
  //Make Sale Order in dear
  const lineItems = SelectTableData.map((row) => ({"ProductID": row.IDDear,"SKU": row.SKU,"Name": row.Name, "Quantity": row.TotalQTY, "Price": parseFloat(String(row.Price).replace("$","").trim()), "Tax": 0, "TaxRule": "GST (Sale)","Total": parseInt(row.TotalQTY)*parseFloat(row.Price)}))
  const saleOrderBody = {"SaleID":NewSaleID,"Status":"DRAFT","Lines": lineItems}
  const DearReqSale = await fetch(SaleOrderURL,{method: "POST", headers: dearHeaders,body: JSON.stringify(saleOrderBody)})
  const DearResSale = await DearReqSale.json()
  const DearResSaleStatus = await DearReqSale.status
  const SaleSO = DearResSale.SaleOrderNumber
  console.log("New Dear SO:",SaleSO,DearResSaleStatus)
  //Send response back to frontend
  if(DearResCode === 200 && DearResSaleStatus === 200){
    res.json({"Server Response":"success","SaleOrder": SaleSO,"SaleID":NewSaleID,"ResCode":200}).status(200)
  }if(DearResCode != 200 || DearResSaleStatus != 200){
    res.json({"Server Response":"error","SaleOrder": SaleSO,"SaleID":NewSaleID,"ResCode":500}).status(500)
  }
    
  }
runSelectReq()
});


//Get Request from frontend for pushing transfer
app.post("/api/transferSelect", (req, res) => {
  async function runSelectReq(){
  //Get the select table of data
  const SelectTableData = req.body;
  console.log(SelectTableData)
  //Make Transfer in dear
  
  //Send response back to frontend
  res.json({"Server Response":"Transfer Success"}).status(200)
    
  }
runSelectReq()
});


//Get the Prod List
app.get("/api/prodList" ,(req,res) => {
  async function getProdList(){
    try{
    //Get the prod list
    const prodRequest = await fetch("https://api.renewablemobile.com.au/dear/product/?fields=SKU,Name,PriceTier1,AverageCost,PriceTier6,AdditionalAttribute1,AdditionalAttribute2,AdditionalAttribute3,AdditionalAttribute4,AdditionalAttribute5,AdditionalAttribute6,AdditionalAttribute7&Name=LIKE(Renewed)",{method: "GET", headers: {"auth":"Jindalee1!"}})
    const prodResposne = await prodRequest.json()
    //Format the prod list
    const ProdListFormatted = prodResposne.Items
    console.log("Prod List Retrieved Successfully")
    //Send response back to frontend
    res.json(ProdListFormatted).status(200)
    }catch{
      res.json("ERROR").status(500)
    }
    }
    getProdList()
})


//Get the GSM Arena Device List
app.get("/api/gsmArenaDeviceList", (req,res) => {
  async function getGSMArenaDeviceList(){
    try{
    //Get the GSM Arena List
    const gsmRequest = await fetch("https://script.google.com/macros/s/AKfycbxNu27V2Y2LuKUIQMK8lX1y0joB6YmG6hUwB1fNeVbgzEh22TcDGrOak03Fk3uBHmz-/exec?route=device-list",{method: "GET", headers: {}})
    const gsmResposne = await gsmRequest.json()
    //Format GSM Arena List 
    const gsmListExpanded = gsmResposne.data
    const gsmListFormatted = []
    
    gsmListExpanded.forEach((row)=>{
      const deviceList = row.device_list
      const BrandName = row.brand_name
      
      deviceList.forEach((rowNew)=>{
        const deviceName = rowNew.device_name
        const deviceKey = rowNew.key
        const ModelToPush = BrandName+" "+deviceName
        gsmListFormatted.push({"Model":ModelToPush,"GSMKey":deviceKey})
      })
    })

    console.log("GSM Arena Device List Retrieved Successfully")
    //Send response back to frontend
    res.json(gsmListFormatted).status(200)
    }catch (error){
      console.log("GSM ERROR FETCHING:",error)
      res.json("ERROR").status(500)
    }
    }
    getGSMArenaDeviceList()
})


//Get all the GSM Arena Variants
app.post("/api/GetGSMArenaVariantsSpecificModel",(req,res)=>{
  async function getGSMVariantsSpeceificModel(){
    try{

      //Get the data and query GSM Arena Device Attributes
      const dataFromFrontend = req.body
      const GSMModel = dataFromFrontend.GSMModel
      const GSMModelKey = dataFromFrontend.GSMModelKey
      const DearModel = dataFromFrontend.DearModel
      console.log("Data Received Frontend",dataFromFrontend)
      const GSMDeviceDetailsRequest = await fetch("https://script.google.com/macros/s/AKfycbxNu27V2Y2LuKUIQMK8lX1y0joB6YmG6hUwB1fNeVbgzEh22TcDGrOak03Fk3uBHmz-/exec",{method: "POST", headers: {'Content-Type': 'application/json'},body: JSON.stringify({"route": "device-detail","key":GSMModelKey})})
      const GSMDeviceDetailsResponse = await GSMDeviceDetailsRequest.json()

      //Get Prod List
      const ProdListURL = await fetch(`https://api.renewablemobile.com.au/dear/product/?fields=SKU,Name,PriceTier1,AdditionalAttribute1,AdditionalAttribute2,AdditionalAttribute3,AdditionalAttribute4,AdditionalAttribute5,AdditionalAttribute6,AdditionalAttribute7&Name=AND(LIKE(${DearModel}),LIKE(Renewed))`,{method: "GET", headers: {"auth":"Jindalee1!"}})
      const ProdListResposne = await ProdListURL.json()

      //Summarize prod list to only include model chosen
      const summarizedProdList = []
      ProdListResposne.Items.forEach((row)=>{
        const BrandProd = row.AdditionalAttribute1
        const ModelProd = row.AdditionalAttribute2
        const ModelToCheck = BrandProd+" "+ModelProd

        if(ModelToCheck == DearModel){
          summarizedProdList.push({row})
        }
          
      })

      //Possible Variants
      const PossibleGrades = ["A","B+","B-","C+"] //Need to workout how to do battery 70%
      const PossibleColours = [GSMDeviceDetailsResponse].map((row)=>(row.data.more_specification[12].data[0].data[0]))[0].split(",").map((row)=>(row.trim()))
      const PossibleGBs = GSMDeviceDetailsResponse.data.storage.split(",")[0].replace("storage","").replace("Storage","").trim().split("/")
      const PossibleBatterys = ["New Battery","85%+","80%+"] //Need to workout how to do battery 70%
      const Brand = DearModel.split(" ")[0].trim()
      const Model = DearModel.replace(Brand,"").trim()

      //Loop Through & Create Variants
      VariantsNotExisting = []
      PossibleGBs.forEach((rowGB)=>{
        const GB = rowGB

        PossibleColours.forEach((rowColour)=>{
          const Colour = rowColour

          PossibleBatterys.forEach((rowBattery)=>{
            const Battery = rowBattery

            PossibleGrades.forEach((rowGrade)=>{
              const Grade = rowGrade
              let FoundMatch = false
              const CombinationGSMToCheck = Brand+" "+Model+" "+GB+" "+Colour+" "+"None"+" "+Battery+" "+Grade
              const AttributesFromGSM = {"Brand":Brand,"Model":Model,"GB":GB,"Colour":Colour,"Connectivity":"None","Battery":Battery,"Grade":Grade}
              
              //Loop throught prod list to see if these attributes don't match and if not make it
              summarizedProdList.forEach((rowProdList)=>{
                if(FoundMatch === false){
                  const BrandProdList = rowProdList.row.AdditionalAttribute1
                  const ModelProdList = rowProdList.row.AdditionalAttribute2
                  const GBProdList = rowProdList.row.AdditionalAttribute3
                  const ColourProdList = rowProdList.row.AdditionalAttribute4
                  const ConnectivityProdList = rowProdList.row.AdditionalAttribute5
                  const BatteryProdList = rowProdList.row.AdditionalAttribute6
                  const GradeProdList = rowProdList.row.AdditionalAttribute7
                  const CombinationToCheckProd = BrandProdList+" "+ModelProdList+" "+GBProdList+" "+ColourProdList+" "+ConnectivityProdList+" "+BatteryProdList+" "+GradeProdList

                  if(CombinationGSMToCheck === CombinationToCheckProd){
                    FoundMatch = true
                  }
                }
              })
              
              //If No Match Push New Variant To Be Made
              if(FoundMatch == false){
                VariantsNotExisting.push(AttributesFromGSM)
              }

            })

          })

        })

      })

      console.log("Variants Not Existing Pushed To Frontend Successfully")
      res.json({VariantsNotExisting}).status(200)
    }catch (error){
      console.log(error)
    }
  }
  getGSMVariantsSpeceificModel()
})



//Get the Prod List For SOH Settings Variables
app.get("/api/prodList_SOH_Settings" ,(req,res) => {
  async function getProdList(){
    try{
    //Get the prod list
    const prodRequest = await fetch("https://api.renewablemobile.com.au/dear/product/?fields=SKU,Name,PriceTier1,AdditionalAttribute1,AdditionalAttribute2,AdditionalAttribute3,AdditionalAttribute4,AdditionalAttribute5,AdditionalAttribute6,AdditionalAttribute7,AverageCost,PriceTier6,AttributeSet&Name=LIKE(Renewed)&AttributeSet=EXACT(Phone-Attributes)",{method: "GET", headers: {"auth":"Jindalee1!"}})
    const prodResposne = await prodRequest.json()
    //Format the prod list
    const ProdListFormatted = prodResposne.Items
    const FormattedProdArray = []
    const cacheArray = []
    ProdListFormatted.forEach((row)=>{
      const Brand = row.AdditionalAttribute1
      let Model = row.AdditionalAttribute2
      const GB = row.AdditionalAttribute3
      const Connectivity = row.AdditionalAttribute5
      const CageAVG = row.AverageCost
      const PriceTierAVG = row.PriceTier6
      const AttributeSet = row.AttributeSet

      if(Connectivity != "None"){
        Model = Model+" "+Connectivity
      }

      const FinalModelFull = Brand+" "+Model+" "+GB
      
      if(!cacheArray.includes(FinalModelFull) && Brand!= "" && Brand != null && Brand != "null" && Model != null && Model != "null" && Model != "null null" && AttributeSet === "Phone-Attributes"){
        cacheArray.push(FinalModelFull)
        FormattedProdArray.push({"FullModel":FinalModelFull,"Brand":Brand,"Model":Model,"GB":GB,"AVGCage":CageAVG,"PriceTierAVG":PriceTierAVG})
      }

    })


      //Sort the array by name
      FormattedProdArray.sort((a,b)=>{if (a.FullModel < b.FullModel) {
        return -1;
      }
      if (a.FullModel > b.FullModel) {
        return 1;
      }
      return 0;})


      //Query the SQL Database
      const SQLRes = await client.query(`SELECT * FROM public."SOH_Pricing_Management" ORDER BY "Model" ASC `)
      const SQLRows = await SQLRes.rows

      //Loop through array to match the SQL Data to prod list
      const FormattedProdWithSQLArray = []
      FormattedProdArray.forEach((row)=>{
        const FullModel = row.FullModel
        const Brand = row.Brand
        const Model = row.Model
        const GB = row.GB
        const AVGCage = row.AVGCage
        const PriceTierAVG = row.PriceTierAVG
        let BXT_Lowest_Price = ""
        let Checker = false
        
        SQLRows.forEach((rowSQL)=>{
          const ModelSQL = rowSQL.Model
          const BXTLowestSQL = rowSQL.BXT_Lowest_Price

          if(Checker === false && ModelSQL === FullModel){
            BXT_Lowest_Price = BXTLowestSQL
            Checker = true
          }
        })
        
        FormattedProdWithSQLArray.push({"FullModel":FullModel,"Brand":Brand,"Model":Model,"GB":GB,"AVGCage":AVGCage,"PriceTierAVG":PriceTierAVG,"BXT_Lowest_Price":BXT_Lowest_Price})

      })

    console.log("Prod List Retrieved Successfully")
    //Send response back to frontend
    res.json(FormattedProdWithSQLArray).status(200)
    }catch(error){
      res.json("ERROR").status(500)
      console.log("ERROR:",error)

    }
    }
    getProdList()
})


//Update Pricing Variables Set on the sheet
app.post("/api/SOHUpdateSQLVarsPricing", (req, res) => {
  async function runSQLUpdate(){  
    //Retrieve Data from frontend
    const dataFromFrontend = req.body
    //Make SQL Query
    const value_string = dataFromFrontend.map(row=> `('${row.FullModel}', '${row.BXT_Lowest_Price}')`).join(",")
    console.log("SQL Formatted String:",value_string)
    const SQLReqTEST = await client.query(`INSERT INTO public."SOH_Pricing_Management" ("Model","BXT_Lowest_Price") VALUES ${value_string} ON CONFLICT ("Model") DO UPDATE SET "BXT_Lowest_Price" = excluded."BXT_Lowest_Price"`)
    console.log("SQL Result:",SQLReqTEST) 
    res.json("SQL Data Pushed Successfully").status(200)
  }
  runSQLUpdate()
});


//Get GSM Attributes to autofill frontent selects
app.post("/api/ProductManagement_GSMAttributes_AutoFill",(req,res)=>{
  async function FetchAttributes(){
    try{
      //Retrieve Data from frontend
      const dataFromFrontend = req.body
      const GSMKey = dataFromFrontend.GSMKey
      //Fetch Data from GSM Arena API
      const GSMDeviceDetailsRequest = await fetch("https://script.google.com/macros/s/AKfycbxNu27V2Y2LuKUIQMK8lX1y0joB6YmG6hUwB1fNeVbgzEh22TcDGrOak03Fk3uBHmz-/exec",{method: "POST", headers: {'Content-Type': 'application/json'},body: JSON.stringify({"route": "device-detail","key":GSMKey})})
      const GSMDeviceDetailsResponse = await GSMDeviceDetailsRequest.json()
      //Format the JSON to Send Back
      const GBS = GSMDeviceDetailsResponse.data.storage.split(",")[0].replace("storage","").replace("Storage","").trim().split("/")
      const Colours = [GSMDeviceDetailsResponse].map((row)=>(row.data.more_specification[12].data[0].data[0]))[0].split(",").map((row)=>(row.trim()))
      res.json({"GBS":GBS,"Colours":Colours}).status(200)
    }catch{
      res.json("GSM Request Failed").status(500)
    }
  }
  FetchAttributes()
})






//Launch the backend server
app.listen(5000, () => {
  console.log("Server Started On Port 5000");
});
