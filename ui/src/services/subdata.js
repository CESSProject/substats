/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-12 11:21:36
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-16 17:29:46
 * @description: about
 * @author: chenbinfa
 */
const wsAPI = process.env.REACT_APP_BASE_WS + "";
let socket = null;
let timeout = null;
const events = [];

export default {
	addEvent,
	removeEvent
};

function connect() {
	if (!socket) {
		socket = new WebSocket(wsAPI);
		socket.addEventListener("open", function (event) {
			console.log("socket is open");
			clearInterval(timeout);
		});
		socket.addEventListener("close", function (event) {
			console.log("socket is close");
			socket = null;
			timeout = setTimeout(function () {
				try {
					console.log("try connect socket");
					connect();
				} catch (e) {
					console.log(e);
				}
			}, 2000);
		});
		socket.addEventListener("message", function (event) {
			// console.log("Message from server", event.data);
			let json = JSON.parse(event.data);
			if (json.msg != "ok") {
				return console.error("json.msg", json.msg);
			}
			const elist = events.filter(t => t.name == json.apiName && t.e);
			if (elist.length == 0) {
				// console.log("event not sub ", json.apiName);
				return;
			}
			for (let o of elist) {
				try {
					o.e(json.data);
				} catch (e) {
					console.log(e);
				}
			}
		});
	}
}

function addEvent(e) {
	let i = events.findIndex(t => t.id == e.id);
	if (i > -1) {
		events.splice(i, 1);
	}
	events.push(e);
	connect();
}
function removeEvent(id) {
	const i = events.findIndex(t => t.id == id);
	if (i > -1) {
		events.splice(i, 1);
		console.log("remove event complect ", id, " events.length", events.length);
	}
}
