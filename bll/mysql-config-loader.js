/*
 * @Description:the database config for mysql
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 cbf0311@sina.com
 * @LastEditTime: 2022-12-06 10:07:31
 */
"use strict";
const fs = require("fs");
const path = require("path");
module.exports = function (configFilePath) {
  if (!configFilePath) {
    configFilePath = path.join(__dirname, "../mysql-config.json");
  }
  if (fs.existsSync(configFilePath)) {
    try {
      let tmp = fs.readFileSync(configFilePath, { encoding: "utf-8" });
      return JSON.parse(tmp);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log("config file not found:", configFilePath);
  }
  return null;
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
