const express = require("express");
const router = express.Router();
const { NseIndia, ApiList } = require("stock-nse-india");
const axios = require('axios');
const CSV = require('csv-string');
const NodeCache = require( "node-cache" );

const nseIndia = new NseIndia()
const symCache = new NodeCache({ checkperiod: 0 } );

async function getAllSymbols() {
    var data = symCache.get("symbols");
    if(data === undefined){
        data = await nseIndia.getAllStockSymbols();
        symCache.set("symbols", data, 100000);
    }
    return data;
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

router.get('/all', async(req, res) => {
    var data = symCache.get("allSymbols");
    if(data === undefined) {
        data = [];
        var csvData = await axios.get('http://www1.nseindia.com/content/equities/EQUITY_L.csv');
        csvData = csvData.data;
        const parsedCsv = CSV.parse(csvData);

        for(var i = 1; i < parsedCsv.length; i++){
            data[i-1] = [parsedCsv[i][0], parsedCsv[i][1]];
        }
        const success = symCache.set("allSymbols", data, 100000);
    } else {
        console.log("available in cache");
    }
    res.json(data);
})

module.exports = router;