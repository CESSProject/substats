const webconfig = require("./webconfig");

test("test batch update function", () => {
  expect(
    webconfig.wsnode.nodeURL != null && webconfig.publicApi.secret != null
  ).toBe(true);
});
