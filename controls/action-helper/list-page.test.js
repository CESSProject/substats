const list = require("./list-page");

test("test the list function", async () => {
  let dal = {
    findCount: (fromStr, whereStr) => {
      return 10;
    },
    findByPage:()=>{
        return [{
            id:1
        }];
    }
  };
  let req = {
    body: {
      id: 1,
    },
  };
  let res = {
    json: (result) => {
      expect(result.data[0].id).toBe(1);
    },
  };
  let fieldStr = "",
    fromStr = "";
  await list(fieldStr, fromStr, dal, req, res);
});
