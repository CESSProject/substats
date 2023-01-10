const Dal = require("../../dal/dal-common");
const dal = Dal("tb_block_account");
const init = require("../init");

const isDebug = true;
let api = null;

function log(...msg) {
  if (isDebug) {
    console.log(...msg);
  }
}
async function main(apis, accountId) {
  if(!accountId){
    return;
  }
  if (apis) {
    api = apis;
  } else {
    if (!api) {
      api = await init();
    }
  }
  log("start get account tx count...");
  let txCount = await getTxCount(accountId);
  log("tx count ", txCount);
  log("start get account balance...");
  let amount = await getBalances(accountId);
  log("account balance ", amount);
  const o = {
    accountId,
    amount,
    txCount,
  };
  await save(o);
  log("save account complete ", accountId);
}
async function save(o) {
  log("saving account ...", o.accountId);
  let tmp = await dal.findOne({
    accountId: o.accountId,
  });
  if (tmp.length > 0) {
    o.id = tmp[0].id;
    const id = o.id;
    delete o.id;
    tmp = await dal.updateById(o, id);
    log("update account", id);
  } else {
    tmp = await dal.insert(o);
    log("add account", tmp.id);
  }
}
async function getTxCount(id) {
  const sql = `select count(id) as c FROM tb_block_transaction WHERE (signer='${id}' or destAccount='${id}')`;
  let result = await dal.query(sql);
  // log(sql);
  // log(result);
  return result[0].c;
}
async function getBalances(id) {
  let result = await api.query.system.account(id);
  return parseInt(result.data.free.toJSON(), 16);
}
module.exports = main;
// main("", "14a82WrZYCAY1vWUd15xxqFnwwNpqgQ6hW3banxZp9KH2ppS");
// getBalances("cXffK7BmstE5rXcK8pxKLufkffp9iASMntxUm6ctpR6xS3icV").then(
//   log,
//   log
// );
// getTxCount('14a82WrZYCAY1vWUd15xxqFnwwNpqgQ6hW3banxZp9KH2ppS');
