let syncBlock = require("./sync-block");
let trend = require("./trend-record");

//This is the entry point for the operation of various modules, and the newly added modules will also run from here.
module.exports = main;
function main() {
  syncBlock();//block sync bloc enter
  trend();
}
main();//when run "npm run app", execute the code here