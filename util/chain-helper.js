/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-08-05 14:06:57
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-04 14:26:16
 * @description: about
 * @author: chenbinfa
 */
const moment = require("moment");
const _ = require("lodash");

module.exports = {
  getBlockInfo,
};
async function getBlockInfo(api, blockHeight) {
  let hash = "",
    tmp = "";
  if (!_.isNumber(blockHeight)) {
    hash = blockHeight;
  } else {
    tmp = await api.rpc.chain.getBlockHash(blockHeight);
    hash = tmp.toHex();
  }
  const blockInfoSrc = await api.rpc.chain.getBlock(hash);
  blockHeight = blockInfoSrc.block.header.number.toNumber();
  // tx
  const { timestamp, trnactions } = await getTx(blockHeight, blockInfoSrc);
  //block
  let blockInfo = blockInfoSrc.toHuman();
  blockInfo = blockInfo.block;
  let blockEntity = {
    hash,
    parentHash: blockInfo.header.parentHash,
    blockHeight,
    // stateRoot: blockInfo.header.stateRoot,
    // extrinsicsRoot: blockInfo.header.extrinsicsRoot,
    timestamp,
    trnactions,
  };
  return blockEntity;
}

async function getTx(blockHeight, src) {
  //   let blockInfo = src.toHuman();
  let blockInfo = src.block;
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
  }
  for (let index in blockInfo.extrinsics) {
    let enx = blockInfo.extrinsics[index];
    try {
      if (typeof enx != "object" || !("toHuman" in enx)) {
        continue;
      }
      let json = enx.toHuman();
      let hash = enx.hash.toHex();
      // console.log(json, hash);
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
          entity.amount = json.method.args.value.split(",").join("");
        }
      }
      if (
        (entity.section == "timestamp" && entity.method == "set") ||
        entity.method == "noteMinGasPriceTarget"
      ) {
        continue;
      }
      trnactions.push(entity);
    } catch (e) {
      console.error(e);
      console.log("error enx", enx);
    }
  }
  return {
    timestamp,
    trnactions,
  };
}
