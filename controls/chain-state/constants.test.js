const main = require("./constants");
const init = require("../../bll/init-polkadot-api");

test("get chain now timestamp", async () => {
  const req = {
    body: {
      ac1: "system",
      ac2: "blockWeights",
    },
  };
  const res = {
    json: (d) => {
      console.log(d);
      expect(d.msg).toBe("ok");
    },
  };
  const { api, keyring } = await init();
  await api.isReady;
  await main(req, res);
});
