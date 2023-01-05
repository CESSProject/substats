const mylog = require("./mylog");

test("show log for time format", async () => {
  let hash = mylog("this is a log");
  expect(hash).toEqual(undefined);
});