#! /usr/bin/env node
const ipc = require('hyper-ipc-secure')
const runCall = require('./index.js');
const init = (
        node = ipc(),
        serializedServerKey = JSON.parse(Buffer.from(process.env.SERVERKEY, 'hex')),
        serializedCallKey = JSON.parse(Buffer.from(process.env.CALLKEY, 'hex'))
    ) => {
    const serverKey = serializedServerKey
    serverKey.publicKey = Buffer.from(serverKey.publicKey.data);
    serverKey.scalar = Buffer.from(serverKey.scalar.data);
    const callKey =serializedCallKey
    callKey.publicKey = Buffer.from(callKey.publicKey.data);
    callKey.scalar = Buffer.from(callKey.scalar.data);
    node.lbserve(callKey, serverKey, process.env.IPCNAME, runCall)
    return node
}
init()
