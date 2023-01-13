
let util = require("../../../util/common");
const Dal = require("../../../dal/dal-common");
const dalBlock = Dal("tb_block_info");
const dalTransaction = Dal("tb_block_transaction");
const dalEvent = Dal("tb_block_event");
let wsHelper = require("../../../bll/ws-helper");

const moment = require("moment");
var os = require("os");
const common = require("../../../util/common");
const accountSave=require('../data-process/process-accounts');

async function saveEvent(blockHeight, src, txId, txIndex, events, timestamp) {
    // events = events.toHuman();
    // console.log(JSON.stringify(events));
    let status = null,
      eventCount = 0;
    const filtered = events.filter(
      ({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(txIndex)
    );
    // console.log(JSON.stringify(filtered));
    if (filtered.length == 0) {
      return { status, eventCount };
    }
    for (o of filtered) {
      try {
        let data = o.event.data.toHuman();
        if (typeof data == "object" && (data.who || data.account)) {
          await accountSave(data.who || data.account);
        }
        let entity = {
          blockHeight,
          txId,
          method: o.event.method,
          section: o.event.section,
          data: JSON.stringify(data),
          index: 0,
          timestamp,
        };
        if (o.event.index) {
          entity.index = parseInt(o.event.index, 16);
        }
        // console.log("event entity", entity);
        if (entity.method == "ExtrinsicSuccess") {
          status = "success";
        }
        if (entity.method == "ExtrinsicFailed") {
          status = "failed";
        }
        await dalEvent.insert(entity);
        eventCount++;
      } catch (e) {
        console.log(e);
      }
    }
    return { status, eventCount };
  }
module.exports = saveEvent;
