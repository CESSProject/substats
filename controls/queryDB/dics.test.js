const main = require("./dics");

test("query the dics list", async () => {
  const res = {
    json: (d) => {
      // console.log(d);
      expect(d.msg == "ok" && d.data.length > 0).toBe(true);
    },
  };
  await main(null, res);
});
