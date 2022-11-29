const main = require("./index");
const init = require("../../bll/init-polkadot-api");

test("get chain now timestamp", async () => {
  const req = {
    body: {
      ac1: "timestamp",
      ac2: "now",
    },
  };
  const res = {
    json: (d) => {
      console.log(d);
      expect(d.msg == "ok" && d.data > 0).toBe(true);
    },
  };
  const { api, keyring } = await init();
  await api.isReady;
  await main(req, res);
});
