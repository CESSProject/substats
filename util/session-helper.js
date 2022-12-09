/*
 * @Description: 
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2022-12-09 09:53:10
 */
"use strict";
const session = require("express-session");

module.exports = function () {  
  return session({
    secret: "afa!@#$%%",
    name: "cess", //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: { maxAge: 80000000 }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: false,
  });
};
