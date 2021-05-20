const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.send("Welcome to backend server");
});

module.exports = router;