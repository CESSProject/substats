"use strict";
let webconfig=require('../webconfig');

module.exports = {
    getip: getip,
    ipBlack:ipBlack
};
function getip(req) {
    if(req.realip) return req.realip;
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.header('x-real-ip') || req.connection.remoteAddress || req.ip;
    }
    if (ipAddress) {
        ipAddress = ipAddress.replace('::ffff:', '');
    }
    req.realip = ipAddress;
    return ipAddress;
}
function ipBlack(req,res,next) {
    //IP黑名单功能
    if(!webconfig.IpBlackList.Enable){
        return;
    }
    getip(req);
    if(!req.realip){
        return;
    }
    let index=webconfig.IpBlackList.List.indexOf(req.realip);
    if(index==-1){
        return next();
    }
    let err = new Error('wait');
    err.status = 404;
    next(err);
}
// function getipDebug(req) {
//     let ips = {
//         x_forwarded_for: req.header('x-forwarded-for'),
//         x_real_ip: req.header('x-real-ip'),
//         real_ip_header: req.header('real_ip_header'),
//         remoteAddress: req.connection.remoteAddress,
//         req_ip: req.ip
//     };
//     return JSON.stringify(ips);
// }
// let a = '', b = '', c = 'c';
// console.log(a || b || c);