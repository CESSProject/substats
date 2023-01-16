/*
 * @Description:Insert a row
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-16 11:35:55
 */
module.exports = async function (ret, dal, req, res) {
  try {
    delete req.body.add_time;
    delete req.body.id;
    if (!dal.columns) {
      dal.columns = await dal.findColumnName();
    }
    let entity = {};
    dal.columns.forEach((t) => {
      let k = t.column_name;
      if (k in req.body) {
        entity[k] = req.body[k];
      }
    });
    ret = await dal.insert(entity);
  } catch (e) {
    ret.msg = "error";
    ret.err = e;
  }
  if ((typeof req.cb).toLocaleLowerCase() == "function") {
    req.cb(ret.id);
  }
  res.json(ret);
};
