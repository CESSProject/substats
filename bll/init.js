/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 20:07:29
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-07-21 16:21:18
 * @description: about
 * @author: chenbinfa
 */
const Dal = require("../dal/dal-common");
const dalDicCat = new Dal("tb_dictionary_category");
const dalDic = new Dal("tb_dictionary");

async function main() {
  const cat = await dalDicCat.findAll();
  const dic = await dalDic.findAll();
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
