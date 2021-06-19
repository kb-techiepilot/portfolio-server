const express = require("express");
const router = express.Router();
const { NseIndia, ApiList } = require("stock-nse-india");
const axios = require('axios');

const nseIndia = new NseIndia()

router.get('/', async (req, res) => {
    const url = ApiList.ALL_INDICES;
    const response = await nseIndia.getDataByEndpoint(url);
    res.json(response);
});

router.get('/all', async (req, res) => {
    const indexes = await axios.get('http://www1.nseindia.com/homepage/Indices1.json');

    res.json(indexes.data);
});

module.exports = router;