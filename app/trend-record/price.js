const http = require("../../util/http-helper.js");
const moment = require("moment");
const webconfig = require("../../webconfig.js");

const save = require("./dal");

async function main() {
  let dateStr = moment().format("YYYY-MM-DD");
  let count = await query();
  let tmp = await save(2, dateStr, count);
  console.log(tmp);
}

async function query() {
  try {
    let json = await http.get(webconfig.tokenPriceAPI);
    return json.lastPrice;
  } catch (e) {
    console.log(e);
  }
}

module.exports = main;
