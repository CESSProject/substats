/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 15:11:35
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-07-21 16:22:16
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
