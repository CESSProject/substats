/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-08-02 10:51:57
 * @LastEditors: lanmeng656 cbf0311@sina.com
 * @LastEditTime: 2022-12-05 11:03:21
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
let common = require("../util/common");
let isLoading = false;

async function initAPI() {
  global.webconfig = webconfig;
  if (isLoading) {
    await common.sleep(500);
    return initAPI();
  }
  if (api) return api;
  try {
    isLoading = true;
    const ws = webconfig.wsnode.nodeURL;
    const wsProvider = new WsProvider(ws);
    let apiS = new ApiPromise({ provider: wsProvider });
    await apiS.isReady;
    global.api = apiS;
    isLoading = false;
    return apiS;
  } catch (e) {
    console.log(e);
    isLoading = false;
    return null;
  }
}
module.exports = initAPI;
