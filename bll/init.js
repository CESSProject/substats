/*
 * @Description: init dictionary list from database 
 * @Autor: fage
 * @Date: 2022-07-11 20:07:29
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-16 11:33:04
 * @description: about
 * @author: chenbinfa
 */
const Dal = require("../dal/dal-common");
const dalDicCat = Dal("tb_dictionary_category");
const dalDic = Dal("tb_dictionary");

async function main() {  
  const cat = await dalDicCat.findAll();
  // console.log('init cat',cat);
  const dic = await dalDic.findAll();
  // console.log('init dic',dic);

  // console.log('init dalDicCat.tabelName',dalDicCat.tableName);
  // console.log('init dalDic.tabelName',dalDic.tableName);

  const list = cat.map((t) => {
    return {
      id: t.id,
      name: t.name,
      about: t.about,
      items: dic
        .filter((d) => d.category_id == t.id)
        .sort((t1, t2) => t1.sort_id - t2.sort_id),
    };
  });
  global.dics = list;
  return list;
}
module.exports = main;
