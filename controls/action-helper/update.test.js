const update = require("./update");

test("test the update function", async () => {
  let dal = {
    columns: [
      {
        column_name: "test",
      },
    ],
    update: async (entity) => {
      return entity;
    },
  };
  let req = {
    body: {
      id: 1,
      test: 1,
    },
  };
  let res = {
    json: (result) => {
      expect(result.data.test).toBe(1);
    },
  };
  await update({}, dal, req, res);
});
