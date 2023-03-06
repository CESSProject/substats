/*
 * @description: 服务请求公共方法
 * @author: Jack Chen @懒人码农
 * @Date: 2022-04-24 10:01:40
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-10 10:19:16
 */

import qs from "qs";
import _ from "lodash";

const baseUrl = process.env.REACT_APP_BASE_API + "";
const request = {
  /**
   * get请求
   * @param url
   * @param options
   * @returns {Promise<void>}
   */
  get: async (
    url,
    options = {
      method: "get",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    }
  ) => {
    options = _.assign(
      {
        method: "get",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      },
      options
    );
    url =
      url +
      "?" +
      qs.stringify(options.data, { encodeValuesOnly: true }) +
      "&" +
      new Date().getTime();
    if (localStorage.getItem("token")) {
      options.headers["token"] = localStorage.getItem("token");
    }
    return ajax(url, options);
  },
  /**
   * post请求
   * @param url
   * @param options
   * @returns {Promise<void>}
   */
  post: async (url, options = { method: "post" }) => {
    options.method = "post";
    if (!options.headers) {
      options.headers = { "Content-Type": "application/json" };
    }
    if (options.headers["Content-Type"] === "multipart/form-data") {
      options.body = options.data;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.data);
    }
    if (localStorage.getItem("token")) {
      options.headers["token"] = localStorage.getItem("token");
    }
    // console.log("options", options);
    return ajax(url, options);
  },
};

function ajax(url, options = {}) {
  url = baseUrl + url;
  if (!options.method) options.method = "get";
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export default request;
