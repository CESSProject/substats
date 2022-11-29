const init = require("./bll/init-polkadot-api");

async function main() {
  const { api, keyring } = await init();
  console.log("api");
  await api.isReady;
  console.log("isReady");
  const lastHdr = await api.rpc.chain.getHeader();
  return lastHdr.number.toNumber();
}
main().then(console.log, console.log);
