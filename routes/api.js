/*
 * @Description:The api router with way and action
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-16 15:01:18
 */
"use strict";

const express = require("express");
const publicAPI = require("../controls/public/index");

var router = express.Router();

router.post("/:way/:action", publicAPI);
// router.post("/:way/:action", function (req, res) {
//   console.log("req.body*************", req.body);
// });

module.exports = router;
