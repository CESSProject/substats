const format = require("./format");

test("format entries", async () => {
  let hash = format.entries([]);
  expect(Array.isArray(hash)).toEqual(true);
});
