const batchUpdate = require("./batch-update");

test("test batch update function", () => {
  let dal = {
    columns: [
      {
        column_name: "test",
      },
    ],
    tableName: "test",
    query: () => {
      return [];
    },
  };
  let req = {
    body: {
      test: "1",
      ids: "1,2",
    },
  };
  let res = {
    json: (data) => {
      expect(data.msg).toBe("ok");
    },
  };
  batchUpdate({ msg: "" }, dal, req, res);
});
