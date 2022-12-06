const mysqlConfigLoader = require("./mysql-config-loader");
let webconfig = require("../webconfig");
//load mysql config
async function init(configFilePath) {
  if (!global.webconfig) {
    global.webconfig = webconfig;
  }
  let config = mysqlConfigLoader(configFilePath);
  if (!config) {
    return console.error("database config load fail");
  }
  global.webconfig.mysql = config;
}
module.exports = init;
