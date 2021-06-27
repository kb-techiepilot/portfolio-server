const express = require("express");
const router = express.Router();
const axios = require('axios');

router.get("/topstocks", async (req, res) => {
    const stocks = await axios.get('https://www1.nseindia.com/live_market/dynaContent/live_analysis/most_active/allTopValue1.json');
    res.json(stocks.data);
});

router.get('/gainers/nifty', async (req, res) => {
    const gainers = await axios.get('http://www1.nseindia.com/live_market/dynaContent/live_analysis/gainers/niftyGainers1.json');
    const losers = await axios.get('http://www1.nseindia.com/live_market/dynaContent/live_analysis/losers/niftyLosers1.json');

    const data = {};
    data.gainers = gainers.data;
    data.losers = losers.data;
    res.json(data);
});

router.get('/gainers/bank', async (req, res) => {
    const gainers = await axios.get('http://www1.nseindia.com/live_market/dynaContent/live_analysis/gainers/bankNiftyGainers1.json');
    const losers = await axios.get('http://www1.nseindia.com/live_market/dynaContent/live_analysis/losers/bankNiftyLosers1.json');

    const data = {};
    data.gainers = gainers.data;
    data.losers = losers.data;
    res.json(data);
});

module.exports = router;