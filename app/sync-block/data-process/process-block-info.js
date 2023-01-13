
const Dal = require("../../../dal/dal-common");
const dalBlock = Dal("tb_block_info");


async function main(blockInfo) {
  const blockHeight = blockInfo.block.header.number.toNumber();
  let exists = false;
  showLog("dalBlock.findWithQuery,blockHeight:", blockHeight);
  sendLog("log", "saving block " + blockHeight);
  const tmp = await dalBlock.findWithQuery({ blockHeight });
  if (tmp.length > 0) {
    exists = true;
    console.log("Item is exists");
  }
  return { blockHeight, exists };
}
module.exports = main;
