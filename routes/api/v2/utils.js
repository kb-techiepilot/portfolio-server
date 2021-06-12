const pool = require("../../../db/db");
const sql  = require("../../../config/sqlv2");

async function addSoldEntry(userId, symbol, quantity, buyPrice, sellPrice) {
    try {
        const res = await pool.query(
            sql.sold.insert, [ userId, symbol, quantity, buyPrice, sellPrice ]
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


async function addTransactions(userId, type, symbol, quantity, price) {
    try {
        const res = await pool.query(
            sql.transaction.insert, [ userId, type, symbol, quantity, price, (quantity * price)]
        );
        return res.rows[0];
      } catch (err) {
        return err.stack;
      }
}

exports.addSoldEntry = addSoldEntry;
exports.getHoldings = getHoldings;
exports.deleteHoldings = deleteHoldings;
exports.updateHoldings = updateHoldings;
exports.addTransactions = addTransactions;