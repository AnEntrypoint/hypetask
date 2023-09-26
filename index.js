
const ipc = require('hyper-ipc-secure');
const goodbye = require('graceful-goodbye');
require('dotenv').config();

import ev from './eval.js'
const runCall = async (index, calls, input = {}, pk, ipcCall, refresh) => {
  console.log('run call')
    const call = calls[index];
    call.stdout = '';
    call.stderr = '';
    console.log('calling before')
    const before = (await ev(`const console = {log:(...params)=>{api('log', JSON.stringify(params))}}; let params = ${JSON.stringify(paramsWithInput)};${call.before};params`));
    console.log(before);
    call.stdout += before.stdout||'';
    const out = await ipcCall(pk, call.name, before.value);
    call.stdout += out.stdout||'';
    call.stderr += out.stderr||'';
    delete out.stdout;
    delete out.stderr;
    const after = (await ev(`const console = {log:(...params)=>{api('log', JSON.stringify(params))}}; let out = ${JSON.stringify(out)};${call.after};out`));
    const afterOut = after.value;
    call.stdout += after.stdout||'';
    call.result = JSON.stringify(afterOut, null, 2)
    refresh(calls);
    if (call.output.length) {
      for (let output of call.output) {
        await runCall(output.split("-")[1], calls, out, pk, ipcCall, refresh);
      }
    }
    return calls
  };
const init = (kp)=>{
    const node = ipc();
    const serverKey = node.getSub(kp, process.env.SERVERNAME);
    const callKey = node.getSub(kp, process.env.IPCNAME);
  
    node.lbserve(runCall, serverKey,process.env.IPCNAME, webhook);
    goodbye(node.destroy)
    return node;
}
export default init;