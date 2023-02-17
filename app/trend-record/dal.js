const Dal = require("../../dal/dal-common");
const dalTrend = Dal("tb_trend");

async function save(catId, dateStr, dataValue) {
  let sql =
    "select id,dataValue from tb_trend where catId=" +
    catId +
    " and dateStr='" +
    dateStr +
    "'";
  let tmp = await dalTrend.query(sql);
  let entity = {
    catId,
    dateStr,
    dataValue,
  };
  if (tmp.length > 0) {
    if (tmp[0].dataValue != dataValue) {
      tmp = await dalTrend.updateById(entity, tmp[0].id);
    }
  } else {
    tmp = await dalTrend.insert(entity);
  }
  return tmp;
}

module.exports = save;
