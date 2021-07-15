const express = require("express");
const router = express.Router();

const pool = require("../../../db/db");
const sql  = require("../../../config/sqlv2");

const user = require("./user");
const transactionResponse = require("../../../response/transaction");

async function getTransactions(userId, brokerId){
    try {
        var data = null;
        if(brokerId > 0){
            data = await pool.query(
                sql.transaction.getAllByBroker, [userId, brokerId]
            );
        } else {
            data = await pool.query(
                sql.transaction.getAll, [userId]
            ); 
        }

        if(data.rows.length === 0 ) {
            return null
        } else {
            return data.rows;
        }
    } catch(err) {
        console.log(err.message);
    }
}

//getting all transactions
router.get('/', async (req, res) => {

    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);

    const brokerId = req.query.broker_id;

    try {
        const data = await getTransactions(userObj.USER_ID, brokerId);
        if(data === null || data.length === 0) {
            return res.status(200).json({"message" : "No Transactions added", "data": []});
        } else {
            var responseList= [];
            data.forEach((row, index) => {
                Promise.resolve(transactionResponse.getTransactions(row))
                .then((response => {
                    responseList.push(response);
                    if(responseList.length == data.length){
                        // responseList.sort((a,b) => {
                        //     return a.date - b.date;
                        // })
                        res.json({
                            "data" : responseList,
                            "meta" : {
                                "count" : responseList.length
                            }
                        });
                    }
                }));
            })
        }
      } catch (err) {
        res.json({"message" : "Error while getting transactions "+err.stack});
      }
});
//getting all transactions
router.get('/top', async (req, res) => {

    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);
    try {
        const resData = await pool.query(
            sql.transaction.getTop,[userObj.USER_ID]
        );
        const data = resData.rows;
        if(data === null || data.length === 0) {
            return res.status(200).json({"message" : "No Transactions added", "data": []});
        } else {
            var responseList= [];
            data.forEach((row, index) => {
                Promise.resolve(transactionResponse.getTransactions(row))
                .then((response => {
                    responseList.push(response);
                    if(responseList.length == data.length){
                        responseList.sort((a,b) => {
                            return a.date - b.date;
                        })
                        res.json({
                            "data" : responseList,
                            "meta" : {
                                "count" : responseList.length
                            }
                        });
                    }
                }));
            })
        }
      } catch (err) {
        res.json({"message" : "Error while getting transactions "+err.stack});
      }
});

module.exports = router;