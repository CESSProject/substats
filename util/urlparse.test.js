const urlparse = require("./urlparse");

test("test urlparse function", async () => {
  let result = urlparse("/a/b?d=1&e=2");
  expect(result).toEqual({"d": "1", "e": "2"});
});

