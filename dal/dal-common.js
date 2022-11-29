/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 cbf0311@sina.com
 * @LastEditTime: 2022-10-13 15:48:45
 * @description: mysql common class
 * @author: chenbinfa
 */
"use strict";
const MysqlBase = require("./mysql-base");

module.exports = class DalCommon extends MysqlBase {
  constructor(tableName) {
    super(tableName);
  }

  insert(entity, checkQuery) {
    return new Promise(async (resolve, reject) => {
      let ret = { msg: "fail", id: 0 };
      try {
        if (checkQuery) {
          let result = await super.findOne(checkQuery);
          if (result && result.length > 0) {
            ret.msg = "duplicate";
            return resolve(ret);
          }
        }
        let result = await super.insert(entity);
        entity.id = result.insertId || 0;
        ret.msg = entity.id > 0 ? "ok" : "fail";
        ret.id = entity.id;
        resolve(ret);
      } catch (e) {
        if (JSON.stringify(e).indexOf("ER_DUP_ENTRY") != -1) {
          ret.msg = "duplicate";
          return resolve(ret);
        }
        console.log(e);
        ret.err = e;
        reject(ret);
      }
    });
  }

  addCount(id, cell, count = 1) {
    let sqlStr = "update ?? set ?=?+? where id=?";
    return super.query(sqlStr, [this.tableName, cell, cell, count, id]);
  }

  update(entity) {
    let id = entity.id;
    delete entity.id;
    return super.updateById(entity, id);
  }

  getAllTableNames() {
    let sql =
      "select table_name from information_schema.tables where table_schema='substats-w3f'";
    return super.query(sql);
  }
};
