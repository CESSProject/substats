const http = require("../../util/http-helper.js");

// import ky from "ky";

let url = "https://api.binance.com/api/v3/ticker?symbol=DOTUSDT";

async function main() {
  let josn =await http.get(url);
  console.log(josn);
}

main();



