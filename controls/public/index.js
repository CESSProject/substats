/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-04 11:23:48
 * @description: about
 * @author: chenbinfa
 */
"use strict";
let paramHelper = require("../param-helper");
let crypto = require("../../util/crypto");
/*
 * public api
 */
let secret = global.webconfig?.publicApi?.secret||'test';

let obj = {
  chainStateConsts: {
    func: require("../chain-state/constants"),
    actions: "*",
    needsecret: false,
  },
  storage: {
    func: require("../storage/index"),
    actions: "*",
    needsecret: false,
  },
  dbcommon: {
    func: require("../queryDB/common"),
    actions: ["list", "detail", "column"],
    needsecret: false,
  },
  dics: {
    func: require("../queryDB/dics"),
    actions: ["list"],
    needsecret: false,
  },
};

module.exports = async function (req, res, next) {
  try {
    let way = req.body.way || req.params.way;
    let action = req.body.action || req.params.action;
    req.body.way = way;
    req.body.action = action;
    paramHelper(req);
    let o = obj[way];
    if (!o) {
      res.json({
        result: "way not found:" + way,
        msg: "fail",
      });
      return false;
    }
    if (o.actions != "*") {
      let temp = o.actions.indexOf(action);
      if (temp == -1) {
        res.json({
          result: "action not fouond:" + action,
          msg: "noAuthority",
        });
        return false;
      }
    }
    if (o.needsecret) {
      if (!req.body.secret || req.body.secret != secret) {
        res.json({
          result: "secret error.",
          msg: "fail",
        });
        return false;
      }
    }
    if (o.md5) {
      if (!req.body.secret) {
        res.json({
          result: "secret not found.",
          msg: "fail",
        });
        return false;
      }
      let str = way + action;
      if (req.body.id) {
        str += req.body.id;
      }
      str += secret;
      let md5str = crypto.md5(str).toLocaleLowerCase();
      if (req.body.secret != md5str) {
        res.json({
          result: "secret error.",
          msg: "error",
          yoursecret: req.body.secret,
        });
        return false;
      }
    }
    o.func(req, res, next);
  } catch (e) {
    console.log(e);
    next(e);
  }
};
