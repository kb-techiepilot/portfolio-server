const Pool = require("pg").Pool;

// const pool = new Pool({
//     user: "postgres",
//     password: "root",
//     database: "port",
//     host: "localhost",
//     port: "5432"
// });

const pool = new Pool({
    user: "ecdklsjcttltdj",
    password: "e16ee3a923992919539ebefb45eca306e954957ce803f05dba64b1691d6c53a7",
    database: "d8lnlcpqhio1si",
    host: "ec2-54-152-185-191.compute-1.amazonaws.com",
    port: "5432",
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;