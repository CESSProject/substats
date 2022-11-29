const main = require("./init-polkadot-api");

test("rpc connect and get block header", async () => {
  const { api, keyring } = await main();
  await api.isReady;
  const lastHdr = await api.rpc.chain.getHeader();
  console.log("block height", lastHdr.number.toNumber());
  expect(lastHdr.number > 0).toBe(true);
});
