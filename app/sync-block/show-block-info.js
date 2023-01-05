/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 15:39:39
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-05 13:45:14
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
const fs = require("fs");

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

  // const events = await api.query.system.events.at(hash);
  let entity = blockInfo.block.toHuman();
  let str=JSON.stringify(entity, null, 2);
  fs.writeFileSync('./app/sync-block/block.json',str);
  // console.log(JSON.stringify(entity, null, 2));
 
  // console.log(JSON.stringify(events, null, 2));

  console.log('blockInfo.extrinsics.length',blockInfo.block.extrinsics.length);

  for (enx of blockInfo.block.extrinsics) {
    // let json = enx.toJSON();
    let hash = enx.hash.toHex();
    // console.log(json);
    console.log("hash",hash);
    console.log("========================================");
  }
}
async function main() {
  api = await init();
  await getBlock(2);
  console.log("complete!");
  process.exit();
}
main();
