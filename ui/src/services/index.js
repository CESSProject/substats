/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 11:21:36
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-10 10:28:16
 * @description: about
 * @author: chenbinfa
 */
import { request } from "@/utils/request";

export default function login(data) {
	return request.post("/user/authentication/login", { data });
}
