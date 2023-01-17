/*
 * @Description:Fromat entries to array
 * @Autor: fage
 * @Date: 2022-08-03 11:35:13
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-16 15:04:40
 * @description: about
 * @author: chenbinfa
 */
const _ = require("lodash");
module.exports = {
  entries,
};
function entries(result) {
  return result.map(([key, entry]) => {
    let id = _.get(
      key.args.map((k) => k.toHuman()),
      `0`
    );
    let humanObj = entry.toJSON();
    return _.assign(humanObj, { key: id });
  });
}
