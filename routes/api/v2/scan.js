const express = require("express");
const router = express.Router();
const axios = require('axios');

router.get("/", async (req, res) => {
    const { cookie, csrf } = req.query;
    const squery = '( {33492} ( latest close > latest "( (1 candle ago high + 1 candle ago low + 1 candle ago close / 3 ) * 2 - 1 candle ago low )" and 1 day ago  close <= 0 day ago "( (1 candle ago high + 1 candle ago low + 1 candle ago close / 3 ) * 2 - 1 candle ago low )" or( {33492} ( latest close < latest "( (1 candle ago high + 1 candle ago low + 1 candle ago close / 3 ) * 2 - 1 candle ago high)" and 1 day ago  close >= 0 day ago "( (1 candle ago high + 1 candle ago low + 1 candle ago close / 3 ) * 2 - 1 candle ago high)" ) ) ) )';
    const stocks = await axios({
        method: "post",
        url: "https://chartink.com/screener/process",
        data: `scan_clause=${encodeURIComponent(squery)}`,
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "cookie": cookie,
            "x-csrf-token": csrf
    },
      })
        .then(function (response) {
          // console.log(response);
          res.json(response.data);
        })
        .catch(function (response) {
          // console.log(response);
          res.json(response);
        });
});

module.exports = router;