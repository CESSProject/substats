
let util = require("../../../util/common");
const Dal = require("../../../dal/dal-common");
const dalBlock = Dal("tb_block_info");
const dalTransaction = Dal("tb_block_transaction");
const dalEvent = Dal("tb_block_event");
let wsHelper = require("../../../bll/ws-helper");

const moment = require("moment");
var os = require("os");
const common = require("../../../util/common");


async function main(value) {
    showLog(
      "========================start block " +
        value +
        "================================"
    );
    let hash = "";
    if (typeof value != "number") {
      hash = value;
    } else {
      // console.log("getBlockHash", value);
      common.useTime("getBlockHash", 1);
      let result = await api.rpc.chain.getBlockHash(value);
      common.useTime("getBlockHash");
      showLog("getBlockHash success", value);
      hash = result.toHex();
    }
    showLog("getBlock", hash);
    common.useTime("getBlock", 1);
    const blockInfo = await api.rpc.chain.getBlock(hash);
    console.log("blockInfo length", JSON.stringify(blockInfo).length);
    common.useTime("getBlock");
    const blockHeight = blockInfo.block.header.number.toNumber();
    showLog("dalBlock.findWithQuery,blockHeight:", blockHeight);
    sendLog("log", "saving block " + blockHeight);
    const tmp = await dalBlock.findWithQuery({ blockHeight });
    if (tmp.length > 0) {
      return console.log("Item is exists");
    }
    showLog("api.query.system.events.at", hash);
    common.useTime("get events", 1);
    const events = await api.query.system.events.at(hash);
    common.useTime("get events");
    console.log("event length", JSON.stringify(events).length);
    showLog("saveTx", blockHeight);
    const { timestamp, txCount, eventCount } = await saveTx(
      hash,
      blockHeight,
      blockInfo,
      events
    );
    showLog("saveBlock", timestamp);
    await saveBlock(hash, blockHeight, blockInfo, timestamp, txCount, eventCount);
    console.log("block sync sccuess", blockHeight);
    sendLog("log", "save block sccuess " + blockHeight);
    showLog(
      "========================end block " +
        blockHeight +
        "================================"
    );
  }
module.exports = main;
