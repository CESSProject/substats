/*
 * @Description:the database config for mysql
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2022-12-09 11:55:23
 */
"use strict";
const fs = require("fs");
module.exports = function (configFilePath) {
  // if (!configFilePath) {
  //   configFilePath = path.join(__dirname, "../mysql-config.json");
  // }
  if (!configFilePath) {
    return null;
  }
  if (!fs.existsSync(configFilePath)) {
    console.log("config file not found:", configFilePath);
    return null;
  }
  try {
    let tmp = fs.readFileSync(configFilePath, { encoding: "utf-8" });
    return JSON.parse(tmp);
  } catch (e) {
    console.error(e);
    return null;
  }
};

// the mysql config format as:
// {
//   "connectionLimit": 10,
//   "host": "127.0.0.1",
//   "user": "substats",
//   "password": "Ni6eY85EXM6ZrMLG",
//   "port": 3306,
//   "database": "substats"
// }
