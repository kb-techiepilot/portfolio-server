module.exports = {
    users: {
        getUserBySub    : `SELECT "USER_ID", "NAME", TO_TIMESTAMP("CREATED_ON")::date AS "CREATED_ON" FROM userinfo WHERE "SUB" = $1`,
        getUserWorkspace: `SELECT userinfo."USER_ID", "NAME", TO_TIMESTAMP(userinfo."CREATED_ON")::date AS "CREATED_ON", "WORKSPACE_ID", "WORKSPACE_NAME" FROM userinfo JOIN workspace ON userinfo."USER_ID" = workspace."USER_ID" WHERE userinfo."USER_ID" = $1 AND "WORKSPACE_NAME" =$2`,
        insert          : `INSERT INTO userinfo ("NAME", "SUB", "CREATED_ON") VALUES ($1, $2, extract(epoch from now())) RETURNING "USER_ID", "CREATED_ON"`
    },
    workspace: {
        insertForWishlist   : `INSERT INTO workspace ("USER_ID", "TYPE", "WORKSPACE_NAME", "CREATED_ON") VALUES ($1, 'wishlist', 'default', extract(epoch from now())) RETURNING "WORKSPACE_ID", "WORKSPACE_NAME", "CREATED_ON"`,
        insertForHoldings   : `INSERT INTO workspace ("USER_ID", "TYPE", "WORKSPACE_NAME", "CREATED_ON") VALUES ($1, 'holdings', 'default', extract(epoch from now())) RETURNING "WORKSPACE_ID", "WORKSPACE_NAME", "CREATED_ON"`
    },
    // dashboard: {
    //     getSummary      : `SELECT "SYMBOL", "PRICE", "QUANTITY" FROM holdings WHERE "USER_ID" = $1`,
    //     getPercentage   : `SELECT "SYMBOL", ROUND(((SUM( "PRICE" * "QUANTITY") / (SELECT SUM("PRICE" * "QUANTITY") FROM HOLDINGS WHERE "USER_ID" = $1)) * 100), 2) AS "HOLDING_PERCENTAGE" FROM holdings WHERE "USER_ID" = $1 GROUP BY "SYMBOL", "HOLDINGS_ID" ORDER BY "HOLDINGS_ID"`
    // },
    wishlist: {
        getAll      : `SELECT "WISHLIST_ID", TO_TIMESTAMP("DATE")::date AS "ADDED_DATE", "SYMBOL", "PRICE" FROM wishlist WHERE "USER_ID" = $1 ORDER BY "ADDED_DATE" ASC`,
        getById     : `SELECT "WISHLIST_ID", TO_TIMESTAMP("DATE")::date AS "DATE", "SYMBOL", "PRICE" FROM wishlist WHERE "WISHLIST_ID" = $1 AND "USER_ID" = $2 AND "WORKSPACE_ID" = $3`,
        getBySymbol : `SELECT "WISHLIST_ID", TO_TIMESTAMP("DATE")::date AS "DATE", "SYMBOL", "PRICE" FROM wishlist WHERE "SYMBOL" = $1 AND "USER_ID" = $2 AND "WORKSPACE_ID" = $3`,
        insert      : `INSERT INTO wishlist ("USER_ID", "WORKSPACE_ID", "DATE", "SYMBOL", "EXCHANGE", "PRICE") VALUES ($1, $2, extract(epoch from now()), $3, 'NSE', $4) RETURNING "WISHLIST_ID", "WORKSPACE_ID", "SYMBOL"`,
        delete      : `DELETE FROM wishlist WHERE "WISHLIST_ID" = $1 AND "USER_ID" = $2 AND "WORKSPACE_ID" = $3`
    },

    // holdings: {
    //     getAll      : `SELECT "HOLDINGS_ID", TO_TIMESTAMP( extract("DATE"))::date "PURCHASED_DATE", "SYMBOL", "QUANTITY", "PRICE" FROM holdings WHERE "USER_ID" = $1 AND "SOLD" = false ORDER BY "DATE" ASC`,
    //     getById     : `SELECT "HOLDINGS_ID", TO_TIMESTAMP( extract("DATE"))::date "DATE", "SYMBOL", "QUANTITY", "PRICE" FROM holdings WHERE "HOLDINGS_ID" = $1 AND "USER_ID" = $2 `,
    //     getBySymbol : `SELECT "HOLDINGS_ID", TO_TIMESTAMP( extract("DATE"))::date "DATE", "SYMBOL", "QUANTITY", "PRICE" FROM holdings WHERE "SYMBOL" = $1 AND "USER_ID" = $2`,
    //     insert      : `INSERT INTO holdings ("USER_ID", "WISHLIST_ID", "DATE", "SYMBOL", "EXCHANGE", "QUANTITY", "PRICE", "UPDATED_DATE") VALUES ($1, $2, $3, $4, 'NSE', $5, $6, extract(epoch from now()) RETURNING "HOLDINGS_ID", "SYMBOL", "QUANTITY", "PRICE"`,
    //     delete      : `DELETE FROM holdings WHERE "HOLDINGS_ID" = $1 AND "USER_ID" = $2`,
    //     update      : `UPDATE holdings SET "QUANTITY" = $1, "PRICE" = $2 WHERE "HOLDINGS_ID" = $3 AND "USER_ID" = $4 RETURNING "HOLDINGS_ID", "SYMBOL", "QUANTITY", "PRICE"`
    // }
}