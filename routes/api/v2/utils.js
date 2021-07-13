const pool = require("../../../db/db");
const sql  = require("../../../config/sqlv2");

const holdingsResponse = require("../../../response/holdings");
async function addSoldEntry(userId, buyDate, soldDate, symbol, quantity, buyPrice, sellPrice) {
    try {
        const res = await pool.query(
            sql.sold.insert, [ userId, buyDate, soldDate, symbol, quantity, buyPrice, sellPrice ]
        );
        return res.rows[0];
      } catch (err) {
        return err.stack;
      }
}

async function getHoldings(id, userId, workspaceId) {
    try {
        const res = await pool.query(
            (Number(id) > 0) ?
            sql.holdings.getById : sql.holdings.getBySymbol,[id, userId, workspaceId]
        );
        return res.rows[0];
      } catch (err) {
        return err.stack;
    }
}

async function getWishlist(id, userId, workspaceId) {
    try {
        const res = await pool.query(
            (Number(id) > 0) ?
            sql.wishlist.getById : sql.wishlist.getBySymbol,[id, userId, workspaceId]
        );
        return res.rows[0];
      } catch (err) {
        return err.stack;
    }
}

async function deleteHoldings(userId, workspaceId, holdingsId){
    try{
        const res = await pool.query(
            sql.holdings.delete, [holdingsId, userId, workspaceId]
        );
    } catch (err) {
        return err.stack;
    }
}

async function updateHoldings(quantity, holdingsId) {
    try{
        await pool.query( 
            `UPDATE holdings SET "QUANTITY" = $1 WHERE "HOLDINGS_ID" = $2`, [quantity, holdingsId]
        )
    } catch (err) {
        return err.stack;
    }
}


async function addTransactions(userId, type, date, symbol, quantity, price) {
    try {
        const res = await pool.query(
            sql.transaction.insert, [ userId, type, date, symbol, quantity, price, (quantity * price)]
        );
        return res.rows[0];
      } catch (err) {
        return err.stack;
      }
}

async function getValidBrokerId(userId, brokerId) {
    try{
        const response = await pool.query(
            sql.broker.select, [userId]
        );

        if(response.rowCount > 0) {
            if(brokerId !== undefined){
                for(var i = 0; i < response.rowCount; i++){
                    if(brokerId === response.rows[i].BROKER_ID){
                        return brokerId;
                    }
                }
            }
            return response.rows[0].BROKER_ID;
        }
    } catch(err) {
        console.log(err.message);
    }
}

exports.addSoldEntry = addSoldEntry;
exports.getHoldings = getHoldings;
exports.getWishlist = getWishlist;
exports.deleteHoldings = deleteHoldings;
exports.updateHoldings = updateHoldings;
exports.addTransactions = addTransactions;
exports.getValidBrokerId = getValidBrokerId;