const fetch = require("node-fetch");
const axios = require("axios");

const pool = require("../../../db/db");
const sql  = require("../../../config/sqlv2");

async function getUserFromAuth0(token) {
    try {
        const response = await axios.get(
          `https://dev-604foaig.us.auth0.com/userinfo`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        return response.data;
      } catch(error) {
        return (error.message);
      }
};

async function getUserProfile(sub) {
  try {
    var user = await pool.query(
      sql.users.getProfile, [sub]
    );
    if(user.rows.length > 0) {
      return user.rows;
    }
  } catch (err) {
    console.log(err.stack);
  }
}

async function getUserFromDb(sub, token) {
    try {
      var user = await pool.query(
        sql.users.getUserBySub, [sub]
      );
      if(user.rows.length === 0) {
        console.log("adding user");
        try{
            const userObj = await getUserFromAuth0(token);
            user = await pool.query(
                sql.users.insert, [userObj.name, userObj.sub ]
            );
            await pool.query(
                sql.workspace.insertForHoldings, [user.rows[0].USER_ID]
            );
            await pool.query(
                sql.workspace.insertForWishlist, [user.rows[0].USER_ID]
            );
            await pool.query(
                sql.broker.insert, [user.rows[0].USER_ID, 'broker_1', '']
            );
            return user.rows[0];
        } catch (err) {
            console.log(err.stack);
          }
      }
      else {
        return user.rows[0];
      }
    } catch (err) {
        console.log(err.stack);
    }
  }

  async function getUserWithWorkspace(sub, workspace, workspaceType, token) {
    const userData = await getUserFromDb(sub, token);
      try {
        var user = await pool.query(
          sql.users.getUserWorkspace, [userData.USER_ID, workspace, workspaceType]
        );
        if(user.rows.length === 0) {
          return null;
        }
        else {
          return user.rows[0];
        }
      } catch (err) {
          console.log(err.stack);
      }
    }

  exports.getUserFromDb = getUserFromDb;
  exports.getUserProfile = getUserProfile;
  exports.getUserWithWorkspace = getUserWithWorkspace;
  exports.getUserFromAuth0 = getUserFromAuth0;