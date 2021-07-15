module.exports = {
    users: {
        getUserBySub        : `SELECT "USER_ID", "NAME", TO_TIMESTAMP("CREATED_ON")::date AS "CREATED_ON" FROM userinfo WHERE "SUB" = $1`,
        getUserWorkspace    : `SELECT userinfo."USER_ID", "NAME", TO_TIMESTAMP(userinfo."CREATED_ON")::date AS "CREATED_ON", "WORKSPACE_ID", "WORKSPACE_NAME" FROM userinfo JOIN workspace ON userinfo."USER_ID" = workspace."USER_ID" WHERE userinfo."USER_ID" = $1 AND "WORKSPACE_NAME" =$2 AND "TYPE" = $3`,
        insert              : `INSERT INTO userinfo ("NAME", "SUB", "CREATED_ON") VALUES ($1, $2, extract(epoch from now())) RETURNING "USER_ID", "CREATED_ON"`,
        getProfile          : `SELECT userinfo."USER_ID", userinfo."NAME", TO_TIMESTAMP("CREATED_ON")::date AS "CREATED_ON", "BROKER_ID", broker."NAME" AS "BROKER_NAME", "URL" FROM userinfo JOIN broker ON broker."USER_ID" = userinfo."USER_ID" WHERE "SUB" = $1`
    },
    workspace: {
        insertForWishlist   : `INSERT INTO workspace ("USER_ID", "TYPE", "WORKSPACE_NAME", "CREATED_ON") VALUES ($1, 'wishlist', 'default', extract(epoch from now())) RETURNING "WORKSPACE_ID", "WORKSPACE_NAME", "CREATED_ON"`,
        insertForHoldings   : `INSERT INTO workspace ("USER_ID", "TYPE", "WORKSPACE_NAME", "CREATED_ON") VALUES ($1, 'holdings', 'default', extract(epoch from now())) RETURNING "WORKSPACE_ID", "WORKSPACE_NAME", "CREATED_ON"`
    },
    broker: {
        insert              : `INSERT INTO broker ("USER_ID", "NAME", "URL") VALUES ($1, $2, $3)`,
        update              : `UPDATE broker SET "NAME" = $1, "URL" = $2 WHERE "BROKER_ID" = $3 AND "USER_ID" = $4`,
        select              : `SELECT "BROKER_ID", "NAME", "URL" FROM broker WHERE "USER_ID" = $1`,
        selectByName        : `SELECT "BROKER_ID", "NAME", "URL" FROM broker WHERE "USER_ID" = $1 AND "NAME" = $2`
    },
    dashboard: {
        getSummary          : `SELECT "SYMBOL", "PRICE", "QUANTITY" FROM holdings WHERE "USER_ID" = $1`,
        getSummaryByBroker  : `SELECT "SYMBOL", "PRICE", "QUANTITY" FROM holdings WHERE "USER_ID" = $1 AND "BROKER_ID" = $2`,
        getPercentage       : `SELECT "INDEX", ROUND(((SUM( "PRICE" * "QUANTITY") / (SELECT SUM("PRICE" * "QUANTITY") FROM HOLDINGS WHERE "USER_ID" = $1)) * 100), 2) AS "HOLDING_PERCENTAGE" FROM holdings WHERE "USER_ID" = $1 GROUP BY "SYMBOL", "INDEX" ORDER BY "INDEX"`
    },
    wishlist: {
        getAll              : `SELECT "WISHLIST_ID", TO_TIMESTAMP("DATE")::date AS "ADDED_DATE", "SYMBOL", "PRICE" FROM wishlist WHERE "USER_ID" = $1 AND "WORKSPACE_ID" = $2 ORDER BY "WISHLIST_ID" ASC`,
        getAllCount         : `SELECT COUNT(*) FROM wishlist WHERE "USER_ID" = $1`,
        getById             : `SELECT "WISHLIST_ID", TO_TIMESTAMP("DATE")::date AS "DATE", "SYMBOL", "PRICE" FROM wishlist WHERE "WISHLIST_ID" = $1 AND "USER_ID" = $2 AND "WORKSPACE_ID" = $3`,
        getBySymbol         : `SELECT "WISHLIST_ID", TO_TIMESTAMP("DATE")::date AS "DATE", "SYMBOL", "PRICE" FROM wishlist WHERE "SYMBOL" = $1 AND "USER_ID" = $2 AND "WORKSPACE_ID" = $3`,
        insert              : `INSERT INTO wishlist ("USER_ID", "WORKSPACE_ID", "DATE", "SYMBOL", "EXCHANGE", "PRICE") VALUES ($1, $2, extract(epoch from now()), $3, 'NSE', $4) RETURNING "WISHLIST_ID", "WORKSPACE_ID", "SYMBOL"`,
        delete              : `DELETE FROM wishlist WHERE "WISHLIST_ID" = $1 AND "USER_ID" = $2 AND "WORKSPACE_ID" = $3`
    },

    holdings: {
        getAll              : `SELECT "HOLDINGS_ID", holdings."BROKER_ID", "NAME" AS "BROKER_NAME", TO_TIMESTAMP("DATE")::date AS "DATE", "SYMBOL", "QUANTITY", "PRICE", "INDUSTRY", "INDEX", TO_TIMESTAMP("UPDATED_DATE")::date AS "UPDATED_DATE" FROM holdings JOIN broker ON broker."BROKER_ID" = holdings."BROKER_ID" WHERE holdings."USER_ID" = $1 AND "WORKSPACE_ID" = $2`,
        getByBroker         : `SELECT "HOLDINGS_ID", holdings."BROKER_ID", "NAME" AS "BROKER_NAME", TO_TIMESTAMP("DATE")::date AS "DATE", "SYMBOL", "QUANTITY", "PRICE", "INDUSTRY", "INDEX", TO_TIMESTAMP("UPDATED_DATE")::date AS "UPDATED_DATE" FROM holdings JOIN broker ON broker."BROKER_ID" = holdings."BROKER_ID" WHERE holdings."USER_ID" = $1 AND "WORKSPACE_ID" = $2 AND holdings."BROKER_ID" = $3`,
        getAllCount         : `SELECT COUNT(*) FROM WHERE "USER_ID" = $1 AND "WORKSPACE_ID" = $2`,
        getById             : `SELECT "HOLDINGS_ID", "BROKER_ID", TO_TIMESTAMP("DATE")::date AS "DATE", "SYMBOL", "QUANTITY", "PRICE", "INDUSTRY", "INDEX", TO_TIMESTAMP("UPDATED_DATE")::date AS "UPDATED_DATE" FROM holdings WHERE "HOLDINGS_ID" = $1 AND "USER_ID" = $2 AND "WORKSPACE_ID" = $3`,
        getBySymbol         : `SELECT "HOLDINGS_ID", "BROKER_ID", TO_TIMESTAMP("DATE")::date AS "DATE", "SYMBOL", "QUANTITY", "PRICE", "INDUSTRY", "INDEX", TO_TIMESTAMP("UPDATED_DATE")::date AS "UPDATED_DATE" FROM holdings WHERE "SYMBOL" = $1 AND "USER_ID" = $2 AND "WORKSPACE_ID" = $3`,
        getBySymbolBroker   : `SELECT "HOLDINGS_ID", "BROKER_ID", TO_TIMESTAMP("DATE")::date AS "DATE", "SYMBOL", "QUANTITY", "PRICE", "INDUSTRY", "INDEX", TO_TIMESTAMP("UPDATED_DATE")::date AS "UPDATED_DATE" FROM holdings WHERE "SYMBOL" = $1 AND "USER_ID" = $2 AND "WORKSPACE_ID" = $3 AND "BROKER_ID" = $4`,
        insert              : `INSERT INTO holdings ("USER_ID", "WORKSPACE_ID", "BROKER_ID", "DATE", "SYMBOL", "EXCHANGE", "QUANTITY", "PRICE", "UPDATED_DATE", "INDUSTRY", "INDEX") VALUES ($1, $2, $9, $3, $4, 'NSE', $5, $6, extract(epoch from now()), $7, $8) RETURNING "HOLDINGS_ID", "WORKSPACE_ID", "SYMBOL", "QUANTITY", "PRICE"`,
        delete              : `DELETE FROM holdings WHERE "HOLDINGS_ID" = $1 AND "USER_ID" = $2 AND "WORKSPACE_ID" = $3`,
        update              : `UPDATE holdings SET "QUANTITY" = $1, "PRICE" = $2, "DATE"=$3, "UPDATED_DATE" = extract(epoch from now()) WHERE "HOLDINGS_ID" = $4 AND "USER_ID" = $5 AND "WORKSPACE_ID" = $6 RETURNING "HOLDINGS_ID", "SYMBOL", "QUANTITY", "PRICE"`
    },

    sold: {
        getAll              : `SELECT "SOLD_ID", TO_TIMESTAMP("BUY_DATE")::date AS "BUY_DATE", TO_TIMESTAMP("DATE")::date AS "DATE", "SYMBOL", "EXCHANGE", "QUANTITY", "BUY_PRICE", "SELL_PRICE" FROM sold WHERE "USER_ID" = $1 ORDER BY "SOLD_ID" DESC`,
        getAllCount         : `SELECT COUNT(*) FROM sold WHERE "USER_ID" = $1`,
        insert              : `INSERT INTO sold ("USER_ID", "BROKER_ID", "BUY_DATE", "DATE", "SYMBOL", "EXCHANGE", "QUANTITY", "BUY_PRICE", "SELL_PRICE") VALUES ($1, $8, $2, $3, $4, 'NSE', $5, $6, $7) RETURNING "SOLD_ID", "SYMBOL"`
    },

    transaction: {
        getAll              : `SELECT "TRANSACTION_ID", transactions."BROKER_ID", "NAME" AS "BROKER_NAME", "TYPE", TO_TIMESTAMP("DATE")::date AS "DATE", "SYMBOL", "EXCHANGE", "QUANTITY", "PRICE", "AMOUNT" FROM transactions JOIN broker on transactions."BROKER_ID" = broker."BROKER_ID" WHERE transactions."USER_ID" = $1 ORDER BY "TRANSACTION_ID" DESC`,
        getAllByBroker      : `SELECT "TRANSACTION_ID", transactions."BROKER_ID", "NAME" AS "BROKER_NAME", "TYPE", TO_TIMESTAMP("DATE")::date AS "DATE", "SYMBOL", "EXCHANGE", "QUANTITY", "PRICE", "AMOUNT" FROM transactions JOIN broker on transactions."BROKER_ID" = broker."BROKER_ID" WHERE transactions."USER_ID" = $1 AND transactions."BROKER_ID" = $2 ORDER BY "TRANSACTION_ID" DESC`,
        getTop              : `SELECT "TRANSACTION_ID", transactions."BROKER_ID", "NAME" AS "BROKER_NAME", "TYPE", TO_TIMESTAMP("DATE")::date AS "DATE", "SYMBOL", "EXCHANGE", "QUANTITY", "PRICE", "AMOUNT" FROM transactions JOIN broker on transactions."BROKER_ID" = broker."BROKER_ID" WHERE transactions."USER_ID" = $1 ORDER BY "TRANSACTION_ID" DESC LIMIT 10`,
        getAllCount         : `SELECT COUNT(*) FROM transactions WHERE "USER_ID" = $1`,
        insert              : `INSERT INTO transactions ("USER_ID", "BROKER_ID", "TYPE", "DATE", "SYMBOL", "EXCHANGE", "QUANTITY", "PRICE", "AMOUNT") VALUES ($1, $8, $2, $3, $4, 'NSE', $5, $6, $7) RETURNING "TRANSACTION_ID"`,
        summary             : `SELECT SUM("AMOUNT") AS "AMOUNT", "TYPE" AS "LABEL" FROM transactions WHERE "USER_ID" = $1 GROUP BY "TYPE" UNION SELECT SUM(("PRICE"*"QUANTITY"))AS "AMOUNT", 'Current' as "LABEL" FROM HOLDINGS WHERE "USER_ID" = $1`
    },

    symbol: {
        wishlistAndHoldings : `select "WISHLIST_ID", "HOLDINGS_ID" from holdings FULL OUTER JOIN wishlist on holdings."SYMBOL" = wishlist."SYMBOL" where holdings."USER_ID" = wishlist."USER_ID" AND holdings."USER_ID" = $1 AND wishlist."SYMBOL"=$2 OR holdings."SYMBOL" = $2`
    }
}