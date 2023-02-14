/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 16:52:25
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-10 10:32:14
 * @description: about
 * @author: chenbinfa
 */
import request from "@utils/request";

export default function main(ac1, ac2) {
	return request.post("/api/chainStateConsts/consts", { data: { ac1, ac2 } });
}
