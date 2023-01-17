/*
 * @Description:Show log with time line;
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-16 15:05:33
 * @description: about
 * @author: chenbinfa
 */
const moment = require("moment");
const debug = true;
module.exports = function (...msg) {
  if (!debug) {
    return;
  }
  msg.unshift(moment().format("MM-DD HH:mm:ss"));
  console.log(...msg);
};
