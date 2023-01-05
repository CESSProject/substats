const index = require("./index");

test("test batch update function", () => {
  let router = index;
  expect(router.stack[1].keys[0].name).toBe("n1");
});
