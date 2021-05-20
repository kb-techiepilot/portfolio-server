const express = require("express");
const router = express.Router();

const pool = require("../../db/db");
const keys = require("../../config/keys");
const sql  = require("../../config/sql");

const user = require("../../user");
const stock = require("../../stock");

const holdingsResponse = require("../../response/holdings");

const app = express();

//getting all holdings
router.get('/', async (req, res) => {
    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);
    
    pool.query(
        sql.holdings.getAll, [userObj.USER_ID],
        (err, holdings) => {
            if(err) {
                throw err;
            }
            if(holdings.rows.length === 0) {
                return res.status(200).json({"message" : "No holdings added"});
            } else {
                // res.json(holdings.rows);
                var responseList= [];
                holdings.rows.forEach((row, index) => {
                    Promise.resolve(holdingsResponse.getHoldings(row))
                    .then((response => {
                        responseList.push(response);
                        if(index == holdings.rows.length - 1){
                            res.json(responseList);
                        }
                    }));
                })
            }
        }
    )
});

//getting single holdings
router.get('/:id', async (req, res) => {
    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);

    let id = req.params.id;
    pool.query(
        (Number(id) > 0) ?
        sql.holdings.getById : sql.holdings.getBySymbol,[id, userObj.USER_ID],
        (err, holdings) => {
            if(err) {
                throw err;
            }
            if(holdings.rows.length === 0) {
                return res.status(200).json({"message" : "No holdings added"});
            } else {
                // res.json(holdings.rows[0]);
                Promise.resolve(holdingsResponse.getHoldings(holdings.rows[0]))
                    .then((response => {
                        res.json(response);
                    }));
            }  
        }
    )
});

//adding holdings
router.post('/', async (req, res) => {
    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);

    const {date, symbol, quantity, price } = req.body;
    pool.query(
        sql.holdings.getBySymbol, [ symbol, userObj.USER_ID ],
        (err, holdings) => {
            if(err) {
                throw err;
            }
            if(holdings.rows.length > 0) {
                return res.status(200).json({"message" : "Stock already added to the holdings"});
            } else {
                pool.query(
                    sql.holdings.insert, [ userObj.USER_ID, date, symbol, quantity, price ],
                    (err, holdings) => {
                        if(err){
                            throw err;
                        }
                        res.json(holdings.rows[0]);
                    }
                );
            }
        }
    );
});

//updating holdings
router.post('/:id', async (req, res) => {
    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);

    let id = req.params.id;
    const {quantity, price } = req.body;
    pool.query(
        sql.holdings.getById, [ id ],
        (err, holdings) => {
            if(err) {
                throw err;
            }
            if(holdings.rows.length === 0) {
                return res.status(200).json({"message" : "Stock not added to holdings"});
            } else {
                pool.query(
                    sql.holdings.update, [ quantity, price, id, userObj.USER_ID],
                    (err, holdings) => {
                        if(err){
                            throw err;
                        }
                        res.json(holdings.rows[0]);
                    }
                );
            }
        }
    );
});

//deleting a holdings
router.delete('/:id', async (req, res) => {
    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);

    let id = req.params.id;
    pool.query(
        sql.holdings.delete ,[id, userObj.USER_ID],
        (err, holdings) => {
            if(err) {
                throw err;
            } else {
                res.status(200).json({"message" : "holdings deleted"});
            }  
        }
    )
});

module.exports = router;