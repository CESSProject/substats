"use strict";
var url = require('url');
var querystring = require('querystring');


function urlParse(u) {
    try {
        let info = url.parse(u);
        let pathname = info.pathname;
        let query = info.query;
        let queryKV = querystring.parse(query);
        pathname = pathname.replace(new RegExp('/', "gm"), '&');
        pathname = pathname.replace(new RegExp('0_10_', "gm"), '');
        let queryPathnameKV = querystring.parse(pathname);
        if (queryPathnameKV) {
            for (let key in queryPathnameKV) {
                if (key && queryPathnameKV[key] && !queryKV[key]) {
                    queryKV[key] = queryPathnameKV[key];
                }
            }
        }
        return queryKV;
    }
    catch (e) {
        return null;
    }
}
module.exports = urlParse;