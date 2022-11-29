/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 19:45:15
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-07-20 16:25:11
 * @description: about
 * @author: chenbinfa
 */
const log = require("../util/mylog");
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
}

module.exports = main;
