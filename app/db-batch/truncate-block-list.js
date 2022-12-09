/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-08-05 11:15:38
 * @LastEditors: lanmeng656 cbf0311@sina.com
 * @LastEditTime: 2022-12-06 10:01:45
 * @description: about
 * @author: chenbinfa
 */
const Dal = require("../../dal/dal-common");
const init = require("../init");

async function main() {
  init();
  const dalBlock = Dal("tb_block_info");
  const tables = [
    "tb_block_info",
    "tb_block_transaction",
    "tb_block_event",
    "tb_block_account",
    "tb_miner",
    "tb_miner_summary",
    "tb_storage_power_trend",
  ];
  for (let tb of tables) {
    console.log("truncating", tb);
    const result = await dalBlock.truncate(tb);
    console.log(result);
    console.log("truncating", tb, "sccuess!");
  }
  console.log("truncate complete!");
  process.exit();
}

main().then(() => {}, console.log);
