"use strict";
const url = require('url');

module.exports = {
    getTopHost: getTopHost
};
//根据域名获取顶级域名
function getTopHost(host) {
    let temp=host.indexOf(':');
    if(temp!=-1){
        host=host.substr(0,temp);
    }
    let arr = host.split('.');
    if (arr.length < 3) return arr.join('.');
    let last2 = arr.slice(-2).join('.');
    if (last2 == 'com.cn' || last2 == 'net.cn' || last2 == 'org.cn' || last2 == 'gov.cn' || last2 == 'edu.cn') {
        return arr.slice(-3).join('.');
    } else {
        return last2;
    }
}
//console.log(getTopHost('www.abc.com:80'));