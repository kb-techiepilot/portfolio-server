const express = require("express");
const router = express.Router();
const { NseIndia } = require("stock-nse-india");

const nseIndia = new NseIndia()

async function getHistoryData(symbol, startDate, endDate) {
    console.log(symbol);
    // let history = await nseIndia.getEquityHistoricalData("SBIN", {start:"2021-06-02", end:"2021-06-04"});
    let history = await nseIndia.getEquityHistoricalData(symbol, {start:startDate, end:endDate});
    // let history = await nseIndia.getEquityDetails("SBIN");
    return history;
}

router.get('/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const {start, end } = req.query;
    console.log(symbol + " " + start + " " + end);
    const history = await getHistoryData(symbol, start, end);
    res.json(history);
});

module.exports = router;