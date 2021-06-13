const express = require("express");
const router = express.Router();
const { NseIndia } = require("stock-nse-india");

const pool = require("../../../db/db");
const sql  = require("../../../config/sqlv2");

const user = require("./user");
const util = require("./utils");

const holdingsResponse = require("../../../response/holdings");

const nseIndia = new NseIndia()

async function getAllHoldings(userId, workspaceId){

    try {
        const data = await pool.query(
            sql.holdings.getAll, [userId, workspaceId]
        );
        if(data.rows.length === 0 ) {
            return null
        } else {
            return data.rows;
        }
    } catch(err) {
        console.log(err.message);
    }
}

//getting all holdings
router.get('/', async (req, res) => {
    
    const { workspace } = req.query;

    const userObj = await user.getUserWithWorkspace(req.user.sub, workspace, 'holdings', req.headers.authorization);
    
    if(userObj === null) {
        return res.status(404).json({"message" : "Workspace not found"});
    }
    const data = await getAllHoldings(userObj.USER_ID, userObj.WORKSPACE_ID);
    if(data === null || data === []) {
        res.status(404).json({"message" : "No holdings added"});
    } else {
        // res.status(200).json(data);
        var responseList= [];
        data.forEach((row, index) => {
            Promise.resolve(holdingsResponse.getHoldings(row))
            .then((response => {
                responseList.push(response);
                if(responseList.length == data.length){
                    responseList.sort((a,b) => {
                        return a.holdings_id - b.holdings_id;
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
});

//getting single holdings
router.get('/:id', async (req, res) => {
    
    const { workspace } = req.query;

    const userObj = await user.getUserWithWorkspace(req.user.sub, workspace, 'holdings', req.headers.authorization);
    
    if(userObj === null) {
        return res.status(404).json({"message" : "Workspace not found"});
    }

    let id = req.params.id;
    const data = await util.getHoldings(id, userObj.USER_ID, userObj.WORKSPACE_ID);
    if(data !== undefined) {
        Promise.resolve(holdingsResponse.getHoldings(data))
            .then((response => {
                res.json(response);
            }));
    } else {
        res.status(404).json({"message" : "No holdings added"});
    }
});

//adding holdings
router.post('/', async (req, res) => {
    
    const { workspace, date, symbol, quantity, price  } = req.query;

    const userObj = await user.getUserWithWorkspace(req.user.sub, workspace, 'holdings', req.headers.authorization);
    
    if(userObj === null) {
        return res.status(404).json({"message" : "Workspace not found"});
    }

    const details = await nseIndia.getEquityDetails(symbol);
    
    if(details.msg === "no data found") {
        res.status(404).json({"message" : "Enter valid symbol"});
    } else {
        const data = await util.getHoldings(symbol, userObj.USER_ID, userObj.WORKSPACE_ID);
        if(data !== undefined) {
            return res.status(400).json({"message" : "Stock already added to the holdings"});
        }else {
            pool.query(
                sql.holdings.insert, [ userObj.USER_ID, userObj.WORKSPACE_ID, new Date(date).getTime() / 1000
                , symbol, quantity, price ],
                async (err, holdings) => {
                    if(err){
                        throw err;
                    } else {
                        try{
                            await util.addTransactions(userObj.USER_ID, 'Buy', symbol, quantity, price);
                        } catch(err) {
                            res.status(500).json({"message" : "Exception on adding holdings : " + msg})
                        }
                        const data = await getAllHoldings(userObj.USER_ID, userObj.WORKSPACE_ID);
                        var responseList= [];
                        data.forEach((row, index) => {
                            Promise.resolve(holdingsResponse.getHoldings(row))
                            .then((response => {
                                responseList.push(response);
                                if(responseList.length == data.length){
                                    responseList.sort((a,b) => {
                                        return a.holdings_id - b.holdings_id;
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
                }
            );
        }
    }
});

//deleting a holdings
router.delete('/:id', async (req, res) => {
    
    const { workspace } = req.query;

    const userObj = await user.getUserWithWorkspace(req.user.sub, workspace, 'holdings', req.headers.authorization);
    
    if(userObj === null) {
        return res.status(200).json({"message" : "Workspace not found"});
    }

    let id = req.params.id;

    const data = await util.getHoldings(id, userObj.USER_ID, userObj.WORKSPACE_ID);
    if(data === undefined) {
        res.status(404).json({"message" : "holdings not available to delete"});
    } else {
        pool.query(
            sql.holdings.delete ,[id, userObj.USER_ID, userObj.WORKSPACE_ID],
            async (err) => {
                if(err) {
                    throw err;
                } else {
                    // res.status(200).json({"message" : "holdings deleted"});
                    const data = await getAllHoldings(userObj.USER_ID, userObj.WORKSPACE_ID);
                    var responseList= [];
                    data.forEach((row, index) => {
                        Promise.resolve(holdingsResponse.getHoldings(row))
                        .then((response => {
                            responseList.push(response);
                            if(responseList.length == data.length){
                                responseList.sort((a,b) => {
                                    return a.holdings_id - b.holdings_id;
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
            }
        )
    }
});

//update holdings
router.post('/:id', async (req, res) => {
    
    let id = req.params.id;    
    
    var { workspace, date, symbol, quantity, price, average } = req.query;

    const userObj = await user.getUserWithWorkspace(req.user.sub, workspace, 'holdings', req.headers.authorization);

    if(userObj === null) {
        return res.status(404).json({"message" : "Workspace not found"});
    }

    const data = await util.getHoldings(id, userObj.USER_ID, userObj.WORKSPACE_ID);
    if(data === undefined) {
        return res.status(404).json({"message" : "Stock not added"});
    }else {
        var newQuantity = quantity;
        var newPrice = price;
        if(average) {
            const oldQuantity = data.QUANTITY;
            const oldPrice = data.PRICE;
            const oldAmount = oldQuantity * oldPrice;
            const newAmount = quantity * price;
            date = data.DATE;
            
            newQuantity = Number(quantity) + Number(oldQuantity);
            newPrice = (oldAmount + newAmount)/newQuantity;

            await util.addTransactions(userObj.USER_ID, 'Buy', symbol, quantity, price);
        } 
        //need to update the transaction table also
        pool.query(
            sql.holdings.update ,[newQuantity, newPrice, new Date(date).getTime() / 1000, data.HOLDINGS_ID, userObj.USER_ID, userObj.WORKSPACE_ID],
            async (err, holdings) => {
                if(err) {
                    res.status(500).json({"message" : "Exception while updating holdings : " + err.message});
                    // throw err;
                } else {
                    // res.status(200).json(holdings.rows[0]);
                    const data = await getAllHoldings(userObj.USER_ID, userObj.WORKSPACE_ID);
                    var responseList= [];
                    data.forEach((row, index) => {
                        Promise.resolve(holdingsResponse.getHoldings(row))
                        .then((response => {
                            responseList.push(response);
                            if(responseList.length == data.length){
                                responseList.sort((a,b) => {
                                    return a.holdings_id - b.holdings_id;
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
            }
        )
    }
});

module.exports = router;