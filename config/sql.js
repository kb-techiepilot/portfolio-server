module.exports = {
    users: {
        getUserBySub    : `SELECT "USER_ID", "NAME", TO_CHAR("CREATED_ON" :: DATE, 'dd-mm-yyyy') AS "CREATED_ON" FROM userinfo WHERE "SUB" = $1`,
        insert          : `INSERT INTO userinfo ("NAME", "SUB", "CREATED_ON") VALUES ($1, $2, NOW()) RETURNING "USER_ID", "CREATED_ON"`
    },
    wishlist: {
        getAll      : `SELECT "WISHLIST_ID", TO_CHAR("DATE" :: DATE, 'dd-mm-yyyy') AS "DATE", "SYMBOL", "PRICE" FROM wishlist WHERE "USER_ID" = $1`,
        getById     : `SELECT "WISHLIST_ID", TO_CHAR("DATE" :: DATE, 'dd-mm-yyyy') AS "DATE", "SYMBOL", "PRICE" FROM wishlist WHERE "WISHLIST_ID" = $1 AND "USER_ID" = $2`,
        getBySymbol : `SELECT "WISHLIST_ID", TO_CHAR("DATE" :: DATE, 'dd-mm-yyyy') AS "DATE", "SYMBOL", "PRICE" FROM wishlist WHERE "SYMBOL" = $1 AND "USER_ID" = $2`,
        insert      : `INSERT INTO wishlist ("USER_ID", "DATE", "SYMBOL", "EXCHANGE", "PRICE") VALUES ($1, NOW(), $2, 'NSE', $3) RETURNING "WISHLIST_ID", "SYMBOL"`,
        delete      : `DELETE FROM wishlist WHERE "WISHLIST_ID" = $1 AND "USER_ID" = $2`
    },

    holdings: {
        getAll      : `SELECT "HOLDINGS_ID", TO_CHAR("DATE" :: DATE, 'dd-mm-yyyy') AS "DATE", "SYMBOL", "QUANTITY", "PRICE" FROM holdings WHERE "USER_ID" = $1 AND "SOLD" = false ORDER BY "DATE" ASC`,
        getById     : `SELECT "HOLDINGS_ID", TO_CHAR("DATE" :: DATE, 'dd-mm-yyyy') AS "DATE", "SYMBOL", "QUANTITY", "PRICE" FROM holdings WHERE "HOLDINGS_ID" = $1 AND "USER_ID" = $2 `,
        getBySymbol : `SELECT "HOLDINGS_ID", TO_CHAR("DATE" :: DATE, 'dd-mm-yyyy') AS "DATE", "SYMBOL", "QUANTITY", "PRICE" FROM holdings WHERE "SYMBOL" = $1 AND "USER_ID" = $2`,
        insert      : `INSERT INTO holdings ("USER_ID", "DATE", "SYMBOL", "EXCHANGE", "QUANTITY", "PRICE", "SOLD") VALUES ($1, $2, $3, 'NSE', $4, $5, false) RETURNING "HOLDINGS_ID", "SYMBOL", "QUANTITY", "PRICE"`,
        delete      : `DELETE FROM holdings WHERE "HOLDINGS_ID" = $1 AND "USER_ID" = $2`,
        markSold    : `UPDATE holdings SET "SOLD" = true WHERE "HOLDINGS_ID" = $1 AND "USER_ID" = $2`,
        update      : `UPDATE holdings SET "QUANTITY" = $1, "PRICE" = $2 WHERE "HOLDINGS_ID" = $3 AND "USER_ID" = $4 RETURNING "HOLDINGS_ID", "SYMBOL", "QUANTITY", "PRICE"`
    }
  };