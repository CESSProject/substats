/*
 * @Description: 
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: fage
 * @LastEditTime: 2022-07-11 17:01:20
 */
"use strict";
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

module.exports = function () {  
  const store = new MySQLStore(global.webconfig.mysql);
  return session({
    secret: "afa!@#$%%",
    name: "cess", //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    store: store,
    cookie: { maxAge: 80000000 }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: false,
  });
};
