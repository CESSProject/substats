'use strict';
let config = require('../webconfig');
let arr = [];//实时队列
let arrBackup = [];//备份最大访问次的值
let hit = {
    hitCount: 0,
    queryCount: 0,
    setCount: 0,
    outCount: 0,
};

module.exports = {
    arr: arr,
    arrBackup: arrBackup,
    hit: hit,
    set: config.MemCache.Enable ? set : setDisable,
    get: config.MemCache.Enable ? get : getDisable,
    del:del
};
function setDisable(id, value) {
}
function getDisable(id) {
    return null;
}
function set(id, value) {
    if (arr.findIndex(t => t.id == id) != -1) {
        return;
    }
    hit.setCount++;
    arr.push({
        id: id,
        value: value,
        count: 1
    });
    cache2();
}
function del(id) {
    let index = arr.findIndex(t => t.id == id);
    if (index != -1) {
        return arr.splice(index, 1);
    }
    index = arrBackup.findIndex(t => t.id == id);
    if (index != -1) {
        return arrBackup.splice(index, 1);
    }
    return null;
}
function get(id) {
    hit.queryCount++;
    let ojbIndex = arr.findIndex(t => t.id == id);
    let obj;
    let checkFull = false;
    if (ojbIndex == -1) {
        ojbIndex = arrBackup.findIndex(t => t.id == id);
        if (ojbIndex == -1) {
            return null;
        }
        obj = arrBackup[ojbIndex];
        arrBackup.splice(ojbIndex, 1);
        checkFull = true;
    }
    else {
        obj = arr[ojbIndex];
        arr.splice(ojbIndex, 1);
        obj.count++;
    }
    arr.push(obj);
    if (checkFull) {
        cache2();
    }
    hit.hitCount++;
    return obj.value;
}
function cache2() {
    if (arr.length > config.MemCache.maxLength) {
        let delObj = arr.shift();
        if (delObj.count > config.MemCache.backupMinCount) {
            arrBackup.push(delObj);
            if (arrBackup.length > config.MemCache.backupMaxLength) {
                arrBackup.shift();
                hit.outCount++;
            }
        }
        else {
            hit.outCount++;
        }
    }
}