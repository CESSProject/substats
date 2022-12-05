/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 15:39:39
 * @LastEditors: lanmeng656 cbf0311@sina.com
 * @LastEditTime: 2022-12-05 17:59:20
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
let webconfig = require("../../webconfig");
global.webconfig = webconfig;
let util = require("../../util/common");
const Dal = require("../../dal/dal-common");
const dalBlock = new Dal("tb_block_info");
const dalTransaction = new Dal("tb_block_transaction");
const dalEvent = new Dal("tb_block_event");
const init = require("../init");
const moment = require("moment");
var os = require("os");

const saveTxMethods = ["faucet", "transferKeepAlive"];

async function getBlock(value) {
  let hash = "";
  if (typeof value != "number") {
    hash = value;
  } else {
    // console.log("getBlockHash", value);
    let result = await api.rpc.chain.getBlockHash(value);
    showLog("getBlockHash success", value);
    hash = result.toHex();
  }
  showLog("getBlock", hash);
  const blockInfo = await api.rpc.chain.getBlock(hash);
  const blockHeight = blockInfo.block.header.number.toNumber();
  showLog("dalBlock.findWithQuery,blockHeight:", blockHeight);
  sendLog("ok", "saving block " + blockHeight);
  const tmp = await dalBlock.findWithQuery({ blockHeight });
  if (tmp.length > 0) {
    return console.log("Item is exists");
  }
  showLog("api.query.system.events.at", hash);
  const events = await api.query.system.events.at(hash);
  showLog("saveTx", blockHeight);
  const timestamp = await saveTx(hash, blockHeight, blockInfo, events);
  showLog("saveBlock", timestamp);
  await saveBlock(hash, blockHeight, blockInfo, timestamp);
  console.log("block sync sccuess", blockHeight);
  sendLog("ok", "save block sccuess " + blockHeight);
}
async function saveBlock(hash, blockHeight, src, timestamp) {
  let blockInfo = src.toHuman();
  blockInfo = blockInfo.block;
  // console.log("blockInfo", blockInfo);
  // let signerAccount = src.header.author || src.header.authorFromMapping;
  // signerAccount = signerAccount.toHuman();
  showLog("dalBlock.insert", blockHeight);
  let result = await dalBlock.insert({
    hash,
    // signerAccount,
    parentHash: blockInfo.header.parentHash,
    blockHeight,
    // stateRoot: blockInfo.header.stateRoot,
    // extrinsicsRoot: blockInfo.header.extrinsicsRoot,
    timestamp,
  });
  showLog("dalBlock.insert end", blockHeight);
  // console.log(result);
}
async function saveTx(blockHash, blockHeight, src, events) {
  //   let blockInfo = src.toHuman();
  blockInfo = src.block;
  let trnactions = [];
  let timestamp = 0;
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
    return timestamp;
  }
  showLog("saving blockInfo.extrinsics");
  for (let index in blockInfo.extrinsics) {
    showLog("saving blockInfo.extrinsics of", index);
    let enx = blockInfo.extrinsics[index];
    try {
      if (typeof enx != "object" || !("toHuman" in enx)) {
        showLog("continue 1 of ", index);
        continue;
      }
      // let json = enx.toHuman();
      let json = enx.toJSON();
      let hash = enx.hash.toHex();
      // console.log(json, hash);
      // if (json.method.method != "transferKeepAlive" || !json.isSigned) {
      //   showLog("continue 1.1 of ", index);
      //   continue;
      // }
      if (
        json.method?.method &&
        saveTxMethods.indexOf(json.method.method) == -1
      ) {
        // console.log("跳过：", json.method.method);
        continue;
      }
      let entity = {
        blockHeight,
        hash,
        isSigned: json.isSigned ? 1 : 0,
        method: json.method.method,
        section: json.method.section,
        // args: JSON.stringify(json.method.args),
        timestamp,
      };
      if (json.isSigned) {
        // entity.era = json.era.ImmortalEra;
        // entity.nonce = enx.nonce.toNumber();
        // entity.signature = enx.signature.toHex();
        entity.signer = json.signer.Id;
        // entity.tip = enx.tip.toNumber();
        if (
          entity.method == "transferKeepAlive" &&
          entity.section == "balances"
        ) {
          entity.destAccount = json.method.args.dest.Id;
          entity.amount = json.method.args.value;
        }
      }
      if (
        (entity.section == "timestamp" && entity.method == "set") ||
        entity.method == "noteMinGasPriceTarget"
      ) {
        showLog("continue 2 of ", index);
        continue;
      }
      showLog("dalTransaction.insert ", index);
      let result = await dalTransaction.insert(entity);
      showLog("dalTransaction.insert end", index);
      let txId = result.id;
      if (txId == 0) {
        console.log("transaction save fail ", result);
        console.log("continue 3 of ", index);
        continue;
      }
      showLog("saveEvent start", index);
      let status = await saveEvent(
        blockHeight,
        src,
        txId,
        index,
        events,
        timestamp
      );
      showLog("dalTransaction.update start", index);
      await dalTransaction.update({
        id: txId,
        status,
      });
      showLog("dalTransaction.update end", index);
    } catch (e) {
      console.error(e);
      console.log("error enx", enx);
    }
  }
  return timestamp;
}
async function saveEvent(blockHeight, src, txId, txIndex, events, timestamp) {
  // events = events.toHuman();
  // console.log(JSON.stringify(events));
  let status = null;
  const filtered = events.filter(
    ({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(txIndex)
  );
  // console.log(JSON.stringify(filtered));
  if (filtered.length == 0) {
    return status;
  }
  for (o of filtered) {
    try {
      let entity = {
        blockHeight,
        txId,
        method: o.event.method,
        section: o.event.section,
        data: JSON.stringify(o.event.data.toHuman()),
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
    } catch (e) {
      console.log(e);
    }
  }
  return status;
}
async function main() {
  api = await init();
  console.log("starting...");
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
  // currHeight = 12460103;
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
  const clientList = global.wsClientList;
  if (!clientList || clientList.length == 0) return;
  let apiName = "sync block";
  let json = JSON.stringify({ apiName, msg, data });
  clientList.forEach((c) => {
    try {
      c.send(json);
    } catch (e) {
      console.log(e);
    }
  });
}
// main();
module.exports = main;
