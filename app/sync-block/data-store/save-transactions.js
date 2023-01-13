
let util = require("../../../util/common");
const Dal = require("../../../dal/dal-common");
const dalBlock = Dal("tb_block_info");
const dalTransaction = Dal("tb_block_transaction");
const dalEvent = Dal("tb_block_event");
let wsHelper = require("../../../bll/ws-helper");

const moment = require("moment");
var os = require("os");
const common = require("../../../util/common");

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
              showLog("dalTransaction.insert1 ", entity);
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
          showLog("dalTransaction.insert ", index, entity);
          result = await dalTransaction.insert(entity);
          txIds.push(result.id || result.lastID);
          if (!result.id) {
            showLog(
              "*****************insert double**********************",
              entity
            );
          }
          showLog("dalTransaction.insert end", index);
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
        showLog("dalTransaction.update start", index);
        for (let tid of txIds) {
          txCount++;
          await dalTransaction.updateById(
            {
              status,
            },
            tid
          );
        }
        showLog("dalTransaction.update end", index);
      } catch (e) {
        console.error(e);
        console.log("error enx", enx);
      }
      index++;
    }
    return { timestamp, txCount, eventCount: eventCountAll };
  }
module.exports = saveTx;
