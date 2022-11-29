/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 15:39:39
 * @LastEditors: lanmeng656 cbf0311@sina.com
 * @LastEditTime: 2022-10-13 17:02:05
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
  formatNumber,
  isFunction,
} = require("@polkadot/util");
let api = null;
let webconfig = require("../../webconfig");
global.webconfig = webconfig;
const init = require("../init");

async function getBlock(value) {
  console.log("value", value);
  let hash = "";
  if (typeof value != "number") {
    hash = value;
  } else {
    let result = await api.rpc.chain.getBlockHash(value);
    hash = result.toHex();
  }
  console.log("******************", hash);
  const blockInfo = await api.rpc.chain.getBlock(hash);
  const blockHeight = blockInfo.block.header.number.toNumber();
  console.log("blockHeight", blockHeight);

  const events = await api.query.system.events.at(hash);
  let entity = blockInfo.toHuman();
  console.log(JSON.stringify(entity, null, 2));
  console.log("========================================");
  console.log(JSON.stringify(events, null, 2));
}
async function main() {
  api = await init();
  await getBlock(12460104);
  console.log("complete!");
  process.exit();
}
main();
