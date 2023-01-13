"use strict";
const fs = require("fs");
const path = require("path");
const util = require('util');
const moment = require('moment');

module.exports = {
    getYYYYMMDD: getYYYYMMDD,
    getDateDir: getDateDir,
    log: log,
    err: err,
    timestr: timestr,
    getExtname: getExtname,
    subtext: sub,
    subtextArr: subs,
    include: include,
    readTemplate: readTemplate,
    relaceAll: relaceAll,
    formatEntity: formatEntity,
    url_encode: url_encode,
    getFiles: getFiles,
    random: random,
    randomStr: randomStr,
    superTrim: superTrim,
    sleep:sleep,
    clone:clone,
    isEmpty:isEmpty,
    getMoneyFloat:getMoneyFloat,
    createTimestamp:createTimestamp,
    raw:raw,
    useTime
};
const cache = {};
function useTime(name, isStart) {
	if (isStart) {
		cache[name] = new Date().valueOf();
	} else {
		if (!cache[name]) {
			console.log("cache not found", name);
		}
		let now = new Date().valueOf();
		let t = now - cache[name];
		let uni = "ms";
		if (t > 1000) {
			t = parseInt(t / 1000);
			uni = "s";
		}
		console.log("run time of ", name, t, uni);
        return t;
	}
}
function getYYYYMMDD(dateTime) {
    let myDate;
    if (!dateTime) {
        myDate = new Date();
    }
    else {
        myDate = new Date(dateTime);
    }
    return parseInt(myDate.getFullYear() + ("0" + (myDate.getMonth() + 1)).slice(-2) + ("0" + myDate.getDate()).slice(-2));
}

function getDateDir(myDate) {
    if (!myDate) {
        myDate = new Date();
    }
    return moment(myDate).format('/YYYY/MM/DD/');
    //return "/" + myDate.getFullYear() + "/" + ("0" + (myDate.getMonth() + 1)).slice(-2) + "/" + ("0" + myDate.getDate()).slice(-2) + "/";
}

