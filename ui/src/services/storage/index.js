/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 17:56:56
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-10 10:32:29
 * @description: about
 * @author: chenbinfa
 */
import request from "@utils/request";

export default function main(data) {
	return request.post("/api/storage/query", { data });
}
