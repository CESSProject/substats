/*
 * @Description:Batch update rows
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-16 11:35:06
 */
module.exports = async function (ret, dal, req, res) {
  try {
    if (!req.body.ids) {
      ret.msg = "ids not exist";
      res.json(ret);
      return false;
    }
    let ids = req.body.ids;
    let idArrTemp = ids.split(",");
    let idArr = [];
    idArrTemp.forEach((id) => {
      if (!isNaN(id)) {
        idArr.push(parseInt(id));
      }
    });
    ids = idArr.join(",");
    delete req.body.add_time;
    if (!dal.columns) {
      dal.columns = await dal.findColumnName();
    }
    if (!dal.columns || dal.columns.length == 0) {
      ret.msg = "get columns fail";
      res.json(ret);
      return;
    }
    let entity = {},
      hasColumn = false;
    dal.columns.forEach((t) => {
      let k = t.column_name;
      if (k in req.body) {
        let v = req.body[k];
        if (v == "curr_admin_id") {
          v = req.admin ? req.admin.id : 0;
        }
        entity[k] = v;
        if (k != "id") {
          hasColumn = true;
        }
      }
    });
    if (!hasColumn) {
      ret.msg = "no change row";
    } else {
      delete entity.id;
      let sql = "update ?? set ? where id in(" + ids + ")";
      let params = [dal.tableName, entity];
      ret.data = await dal.query(sql, params);
      if (req.admin && req.admin.id) {
        req.body.changedRows = ret.data.changedRows;
      }
      ret.msg = "ok";
    }
  } catch (e) {
    ret.msg = "error";
    ret.err = e;
  }
  if ((typeof req.cb).toLocaleLowerCase() == "function") {
    req.cb(ret.data);
  }
  res.json(ret);
};
