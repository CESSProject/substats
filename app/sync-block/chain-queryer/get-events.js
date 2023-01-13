
let util = require("../../../util/common");
const Dal = require("../../../dal/dal-common");
const dalBlock = Dal("tb_block_info");
const dalTransaction = Dal("tb_block_transaction");
const dalEvent = Dal("tb_block_event");
let wsHelper = require("../../../bll/ws-helper");

const moment = require("moment");
var os = require("os");
const common = require("../../../util/common");

async function main(hash) {
  common.useTime("get events", 1);
  const events = await api.query.system.events.at(hash);
  common.useTime("get events");
  console.log("event length", JSON.stringify(events).length);
  return events;
}
module.exports = main;
