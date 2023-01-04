const ws = require("./ws");

test("test batch update function", () => {
  global.wsClientList = [];
  let closeFun = null;
  let wsClient = {
    send: (str) => {
        let json=JSON.parse(str);
        expect(json.apiName).toBe('connectState');
    },
    on: (action, cb) => {
    },
  };
  ws(wsClient);
});
