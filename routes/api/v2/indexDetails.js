const express = require("express");
const router = express.Router();
const { NseIndia, ApiList } = require("stock-nse-india");

const nseIndia = new NseIndia()

router.get('/', async (req, res) => {
    const url = ApiList.ALL_INDICES;
    const response = await nseIndia.getDataByEndpoint(url);
    console.log(response);
    res.json(response);
});

module.exports = router;