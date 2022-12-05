class WS {
  socket = null;
  timeout = null;
  connectStatus = null;
  isConnecting = false;
  onNewMessage = null;
  onConnectOk = null;
  reqList = [];

  constructor(onNewMessage, onConnectOk) {
    if (!onNewMessage) {
      onNewMessage = console.log;
    }
    if (!onConnectOk) {
      onConnectOk = () => {
        console.log("socket is open");
      };
    }
    this.onNewMessage = onNewMessage;
    this.onConnectOk = onConnectOk;
    this.connect();
  }
  async send(way, action, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const that = this;
        if (!that.socket || that.connectStatus != "ok") {
          await this.connect();
        }
        const id = new Date().valueOf();
        const json = {
          way,
          action,
          id,
          data,
        };
        that.reqList.push({
          id,
          cb: resolve,
        });
        that.socket.send(JSON.stringify(json));
      } catch (e) {
        reject(e);
      }
    });
  }
  reconnect() {
    const that = this;
    that.connectStatus = "retrying";
    console.log("trying reconnect socket");
    that.socket = null;
    that.connect();
  }
  connect() {
    const that = this;
    if (that.isConnecting) {
      return console.log("connecting");
    }
    let sockurl = "ws://" + window.location.host + "/ws/";
    console.log("connecting wsAPI:", sockurl);
    that.isConnecting = true;
    const socketS = new WebSocket(sockurl);
    socketS.addEventListener("open", function open() {
      that.isConnecting = false;
      that.socket = socketS;
      clearInterval(that.timeout);
      that.connectStatus = "ok";
      that.onConnectOk();
      that.send("public", "hello", { msg: "ok" });
    });
    socketS.addEventListener("close", function open() {
      that.isConnecting = false;
      console.log("socket is close,retry connect after 3s.");
      that.socket = null;
      that.connectStatus = "close";
      that.timeout = setTimeout(() => {
        that.reconnect();
      }, 3000);
    });
    socketS.addEventListener("error", (e) => {
      console.log("socket error");
    });
    socketS.addEventListener("message", function open(data) {
      console.log("has new message：" + event.data);
      const res = JSON.parse(event.data);
      if (res.id) {
        //应答消息
        let id = parseInt(res.id);
        const index = that.reqList.findIndex((t) => t.id == id);
        const req = that.reqList[index];
        if (index > -1 && req && req.cb) {
          that.reqList.splice(index, 1);
          return req.cb(res);
        }
      }
      //主动型消息
      if (that.onNewMessage) {
        that.onNewMessage(res);
      }
    });
  }
}
