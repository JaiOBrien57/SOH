var express = require('express');
var router = express.Router();
const axios = require('axios');

const headers = {
  'auth': 'Jindalee1!'
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/product', async function(req, res, next) {

  const url = 'https://api.renewablemobile.com.au/dear/product?fields=SKU,Name,ID,AdditionalAttribute1,AdditionalAttribute2,AdditionalAttribute4,AdditionalAttribute5,AdditionalAttribute6,AdditionalAttribute7,PriceTier1,AverageCost,PriceTier6&AdditionalAttribute6=EXACT(Part)&includeavailability=true'

  axios.get(url, {headers})
    .then(response => {
      const responseData = response.data;
      availUnique = []
      cacheArray = []

      responseData.Items.forEach(element => {
        var FinalModel = element.AdditionalAttribute1 + " " + element.AdditionalAttribute2 + " " + element.AdditionalAttribute7
        var CageQTY = 0
        var RefurbCageTwoQTY = 0
        var TotalQTY = 0
        var AvailableQTYBulk = parseInt(element.Availability.Available)
        var LocationBulk = element.Availability.Location
        var BinBulk = element.Availability.Bin

        if(LocationBulk == "BNE - Main Warehouse" && BinBulk == "Cage" && AvailableQTYBulk > 0){
          CageQTY = CageQTY + AvailableQTYBulk
        } else if(LocationBulk == "BNE - CAGE - Refurb 2 (106.2)" && BinBulk == "Cage" && AvailableQTYBulk > 0){
          RefurbCageTwoQTY = RefurbCageTwoQTY + AvailableQTYBulk
        }

        TotalQTY = CageQTY + RefurbCageTwoQTY

        if(!cacheArray.includes(element.SKU)) {
          cacheArray.push(element.SKU)
          availUnique.push({"SKU": element.SKU, "Name": element.Name, "ID": element.ID, "AvailableCage": CageQTY, "AvailableRefurbCage": RefurbCageTwoQTY, "DealerPrice": element.PriceTier1, "TotalQTY": TotalQTY, "FinalModel": FinalModel, "Grade": element.AdditionalAttribute5, "Battery": element.AdditionalAttribute6, "AVGCost": element.AverageCost, "Colour": element.AdditionalAttribute4, "AVGPriceTier": element.PriceTier6})
        }

        availUnique.sort((a,b)=>{if (a.FinalModel < b.FinalModel) {
          return -1;
        }
        if (a.FinalModel > b.FinalModel) {
          return 1;
        }
        return 0;})

      })
      res.json(availUnique);
    })
    .catch(error => {
      console.error('Error', error.message);
      res.status(500).json({error: 'Internal Server Error'})
    })
})





router.get('/renewedDeviceList', (req, res) => {
  const url = 'https://api.renewablemobile.com.au/dear/productavailability?fields=ID,SKU,Name,Available,Location,Bin&Name=LIKE(Renewed)&includeproduct=true'

  axios.get(url, {headers})
    .then(response => {
      const responseData = response.data;
      availUnique = []
      cacheArray = []
      var FinalModel = ""

      responseData.Items.forEach(element => {
        if(element.Product.AdditionalAttribute2 == null || element.Product.AdditionalAttribute2 == "") {
          element.Product.AdditionalAttribute2 = "UNKOWN"
        } else if(element.Product.AdditionalAttribute2.includes("iPad")) {
          FinalModel = element.Product.AdditionalAttribute1 + " " + element.Product.AdditionalAttribute2 + " " + element.Product.AdditionalAttribute3 + " " + element.Product.AdditionalAttribute5
        } else if(!element.Product.AdditionalAttribute2.includes("iPad")){
          FinalModel = element.Product.AdditionalAttribute1 + " " + element.Product.AdditionalAttribute2 + " " + element.Product.AdditionalAttribute3
        }

        if(element.Product.AdditionalAttribute6 == "New Battery") {
          element.Product.AdditionalAttribute6 = "100%"
        }

        if(!cacheArray.includes(element.SKU) && element.Name.includes("Renewed")){
          cacheArray.push(element.SKU)
          availUnique.push({"SKU": element.SKU, "Name": element.Name, "ID": element.ID, "DealerPrice": element.Product.PriceTier1, "FinalModel": FinalModel, "Grade": element.Product.AdditionalAttribute7, "Battery": element.Product.AdditionalAttribute6, "AVGCost": element.Product.AverageCost, "Colour": element.Product.AdditionalAttribute4, "AVGPriceTier": element.Product.PriceTier6})
        }
      })

      res.json(availUnique);
    })
    .catch(error => {
      console.error('Error', error.message);
      res.status(500).json({error: 'Internal Server Error'})
    })
})

module.exports = router;
