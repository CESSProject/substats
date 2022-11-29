/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 15:39:39
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-02 11:28:26
 * @description: auto record everyday power to db
 * @author: chenbinfa
 */
const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api");
const {
  BN,
  BN_ONE,
  BN_THOUSAND,
  BN_TWO,
  bnToBn,
  extractTime,
} = require("@polkadot/util");
let api = null;
let webconfig = require("../../webconfig");
global.webconfig = webconfig;
let util = require("../../util/common");
const Dal = require("../../dal/dal-common");
const dal = new Dal("tb_storage_power_trend");
const _ = require("lodash");
const init = require("../init");
const moment = require("moment");

async function main() {
  api = await init();
  if (!api) {
    setTimeout(main, 10000);
    return console.log("ws node connection failed,retry after 10s");
  }
  const dateStr = moment().format("YYYY-MM-DD");
  console.log("dataStr", dateStr);
  let tmp = await dal.findWithQuery({ dateStr });
  if (tmp && tmp.length > 0) {
    setTimeout(main, 3600000);
    return console.log("today has add,run after 1h");
  }
  const d = await api.query.sminer.totalIdleSpace();
  const o = {
    power: d.toNumber(),
    dateStr,
  };
  tmp = await dal.insert(o);
  console.log("complete ", tmp);
  setTimeout(main, 3600000);
}
main();
