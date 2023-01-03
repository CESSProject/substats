const loader = require("./mysql-config-loader");
const path = require("path");

test("get mysql connect config from a file", () => {
  let result = loader(path.join(__dirname, "../demo/mysql-config.json"));
  expect(result != null).toBe(true);
});
