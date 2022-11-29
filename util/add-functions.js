/**
 * 增加对象的方法
 */
//数组去重
Array.prototype.unique = function () {
    var res = [this[0]];
    for (var i = 1; i < this.length; i++) {
        var repeat = false;
        for (var j = 0; j < res.length; j++) {
            if (this[i] === res[j]) {
                repeat = true;
                break;
            }
        }
        if (!repeat) {
            res.push(this[i]);
        }
    }
    return res;
}
//数据随机排序
Array.prototype.randSort = function (s1, s2) {
    return this.sort(() => Math.random() - 0.5);
}
String.prototype.replaceAll = function (s1, s2) {
    //return this.replace(new RegExp(s1, "gm"), s2);
    return this.split(s1).join(s2);
}
String.prototype.mytrim = function () {
    let a = this.replace(new RegExp('\r', "gm"), '');
    a = a.replace(new RegExp('\n', "gm"), '');
    a = a.replace(new RegExp('\t', "gm"), '');
    return a.trim();
}
String.prototype.mysubstr = function (strStart, strEnd) {
    let str = this.substr(this.indexOf(strStart) + strStart.length);
    return str.substring(0, str.indexOf(strEnd));
}