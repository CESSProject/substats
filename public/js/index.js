let ws = null;
var vm = new Vue({
  el: "#app",
  data: {
    loading: false,
    blockHeight: 0,
    rpcConnectStatus: "loading",
    systemStatus: [
      {
        title: "System startup",
        status: "waiting",
        about: "Check the system status",
      },
      {
        title: "Listening port",
        status: "waiting",
        about: "Get listening port number",
      },
      {
        title: "Connect to mysql",
        status: "waiting",
        about: "Check the connect to mysql database status",
      },
      {
        title: "Tables",
        status: "waiting",
        about: "Get table list",
      },
    ],
    shellTxt: [],
  },
  mounted() {
    const that = this;
    window.onload = function () {
      ws = new WS(
        function (json) {
          if (json.way == "block" && json.action == "new") {
            that.showMsgInBlackborad("new block：", json.data.blockHeight);
            that.blockHeight = json.data.blockHeight;
            that.rpcConnectStatus = "ok";
          } else if (json.way == "log") {
            that.showMsgInBlackborad("synchronization block：", json.data);
          } else if (json.way == "rpc") {
            that.showMsgInBlackborad("chain rpc connect：", json.data);
            that.rpcConnectStatus = json.data;
          }
        },
        function () {
          that.got();
        }
      );
    };
  },
  methods: {
    showMsgInBlackborad(k, v) {
      this.shellTxt.push({ k, v });
      if (this.shellTxt.length > 50) {
        this.shellTxt.shift();
      }
      setTimeout(() => {
        var div = document.getElementById("blackborad");
        div.scrollTop = div.scrollHeight;
      }, 10);
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status == "ok") {
        return "success-row";
      } else if (row.status == "loading") {
        return "loading-row";
      } else if (row.status == "waiting") {
        return "info-row";
      } else {
        return "warning-row";
      }
    },
    async got() {
      let that = this;
      if (this.loading) return;
      this.loading = true;
      this.systemStatus.forEach((t) => (t.status = "waiting"));
      for (item of this.systemStatus) {
        item.status = "loading";
        let tmp = await ws.send(item.title, item.about, item);
        console.log("replace", tmp);
        item.status = tmp.msg;
        if (tmp.data) {
          item.about = tmp.data;
        }
      }
      that.loading = false;
    },
  },
});
