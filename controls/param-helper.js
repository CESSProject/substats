"use strict";
module.exports = function (req) {
    if (req.body.id && !isNaN(req.body.id)) {
        req.body.id = parseInt(req.body.id);
    }
    if (req.query.id && !isNaN(req.query.id)) {
        req.query.id = parseInt(req.query.id);
    }
    if (req.body.pageindex && !isNaN(req.body.pageindex)) {
        req.body.pageindex = parseInt(req.body.pageindex);
    } else if (req.body.action == 'list') {
        req.body.pageindex = 1;
    }
    if (req.body.pagesize && !isNaN(req.body.pagesize)) {
        req.body.pagesize = parseInt(req.body.pagesize);
    } else if (req.body.action == 'list') {
        req.body.pagesize = 20;
    }
    if (req.body.orderway && !isNaN(req.body.orderway)) {
        req.body.orderway = req.body.orderway == '-1' ? -1 : 1;
    }
}
