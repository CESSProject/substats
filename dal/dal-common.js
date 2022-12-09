const orm = require("sqldb-orm");
const path = require("path");
let dborm = {};

module.exports = function (tableName) {
  if (dborm[tableName]) {
    return dborm[tableName];
  }
  let dbType = "sqlite3",
    config = path.join(__dirname, "../db.sqlite3");
  if (global.webconfig?.mysql?.user) {
    dbType = "mysql";
    config = global.webconfig.mysql;
  }
  // console.log("database type ", dbType);
  dborm[tableName] = orm.getClassSync(dbType, config, tableName, false);
  return dborm[tableName];
};
