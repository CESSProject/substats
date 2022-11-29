/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-07-20 15:55:12
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
    // console.log('****************entity**********************');
    // console.log(entity);
    ret = await dal.insert(entity);
  } catch (e) {
    ret.msg = "error";
    ret.err = e;
    let msg = "创建记录失败。";
  }
  if ((typeof req.cb).toLocaleLowerCase() == "function") {
    req.cb(ret.id);
  }
  res.json(ret);
};
