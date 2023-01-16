/*
 * @Description: Get dictionary list from cache
 * @Autor: fage
 * @Date: 2022-07-11 15:11:35
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-16 14:59:56
 * @description: about
 * @author: chenbinfa
 */
"use strict";
const init = require("../../bll/init");

module.exports = async function (req, res, next) {
  const data = await init();
  // console.log("get dics", JSON.stringify(data));
  res.json({ msg: "ok", data });
};
