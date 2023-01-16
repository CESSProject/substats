const orm = require("sqldb-orm");
const path = require("path");
let dborm = {};

// This is database handle function
// Use sqldb-orm package to connect database
// The runtime can select mysql or sqlite according to the parameters
module.exports = function (tableName) {
  if (dborm[tableName]) {
    return dborm[tableName];
  }
  let dbType = "sqlite3",// default database
    config = path.join(__dirname, "../db.sqlite3");//sqlite3 file path
  if (global.webconfig?.mysql?.user) {
    dbType = "mysql"; // if has init a mysql connect ,use mysql
    config = global.webconfig.mysql; // load the mysql config
  }
  // console.log("database type ", dbType);
  dborm[tableName] = orm.getClassSync(dbType, config, tableName, false);//get class
  return dborm[tableName];
};
