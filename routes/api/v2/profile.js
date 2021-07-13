const express = require("express");
const router = express.Router();
const user = require("./user");
const axios = require('axios');

const pool = require("../../../db/db");
const sql  = require("../../../config/sqlv2");

function getProfileResponse(userData, profileData) {
    const response = {};
    const brokers = [];
    var broker = {};

    for(var i = 0; i < profileData.length; i++){
        broker.broker_id = profileData[i].BROKER_ID;
        broker.name = profileData[i].BROKER_NAME;
        broker.url = profileData[i].URL;
        brokers.push(broker);
        broker = {};
    }

    response.user_id = profileData[0].USER_ID;
    response.created_on = profileData[0].CREATED_ON;
    response.name = profileData[0].NAME;
    response.picture = userData.picture;
    response.email = userData.email;
    response.email_verified = userData.email_verified;
    response.brokers = brokers;

    return response;
}

router.get('/', async (req, res) => {
    const userData = await user.getUserFromAuth0(req.headers.authorization);
    const profile = await user.getUserProfile(req.user.sub);
    var response = getProfileResponse(userData, profile);

    res.json(response);
});

module.exports = router;