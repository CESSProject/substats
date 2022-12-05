/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 19:45:15
 * @LastEditors: lanmeng656 cbf0311@sina.com
 * @LastEditTime: 2022-12-05 17:09:48
 * @description: about
 * @author: chenbinfa
 */
const log = require("../util/mylog");
const Dal = require("../dal/dal-common");
async function main(ws, req) {
  let list = global.wsClientList;
  ws.send(
    JSON.stringify({ msg: "ok", apiName: "connectState", data: "success" })
  );
  list.push(ws);
  log("client count ", list.length);
  ws.on("close", function close() {
    let i = list.indexOf(ws);
    list.splice(i, 1);
    log("disconnected");
    log("client count ", list.length);
  });
  ws.on("message", function (data) {
    systemStatus(ws, data);
  });
}

async function systemStatus(ws, json) {
  json.data = null;
  if (json.way == "System startup") {
    json.msg = global.webconfig ? "ok" : "fail";
  } else if (json.way == "Listening port") {
    json.msg = "ok";
    json.data = global.webconfig.port.http;
  } else if (json.way == "Connect to mysql") {
    try {
      const dal = new Dal("tb_block_info");
      let list = await dal.findTop(null, 1);
      json.msg = list ? "ok" : "fail";
    } catch (e) {
      json.msg = "fail";
    }
  } else if (json.way == "Connect chain node RPC") {
    try {
      json.msg = global.api ? "ok" : "fail";
      json.data = global.webconfig.wsnode.nodeURL;
    } catch (e) {
      json.msg = "fail";
    }
  } else if (json.way == "Tables") {
    try {
      const dal = new Dal("tb_block_info");
      let list = await dal.getAllTableNames();
      json.msg = list ? "ok" : "fail";
      json.data = list;
    } catch (e) {
      json.msg = "fail";
    }
  }
  ws.send(json);
}

module.exports = main;
