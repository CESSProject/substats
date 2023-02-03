const Dal = require("../../dal/dal-common");
const moment = require("moment");
const dalTransaction = Dal("tb_block_transaction");

const save = require("./dal");

async function main() {
  let sql =
    "select timestamp from tb_block_transaction ORDER BY blockHeight DESC LIMIT 1";
  let tmp = await dalTransaction.query(sql);
  if (!tmp || tmp.length == 0) {
    console.log("no items");
    return false;
  }
  // console.log(tmp);
  let dateTime = moment(tmp[0].timestamp);
  // console.log(dateTime);

  for (let i = 0; i < 7; i++) {
    let dateTime2 = dateTime.add(-1, "day");
    let dateStr = dateTime2.format("YYYY-MM-DD");
    let count = await query(dateStr);
    tmp = await save(1, dateStr, count);
    console.log(tmp);
  }
}
async function query(dateStr) {
  let start = dateStr + " 00:00:00";
  let end = dateStr + " 23:59:59";
  if (global.dbType == "sqlite3") {
    start = moment(start).valueOf();
    end = moment(end).valueOf();
  } else {
    start = "'" + start + "'";
    end = "'" + end + "'";
  }
  let sql =
    "select count(1) as c from tb_block_transaction where `timestamp`>=" +
    start +
    " and `timestamp`<=" +
    end;
  // console.log(sql);
  let tmp = await dalTransaction.query(sql);
  let count = parseInt(tmp[0].c);
  return count;
}

module.exports = main;
