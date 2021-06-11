const express = require("express");
const router = express.Router();
const { NseIndia, ApiList } = require("stock-nse-india");

const nseIndia = new NseIndia()

async function getAllSymbols() {
    let symbols = await nseIndia.getAllStockSymbols();
    return symbols;
}

router.get('/', async (req, res) => {
    const symbols = await getAllSymbols();
    res.json(symbols);
});


router.get('/intraday', async (req, res) => {
    const { symbol } = req.query;
    const intra = await nseIndia.getEquityIntradayData(req.query.symbol, false);

    var currentData = await nseIndia.getEquityDetails(symbol);
    var responseData = {};
    responseData.intra = intra.grapthData;
    responseData.current = currentData;
    res.json(responseData);
});

router.get('/current', async (req, res) => {
    const symbolData = await nseIndia.getEquityDetails(req.query.symbol);
    res.json(symbolData);
});

router.get('/data', async (req, res) => {
    const url = ApiList[req.query.symbol];
    const response = await nseIndia.getEquityCorporateInfo("SBIN");
    console.log(response);
    res.json(response);
});

module.exports = router;