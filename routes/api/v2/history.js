const express = require("express");
const router = express.Router();
const { NseIndia } = require("stock-nse-india");

const nseIndia = new NseIndia()

async function getHistoryData(symbol, startDate, endDate) {
    let history = await nseIndia.getEquityHistoricalData(symbol, {start:startDate, end:endDate});
    return history;
}
function GetSortOrder() {
    return function(a, b) {
        if (a.CH_TIMESTAMP > b.CH_TIMESTAMP) {
            return 1;
        } else {
            return -1;
        }
    }
}

router.get('/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const {start, end } = req.query;
    var history = await getHistoryData(symbol, start, end);
    var data = {};
    var historyData = [];
    history.forEach(ele => {
        ele.data.forEach(element => {
            data = element;
            historyData.push(data);
            data = {};
        });
    });
    historyData = historyData.sort(GetSortOrder());

    history = [];
    data = [];
    historyData.forEach(ele => {
        data = [new Date(ele.CH_TIMESTAMP).getTime(), ele.CH_CLOSING_PRICE];
        history.push(data);
        data = [];
    })

    var currentData = await nseIndia.getEquityDetails(symbol);
    var responseData = {};
    responseData.history = history;
    responseData.current = currentData;
    res.json(responseData);
});

module.exports = router;
