/*
 * @Description:Subscribe new heads
 * @Autor: fage
 * @Date: 2022-07-11 20:07:29
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-16 11:34:10
 * @description: about
 * @author: chenbinfa
 */
let chainHelper = require("../util/chain-helper");
let wsHelper = require("./ws-helper");
async function main() {
  try {
    const api = global.dotApi;
    await api.isReady;
    // api.query.timestamp.now((now) => {
    //   // console.log(`now of ${now}`);
    //   send("timestamp", "ok", now.toString());
    // });
    api.rpc.chain.subscribeNewHeads(async (header) => {
      try {
        const blockHeight = header.number.toNumber();
        console.log("blockHeight", blockHeight);
        const blockInfo = await chainHelper.getBlockInfo(api, blockHeight);
        wsHelper.send("block", "new", blockInfo);
      } catch (e2) {
        console.log(e2);
      }
    });
    // api.derive.chain.subscribeNewHeads((header) => {
    // console.log("subscribeNewHeads", header.toHuman());
    // console.log("blockHeight", header.number.toString());
    // let json = header.toHuman();
    // console.log(json.digest.logs);
    // });
  } catch (e) {
    console.log(e);
  }
}
module.exports = main;
