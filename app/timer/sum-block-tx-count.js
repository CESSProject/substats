/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-08-05 11:15:38
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-11 19:58:51
 * @description: about
 * @author: chenbinfa
 */
let webconfig = require("../../webconfig");
global.webconfig = webconfig;
const Dal = require("../../dal/dal-common");
const dalBlock = new Dal("tb_block_info");

async function main() {
  let sql =
    "select id,blockHeight from tb_block_info where txCount is null limit 100";
  let list = await dalBlock.query(sql);
  console.log("list length", list.length);
  if (list.length == 0) {
    return setTimeout(main, 10000);
  }
  for (entity of list) {
    sql =
      "SELECT COUNT(1) as c FROM tb_block_transaction WHERE blockHeight=" +
      entity.blockHeight;
    let tmp = await dalBlock.query(sql);
    let txCount = tmp[0].c;
    sql =
      "SELECT COUNT(1) as c FROM tb_block_event WHERE blockHeight=" +
      entity.blockHeight;
    tmp = await dalBlock.query(sql);
    let eventCount = tmp[0].c;
    tmp = await dalBlock.update({
      id: entity.id,
      txCount,
      eventCount,
    });
    console.log(entity.blockHeight, tmp.affectedRows == 1 ? "✔" : "✘");
  }
  await main();
}
main().then(() => {}, console.log);
