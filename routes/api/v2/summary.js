const express = require("express");
const router = express.Router();
const { NseIndia } = require("stock-nse-india");

const pool = require("../../../db/db");
const sql  = require("../../../config/sqlv2");

const user = require("./user");

const nseUtil = require('./nseUtil');

const nseIndia = new NseIndia()

router.get('/', async (req, res) => {
    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);

    pool.query(
        sql.dashboard.getSummary, [userObj.USER_ID],
        (err, summary) => {
            if(err) {
                throw err;
            }
            if(summary.rows.length === 0) {
                var result = {}
                result.total_amount = 0;
                result.current_amount = 0;
                result.difference = 0;
                result.percentage = 0;
                return res.status(200).json(result);
            } else {
                var totalAmount = 0;
                var currentAmount = 0;
                var dayChange = 0;
                var tempArray = [];
                var result = {};
                //from nseindia npm
                // summary.rows.forEach((row, index) => {
                //     totalAmount = totalAmount + (row.QUANTITY * row.PRICE);
                //     Promise.resolve(nseIndia.getEquityDetails(row.SYMBOL))
                //     .then(response => {
                //         var currentPrice = response.priceInfo.lastPrice;
                //         currentAmount = currentAmount + ( row.QUANTITY * currentPrice );
                //         dayChange = dayChange + ( row.QUANTITY * response.priceInfo.change);
                //         tempArray.push(totalAmount);
                //         if(summary.rows.length === tempArray.length){
                //             result.total_amount = totalAmount.toFixed(0);
                //             result.current_amount = currentAmount.toFixed(0);
                //             result.difference = (currentAmount - totalAmount).toFixed(0);
                //             result.percentage = (((currentAmount - totalAmount) / totalAmount) * 100).toFixed(2);
                //             result.day_change = dayChange.toFixed(0);
                //             result.day_prechent = ((dayChange / totalAmount) * 100).toFixed(2);
                //             res.json(result);
                //         }
                //     });
                // });

                //from nseindia site
                summary.rows.forEach((row, index) => {
                    totalAmount = totalAmount + (row.QUANTITY * row.PRICE);
                    Promise.resolve(nseUtil.getQuote(row.SYMBOL))
                    .then(response => {
                        var currentPrice = parseFloat(response.lastPrice.replace(/,/g, ''));
                        currentAmount = currentAmount + ( row.QUANTITY * currentPrice );
                        dayChange = dayChange + ( row.QUANTITY * parseFloat(response.change));
                        tempArray.push(totalAmount);
                        if(summary.rows.length === tempArray.length){
                            result.total_amount = totalAmount.toFixed(0);
                            result.current_amount = currentAmount.toFixed(0);
                            result.difference = (currentAmount - totalAmount).toFixed(0);
                            result.percentage = (((currentAmount - totalAmount) / totalAmount) * 100).toFixed(2);
                            result.day_change = dayChange.toFixed(0);
                            result.day_prechent = ((dayChange / totalAmount) * 100).toFixed(2);
                            res.json(result);
                        }
                    });
                });
            }
        }
    )
});

router.get('/chart', async (req, res) => {
    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);

    pool.query(
        sql.dashboard.getPercentage, [userObj.USER_ID],
        (err, summary) => {
            if(err) {
                throw err;
            }
            if(summary.rows.length === 0) {
                var responseList = []
                return res.status(200).json(responseList);
            } else {
                var responseList = [];
                var result = {};
                summary.rows.forEach((row, index) => {
                    result.index = row.INDEX;
                    result.percentage = row.HOLDING_PERCENTAGE;
                    responseList.push(result);
                    result = {};

                    if(responseList.length === summary.rows.length){
                        res.json(responseList);
                    }
                });
            }
        }
    )
});

module.exports = router;