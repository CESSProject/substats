const main = require("./common");

test("query the block list", async () => {
  const req = {
    body: {
      tableName: "block_info",
      action: "list",
      pageindex: 1,
      pagesize: 1,
    },
  };
  const res = {
    json: (d) => {
      // console.log(d);
      expect(d.msg == "ok" && d.data.length > 0).toBe(true);
    },
  };
  await main(req, res);
});

test("query the transaction list", async () => {
  const req = {
    body: {
      tableName: "block_transaction",
      action: "list",
      pageindex: 1,
      pagesize: 1,
    },
  };
  const res = {
    json: (d) => {
      // console.log(d);
      expect(d.msg == "ok" && d.data.length > 0).toBe(true);
    },
  };
  await main(req, res);
});
test("query the miner list", async () => {
  const req = {
    body: {
      tableName: "miner",
      action: "list",
      pageindex: 1,
      pagesize: 1,
    },
  };
  const res = {
    json: (d) => {
      // console.log(d);
      expect(d.msg == "ok" && d.data.length > 0).toBe(true);
    },
  };
  await main(req, res);
});
test("query the miner_summary list", async () => {
  const req = {
    body: {
      tableName: "miner_summary",
      action: "list",
      pageindex: 1,
      pagesize: 1,
    },
  };
  const res = {
    json: (d) => {
      // console.log(d);
      expect(d.msg == "ok" && d.data.length > 0).toBe(true);
    },
  };
  await main(req, res);
});
