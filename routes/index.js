/*
 * @Description: 
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: fage
 * @LastEditTime: 2022-07-11 17:14:25
 */
"use strict";

/*
 * 前台页面
 */

const express = require('express');
let router = express.Router();

router.get(['/','/index.html'], function (req, res, next) {
    res.send('<h1>welcome</h1>');
});

router.get(['/test/:n1','/index.html'], function (req, res, next) {
    res.send('<h1>'+req.params.n1+'</h1>');
});


module.exports = router;
