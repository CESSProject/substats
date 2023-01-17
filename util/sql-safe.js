/*
 * @Description:Sql query keywrod safe check
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-16 15:05:21
 * @description: about
 * @author: chenbinfa
 */
"use strict";
const injArr =
  "'|exec|insert|select|delete|update|*|%|chr|mid|master|truncate|char|declare|;|+|=|!=".split(
    "|"
  );

function checkSafe(sqlStr) {
  for (let i = 0; i < injArr.length; i++) {
    if (sqlStr.indexOf(injArr[i]) != -1) {
      if (sqlStr.indexOf("master_") == -1) {
        return false;
      }
    }
  }
  return true;
}
module.exports = {
  checkSafe: checkSafe,
};

// console.log(checkSafe('bandwidth'));
