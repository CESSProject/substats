const webconfig = require("./webconfig");
global.webconfig = webconfig; //set grobal attribute for more convenient call
const initDatabaseConfig = require("./bll/init-database-config");

// check the run arguments and use the corresponding database
const arguments = process.argv;
let dbconfigFile = null;
if (arguments.length > 2) {
  //get config from command arguments
  console.log("arguments[2]", arguments[2]);
  dbconfigFile = arguments[2];
}
initDatabaseConfig(dbconfigFile); //init the database config from config file

const express = require("express");
const compression = require("compression");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const moment = require("moment");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressWs = require("express-ws");
require("./util/add-functions");
const syncBlockAPP = require("./app/sync-block/index.js");
const trendAPP = require("./app/trend-record");

const routes = require("./routes/index");
const api = require("./routes/api");
const ws = require("./routes/ws");
const initDotChain = require("./bll/init-polkadot-api");
const sub = require("./bll/sub");
const init = require("./bll/init");

// defaut use the port of webconfig
const port = webconfig.port.http || 80;

const app = express();
expressWs(app);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(compression()); //gzip

//CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
app.use(cors());

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "ui/build", "favicon.ico")));

//add log with the format
logger.token("time", function (req, res) {
  return moment().format("YYYY-MM-DD HH:mm:ss");
});
logger.token("realip", function (req, res) {
  if (!req || !req.ip) return "";
  return req.ip.replace("::ffff:", "");
});
logger.token("host", function (req, res) {
  return req.headers.host;
});
app.use(
  logger(":time :method :status :host :realip :url", {
    skip: function (req, res) {
      //skip show log when status code is 200 or 304,because this is normal .
      return res.statusCode == 200 || res.statusCode == 304;
    },
  })
);

// will can get req.body object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: "10000kb" })); //max req size
app.use(express.static(path.join(__dirname, "ui/build")));
app.use(express.static(path.join(__dirname, "public"))); //config the static dir

app.use("/", routes); //base path
app.use("/api", api); //api router
app.ws("/ws", ws); // websocker router
app.use(function (req, res, next) {
  // var err = new Error("Not Found");
  // err.status = 404;
  // next(err);
  res.sendFile(path.join(__dirname, "ui/build")+'/index.html');
});
app.use(function (err, req, res, next) {
  if (err == 404) {
    err = new Error("404 not found");
    
    return;
  } else if (typeof err != "object") {
    err = new Error(err);
  }
  if (err && !err.status) err.status = 500;
  if (err.status == 302) {
    return res.redirect(err.message);
  }
  res.status(err.status);
  //err.stack = '';
  res.render("error", {
    message: err.message || "unknow error",
    error: err,
  });
});
global.wsClientList = []; //all websocker client
initDotChain().then((t) => {
  // init the chain connect
  syncBlockAPP();
  trendAPP();
  sub();
}, console.error);
init();

app.listen(port); //start the http webserver
console.log("listening on ", port);
