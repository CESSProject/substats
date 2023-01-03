const wsHelper = require("./ws-helper");

test("test ws helper send message function.", () => {
  global.wsClientList = [
    {
      send: function (msg) {
        let json = JSON.parse(msg);
        expect(json.way).toBe("testway");
      },
    },
  ];
  wsHelper.send("testway", "testaction", new Date());
});
