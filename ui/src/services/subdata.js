/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 11:21:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-15 17:53:17
 * @description: about
 * @author: chenbinfa
 */
import request from "@utils/request";
const wsAPI = process.env.REACT_APP_BASE_WS + "";
let socket = null;
let timeout = null;
const events = [];

export default {
  addEvent,
  removeEvent,
};
function getWsAPI() {
  if (wsAPI.indexOf("ws:") != -1) {
    return wsAPI;
  }
  let wsProtocol = "wss:";
  if (window.location.protocol == "http:") {
    wsProtocol = "ws:";
  }
  let host = window.location.host;
  return wsProtocol + host + wsAPI;
}
function connect() {
  if (!socket) {
    socket = new WebSocket(getWsAPI());
    socket.addEventListener("open", function (event) {
      console.log("socket is open");
      clearInterval(timeout);
    });
    socket.addEventListener("close", function (event) {
      console.log("socket is close");
      return connectHttp();
      socket = null;
      timeout = setTimeout(function () {
        try {
          console.log("try connect socket");
          connect();
        } catch (e) {
          console.log(e);
        }
      }, 2000);
    });
    socket.addEventListener("message", function (event) {
      // console.log("Message from server", event.data);
      let json = JSON.parse(event.data);
      // if(!json.msg){
      // 	return;
      // }
      // if (json.msg != "ok") {
      // 	return console.error("json.msg", json.msg);
      // }
      const elist = events.filter(
        (t) => t.name == json.way + "-" + json.action && t.e
      );
      if (elist.length == 0) {
        // console.log("event not sub ", json.apiName);
        return;
      }
      for (let o of elist) {
        try {
          o.e(json.data);
        } catch (e) {
          console.log(e);
        }
      }
    });
  }
}

function addEvent(e) {
  let i = events.findIndex((t) => t.id == e.id);
  if (i > -1) {
    events.splice(i, 1);
  }
  events.push(e);
  connect();
  // if (window.location.protocol == "http:") {
  //   connect();
  // } else {
  //   connectHttp();
  // }
}
function removeEvent(id) {
  const i = events.findIndex((t) => t.id == id);
  if (i > -1) {
    events.splice(i, 1);
    console.log("remove event complect ", id, " events.length", events.length);
  }
}

function connectHttp() {
  setInterval(getBlockHeight, 1000);
}
let blockHeight = 0;
async function getBlockHeight() {
  let data = {
    ac1: "system",
    ac2: "number",
  };
  let result = await request.post("/api/storage/query", { data });
  if (result.msg == "ok") {
    if (blockHeight == result.data) {
      return;
    }
    blockHeight = result.data;
    const elist = events.filter((t) => t.name == "block-new" && t.e);
    if (elist.length == 0) {
      return;
    }
    for (let o of elist) {
      try {
        o.e({ blockHeight });
      } catch (e) {
        console.log(e);
      }
    }
  }
}
