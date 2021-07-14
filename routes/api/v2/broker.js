const express = require("express");
const router = express.Router();
const user = require("./user");


const sql  = require("../../../config/sqlv2");
const pool = require("../../../db/db");

function getBrokerResponse(brokers){
    const response = [];
    var broker = {};

    for(var i = 0; i < brokers.length; i++) {
        broker.broker_id = brokers[i].BROKER_ID;
        broker.name = brokers[i].NAME;
        broker.url = brokers[i].URL;
        response.push(broker);
        broker = {};
    }
    return response;
}

async function getBrokers(userId) {

    try{
        const response = await pool.query(
            sql.broker.select, [userId]
        );

        if(response.rowCount > 0) {
            return getBrokerResponse(response.rows);
        }
    } catch(err) {
        console.log(err.message);
    }
}

async function getBroker(userId, name) {

    try{
        const response = await pool.query(
            sql.broker.selectByName, [userId, name]
        );

        if(response.rowCount > 0) {
            return response.rows;
        }
        return null;
    } catch(err) {
        console.log(err.message);
    }
}

router.get('/', async (req, res) => {
    const userData = await user.getUserFromDb(req.user.sub, req.headers.authorization);
    const response = await getBrokers(userData.USER_ID)
    res.json(response);
});

router.post('/', async (req, res) => {
    const { name, url} = req.body;

    const userData = await user.getUserFromDb(req.user.sub, req.headers.authorization);

    const broker = await getBroker(userData.USER_ID, name);
    if(broker !== null) {
        return res.status(404).json({"message" : "Broker already exist"});
    }
    await pool.query(
        sql.broker.insert, [userData.USER_ID, name, url]
    );
    const response = await getBrokers(userData.USER_ID)
    res.json(response);
});

router.post('/:id', async (req, res) => {
    let id = req.params.id;
    const { name, url} = req.body;

    const userData = await user.getUserFromDb(req.user.sub, req.headers.authorization);
    await pool.query(
        sql.broker.update, [name, url, id, userData.USER_ID]
    );
    const response = await getBrokers(userData.USER_ID)
    res.json(response);
});

module.exports = router;