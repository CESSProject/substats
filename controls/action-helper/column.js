"use strict";
module.exports = async function (ret, dal, req, res) {
  try {
    if (!dal.columns) {
      dal.columns = await dal.findColumnName();
    }
    ret.data = dal.columns;
  } catch (e) {
    ret.msg = "error";
    ret.err = e;
  }
  if ((typeof req.cb).toLocaleLowerCase() == "function") {
    req.cb(ret);
  }
  res.json(ret);
};
