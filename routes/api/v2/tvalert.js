const express = require("express");
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    const gainers = await axios.post('https://api.telegram.org/bot5007955067:AAGCvnc1AhD0Y11ukuM4zuuCKTb3obJVlwM/sendMessage?chat_id=-1001793121016&text='+req.body.text);
    console.log(gainers);
    res.json({"return" : "success"});
});

module.exports = router;