"use strict";
const moment = require("moment");
const sqlSafe = require("../../util/sql-safe");

module.exports = list;

async function list(fieldStr, fromStr, dal, req, res) {
  let ret = {
    msg: "ok",
    data: [],
    dangerous: [],
  };
  try {
    const pre = req.body.pre || "a.";
    const { whereStr, sortStr, dangerous } = formatParams(pre, req);

    console.log("whereStr", whereStr);

    if (req.body.groupby) {
      sortStr = " GROUP BY " + req.body.groupby + " " + sortStr;
    }
    ret.dangerous = dangerous;
    ret.pageindex = req.body.pageindex;
    ret.pagesize = req.body.pagesize;
    ret.total = await dal.findCount(fromStr, whereStr);
    if (!ret.total || req.body.onlytotal) {
      // console.log(fromStr, whereStr);
      ret.data = [];
    } else {
      // console.log("whereStr", whereStr);
      // console.log("sortStr", sortStr);
      ret.data = await dal.findByPage(
        fieldStr,
        fromStr,
        whereStr,
        sortStr,
        req.body.pageindex,
        req.body.pagesize
      );
    }
  } catch (e) {
    ret.msg = "error";
    console.log(e);
    ret.err = e;
  }
  // ret.body = req.body;
  if ((typeof req.cb).toLocaleLowerCase() == "function") {
    req.cb(ret);
  }
  res.json(ret);
}
function formatParams(pre = "", req) {
  const { filter, filterType, sorter } = req.body;
  const result = {
    whereStr: null,
    sortStr: null,
    dangerous: [],
  };
  if (filter) {
    // console.log("filter", filter);
    const filterArr = [];
    filter.forEach((t) => {
      let column = pre + "`" + t.column + "`";
      let v = t.values.join(",");
      if (!sqlSafe.checkSafe(v)) {
        result.dangerous.push(v);
        return;
      }
      if ("=,!=,<,<=,>,>=".split(",").includes(t.sign)) {
        filterArr.push(column + t.sign + "'" + v + "'");
      } else if (t.sign == "like") {
        filterArr.push(column + " like '%" + v + "%'");
      } else if (t.sign == "notlike") {
        filterArr.push(column + " not like '%" + v + "%'");
      } else if (t.sign == "in") {
        v = t.values.map((d) => "'" + d + "'").join(",");
        filterArr.push(column + " in (" + v + ")");
      } else if (t.sign == "notin") {
        v = t.values.map((d) => "'" + d + "'").join(",");
        filterArr.push(column + " not in (" + v + ")");
      } else if (t.sign == "between" && t.values.length == 2) {
        v = t.values.join(" and ");
        filterArr.push(column + " between " + v);
      } else if (t.sign == "betweenTime" && t.values.length == 2) {
        v = t.values
          .map((d) => "'" + moment(d, "YYYY-MM-DD HH:mm:ss").format() + "'")
          .join(" and ");
        filterArr.push(column + " between " + v);
      }
    });
    if (filterArr.length) {
      result.whereStr = filterArr.join(filterType == "and" ? " and " : " or ");
    }
  }
  if (sorter) {
    // console.log("sorter", sorter);
    const sortArr = sorter.map((t) => t.column + " " + t.order);
    result.sortStr = "order by " + sortArr.join(",");
    if (!sqlSafe.checkSafe(result.sortStr)) {
      result.sortStr = null;
      return;
    }
  }
  return result;
}

/* 
let postParamsDemo = {
  pageindex: 1,
  pagesize: 10,
  filter: [
    {
      column: "title",
      sign: "=,!=,<,<=,>,>=,between,betweenTime,like,notlike,in,notin",
      values: [1, 2],
    },
  ],
  filterType: "or",
  groupby: "",
  onlytotal: false,
  sorter: [
    {
      column: "id",
      order: "asc",
    },
    {
      column: "sort_id",
      order: "desc",
    },
  ],
};
*/
