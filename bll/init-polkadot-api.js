/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 17:31:18
 * @LastEditors: lanmeng656 cbf0311@sina.com
 * @LastEditTime: 2022-12-06 10:31:13
 */
const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api");
const webconfig = require("../webconfig");
let wsHelper = require("./ws-helper");
const config = webconfig.wsnode;
let api, keyring;
const provider = new WsProvider(config.nodeURL);

module.exports = main;
let waiting = false;
async function main() {
  try {
    if (waiting) {
      return;
    }
    wsHelper.send("rpc", "connect", "loading");
    waiting = false;
    api = new ApiPromise({
      provider,
    });
    api.on("connected", () => {
      console.log("connect success ", config.nodeURL);
      wsHelper.send("rpc", "connect", "ok");
    });
    api.on("disconnected", () => {
      console.log("ws disconnected", config.nodeURL);
      wsHelper.send("rpc", "connect", "disconnected");
      if (waiting) {
        return;
      }
      waiting = true;
      setTimeout(main, 3000);
    });
    api.on("error", (error) => {
      console.log("error", error.message);
      wsHelper.send("rpc", "connect", "error");
      if (waiting) {
        return;
      }
      waiting = true;
      setTimeout(main, 3000);
    });
    process.on("uncaughtException", function (err) {
      console.error("uncaughtException", err);
    });

    process.on("unhandledRejection", function (err, promise) {
      console.error("unhandledRejection", err);
    });

    keyring = new Keyring(config.keyringOption);
    api.o;
    global.dotApi = api;
    global.dotKeyring = keyring;
    return { api, keyring };
  } catch (e) {
    console.log(e);
  }
}
