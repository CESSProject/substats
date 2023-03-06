const transactions = require("./transactions");
const price = require("./price");

async function main() {
  await transactions();
  await price();
  setTimeout(function () {
    main();    
  }, 10000);
}

// main();
module.exports = main;
