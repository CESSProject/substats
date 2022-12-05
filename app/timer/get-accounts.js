/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 15:39:39
 * @LastEditors: lanmeng656 cbf0311@sina.com
 * @LastEditTime: 2022-12-05 09:14:01
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
const webconfig = require("../../webconfig");
global.webconfig = webconfig;
const util = require("../../util/common");
const Dal = require("../../dal/dal-common");
const dal = new Dal("tb_block_account");
const _ = require("lodash");
const init = require("../init");
const moment = require("moment");
const format = require("../../util/format");

async function main() {
  console.log("start...");
  api = await init();
  console.log("init ok");
  if (!api) {
    setTimeout(main, 10000);
    return console.log("ws node connection failed,retry after 10s");
  }
  let result = await api.query.system.account.entries();
  console.log("result", result);
  let accounts = format.entries(result);
  console.log("accounts", accounts);
  result = await api.query.sminer.minerItems.entries();
  let miners = format.entries(result);
  for (entity of accounts) {
    let amount = parseInt(entity.data.free, 16);
    let txCount = await getTxCount(entity.key);
    const o = {
      accountId: entity.key,
      amount,
      txCount,
      isMiner: 0,
    };
    await save(o);
  }
  for (entity of miners) {
    let amount = await getBalances(entity.key);
    let txCount = await getTxCount(entity.key);
    const o = {
      accountId: entity.key,
      amount,
      txCount,
      isMiner: 1,
    };
    await save(o);
    amount = await getBalances(entity.beneficiary);
    txCount = await getTxCount(entity.beneficiary);
    const o2 = {
      accountId: entity.beneficiary,
      amount,
      txCount,
      isMiner: 1,
    };
    await save(o2);
  }
  console.log("complete!");
  setTimeout(main, 1000000);
}
async function save(o) {
  let tmp = await dal.findOne({
    accountId: o.accountId,
  });
  if (tmp.length > 0) {
    o.id = tmp[0].id;
    const id = o.id;
    tmp = await dal.update(o);
    console.log("update", id);
  } else {
    tmp = await dal.insert(o);
    console.log("add", tmp.id);
  }
}
async function getTxCount(id) {
  const sql = `SELECT id FROM tb_block_transaction WHERE (signer='${id}' or destAccount='${id}') AND amount>0`;
  let result = await dal.query(sql);
  return result.length;
}
async function getBalances(id) {
  api = await init();
  let result = await api.query.system.account(id);
  return parseInt(result.data.free.toJSON(), 16);
}
module.exports = main;
// main();
// getBalances("cXffK7BmstE5rXcK8pxKLufkffp9iASMntxUm6ctpR6xS3icV").then(
//   console.log,
//   console.log
// );
