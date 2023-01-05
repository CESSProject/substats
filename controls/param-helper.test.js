const paramHelper = require("./param-helper");

test("test param helper function", () => {
  let req = {
    body: {
      id: "1",
      action: "list",
      orderway: "9",
    },
    query: {
      id: "2",
    },
  };
  paramHelper(req);
  expect(
    req.body.id === 1 &&
      req.query.id === 2 &&
      req.body.pageindex === 1 &&
      req.body.pagesize === 20 &&
      req.body.orderway === 1
  ).toBe(true);
});
