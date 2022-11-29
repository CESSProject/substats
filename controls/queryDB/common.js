/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 15:11:35
 * @LastEditors: lanmeng656 cbf0311@sina.com
 * @LastEditTime: 2022-10-13 15:50:38
 * @description: about
 * @author: chenbinfa
 */
"use strict";
const Dal = require("../../dal/dal-common");
const listPage = require("../action-helper/list-page");
const detail = require("../action-helper/detail");
const column = require("../action-helper/column");
const del = require("../action-helper/del");
const create = require("../action-helper/create");
const update = require("../action-helper/update");
const exportHelper = require("../action-helper/export");
const batchUpdate = require("../action-helper/batch-update");
const copy = require("../action-helper/copy");
let tables = null;

module.exports = async function (req, res, next) {
  let funs = {
    list: list,
    create: create,
    update: update,
    del: del,
    column: column,
    detail: detail,
    batch_update: batchUpdate,
    copy: copy,
    export: exportHelper,
    get_table_names: getTableNames,
    get_colum_names: getColumNames,
  };
  let ret = {
    msg: "ok",
    data: [],
  };
  let tableName = req.body.tableName;
  let dal = new Dal("tb_" + tableName);
  const valiResult = await checkTableName(dal, tableName);
  if (!valiResult) {
    return res.json({ msg: "table [" + tableName + "] not found" });
  }
  let f = funs[req.body.action];
  if (f) {
    f(ret, dal, req, res);
  } else {
    ret.msg = "action(" + req.body.action + ")not found";
    res.json(ret);
  }
};
async function checkTableName(dal, tableName) {
  if (!tables) {
    const list = await dal.getTableNames();
    tables = list.map((t) => t.table_name.replace("tb_", ""));
  }
  return tables.indexOf(tableName) != -1;
}
function list(ret, dal, req, res) {
  let fieldStr = " * ";
  let fromStr = dal.tableName + " as a";
  listPage(fieldStr, fromStr, dal, req, res);
}
async function getTableNames(ret, dal, req, res) {
  ret.data = await dal.getTableNames();
  res.json(ret);
}
async function getColumNames(ret, dal, req, res) {
  ret.data = await dal.findColumnName(req.body.column_name);
  res.json(ret);
}
