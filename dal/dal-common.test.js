const dalCommon = require("./dal-common");

test("test the database orm function", async () => {
  let dal = dalCommon("tb_block_info");
  let columns = await dal.findColumnName();
  expect(columns.length > 0).toBe(true);
});
