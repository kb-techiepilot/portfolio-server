const express = require("express");
const { NseIndia } = require("stock-nse-india");

const pool = require("../../../db/db");
const sql  = require("../../../config/sqlv2");
const user = require("./user");
const util = require("./utils");

const router = express.Router();

const wishlistResponse = require("../../../response/wishlist");

const nseIndia = new NseIndia();

async function getAllWishlist(userId, workspaceId){

    try {
        const data = await pool.query(
            sql.wishlist.getAll, [userId, workspaceId]
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

//getting all wishlist
router.get('/', async (req, res) => {
    const { workspace } = req.query;
    var userObj = await user.getUserWithWorkspace(req.user.sub, workspace, 'wishlist', req.headers.authorization);
    if(userObj === null) {
        return res.status(200).json({"message" : "Workspace not found"});
    }
    const data = await getAllWishlist(userObj.USER_ID, userObj.WORKSPACE_ID);
    if(data === null || data === []) {
        res.status(404).json({"message" : "No wishlist added"});
    } else {
        var responseList= [];
        data.forEach((row, index) => {
            Promise.resolve(wishlistResponse.getAllWishlist(row))
            .then((response => {
                responseList.push(response);
                    if(responseList.length == data.length){
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


//getting single wishlist
router.get('/:id', async (req, res) => {

    const { workspace } = req.query;

    const userObj = await user.getUserWithWorkspace(req.user.sub, workspace, 'wishlist', req.headers.authorization);

    if(userObj === null) {
        return res.status(200).json({"message" : "Workspace not found"});
    }
    let id = req.params.id;
    pool.query(
        (Number(id) > 0) ?
        sql.wishlist.getById : sql.wishlist.getBySymbol,[id, userObj.USER_ID, userObj.WORKSPACE_ID],
        (err, wishlist) => {
            if(err) {
                throw err;
            }
            if(wishlist.rows.length === 0) {
                return res.status(404).json({"message" : "No wishlist added"});
            } else {
                Promise.resolve(wishlistResponse.getWishlist(wishlist.rows[0]))
                    .then((response => {
                        res.json(response);
                    }));
            }  
        }
    )
});

//adding wishlist
router.post('/', async (req, res) => {
    const { symbol, workspace } = req.query;
    const userObj = await user.getUserWithWorkspace(req.user.sub, workspace, 'wishlist', req.headers.authorization);

    if(userObj === null) {
        return res.status(200).json({"message" : "Workspace not found"});
    }

    const details = await nseIndia.getEquityDetails(symbol)
    if(details.msg === "no data found") {
        res.status(200).json({"message" : "Enter valid symbol"});
    } else {
        const data = await util.getWishlist(symbol, userObj.USER_ID, userObj.WORKSPACE_ID);
        if(data !== undefined) {
            return res.status(400).json({"message" : "Stock already added to the wishlist"});
        }else {
            pool.query(
                sql.wishlist.insert, [userObj.USER_ID, userObj.WORKSPACE_ID, symbol, details.priceInfo.lastPrice ],
                async (err) => {
                    if(err){
                        throw err;
                    } else {
                        const data = await getAllWishlist(userObj.USER_ID, userObj.WORKSPACE_ID);
                        var responseList= [];
                        data.forEach((row, index) => {
                            Promise.resolve(wishlistResponse.getAllWishlist(row))
                            .then((response => {
                                responseList.push(response);
                                    if(responseList.length == data.length){
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

//bulk insert - need to workout
router.post('/bulk', async (req, res) => {
    const { symbols, workspace } = req.query;
    const userObj = await user.getUserWithWorkspace(req.user.sub, workspace, 'wishlist', req.headers.authorization);
    var response = [];

    if(userObj === null) {
        return res.status(200).json({"message" : "Workspace not found"});
    }
    console.log(symbols + " " + typeof(symbols));
    const symbolArray = JSON.parse(symbols);
    symbolArray.forEach(async (symbol) => {
        console.log("symbol : " + symbol);
        const details = await nseIndia.getEquityDetails(symbol)
        if(details.msg === "no data found") {
            // res.status(200).json({"message" : "Enter valid symbol"});
            response.push({"message" : "Enter valid symbol for " + symbol})
        } else {
            pool.query(
                sql.wishlist.getBySymbol, [ symbol, userObj.USER_ID, userObj.WORKSPACE_ID],
                (err, wishlist, response) => {
                    if(err) {
                        throw err;
                    }
                    if(wishlist.rows.length > 0) {
                        // return res.status(200).json({"message" : symbol + " already added to the wishlist"});

                        response.push({"message" : symbol + " already added to the wishlist"})
                    } else {
                        pool.query(
                            sql.wishlist.insert, [userObj.USER_ID, userObj.WORKSPACE_ID, symbol, details.priceInfo.lastPrice ],
                            (err, wishlist) => {
                                if(err){
                                    throw err;
                                }
                                // res.json(wishlist.rows[0]);
                            }
                        );
                    }
                }
            );
        }
    })
    res.json(response);
});

//deleting a wishlist
router.delete('/:id', async (req, res) => {

    const { workspace } = req.query;

    const userObj = await user.getUserWithWorkspace(req.user.sub, workspace, 'wishlist', req.headers.authorization);

    if(userObj === null) {
        return res.status(200).json({"message" : "Workspace not found"});
    }

    let id = req.params.id;
    pool.query(
        sql.wishlist.delete ,[id, userObj.USER_ID, userObj.WORKSPACE_ID],
        async (err) => {
            if(err) {
                throw err;
            } else {
                // res.status(200).json({"message" : "wishlist deleted"});
                const data = await getAllWishlist(userObj.USER_ID, userObj.WORKSPACE_ID);
                if(data === null || data === []) {
                    res.status(404).json({"message" : "All Wishlist deleted"});
                } else {
                    var responseList= [];
                    data.forEach((row, index) => {
                        Promise.resolve(wishlistResponse.getAllWishlist(row))
                        .then((response => {
                            responseList.push(response);
                                if(responseList.length == data.length){
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
        }
    )
});

module.exports = router;