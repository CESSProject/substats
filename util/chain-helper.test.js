const { getBlockInfo } = require("./chain-helper");
const init = require("../bll/init-polkadot-api");

test("get block info from block chain", async () => {
  const { api } = await init();
  await api.isReady;
  let blockInfo = await getBlockInfo(api, 93923);
  expect(blockInfo.blockHeight).toEqual(93923);
});
