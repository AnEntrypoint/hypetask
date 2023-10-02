
const ipc = require('hyper-ipc-secure');
require('dotenv').config();
const runCall = require('hypeeval')
const init = (kp, node = ipc(), serverKey = node.getSub(kp, process.env.SERVERNAME), callKey = node.getSub(kp, process.env.IPCNAME)) => {
  node.lbserve(callKey, serverKey, process.env.IPCNAME, runCall);
  return node;
}
module.exports = init
