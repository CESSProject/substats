/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 cbf0311@sina.com
 * @LastEditTime: 2022-11-01 17:55:56
 */
"use strict";

/*
 * API公共接口
 */

const express = require("express");
const publicAPI = require("../controls/public/index");

var router = express.Router();

router.post("/:way/:action", publicAPI);
// router.post("/:way/:action", function (req, res) {
//   console.log("req.body*************", req.body);
// });

module.exports = router;
