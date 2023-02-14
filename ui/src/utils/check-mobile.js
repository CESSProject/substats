/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-08-10 09:51:03
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-10 11:22:00
 * @description: about
 * @author: chenbinfa
 */
function isMobile() {
	let isMobile = false;
	if (
		navigator.userAgent.match(
			/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
		)
	) {
		// console.log('移动端');
		isMobile = true;
	}
	if (document.body.clientWidth < 800) {
		isMobile = true;
	}
	return isMobile;
}

export { isMobile };
