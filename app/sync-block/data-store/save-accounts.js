
const Dal = require("../../../dal/dal-common");
const dal = Dal("tb_block_account");

async function save(o) {
  showLog("saving account", o);
  let tmp = await dal.findOne({
    accountId: o.accountId,
  });
  if (tmp.length > 0) {
    o.id = tmp[0].id;
    const id = o.id;
    delete o.id;
    tmp = await dal.updateById(o, id);
    showLog("update account", id);
  } else {
    tmp = await dal.insert(o);
    showLog("add account", tmp.id);
  }
}
module.exports = save;
