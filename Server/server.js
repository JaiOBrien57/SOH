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
   
    if(!cacheArray.includes(SKU) && Name.includes("Renewed")){
      cacheArray.push(SKU)
      availUnique.push({"SKU":SKU,"Name":Name,"ID":IDDear,"DealerPrice":PriceTier1})
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

    TotalQTY = CageQTY+RefurbCageTwoQTY

    if(CageQTY != "" || RefurbCageTwoQTY != ""){
      availFormatted.push({"IDDear":IDDear,"SKU":SKU,"Name":Name,"AvailableCage":CageQTY,"AvailableRefurbCage":RefurbCageTwoQTY,"DealerPrice":DealerPrice,"TotalQTY":TotalQTY})
    }

  });

  //Sort the array by name
  availFormatted.sort((a,b)=>{if (a.Name < b.Name) {
    return -1;
  }
  if (a.Name > b.Name) {
    return 1;
  }
  return 0;})


  //Sending results back
    res.json(availFormatted).status(200)
    console.log(availFormatted)
  }
  getAvailList()
});


//Get Request from frontend for pushing transfer
app.put("/api/availList", (req, res) => {

})


//Launch the backend server
app.listen(5000, () => {
  console.log("Server Started On Port 5000");
});
