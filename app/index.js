let getAcount = require("./timer/get-accounts");
let sumTxCount = require("./timer/sum-block-tx-count");
let syncBlock = require("./sync-block");

module.exports = main;
function main() {
  // getAcount();
  // sumTxCount();
  syncBlock();
}
// main();