const main = require("./init");

test("the dic is a list", async () => {
  const list = await main();
  // console.log(list);
  expect(list && list.length > 0 && list[0].id > 0).toBe(true);
});
