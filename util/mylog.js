/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-07-20 16:18:38
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
