/*
 * @Description: 
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: fage
 * @LastEditTime: 2022-07-11 16:40:33
 */
"use strict";
const webconfig = require('../webconfig');
const hostHelper = require('./host-helper');
module.exports = function (req, res, next) {
    let host=hostHelper.getTopHost(req.headers.host);
    req.topHost=host;
    if (host&&webconfig.AllowBindHosts.indexOf(host) == -1) {
        let err = new Error('403 error【host not allow('+host+')】.');
        err.status=403;
        next(err);
    }
    else{
        next();
    }
}
