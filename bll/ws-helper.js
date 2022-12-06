function send(way, action, data) {
  const clientList = global.wsClientList;
  if (!clientList || clientList.length == 0) {
    console.log("ws client list is empty.");
    return;
  }
  json = JSON.stringify({ way, action, data });
  clientList.forEach((c) => {
    try {
      c.send(json);
      //   console.log(`sended data ${json}`);
    } catch (e) {
      console.log(e);
    }
  });
}
module.exports = {
  send,
};
