const Dal = require("../../../dal/dal-common");
const dal = Dal("tb_block_account");
const init = require("../../init");
const save = require("../data-store/save-accounts");

const isDebug = true;

function log(...msg) {
  if (isDebug) {
    console.log(...msg);
  }
}
async function main(accountId) {
  if(!accountId){
    return;
  }
  log("start get account tx count...");
  let txCount = await getTxCount(accountId);
  log("tx count ", txCount);
  log("start get account balance...",accountId);
  let amount =0;
  try{
    amount = await getBalances(accountId);
  }catch(e){
    console.error(e);
  }  
  log("account balance ", amount);
  const o = {
    accountId,
    amount,
    txCount,
  };
  await save(o);
  log("save account complete ", accountId);
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
