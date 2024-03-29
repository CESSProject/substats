/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 15:39:39
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-01 10:41:33
 * @description: about
 * @author: chenbinfa
 */
const init = require("../init");
let api = null;

let util = require("../../util/common");
const Dal = require("../../dal/dal-common");
const dalBlock = Dal("tb_block_info");
const dalTransaction = Dal("tb_block_transaction");
const dalEvent = Dal("tb_block_event");
let wsHelper = require("../../bll/ws-helper");
let accountSave = require("./account");

const moment = require("moment");
var os = require("os");
const common = require("../../util/common");

async function getBlock(value) {
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
async function saveBlock(
  hash,
  blockHeight,
  src,
  timestamp,
  txCount,
  eventCount
) {
  let blockInfo = src.toHuman();
  blockInfo = blockInfo.block;
  // console.log("blockInfo", blockInfo);
  // let signerAccount = src.header.author || src.header.authorFromMapping;
  // signerAccount = signerAccount.toHuman();
  showLog("dalBlock.insert", blockHeight);
  let result = await dalBlock.insert(
    {
      hash,
      // signerAccount,
      parentHash: blockInfo.header.parentHash,
      blockHeight,
      txCount,
      eventCount,
      // stateRoot: blockInfo.header.stateRoot,
      // extrinsicsRoot: blockInfo.header.extrinsicsRoot,
      timestamp,
    },
    { blockHeight }
  );
  showLog("dalBlock.insert end", blockHeight);
  // console.log(result);
}
async function saveTx(blockHash, blockHeight, src, events) {
  //   let blockInfo = src.toHuman();
  blockInfo = src.block;
  let trnactions = [];
  let timestamp = 0;
  let txCount = 0;
  let eventCountAll = 0;
  let timestampTx = blockInfo.extrinsics.find(
    (t) => t.method.section == "timestamp" && t.method.method == "set"
  );
  if (timestampTx) {
    timestamp = parseInt(
      timestampTx.toHuman().method.args.now.split(",").join("")
    );
    timestamp = moment(timestamp).toDate();
    // console.log("timestamp:", timestamp);
  } else {
    showLog("timestampTx not found");
    return { timestamp, txCount, eventCount: eventCountAll };
  }
  showLog("saving blockInfo.extrinsics");

  let index = 0;
  for (enx of blockInfo.extrinsics) {
    try {
      if (typeof enx != "object" || !("toHuman" in enx)) {
        showLog("continue 1 of ", enx);
        continue;
      }
      // let json = enx.toHuman();
      let json = enx.toHuman();
      showLog(enx.toHuman());
      let hash = enx.hash.toHex();
      // console.log(json, hash);
      // if (json.method.method != "transferKeepAlive" || !json.isSigned) {
      //   showLog("continue 1.1 of ", index);
      //   continue;
      // }
      let entity = {
        blockHeight,
        hash,
        isSigned: json.isSigned ? 1 : 0,
        method: json.method?.method,
        section: json.method?.section,
        // args: JSON.stringify(json.method.args),
        timestamp,
      };
      let result = "";
      let txIds = [];
      if (json.isSigned) {
        // entity.era = json.era.ImmortalEra;
        // entity.nonce = enx.nonce.toNumber();
        // entity.signature = enx.signature.toHex();
        entity.signer = json.signer.Id;
        await accountSave(api, entity.signer);
        // entity.tip = enx.tip.toNumber();
        if (
          entity.method == "transferKeepAlive" &&
          entity.section == "balances"
        ) {
          entity.destAccount = json.method.args.dest.Id;
          await accountSave(api, entity.destAccount);
          entity.amount = json.method.args.value;
        } else if (entity.method == "batchAll") {
          let arr = json.method.args.calls;
          for (i in arr) {
            let a = arr[i];
            entity.method = a.method;
            entity.section = a.section;
            entity.destAccount = a.args.dest.Id;
            await accountSave(api, entity.destAccount);
            entity.amount = a.args.value;
            if (i > 0) {
              entity.hash = hash + "-" + i;
            }
            if (
              typeof entity.amount == "string" &&
              entity.amount.indexOf(",") != -1
            ) {
              entity.amount = entity.amount.split(",").join("");
            }
            // showLog("dalTransaction.insert1 ", entity);
            result = await dalTransaction.insert(entity);
            txIds.push(result.id || result.lastID);
          }
        }
      }
      if (!entity.method || !entity.section) {
        showLog("!entity.method || !entity.section", entity);
        continue;
      }
      if (!result) {
        // showLog("dalTransaction.insert ", index, entity);
        result = await dalTransaction.insert(entity);
        txIds.push(result.id || result.lastID);
        if (!result.id) {
          showLog(
            "*****************insert double**********************",
            entity
          );
        }
        // showLog("dalTransaction.insert end", index);
      }
      if (txIds.length == 0) {
        console.log("transaction save fail ", result);
        console.log("continue 3 of ", index);
        continue;
      }
      showLog("saveEvent start", index);
      let txId = txIds[0];
      if (!txId) {
        showLog("txId  is null,blockHeight=", blockHeight, result);
        continue;
      }
      let { status, eventCount } = await saveEvent(
        blockHeight,
        src,
        txId,
        index,
        events,
        timestamp
      );
      if (eventCount) {
        eventCountAll += eventCount;
      }
      // showLog("dalTransaction.update start", index);
      for (let tid of txIds) {
        txCount++;
        await dalTransaction.updateById(
          {
            status,
          },
          tid
        );
      }
      // showLog("dalTransaction.update end", index);
    } catch (e) {
      console.error(e);
      console.log("error enx", enx);
    }
    index++;
  }
  return { timestamp, txCount, eventCount: eventCountAll };
}
async function saveEvent(blockHeight, src, txId, txIndex, events, timestamp) {
  // events = events.toHuman();
  // console.log(JSON.stringify(events));
  let status = null,
    eventCount = 0;
  const filtered = events.filter(
    ({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(txIndex)
  );
  // console.log(JSON.stringify(filtered));
  if (filtered.length == 0) {
    return { status, eventCount };
  }
  for (o of filtered) {
    try {
      let data = o.event.data.toHuman();
      if (typeof data == "object" && (data.who || data.account)) {
        await accountSave(api, data.who || data.account);
      }
      let entity = {
        blockHeight,
        txId,
        method: o.event.method,
        section: o.event.section,
        data: JSON.stringify(data),
        index: 0,
        timestamp,
      };
      if (o.event.index) {
        entity.index = parseInt(o.event.index, 16);
      }
      // console.log("event entity", entity);
      if (entity.method == "ExtrinsicSuccess") {
        status = "success";
      }
      if (entity.method == "ExtrinsicFailed") {
        status = "failed";
      }
      await dalEvent.insert(entity);
      eventCount++;
    } catch (e) {
      console.log(e);
    }
  }
  return { status, eventCount };
}
async function main() {
  common.useTime("init polkdot chain rpc", 1);
  api = await init();
  common.useTime("init polkdot chain rpc");
  console.log("starting sync block info...");
  const platform = os.platform();
  console.log("os platform", platform);

  let maxHeight = 100;
  let currHeight = 1;
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
    currHeight = await startDo(currHeight, maxHeight);
    if (currHeight >= maxHeight) {
      await util.sleep(2000);
    }
  }
  console.log("complete!");
  process.exit();
}
async function startDo(start, end) {
  let index = 0;
  for (let i = start; i < end; i++) {
    try {
      await getBlock(i);
    } catch (e) {
      api = await init();
      break;
      console.error(e);
    }
    index = i;
  }
  return index;
}

function showLog(...msg) {
  // console.log(...msg);
  // sendLog("ok", msg.join(" "));
}
function sendLog(msg, data) {
  wsHelper.send("log", "append", data);
}

global.showLog = showLog;
global.sendLog = sendLog;
// main();
module.exports = main;
