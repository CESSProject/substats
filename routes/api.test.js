const api = require("./api");

test("test batch update function", () => {
  let router = api;
  expect(router.stack[0].keys[0].name).toBe("way");
});
