/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 15:39:39
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-09-06 16:12:55
 * @description: about
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
  formatNumber,
  isFunction,
} = require("@polkadot/util");
let api = null;
const _ = require("lodash");
let webconfig = require("../../webconfig");
global.webconfig = webconfig;
const Dal = require("../../dal/dal-common");
const dal = new Dal("tb_miner");
const dalSum = new Dal("tb_miner_summary");
const init = require("../init");

async function getMiner() {
  console.log("start");
  let retsult = await api.query.sminer.minerItems.entries();
  console.log("get miner", retsult.length);
  let totalPower = 0;
  retsult = retsult.map(([key, entry]) => {
    let id = _.get(
      key.args.map((k) => k.toHuman()),
      `0`
    );
    let human = entry.toHuman();
    let json = entry.toJSON();

    let obj = {
      collateralAccount: id,
      beneficiaryAccount: json.beneficiary,
      collaterals: toNumber(json.collaterals.toString()),
      state: human.state,
      power: json.power,
      space: _.toNumber(json.space),
      totalReward: toNumber(json.rewardInfo.totalReward),
      totalRewardsCurrentlyAvailable: toNumber(
        json.rewardInfo.totalRewardsCurrentlyAvailable
      ),
      totalNotReceive: toNumber(json.rewardInfo.totalNotReceive),
      timerStatus: 2,
    };
    totalPower += obj.power;
    return obj;
  });
  if (retsult.length > 0) {
    let sql = "update tb_miner set timerStatus=1";
    await dal.query(sql);
    sql = "update tb_miner_summary set timerStatus=1";
    await dalSum.query(sql);
  }
  let i = 0;
  let summaryList = [];
  for (let entity of retsult) {
    i++;
    let summary = summaryList.find(
      (t) => t.beneficiaryAccount == entity.beneficiaryAccount
    );
    if (summary) {
      summary.collaterals += entity.collaterals;
      summary.power += entity.power;
      summary.space += entity.space;
      summary.totalReward += entity.totalReward;
      summary.totalRewardsCurrentlyAvailable +=
        entity.totalRewardsCurrentlyAvailable;
      summary.totalNotReceive += entity.totalNotReceive;
      summary.collateralAccounts.push(entity.collateralAccount);
    } else {
      let o = _.cloneDeep(entity);
      o.collateralAccounts = [entity.collateralAccount];
      delete o.collateralAccount;
      summaryList.push(o);
    }
    entity.powerPer = _.round((entity.power * 100) / totalPower, 1);
    if (isNaN(entity.powerPer)) {
      entity.powerPer = 0;
    }
    let tmp = await dal.findWithQuery({
      collateralAccount: entity.collateralAccount,
    });
    if (tmp.length > 0) {
      entity.id = tmp[0].id;
      tmp = await dal.update(entity);
      console.log("update", i, "/", retsult.length);
    } else {
      tmp = await dal.insert(entity);
      console.log("add", i, "/", retsult.length);
    }
  }
  i = 0;
  for (let entity of summaryList) {
    i++;
    entity.collateralAccountCount = entity.collateralAccounts.length;
    entity.collateralAccounts = entity.collateralAccounts.join(",");
    entity.powerPer = _.round((entity.power * 100) / totalPower, 1);
    if (isNaN(entity.powerPer)) {
      entity.powerPer = 0;
    }
    let tmp = await dalSum.findWithQuery({
      beneficiaryAccount: entity.beneficiaryAccount,
    });
    if (tmp.length > 0) {
      entity.id = tmp[0].id;
      tmp = await dalSum.update(entity);
      console.log("update sum", i, "/", retsult.length);
    } else {
      tmp = await dalSum.insert(entity);
      console.log("add sum", i, "/", retsult.length);
    }
  }
  if (retsult.length > 0) {
    let sql = "delete from tb_miner where timerStatus=1";
    let tmp = await dal.query(sql);
    // console.log("delete from tb_miner", tmp);
    sql = "delete from tb_miner_summary where timerStatus=1";
    tmp = await dalSum.query(sql);
    // console.log("delete from tb_miner_summary", tmp);
  }
  console.log("complete");
  setTimeout(getMiner, 3000000);
}
async function main() {
  api = await init();
  await getMiner();
}
function toNumber(v) {
  if (typeof v != "number") {
    v = parseInt(v, 16);
  }
  if (isNaN(v)) {
    v = 0;
  }
  return v;
}
main();
