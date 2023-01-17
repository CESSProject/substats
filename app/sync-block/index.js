/*
 * @Description: This is a program to synchronize block data from the chain. This page is the main process
 * @Autor: fage
 * @Date: 2022-07-12 15:39:39
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-16 10:55:12
 * @description: about
 * @author: chenbinfa
 */
const init = require("../init");
let api = null;

let util = require("../../util/common");
const Dal = require("../../dal/dal-common");
const dalBlock = Dal("tb_block_info");
let wsHelper = require("../../bll/ws-helper");

var os = require("os");
const common = require("../../util/common");

const {
  getBlockInfo,
  getEvents,
  getTransactions,
} = require("./chain-queryer");
const {
  processBlockInfo,
} = require("./data-process");
const {
  saveBlockInfo,
} = require("./data-store");

async function main() {
  console.log("sync block info starting");
  const platform = os.platform();
  console.log("os platform", platform);
  console.log("waiting init connect chain...");
  common.useTime("init polkdot chain rpc", 1);
  api = await init();
  global.api = api;
  common.useTime("init polkdot chain rpc");
  console.log("starting sync block info...");
  

  let currHeight = 13780000;
  let maxHeight=await api.query.system.number();
  maxHeight=maxHeight.toNumber();
  if(currHeight>maxHeight){
    currHeight=maxHeight-1000;
  }
  
  api.rpc.chain.subscribeNewHeads((header) => {
    maxHeight = header.number.toNumber();
    console.log(`maxHeight ${header.number}`);
  });
  let sql = "select blockHeight from ?? order by blockHeight desc limit 1";
  let param = [dalBlock.tableName];
  let tmp = await dalBlock.query(sql, param);
  if (tmp.length > 0) {
    currHeight = tmp[0].blockHeight + 1;
  }
  // currHeight = 13652287;
  // console.log("currHeight", currHeight);
  if (maxHeight < currHeight) {
    maxHeight = currHeight + 1;
  }

  // return;
  while (true) {
    currHeight = await loopGetBlock(currHeight, maxHeight);
    if (currHeight >= maxHeight) {
      await util.sleep(2000);
    }
  }
}
async function loopGetBlock(start, end) {
  let index = 0;
  for (let i = start; i < end; i++) {
    try {
      let { blockInfo, hash } = await getBlockInfo(i);
      let { blockHeight, exists } = await processBlockInfo(blockInfo);
      if(exists){
        continue;
      }
      let events = await getEvents(hash);
      let { timestamp, txCount, eventCount }=await getTransactions(blockInfo,blockHeight,events);
      await saveBlockInfo(hash, blockHeight, blockInfo, timestamp, txCount, eventCount);
    } catch (e) {
      api = await init();
      console.error(e);
    }
    index = i;
  }
  return index;
}

function showLog(...msg) {
  console.log(...msg);
}
function sendLog(msg, data) {
  wsHelper.send("log", "append", data);
}

global.showLog = showLog;
global.sendLog = sendLog;
// main();
module.exports = main;

// main();
