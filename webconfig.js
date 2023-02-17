/*
 * @Description:The system config file
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-16 17:05:07
 */
"use strict";
const path = require("path");
module.exports = {
  sitename: "CESS Brower",
  wsnode: {
    nodeURL:  "wss://1rpc.io/dot", // config the block chain node rpc websocket url
    // nodeURL: "wss://rpc.dotters.network/polkadot",
    // nodeURL: "wss://polkadot-rpc.dwellir.com",
    // nodeURL: "wss://polkadot-rpc-tn.dwellir.com", 
    // nodeURL: "wss://polkadot.api.onfinality.io/public-ws", 
    keyringOption: { type: "sr25519", ss58Format: 42 },
  },
  host: "substats.cess.cloud",//system bind domain
  port: {
    http: 8080,//system run port
  },
  tokenPriceAPI:'http://175.41.161.67:3008/api/v3/ticker?symbol=DOTUSDT',
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
