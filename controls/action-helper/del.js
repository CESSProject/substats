/*
 * @Description: 
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-04 10:09:31
 */
"use strict";

module.exports = async function (ret, dal, req, res) {
    try {
        let id = req.body.id;
        if (!id) {
            ret.msg = 'id is null';
            res.json(ret);
            return;
        }
        if (!ret.nolog) {
            let sql = 'select * from ?? where id=?';
            let tmp = await dal.query(sql, [dal.tableName, id]);
            if (!tmp || tmp.length == 0) {
                ret.msg = 'item not found';
                res.json(ret);
                return;
            }
            let item = tmp[0];
            let entity = {
                table_name: dal.tableName,
                row_id: req.body.id,
                json_data: JSON.stringify(item),
                ip: req.ip.replace('::ffff:', '')
            };
            if (req.session && req.session.admin && req.session.admin.id) {
                entity.admin_id = req.session.admin.id;
            }
            if (req.session && req.session.user && req.session.user.id) {
                entity.user_id = req.session.user.id;
            }
        }
        ret.data = await dal.removeById(id);
        ret.msg = 'ok';
    } catch (e) {
        ret.msg = 'error';
        ret.err = e;
    }
    if (req.cb) {
        req.cb(ret.data);
    }
    res.json(ret);
}