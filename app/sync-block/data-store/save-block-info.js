let util = require("../../../util/common");
const Dal = require("../../../dal/dal-common");
const dalBlock = Dal("tb_block_info");
const dalTransaction = Dal("tb_block_transaction");
const dalEvent = Dal("tb_block_event");

const common = require("../../../util/common");

let blockHeightCache = [];

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
  if (blockHeightCache.includes(blockHeight)) {
    return;
  }
  blockHeightCache.push(blockHeight);
  if (blockHeightCache.length > 1000) {
    blockHeightCache.shift();
  }
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

module.exports = saveBlock;
