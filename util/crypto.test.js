const crypto = require("./crypto");

test("get md5 hash from a text", async () => {
  let hash = crypto.md5("fdsafldsafjdslafdsa");
  expect(hash).toEqual("15f48590d8d96f12c6e4c34cef535f64");
});

test("aes crypto", async () => {
  let hash = crypto.aes("fdsafldsafjdslafdsa");
  expect(hash).toEqual(
    "97a66a35d1c5d1d5ea132edff7fb35a788486ce7eb1562670e027629ca2c7f59"
  );
});

test("deaes crypto", async () => {
  let hash = crypto.deaes(
    "97a66a35d1c5d1d5ea132edff7fb35a788486ce7eb1562670e027629ca2c7f59"
  );
  expect(hash).toEqual("fdsafldsafjdslafdsa");
});
