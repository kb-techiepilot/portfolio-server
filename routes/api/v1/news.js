const express = require("express");
const NewsAPI = require('newsapi');
const moment = require('moment');
const newsapi = new NewsAPI('0975df992014492c83c727d25d389ad1');
const router = express.Router();

router.get('/', async (req, res) => {
    var startDate = moment().subtract(1, 'day').format("YYYY-MM-DD");
    var endDate = moment().format("YYYY-MM-DD");
    newsapi.v2.everything({
        q: 'sensex',
        from: startDate,
        to: endDate,
        language: 'en',
        pageSize: 10
      }).then(response => {
        res.json(response);
      });
});
module.exports = router;