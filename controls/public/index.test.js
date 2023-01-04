const index = require("./index");

test("test public api function", async () => {
  let req = {
    body: {
      way: "dbcommon",
      action: "list",
      tableName: "block_info",
    },
    query:{

    }
  };
  let res = {
    json: (ret) => {
      expect(ret.msg).toBe("ok");
    },
  };
  await index(req, res,function(){});
});
