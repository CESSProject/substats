/*
 * @Description:Websocket api
 * @Autor: fage
 * @Date: 2022-07-11 19:45:15
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-16 15:03:35
 * @description: about
 * @author: chenbinfa
 */
const log = require("../util/mylog");
const Dal = require("../dal/dal-common");
const common = require("../util/common");

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
    let json = JSON.parse(data);
    systemStatus(ws, json);
  });
}

async function systemStatus(ws, json) {
  json.data = null;
  if (json.way == "System startup") {
    json.msg = global.webconfig ? "ok" : "fail";
  } else if (json.way == "Listening port") {
    json.msg = "ok";
    json.data = global.webconfig.port.http;
  } else if (json.way == "Connect to database") {
    try {
      const dal = Dal("tb_block_info");
      let list = await dal.findTop(null, 1);
      json.msg = list ? "ok" : "fail";
    } catch (e) {
      json.msg = "fail";
    }
  } else if (json.way == "Connect chain node RPC") {
    try {
      for (let i = 0; i < 1000; i++) {
        json.msg = global.api ? "ok" : "fail";
        if (json.msg != "ok") {
          common.sleep(500);
        } else {
          break;
        }
      }
      json.data = global.webconfig.wsnode.nodeURL;
    } catch (e) {
      json.msg = "fail";
    }
  } else if (json.way == "Tables") {
    try {
      const dal = Dal("tb_block_info");
      let list = await dal.getTableNames();
      // let list=await dal.findTop(null,10);
      json.msg = list ? "ok" : "fail";
      json.data ="tables:" + list.map((t) => t.table_name).join(",");
    } catch (e) {
      json.msg = "fail";
    }
  }
  ws.send(JSON.stringify(json));
}

module.exports = main;
