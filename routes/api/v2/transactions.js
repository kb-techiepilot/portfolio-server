const express = require("express");
const router = express.Router();
const { NseIndia } = require("stock-nse-india");

const pool = require("../../../db/db");
const sql  = require("../../../config/sqlv2");

const user = require("./user");

//getting all transactions
router.get('/', async (req, res) => {

    const userObj = await user.getUserFromDb(req.user.sub, req.headers.authorization);

    console.log(userObj);
    try {
        const resData = await pool.query(
            sql.transaction.getAll,[userObj.USER_ID]
        );
        res.json(resData.rows);
      } catch (err) {
        res.json({"message" : "Error while getting transactions "+err.stack});
      }
});

module.exports = router;