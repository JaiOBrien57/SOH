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


//Receive the request on refresh from frontend
app.get("/api/availList", (req, res) => {
  async function getAvailList(){
  //Get the avail list
    const availRequest = await fetch("https://api.renewablemobile.com.au/dear/productavailability?fields=ID,SKU,Name,Available,Location,Bin&Name=LIKE(Renewed)",{method: "GET", headers: {"auth":"Jindalee1!"}})
    const availResponse = await availRequest.json()
  //Get the Prod list
    const prodRequest = await fetch("https://api.renewablemobile.com.au/dear/product/?Name=LIKE(Renewed)&fields=SKU,PriceTier1",{method: "GET", headers: {"auth":"Jindalee1!"}})
    const prodResponse = await prodRequest.json()
    //Loop through to get the list formatted for Dealer Cage and Refurb Cage QTY
  //Get the unique array from avail SKU'S
  var availUnique = []
  var cacheArray = []
  availResponse.Items.forEach(element => {
    var SKU = element.SKU
    var Name = element.Name
    var IDDear = element.ID
   
    if(!cacheArray.includes(SKU) && Name.includes("Renewed")){
      cacheArray.push(SKU)
      availUnique.push({"SKU":SKU,"Name":Name,"ID":IDDear})
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

    availResponse.Items.forEach(elementTwo => {
      var SKUBulk = elementTwo.SKU
      var AvailableQTYBulk = parseInt(elementTwo.Available)
      var LocationBulk = elementTwo.Location
      var BinBulk = elementTwo.Bin
      
      if(SKU == SKUBulk && LocationBulk == "BNE - Main Warehouse" && BinBulk == "Cage"){
        CageQTY = CageQTY+AvailableQTYBulk
      }

      if(SKU == SKUBulk && LocationBulk == "BNE - CAGE - Refurb 2 (106.2)"){
        RefurbCageTwoQTY = RefurbCageTwoQTY+AvailableQTYBulk
      } 
    })
    

    if(CageQTY != "" || RefurbCageTwoQTY != ""){
      availFormatted.push({"IDDear":IDDear,"SKU":SKU,"Name":Name,"AvailableCage":CageQTY,"AvailableRefurbCage":RefurbCageTwoQTY})
    }

  });

  //Loop through prod and avail to get the dealer price and final array
  availFinalFormat = []
  availFormatted.forEach(row=>{
    var IDDear = row.IDDear
    var SKU = row.SKU
    var Name = row.Name
    var AvailableCage = row.AvailableCage
    var AvailableRefurbCage = row.AvailableRefurbCage
    var Checker = false

    prodResponse.Items.forEach(rowProd=>{
      var SKUProd = rowProd.SKU
      var DealerProd = parseFloat(rowProd.PriceTier1.toFixed(2))
      
      if(Checker == false && SKU == SKUProd){
        availFinalFormat.push({"IDDear":IDDear,"SKU":SKU,"Name":Name,"AvailableCage":AvailableCage,"AvailableRefurbCage":AvailableRefurbCage,"DealerPrice":DealerProd})
        Checker = true
      }

    })

    if(Checker == false){
      availFinalFormat.push({"IDDear":IDDear,"SKU":SKU,"Name":Name,"AvailableCage":AvailableCage,"AvailableRefurbCage":AvailableRefurbCage,"DealerPrice":"0"})
    }

  })


  //Sort the array by name
  availFinalFormat.sort((a,b)=>{if (a.Name < b.Name) {
    return -1;
  }
  if (a.Name > b.Name) {
    return 1;
  }
  return 0;})


  //Sending results back
    res.json(availFinalFormat).status(200)
    console.log(availFinalFormat)
  }
  getAvailList()
});



//Launch the backend server
app.listen(5000, () => {
  console.log("Server Started On Port 5000");
});
