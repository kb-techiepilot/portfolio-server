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
    console.log(symbol + " " + start + " " + end);
    const history = await getHistoryData(symbol, start, end);
    var data = {};
    var historyData = [];
    console.log("legnth : " + history.length);
    history.forEach(ele => {
        ele.data.forEach(element => {
            console.log(JSON.stringify(element) + "\n");
            data = element;
            historyData.push(data);
            data = {};
        });
    });
    historyData = historyData.sort(GetSortOrder());
    res.json(historyData);
});

module.exports = router;