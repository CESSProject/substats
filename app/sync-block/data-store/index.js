const saveBlockInfo = require("./save-block-info");
const saveEvents = require("./save-events");
const saveTransactions = require("./save-transactions");
const saveAccounts = require("./save-accounts");

//this is data store module
module.exports = { saveBlockInfo, saveEvents, saveTransactions, saveAccounts };
