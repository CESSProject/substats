/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-13 16:57:22
 */
"use strict";
const path = require("path");
module.exports = {
  sitename: "CESS Brower",
  wsnode: {
    // nodeURL: "wss://rpc.dotters.network/polkadot",
    nodeURL: "wss://1rpc.io/dot",    
    // nodeURL: "wss://devnet-rpc.cess.cloud/ws/",
    keyringOption: { type: "sr25519", ss58Format: 42 },
  },
  host: "substats.cess.cloud",
  port: {
    http: 8080,
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
