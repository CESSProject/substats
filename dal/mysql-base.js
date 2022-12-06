"use strict";
const mysql = require("mysql");
let conn = null;

module.exports = class mysqlBase {
  constructor(tableName) {
    if (!conn) {
      let webconfig = global.webconfig;
      conn = mysql.createPool(webconfig.mysql);
    }
    this.conn = conn;
    this.tableName = tableName;
  }

  query(sqlStr, params) {
    return new Promise((resolve, reject) => {
      this.conn.query(
        {
          sql: sqlStr,
          timeout: 5000,
        },
        params,
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  insert(entity) {
    let sql = "insert into ?? set ?";
    return this.query(sql, [this.tableName, entity]);
  }

  truncate(tableName) {
    if (!tableName) {
      tableName = this.tableName;
    }
    let sql = "truncate table " + tableName;
    return this.query(sql);
  }

  remove(whereStr) {
    let sql = "delete from ?? where " + whereStr;
    return this.query(sql, [this.tableName]);
  }

  removeById(id) {
    let sql = "delete from ?? where id=?";
    return this.query(sql, [this.tableName, id]);
  }

  update(entity, whereStr) {
    let sql = "update ?? set ? where " + whereStr;
    return this.query(sql, [this.tableName, entity]);
  }

  updateByParams(entity, where) {
    let sql = "update ?? set ? where ?";
    return this.query(sql, [this.tableName, entity, where]);
  }

  updateById(entity, id) {
    let sql = "update ?? set ? where id=?";
    return this.query(sql, [this.tableName, entity, id]);
  }

  findAll(columns, orderStr) {
    if (!columns) {
      columns = "*";
    }
    let sql = "select " + columns + " from ?? ";
    if (orderStr) sql += orderStr;
    return this.query(sql, [this.tableName]);
  }

  findById(id) {
    let sql = "select * from ?? where id=?";
    return this.query(sql, [this.tableName, id]);
  }

  findOne(query) {
    let sql = "select * from ?? where ? order by id desc limit 1";
    return this.query(sql, [this.tableName, query]);
  }

  findWithQuery(query) {
    let sql = "select * from ?? where ? ";
    return this.query(sql, [this.tableName, query]);
  }

  findTop(columns, count, whereStr) {
    if (!columns) {
      columns = "*";
    }
    let sql = "select " + columns + " from ??";
    if (whereStr) {
      sql += " where " + whereStr;
    }
    sql += " order by id desc limit ?";
    return this.query(sql, [this.tableName, count]);
  }

  findCount(fromStr, whereStr) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = "select count(1) as itemcount from ";
        if (fromStr) {
          sql += fromStr;
        } else {
          sql += this.tableName;
        }
        if (whereStr) {
          sql += " where " + whereStr;
        }
        let temp = await this.query(sql);
        if (temp && temp.length > 0) {
          resolve(temp[0].itemcount);
        } else {
          reject(temp);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  find(columns, whereStr, sortStr, count) {
    if (!columns) {
      columns = "*";
    }
    let sql = "select " + columns + " from ?? ";
    if (whereStr) {
      sql += " where " + whereStr;
    }
    if (sortStr) {
      sql += sortStr;
    }
    if (count) {
      sql += " limit " + count;
    }
    return this.query(sql, [this.tableName]);
  }

  findByPage(fieldStr, fromStr, whereStr, sortStr, pageIndex, pageSize) {
    if (!fieldStr) {
      fieldStr = "*";
    }
    let sql = "select " + fieldStr + " from ";
    if (fromStr) {
      sql += fromStr + " ";
    } else {
      sql += this.tableName + " ";
    }
    if (whereStr) {
      sql += " where " + whereStr;
    }
    if (!sortStr) {
      sortStr = " order by id desc";
    }
    sql += sortStr + " limit ?,?";
    let params = [pageSize * (pageIndex - 1), pageSize];
    // console.log('sql',sql,params);
    return this.query(sql, params);
  }
  getTableNames(tableName) {
    let sql =
      "select table_name,table_comment,table_rows from information_schema.tables where table_schema='substats-w3f' and table_type='BASE TABLE'";
    if (tableName) {
      sql += " and table_name='" + tableName + "'";
    }
    return this.query(sql);
  }

  findColumnName(tableName) {
    let sql =
      "select column_name,column_comment,column_type from information_schema.columns where TABLE_SCHEMA=? and table_name=?";
    return this.query(sql, ["substats-w3f", tableName || this.tableName]);
  }

  findMaxId(tableName) {
    let sql = "select id from ?? order by id desc limit 1";
    let tn = tableName || this.tableName;
    return this.query(sql, [tn]);
  }
};
