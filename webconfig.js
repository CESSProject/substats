/*
 * @Description:The system config file
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-02 16:59:08
 */
"use strict";
const path = require("path");
module.exports = {
  sitename: "CESS Brower",
  wsnode: {
    nodeURL: "wss://rpc.dotters.network/polkadot", // config the block chain node rpc websocket url
    // nodeURL: "wss://rococo-contracts-rpc.polkadot.io",//rococo network rpc 
    // nodeURL: "wss://1rpc.io/ksm",    //kusama network rpc
    // nodeURL: "wss://1rpc.io/dot",    //polkadot network rpc
    keyringOption: { type: "sr25519", ss58Format: 42 },
  },
  host: "substats.cess.cloud",//system bind domain
  port: {
    http: 8080,//system run port
  },
  publicApi: {
    secret: "MA14BAHJ2JEASL",
  },
  serverIP: "140.143.93.47",//websever bind ip
  cookie: {// cookie config
    enable: false,
    secret: "3**&2fMNU",
    expires_day: 2,
  },
};
