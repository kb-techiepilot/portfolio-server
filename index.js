const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { resolve } = require("path");

const indexRoute = require("./routes/index");
const wishlist = require("./routes/api/wishlist");
const holdings = require("./routes/api/holdings");

const PORT = process.env.PORT || 2000

const app = express();

const port = "7001";
const appOrigin = "http://localhost:3000";
const audience = "https://techiepilot.in";
const issuer = "https://dev-604foaig.us.auth0.com/";

app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());

app.use(helmet());
app.use(cors({ origin: appOrigin }));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${issuer}.well-known/jwks.json`,
  }),

  audience: audience,
  issuer: issuer,
  algorithms: ["RS256"],
});

// Routes
app.use("/", indexRoute);
app.use("/wishlist", wishlist);
app.use("/holdings", holdings);

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}!!!`);
});