function timestr(fmt, time) {
    var now = time ? new Date(time) : new Date();
    var o = {
        "M+": now.getMonth() + 1,                
        "d+": now.getDate(),                    
        "h+": now.getHours(),                  
        "m+": now.getMinutes(),                
        "s+": now.getSeconds(),                 
        "q+": Math.floor((now.getMonth() + 3) / 3), 
        "S": now.getMilliseconds()            
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getExtname(url, defaultExtname) {
    url = url.toLowerCase();
    let extname = path.extname(url);
    if (url.substr(-1) == "/") {
        return defaultExtname || "/";
    }
    else {
        if (!extname) {
            let arr = ['jpg', 'png', 'gif', 'bmp', 'jpeg'];
            for (let t of arr) {
                if (url.indexOf(t) != -1) return "." + t;
            }
            let splitChar = url.indexOf("?");
            if (splitChar > -1) {
                url = url.substring(0, splitChar);
            }
            splitChar = url.indexOf("#");
            if (splitChar > -1) {
                url = url.substring(0, splitChar);
            }
            if (url.substr(-1) == "/") {
                return defaultExtname || "/";
            }
            return defaultExtname || "";
        }
        else if (extname.indexOf("?") != -1) {
            extname = extname.split('?')[0];
        } else if (extname.indexOf("#") != -1) {
            extname = extname.split('#')[0];
        }
    }
    return extname;
}

function log(arg) {
    let len = arguments.length;
    if (len == 1) {
        console.log(arg);
    }
    else {
        let str = [];
        for (let i = 0; i < len; i++) {
            str.push(arguments[i]);
        }
        console.log(str);
    }
}

function err(arg) {
    let len = arguments.length;
    if (len == 1) {
        console.log(arg);
    }
    else {
        let str = [];
        for (let i = 0; i < len; i++) {
            str.push(arguments[i]);
        }
        console.log(str);
    }
}


function sub(str, start, end) {
    let s = str.indexOf(start);
    if (s == -1) return null;
    let temp = str.substr(s + start.length);
    let e = temp.indexOf(end);
    if (e == -1) return null;
    return temp.substring(0, e);
}

function subs(str, start, end) {
    let arr = str.split(end);
    let retArr = [];
    for (let a of arr) {
        if (!a) continue;
        let s = a.lastIndexOf(start);
        if (s == -1) continue;
        let temp = a.substr(s + start.length);
        if (temp) retArr.push(temp);
    }
    return retArr;
}


function include(relativeDir, pageHtml) {
    let arr = subs(pageHtml, '<include>', '</include>');
    if (arr.length == 0) return pageHtml;
    arr.forEach(function (v) {
        let incFilePath;
        if (v.substr(0, 1) == '/') {
            incFilePath = path.join(__dirname, '/../', v);
        } else {
            incFilePath = path.join(relativeDir, v);
        }
        let inc = fs.readFileSync(incFilePath, 'utf8');
        pageHtml = pageHtml.replace('<include>' + v + '</include>', inc);
    });
    return pageHtml;
}

function readTemplate(fullPath) {
    let dir = path.dirname(fullPath);
    let html = fs.readFileSync(fullPath, 'utf8');
    return include(dir, html);
}

function relaceAll(sourStr, oldStr, newStr) {
    return sourStr.replace(new RegExp(oldStr, "gm"), newStr);
}


function url_encode(url) {
    url = encodeURIComponent(url);
    url = url.replace(/\%3A/g, ":");
    url = url.replace(/\%2F/g, "/");
    url = url.replace(/\%3F/g, "?");
    url = url.replace(/\%3D/g, "=");
    url = url.replace(/\%26/g, "&");
    return url;
}

function formatEntity(entity) {
    for (let i in entity) {
        let t = entity[i];
        switch (typeof t) {
            case 'undefined':
                delete entity[i];
                break;
            case 'number':
                if (isNaN(t)) delete entity[i];
                break;
            case 'string':
                if (t == '' || t.toString().trim() == '')
                    delete entity[i];
                break;
            case 'object':
                if (t === null || Object.keys(t).length === 0)
                    delete entity[i];
                break;
            default:
                break;
        }
    }
}

function getFiles(dir) {
    let files = fs.readdirSync(dir);
    for (let f in files) {
        files[f] = dir + files[f];
    }
    return files;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomStr() {
    return Math.random().toString(36).substr(2);
}

function superTrim(obj) {
    if (typeof obj == 'string') {
        return obj.mytrim();
    }
    if (typeof obj != 'object') {
        return obj;
    }
    for (let i in obj) {
        if (typeof obj[i] == 'string') {
            obj[i] = obj[i].mytrim();
        }
    }
    return obj;
}
function sleep(minisec,showLog) {
    return new Promise((resolve, reject) => {
        if(showLog){
            console.log(moment().format('YYYY-MM-DD HH:mm'), 'pause ' + (minisec / 1000).toString() + 's.');
        }
        setTimeout(function () {
            resolve();
        }, minisec);
    });
}
function clone(obj) {
    var o;
    switch (typeof obj) {
        case "undefined":
            break;
        case "string":
            o = obj + "";
            break;
        case "number":
            o = obj - 0;
            break;
        case "boolean":
            o = obj;
            break;
        case "object":
            if (obj === null) {
                o = null;
            } else {
                if(obj instanceof Date){
                    o=obj;
                }else if (Object.prototype.toString.call(obj).slice(8, -1) === "Array") {
                    o = [];
                    for (var i = 0; i < obj.length; i++) {
                        o.push(clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var k in obj) {
                        o[k] = clone(obj[k]);
                    }
                }
            }
            break;
        default:
            o = obj;
            break;
    }
    return o;
}
function isEmpty(value) {
    var result=false;
    console.log(typeof value);
    switch (typeof value){
        case 'string':
            result=value=='';
            break;
        case 'undefined':
            result=true;
            break;
        case 'number':
            result=false;
            break;
        case 'object':
            var tmp=JSON.stringify(value);
            result=tmp=='{}'||tmp=='[]'?true:false;
            break;
    }
    return result;
}
function getMoneyFloat(v){
    return parseInt(v*100)/100;
}
function createTimestamp() {
    return parseInt(new Date().getTime() / 1000) + '';
}
function raw(args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
}