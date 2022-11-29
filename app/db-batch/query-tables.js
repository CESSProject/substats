/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-08-05 11:15:38
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-18 15:12:18
 * @description: about
 * @author: chenbinfa
 */
let webconfig = require("../../webconfig");
global.webconfig = webconfig;
const Dal = require("../../dal/dal-common");
const dalBlock = new Dal("tb_block_info");

async function main() {
  let list = await dalBlock.getTableNames();
  list.forEach((t) => {
    console.log("- " + t.table_name.replace("tb_", ""));
  });
  console.log("truncate complete!");
  process.exit();
}
main().then(() => {}, console.log);
