/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-08-02 10:51:57
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-04 17:07:53
 * @description: about
 * @author: chenbinfa
 */
const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api");
const {
  BN,
  BN_ONE,
  BN_THOUSAND,
  BN_TWO,
  bnToBn,
  extractTime,
} = require("@polkadot/util");
let api = null;
let webconfig = require("../webconfig");

async function initAPI() {
  global.webconfig = webconfig;
  if (api) return api;
  try {
    const ws = webconfig.wsnode.nodeURL;
    const wsProvider = new WsProvider(ws);
    api = new ApiPromise({ provider: wsProvider });
    await api.isReady;
    global.api = api;
    return api;
  } catch (e) {
    console.log(e);
    return null;
  }
}
module.exports = initAPI;
