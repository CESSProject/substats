/*
 * @Description:data base reset module,it will truncate table of tb_block_info,tb_block_transaction,tb_block_event,tb_block_account and shrink database
 * @Autor: fage
 * @Date: 2022-08-05 11:15:38
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-17 10:48:25
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
  ];
  for (let tb of tables) {
    console.log("truncating", tb);
    const result = await dalBlock.truncate(tb);
    console.log(result);
    console.log("truncating", tb, "sccuess!");
  }
  if (global.dbType == "sqlite3") {
    console.log('Shrink database file');
    await dalBlock.query("vacuum");
  }
  console.log("truncate complete!");
  process.exit();
}

main().then(() => {}, console.log);
