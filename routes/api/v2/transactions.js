const express = require("express");
const router = express.Router();

const pool = require("../../../db/db");
const sql  = require("../../../config/sqlv2");

const user = require("./user");
const transactionResponse = require("../../../response/transaction");

//getting all transactions
router.get('/', async (req, res) => {

    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);

    try {
        const resData = await pool.query(
            sql.transaction.getAll,[userObj.USER_ID]
        );
        const data = resData.rows;
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
      } catch (err) {
        res.json({"message" : "Error while getting transactions "+err.stack});
      }
});

module.exports = router;