var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/product', async function(req, res, next) {

  const headers = {
    'auth': 'Jindalee1!'
  }
  const url = 'https://api.renewablemobile.com.au/dear/product?fields=ID,SKU,Name&AdditionalAttribute6=EXACT(Part)'
  const params = {fields : 'ID,SKU,Name', 'AdditionalAttribute6': 'Exact(Part)'}

  axios.get(url, {headers})
    .then(response => {
      const responseData = response.data;
      res.json(responseData);
    })
    .catch(error => {
      console.error('Error', error.message);
      res.status(500).json({error: 'Internal Server Error'})
    })
})

module.exports = router;
