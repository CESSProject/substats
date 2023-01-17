/*
 * @Description:init polkadot.js and connect to rpc node
 * @Autor: fage
 * @Date: 2022-08-02 10:51:57
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-17 10:32:08
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
let common = require("../util/common");
const initDatabaseConfig = require("../bll/init-database-config");
let isLoading = false;
let webconfigS = require("../webconfig");

async function initAPI() {
  //init webconfig
  webconfig = global.webconfig;
  if (!webconfig) {
    webconfig = webconfigS;
    global.webconfig = webconfig;
  }
  if (!webconfig.mysql) {
    initDatabaseConfig();//init database connect
  }
  if (isLoading) {
    await common.sleep(500);
    return initAPI();
  }
  if (api) return api;
  if (global.dotApi) {
    console.log('get connect chain api object from global.dotApi');
    api = global.dotApi;
    await api.isReady;
    global.api = api;
    return api;
  }
  try {
    isLoading = true;
    const ws = webconfig.wsnode.nodeURL;
    const wsProvider = new WsProvider(ws);
    let apiS = new ApiPromise({ provider: wsProvider });
    await apiS.isReady;
    global.api = apiS;
    api = apiS;
    isLoading = false;
    return apiS;
  } catch (e) {
    console.log(e);
    isLoading = false;
    return null;
  }
}
module.exports = initAPI;
