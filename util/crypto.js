"use strict";
var crypto = require('crypto');
module.exports={
    md5:md5,
    aes:aes,
    deaes:deaes
};
function md5(txt){
    return crypto.createHash("md5").update(txt).digest("hex");
}
function aes(txt,key){
    if(!key){
        key="edit_by_chenbinfa";
    }
    let cipher = crypto.createCipher('aes-256-cbc',key);
    let crypted = cipher.update(txt,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}
function deaes(txt,key){
    if(!key){
        key="edit_by_chenbinfa";
    }
    let decipher = crypto.createDecipher('aes-256-cbc',key)
    let dec = decipher.update(txt,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}