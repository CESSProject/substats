const processBlockInfo = require("./process-block-info");
const processEvents = require("./process-events");
const processTransactions = require("./process-transactions");
const processAccounts = require("./process-accounts");
//this is data process module
module.exports = { processBlockInfo, processEvents, processTransactions, processAccounts };
