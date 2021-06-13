var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const indexRoute = require("./routes/index");
const wishlist = require("./routes/api/v1/wishlist");
const holdings = require("./routes/api/v1/holdings");
const summary = require("./routes/api/v1/summary");
const history = require("./routes/api/v1/history");
const symbols = require("./routes/api/v1/symbols");
const news = require("./routes/api/v1/news");

const wishlistV2 = require("./routes/api/v2/wishlist");
const holdingsV2 = require("./routes/api/v2/holdings");
const transactionsV2 = require("./routes/api/v2/transactions");
const soldV2 = require("./routes/api/v2/sold");
const summaryV2 = require("./routes/api/v2/summary");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const audience = "https://techiepilot.in";
const issuer = "https://dev-604foaig.us.auth0.com/";

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use(helmet());
app.use(cors({ origin: "*" }));

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

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
app.use("/api/v1/wishlist", checkJwt, wishlist);
app.use("/api/v1/holdings", checkJwt, holdings);
app.use("/api/v1/summary", checkJwt, summary);
app.use("/api/v1/history", history);
app.use("/api/v1/symbols", symbols);
app.use("/api/v1/news", news);

//version2 apis
app.use("/api/v2/wishlist", checkJwt, wishlistV2);
app.use("/api/v2/holdings", checkJwt, holdingsV2);
app.use("/api/v2/transactions", checkJwt, transactionsV2);
app.use("/api/v2/sold", checkJwt, soldV2);

app.use("/api/v2/summary", checkJwt, summaryV2);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
