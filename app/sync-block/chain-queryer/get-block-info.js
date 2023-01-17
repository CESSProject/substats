const common = require("../../../util/common");

//get block info from chain
async function getBlock(value) {
  let hash = "";
  if (typeof value != "number") {
    hash = value;
  } else {
    // console.log("getBlockHash", value);
    common.useTime("getBlockHash", 1);//log run time
    let result = await api.rpc.chain.getBlockHash(value);//if value is block height ,query the block hash
    common.useTime("getBlockHash");
    showLog("getBlockHash success", value);
    hash = result.toHex();
  }
  showLog("getBlock", hash);
  common.useTime("getBlock", 1);
  const blockInfo = await api.rpc.chain.getBlock(hash);
  console.log("blockInfo length", JSON.stringify(blockInfo).length);
  common.useTime("getBlock");
  return { blockInfo, hash };
}

module.exports = getBlock;
