const Pool = require("pg").Pool;

//dbconfig for V1
// const pool = new Pool({
//     user: "postgres",
//     password: "root",
//     database: "port",
//     host: "localhost",
//     port: "5432"
// });

//dbconfig for V2
// const pool = new Pool({
//     user: "postgres",
//     password: "root",
//     database: "portv2",
//     host: "localhost",
//     port: "5432"
// });

//heroku configuration for V1
// const pool = new Pool({
//     user: "ecdklsjcttltdj",
//     password: "e16ee3a923992919539ebefb45eca306e954957ce803f05dba64b1691d6c53a7",
//     database: "d8lnlcpqhio1si",
//     host: "ec2-54-152-185-191.compute-1.amazonaws.com",
//     port: "5432",
//     ssl: { rejectUnauthorized: false }
// });

//heroku configuration for V2
const pool = new Pool({
    user: "auvoanjugvszuy",
    password: "8c87548ac07ae429548cf961d419efb951c3a4a41f33e012ce4403f8c54ebad9",
    database: "dalhvchjeh35l9",
    host: "ec2-34-193-101-0.compute-1.amazonaws.com",
    port: "5432",
    ssl: { rejectUnauthorized: false }
});

//azure psql configs
// const pool = new Pool({
//     user: "portfolio@kb-shares",
//     password: "Root@123",
//     database: "postgres",
//     host: "kb-shares.postgres.database.azure.com",
//     port: "5432",
//     ssl: true
// });

module.exports = pool;

// postgres://portfolio%40kb-shares:Root%40123@kb-shares.postgres.database.azure.com:5432/postgres