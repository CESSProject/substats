const del = require("./del");

test("test the del function", async () => {
  let dal = {
    columns: [
      {
        column_name: "test",
      },
    ],
    removeById: (entity) => {
      return [];
    },
  };
  let req = {
    body: {
      id: 1,
    },
  };
  let res = {
    json: (result) => {
      expect(result.msg).toBe("ok");
    },
  };
  await del({ msg: "", nolog: true }, dal, req, res);
});
