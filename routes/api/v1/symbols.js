const express = require("express");
const router = express.Router();
const { NseIndia } = require("stock-nse-india");

const nseIndia = new NseIndia()

async function getAllSymbols() {
    let symbols = await nseIndia.getAllStockSymbols();
    return symbols;
}

router.get('/', async (req, res) => {
    const symbols = await getAllSymbols();
    res.json(symbols);
});

module.exports = router;