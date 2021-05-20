const express = require("express");
const router = express.Router();
const { NseIndia } = require("stock-nse-india");

const pool = require("../../db/db");
const keys = require("../../config/keys");
const sql  = require("../../config/sql");
const user = require("../../user");
const stock = require("../../stock");

const wishlistResponse = require("../../response/wishlist");

const nseIndia = new NseIndia()

const app = express();

//getting all wishlist
router.get('/', async (req, res) => {
    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);
    console.log("user from db : " + JSON.stringify(userObj));
    pool.query(
        sql.wishlist.getAll, [userObj.USER_ID],
        (err, wishlist) => {
            if(err) {
                throw err;
            }
            if(wishlist.rows.length === 0) {
                return res.status(200).json({"message" : "No wishlist added"});
            } else {
                var responseList= [];
                wishlist.rows.forEach((row, index) => {
                    
                    console.log("data from db : " + JSON.stringify(row));
                    Promise.resolve(wishlistResponse.getAllWishlist(row))
                    .then((response => {
                        responseList.push(response);
                        if(index == wishlist.rows.length - 1){
                            res.json(responseList);
                        }
                    }));
                })
            }
        }
    )
});

//getting single wishlist
router.get('/:id', async (req, res) => {
    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);
    let id = req.params.id;
    pool.query(
        (Number(id) > 0) ?
        sql.wishlist.getById : sql.wishlist.getBySymbol,[id, userObj.USER_ID],
        (err, wishlist) => {
            if(err) {
                throw err;
            }
            if(wishlist.rows.length === 0) {
                return res.status(200).json({"message" : "No wishlist added"});
            } else {
                // res.json(wishlist.rows[0]);
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
    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);
    const { symbol } = req.body;

    const details = await nseIndia.getEquityDetails(symbol)
    pool.query(
        sql.wishlist.getBySymbol, [ symbol, userObj.USER_ID],
        (err, wishlist) => {
            if(err) {
                throw err;
            }
            if(wishlist.rows.length > 0) {
                return res.status(200).json({"message" : "Stock already added to the wishlist"});
            } else {
                pool.query(
                    sql.wishlist.insert, [userObj.USER_ID, symbol, details.priceInfo.lastPrice ],
                    (err, wishlist) => {
                        if(err){
                            throw err;
                        }
                        res.json(wishlist.rows[0]);
                    }
                );
            }
        }
    );
});

//deleting a wishlist
router.delete('/:id', async (req, res) => {
    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);
    let id = req.params.id;
    pool.query(
        sql.wishlist.delete ,[id, userObj.USER_ID],
        (err, wishlist) => {
            if(err) {
                throw err;
            } else {
                res.status(200).json({"message" : "wishlist deleted"});
            }  
        }
    )
});

module.exports = router;