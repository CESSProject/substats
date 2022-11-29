
module.exports = async function (ret, dal, req, res) {
    try {
        if (!req.body.id) {
            ret.msg = 'id not exist';
            res.json(ret);
            return false;
        }
        delete req.body.add_time;
        if (!dal.columns) {
            dal.columns = await dal.findColumnName();
        }
        if (!dal.columns || dal.columns.length == 0) {
            ret.msg = '获取列失败';
            res.json(ret);
            return;
        }
        let entity = {}, hasColumn = false;
        dal.columns.forEach(t => {
            let k = t.column_name;
            if (k in req.body) {
                let v = req.body[k];
                if (v == 'curr_admin_id') {
                    v = req.admin ? req.admin.id : 0;
                }
                entity[k] = v;
                if(k!='id'){
                    hasColumn = true;
                }
            }
        });
        if (!hasColumn) {
            ret.msg = '没有需要更改的列';
        }
    } catch (e) {
        ret.msg = 'error';
        ret.err = e;
    }
    if ((typeof req.cb).toLocaleLowerCase() == 'function') {
        req.cb(ret.data);
    }
    res.json(ret);
}