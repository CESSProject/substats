"use strict";

module.exports = async function (ret, dal, req, res) {
  let id = req.body.id || req.query.id;
  if (!id) {
    ret.msg = "id no exist";
    res.json(ret);
    return false;
  }
  try {
    ret.data = await dal.findById(id);
    if (!ret.data || ret.data.length == 0) {
      throw "id not exist.";
    }
    ret.data = ret.data[0];
  } catch (e) {
    ret.msg = "error";
    ret.err = e;
  }
  if ((typeof req.cb).toLocaleLowerCase() == "function") {
    req.cb(ret);
  }
  res.json(ret);
};
