/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 cbf0311@sina.com
 * @LastEditTime: 2022-12-06 09:32:50
 */
"use strict";
const path = require("path");
module.exports = {
  sitename: "CESS Brower",
  wsnode: {
    nodeURL: "wss://polkadot.api.onfinality.io/public-ws", //"ws://localhost:9944"
    // nodeURL: "wss://devnet-rpc.cess.cloud/ws/",
    keyringOption: { type: "sr25519", ss58Format: 42 },
  },
  host: "substats.cess.cloud",
  port: {
    http: 80,
  },
  publicApi: {
    secret: "MA14BAHJ2JEASL",
  },
  serverIP: "140.143.93.47",
  cookie: {
    enable: false,
    secret: "3**&2fMNU",
    expires_day: 2,
  },
};
