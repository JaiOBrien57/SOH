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

//Setup the Dear API
const dearHeaders = {
  'Content-Type': 'application/json',
  'api-auth-accountid': '17c87b52-bd17-44ca-a461-3eb522ef708d',
  'api-auth-applicationkey': 'de744903-23ba-5a16-a198-fab8bd7e207e'
}
const SaleURL = "https://inventory.dearsystems.com/ExternalApi/v2/sale"
const SaleOrderURL = "https://inventory.dearsystems.com/ExternalApi/v2/sale/order"


//Receive the request on refresh from frontend
app.get("/api/renewedDevicesList", (req, res) => {
  async function getAvailList(){
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
    if (Model == null || Model == "") {
      Model="UNKOWN"
    }
    var GB = element.Product.AdditionalAttribute3
    var Colour = element.Product.AdditionalAttribute4
    var Connectivity = element.Product.AdditionalAttribute5
    var Battery = element.Product.AdditionalAttribute6
    var Grade = element.Product.AdditionalAttribute7
  
    if (Model.includes("iPad")) {
      var FinalModel = Brand+" "+Model+" "+GB+" "+Connectivity+" - "+Colour
    }if (!Model.includes("iPad")) {
      var FinalModel = Brand+" "+Model+" "+GB+" - "+Colour
    }

    if (Battery == "New Battery") {
      Battery = "100%"
    }

   
    if(!cacheArray.includes(SKU) && Name.includes("Renewed")){
      cacheArray.push(SKU)
      availUnique.push({"SKU":SKU,"Name":Name,"ID":IDDear,"DealerPrice":PriceTier1,"FinalModel":FinalModel,"Grade":Grade,"Battery":Battery,"AVGCost":AVGCost})
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
      availFormatted.push({"IDDear":IDDear,"SKU":SKU,"Name":Name,"AvailableCage":CageQTY,"AvailableRefurbCage":RefurbCageTwoQTY,"DealerPrice":DealerPrice,"TotalQTY":TotalQTY,"FinalModel":FinalModel,"Grade":Grade,"Battery":Battery,"AVGCost":AVGCost})
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
    console.log("Avail List has Been Fetched and Formatted")
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



//Launch the backend server
app.listen(5000, () => {
  console.log("Server Started On Port 5000");
});
