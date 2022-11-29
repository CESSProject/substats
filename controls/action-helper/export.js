"use strict";
// 导出到excel
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const sqlSafe = require("../../util/sql-safe");
const json2csv = {};

module.exports = async function (ret, dal, req, res) {
    try {
        let departments = global.webconfig.departments;
        let admins = global.webconfig.admins;
        let mallproducts = global.webconfig.mallproducts;
        let users = global.webconfig.users;
        let communitys = global.webconfig.communitys;
        let pre = req.body.pre || 'a.';


        let fields = [];
        if (req.fields) {
            fields = req.fields;
        } else {
            if (!dal.columns) {
                dal.columns = await
                dal.findColumnName();
            }
            dal.columns.forEach(t => {
                fields.push({
                    label: t.column_comment,
                    value: t.column_name,
                    default: ''
                });
            });
        }

        let fieldStr = req.fieldStr || '*';
        let fromStr = req.fromStr || dal.tableName + ' as a ';


        let whereStr = '', whereStrArr = req.whereStrArr || [];
        let sortStr = '';
        if ('keyvalues' in req.body)
            req.body.keyvalues = req.body.keyvalues.toString();

        let orderway = req.body.orderway && req.body.orderway == 1 ? 'asc' : 'desc';
        let orderby = req.body.orderby || 'id';
        let keynames = req.body.keynames || '';
        let keyvalues = req.body.keyvalues || '';
        let signs = req.body.signs || '';

        let starttime = req.body.starttime || '';
        let timeColumn = req.body.timecolumn || pre + 'add_time';

        if (starttime) {
            starttime = moment(starttime, 'YYYY-MM-DD HH:mm:ss');
            whereStrArr.push(timeColumn + '>="' + starttime.format() + '"');
        }
        let endtime = req.body.endtime || '';
        if (endtime) {
            endtime = moment(endtime, 'YYYY-MM-DD HH:mm:ss').format();
            whereStrArr.push(timeColumn + '<="' + endtime + '"');
        }

        var signDic = '= != like notlike > >= < <=';//词典
        if (keynames != '' && keyvalues != '' && signs != '') {
            let keyArr = keynames.split(',');
            let valArr = keyvalues.split(',');
            let signArr = signs.split(',');
            for (let i = 0; i < keyArr.length; i++) {
                let key = keyArr[i];
                let val = valArr[i];
                let sign = signArr[i];
                if (!key
                    || val == ''
                    || !sign
                    || signDic.indexOf(sign) == -1
                    || !sqlSafe.checkSafe(key)
                    || !sqlSafe.checkSafe(val)) {
                    ret.dangerous.push(key);
                    continue
                }
                if (key == 'id') {
                    val = parseInt(val);
                    whereStrArr.push(pre + 'id=' + val);
                    continue;
                }
                switch (sign) {
                    case 'like':
                        whereStrArr.push(key + ' like "%' + val + '%"');
                        break;
                    case 'notlike':
                        whereStrArr.push(key + ' not like "%' + val + '%"');
                        break;
                    case '>':
                    case '>=':
                    case '<':
                    case '<=':
                        whereStrArr.push(key + sign + val);
                        break;
                    default:
                        whereStrArr.push(key + sign + '"' + val + '"');
                        break;
                }
            }
        }
        if (orderby == 'id') {
            sortStr = ' order by ' + pre + orderby + ' ' + orderway;
        } else {
            sortStr = ' order by ' + orderby + ' ' + orderway + ',' + pre + 'id desc';
        }

        whereStr = whereStrArr.length > 0 ? whereStrArr.join(' and ') : null;

        let list = [], items = [];
        if (ret.data && ret.data.length > 0) {
            items = ret.data;
        } else {
            items = await
            dal.findByPage(fieldStr, fromStr, whereStr, sortStr, req.body.pageindex, req.body.pagesize);
        }
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let newItem = {line_index: i + 1};
            let tmp = null;
            for (let j = 0; j < fields.length; j++) {
                let field = fields[j];
                let arr = field.arr;
                if (!field.arr) {
                    let o = {col: field.value};
                    if (field.type) {
                        o.type = field.type;
                    }
                    arr = [o];
                }
                let valArr = [];
                for (let a = 0; a < arr.length; a++) {
                    let f = arr[a];
                    let value = item[f.col];
                    switch (f.type) {
                        // case 'dic':
                        //     if (value == -1) {
                        //         value = '';
                        //     } else {
                        //         let dic = dictionarys.find(d => d.id == field.v);
                        //         if (dic && dic.dictionarys) {
                        //             tmp = dic.dictionarys.find(t => t.key_id == value);
                        //             if (tmp) {
                        //                 value = tmp.key_value;
                        //             }
                        //         }
                        //     }
                        //     break;
                        case "admin_name":
                            tmp = admins.find(a => a.id == value);
                            if (tmp) {
                                value = tmp.name;
                            }
                            break;
                        case "department_name":
                            tmp = departments.find(a => a.id == value);
                            if (tmp) {
                                value = tmp.name;
                            }
                            break;
                        case 'money':
                            value += '元';
                            break;
                        case 'date':
                            value = moment(value).format('MM月DD日');
                            break;
                        case 'time':
                            value = moment(value).format('HH:mm');
                            break;
                        case 'datetime':
                            value = moment(value).format('YYYY-MM-DD HH:mm');
                            break;
                        case 'product_name':
                            tmp = mallproducts.find(t => t.id == value);
                            if (tmp) {
                                value = tmp.product_name;
                            }
                            break;
                        case 'user_name':
                            if (value) {
                                value = parseInt(value);
                                tmp = users.find(t => t.id == value);
                                if (tmp) {
                                    value = tmp.real_name || tmp.nickname || tmp.id;
                                } else {
                                    value = '未找到';
                                }
                            }
                            break;
                        case 'community_name':
                            tmp = communitys.find(t => t.id == value);
                            if (tmp) {
                                value = tmp.community_name;
                            }
                            break;
                        case 'about':
                            if (value) {
                                value = value.split('\n').join('，');
                            }
                            break;
                        case 'star':
                            if (!value || value == 0) {
                                value = '';
                            } else {
                                let stars = parseInt(value);
                                value = '';
                                for (let s = 1; s < 6; s++) {
                                    if (stars >= s) {
                                        value += '★';
                                    } else {
                                        value += '☆';
                                    }
                                }
                                value += ' (' + stars + '星)';
                            }
                            break;
                        case 'fun':
                            value = field.fun(field, item);
                            break;
                        default:
                            break;
                    }
                    valArr.push(value);
                }
                newItem[field.value] = valArr.join(field.splitstr || '');
            }
            list.push(newItem);
        }
        let newFields = [{
            label: '序号',
            value: 'line_index',
            default: ''
        }];
        fields.forEach(t => {
            newFields.push({
                label: t.label,
                value: t.value.toString(),
                default: ''
            });
        });
        // console.log(fieldStr,fields);
        let csv = json2csv({data: list, fields: newFields});

        let fileName = req.body.way + '_' + moment().format('YYYY-MM-DD-HHmmss') + '.csv';
        let savePath = path.join(__dirname, '../../', 'public', 'files', 'excel/');
        fs.writeFile(savePath + fileName, csv, function (err) {
            if (err) throw err;
            ret.data = '/files/excel/' + fileName;
            res.json(ret);
        });
    } catch (e) {
        ret.msg = 'error';
        ret.err = e;
        console.log(e);
        res.json(ret);
    }
    if ((typeof req.cb).toLocaleLowerCase() == 'function') {
        req.cb(ret.id);
    }

}