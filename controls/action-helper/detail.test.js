const detail = require("./detail");

test("test the detail function", async () => {
  let dal = {
    findById: (id) => {
      return [
        {
          id,
        },
      ];
    },
  };
  let req = {
    body: {
      id: 1,
    },
  };
  let res = {
    json: (result) => {
      expect(result.data.id).toBe(1);
    },
  };
  await detail({}, dal, req, res);
});
