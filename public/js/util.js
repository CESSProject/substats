function timestr(fmt, time) {
  var now = time ? new Date(time) : new Date();
  var o = {
    "M+": now.getMonth() + 1,
    "d+": now.getDate(),
    "h+": now.getHours(),
    "m+": now.getMinutes(),
    "s+": now.getSeconds(),
    "q+": Math.floor((now.getMonth() + 3) / 3),
    S: now.getMilliseconds(),
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (now.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
}
const ajax = {
  post: function (url, params = {}) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(params),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.msg == "unlogin") {
            return (window.location.href = "/login.html?unlogin");
          }
          resolve(data);
        })
        .catch((error) => {
          console.log(error.msg);
          reject(error);
        });
    });
  },
};
