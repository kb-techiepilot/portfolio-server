const fetch = require("node-fetch");

const pool = require("../../../db/db");
const sql  = require("../../../config/sqlv2");

async function getUserFromAuth0(token) {
    try {
        const response = await fetch(
          `https://dev-604foaig.us.auth0.com/userinfo`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        
        let responseData = await response.json();
        return responseData;
      } catch(error) {
        return (error.message);
      }
};

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

async function getUserProfile(sub, token) {
    const dbUser = await getUserFromAuth0(sub);
    const apiUser = await getUserFromAuth0(token);

    apiUser.created_on = dbUser.CREATED_ON;
    apiUser.user_id = dbUser.USER_ID;

    return apiUser;
}

  exports.getUserFromDb = getUserFromDb;
  exports.getUserProfile = getUserProfile;
  exports.getUserWithWorkspace = getUserWithWorkspace;