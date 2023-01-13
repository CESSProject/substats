/*
 * @Description:This is a public database reading component, which aims to return the data records to be read from the front end
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-13 16:32:51
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
const batchUpdate = require("../action-helper/batch-update");
const copy = require("../action-helper/copy");
let tables = null;

module.exports = async function (req, res, next) {
  let funs = {
    list: list, //query list from database table
    create: create, //create a item to the database
    update: update,//update a item at database table
    del: del,//delete a item from database table
    column: column,//get table column list
    detail: detail,//get table row detail
    batch_update: batchUpdate,//batch update item as database
    copy: copy,//copy a item
    get_table_names: getTableNames,//get all table names of database
    get_colum_names: getColumNames,//get columns list of a table
  };
  let ret = {
    msg: "ok",
    data: [],
  };
  let tableName = req.body.tableName;//table name by request
  let dal = Dal("tb_" + tableName);
  const valiResult = await checkTableName(dal, tableName);//check table name if exist
  if (!valiResult) {
    //if not exists return error
    return res.json({ msg: "table [" + tableName + "] not found" });
  }
  let f = funs[req.body.action];
  if (f) {
    f(ret, dal, req, res);
  } else {
    //if action not found return a error
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
