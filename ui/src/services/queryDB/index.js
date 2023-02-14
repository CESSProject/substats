/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 17:56:56
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-10 10:28:43
 * @description: about
 * @author: chenbinfa
 */
import request from "@utils/request";

export default {
	list,
	dics,
	detail
};

function list(data) {
	return request.post("/api/dbcommon/list", { data });
}
function detail(data) {
	return request.post("/api/dbcommon/detail", { data });
}
function dics() {
	const data = {
		action: "list"
	};
	return request.post("/api/dics/list", { data });
}
