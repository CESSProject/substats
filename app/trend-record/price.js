const Dal = require("../../dal/dal-common");
const util = require("../../util/common");
const moment = require("moment");

const save = require("./dal");

async function main() {
  let dateStr = moment().format("YYYY-MM-DD");
  let count = await query();
  let tmp = await save(2, dateStr, count);
  console.log(tmp);
}

async function query() {
  return util.random(5, 8);
}

module.exports = main;
