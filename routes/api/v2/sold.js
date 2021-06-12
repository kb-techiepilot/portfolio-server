const express = require("express");
const router = express.Router();
const { NseIndia } = require("stock-nse-india");

const pool = require("../../../db/db");
const sql  = require("../../../config/sqlv2");

const user = require("./user");

const util = require('./utils');

//getting all sold
router.get('/', async (req, res) => {
    
    const { workspace } = req.query;

    const userObj = await user.getUserWithWorkspace(req.user.sub, 'default', 'holdings', req.headers.authorization);

    try {
        const soldData = await pool.query(
            sql.sold.getAll, [userObj.USER_ID]
        );
        res.json(soldData.rows);

    }catch (err) {
        res.json({"message" : "Error while fetching sold details " + err.message})
    }
});

router.post('/:id', async (req, res) => {

    let id = req.params.id;

    var { partial, price, quantity } = req.query;

    const userObj = await user.getUserWithWorkspace(req.user.sub, 'default', 'holdings', req.headers.authorization);

    const holdingsData = await util.getHoldings(id, userObj.USER_ID, userObj.WORKSPACE_ID);
    if(holdingsData !== undefined) {

        if(partial === "true") {
            if(holdingsData.QUANTITY < quantity ) {
                res.json({"message" : "Insufficient quantity in funds"});
            } else {
                await util.updateHoldings(Number(holdingsData.QUANTITY) - quantity, holdingsData.HOLDINGS_ID);
            }
        } else {
            quantity = holdingsData.QUANTITY;
            await util.deleteHoldings(userObj.USER_ID, userObj.WORKSPACE_ID, id);
        }

        try{
            const response = await util.addSoldEntry(userObj.USER_ID, holdingsData.SYMBOL, quantity, holdingsData.PRICE, price);
            try{
                await util.addTransactions(userObj.USER_ID, 'Sell', holdingsData.SYMBOL, quantity, price);
            } catch(err) {
                res.status(200).json({"message" : "Exception on selling holdings : " + err})
            }
            res.json(response);
        } catch (err) {
            res.json({"message" : "Error while selling share " + err})
        }
    } else {
        res.json({"message" : "Share not found to sell"});
    }

});

module.exports = router;