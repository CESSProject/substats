/*
 * @Description: The router of index page
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-16 15:02:24
 */
"use strict";


const express = require('express');
let router = express.Router();

router.get(['/','/index.html'], function (req, res, next) {
    res.send('<h1>welcome</h1>');
});

router.get(['/test/:n1','/index.html'], function (req, res, next) {
    res.send('<h1>'+req.params.n1+'</h1>');
});


module.exports = router;
