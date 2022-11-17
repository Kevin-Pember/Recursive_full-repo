const workerCreator = () => {
  let worker = new Worker('../../evalWorker.js');
  worker.onmessage = (event) => {
    let rtnObj = event.data
    if (rtnObj.type == 'posError') {
      report(rtnObj.mes, false)
      window.top.postMessage({ 'call': 'report', 'mes': rtnObj.mes, "meaning": false })
    } else if (rtnObj.type == 'posComp') {
      window.top.postMessage({ 'call': 'report', 'mes': rtnObj.mes, "meaning": true })
    }
  }
  return worker;
}
const calcWorker = workerCreator();
const callCalc = (arry) => new Promise((res, rej) => {
  const channel = new MessageChannel();
  channel.port1.onmessage = ({ data }) => {
    channel.port1.close();
    if (data.error) {
      rej(data.error);
    } else {
      res(data.result);
    }
  };

  calcWorker.postMessage(arry, [channel.port2]);
});
window.onmessage = function (e) {
  console.log(e)
  let valArry = e.data;
  let object = valArry
  if (object.call == 'init') {
    console.log('init called')
    let html;
    eval(object.code)
    console.log(object.code)
  }
}
