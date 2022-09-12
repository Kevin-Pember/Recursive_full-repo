let calcWorker = new Worker('../../evalWorker.js');
calcWorker.onmessage = (event) => {
  let rtnObj = event.data
  if (rtnObj.type == 'posError') {
    report(rtnObj.mes, false)
    window.top.postMessage({'call':'report','mes' : rtnObj.mes, "meaning": false})
  } else if (rtnObj.type == 'posComp') {
    window.top.postMessage({'call':'report','mes' : rtnObj.mes, "meaning": true})
  }
}
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
window.onmessage = function (e){
    let valArry = e.data;
    let object = valArry[0]
    if(object.call == 'init'){
        eval(object.code)
        if(typeof html !== 'undefined'){
            document.body.innerHTML == html;
        }
    }
}
