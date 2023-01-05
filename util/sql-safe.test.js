const safe = require("./sql-safe");

test("check sql string safe", async () => {
  let result = safe.checkSafe("fdsafldsafjdslafdsa");
  expect(result).toEqual(true);
});
