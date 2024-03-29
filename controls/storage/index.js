/*
 * @Description:query store from chain
 * @Autor: fage
 * @Date: 2022-07-11 15:11:35
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-21 17:12:14
 * @description: about
 * @author: chenbinfa
 */
"use strict";
const _ = require("lodash");

module.exports = async function (req, res, next) {
  const api = global.dotApi;
  // console.log("req.body storage", req.body);
  //   return res.json({ msg: "ok", data: "11" });
  const { ac1, ac2 } = req.body;
  if (!ac1) {
    return res.json({ msg: "ac1 not found." });
  }
  if (!ac2) {
    return res.json({ msg: "ac2 not found." });
  }
  try{
    await api.isReady;//wait connect ready
  }catch(e){
    return res.json({ msg: "error" });
  }
  const param = req.body;
  if (!api.query[ac1]) {
    return res.json({ msg: "api.query." + ac1 + " not a function" });
  }
  if(!api.query[ac1][ac2]){
    return res.json({
      msg: "api.query." + ac1 + "." + ac2 + " not a function",
    });
  }
  let retsult; 
  let fun = api.query[ac1][ac2];//the ac1 and ac2 is function name
  if (fun.entries && typeof fun.entries == "function") {
    if (param && param.id) {
      retsult = await fun(param.id);
      retsult = retsult.toJSON();
    } else {
      retsult = await fun.entries();
      retsult = retsult.map(([key, entry]) => {
        let id = _.get(
          key.args.map((k) => k.toHuman()),
          `0`
        );
        let humanObj = entry.toJSON();
        return _.assign(humanObj, { key: id });
      });
    }
  } else {
    if (param && param.id) {
      retsult = await fun(param.id);
    } else {
      retsult = await fun();
    }
    retsult = retsult.toJSON();
  }

  const ret = {
    msg: "ok",
    data: retsult,
  };
  //   let a = api.consts.babe.expectedBlockTime;
  res.json(ret);
};
