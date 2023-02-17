const axios = require("axios");

async function req(url, data) {
  let res = "";
  if (data) {
    res = await axios.post(url, data);
  } else {
    res = await axios.get(url);
  }
  const str = res.data;
  if (typeof str == "string") {
    str = JSON.parse(str);
  }
  return str;
}
module.exports = {
  get: req,
  post: req,
};