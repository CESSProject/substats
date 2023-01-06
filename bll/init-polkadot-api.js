/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 17:31:18
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-06 11:01:49
 */
const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api");
const webconfig = require("../webconfig");
let wsHelper = require("./ws-helper");
const config = webconfig.wsnode;
let api, keyring;
const provider = new WsProvider(config.nodeURL);

module.exports = main;
let waiting = false;
function main() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('start connect to chain rpc...');
      keyring = new Keyring(config.keyringOption);
      if (waiting) {
        console.log('connecting to chain rpc');
        return;
      }
      wsHelper.send("rpc", "connect", "loading");
      waiting = false;
      api = new ApiPromise({
        provider,
      });      
      api.on("connected", () => {
        console.log("connect to chain rpc success ", config.nodeURL);
        wsHelper.send("rpc", "connect", "ok");

        global.dotApi = api;
        global.dotKeyring = keyring;
        resolve({ api, keyring });
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
      // await api.isReady;
      // api.o;
    } catch (e) {
      console.log(e);
    }
  });
}
