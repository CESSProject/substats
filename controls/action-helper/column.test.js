const column = require("./column");

test("test the get column function", async () => {
  let dal = {
    columns: ["test"],
  };
  let res = {
    json: (result) => {
      expect(result.data[0]).toBe("test");
    },
  };
  await column({ msg: "" }, dal, {}, res);
});
