const express = require("express");
const router = express.Router();
const { NseIndia } = require("stock-nse-india");

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
    res.json(intra.grapthData);
});

router.get('/current', async (req, res) => {
    const { symbol } = req.query;
    const symbolData = await nseIndia.getEquityDetails(req.query.symbol);
    res.json(symbolData);
});

module.exports = router;