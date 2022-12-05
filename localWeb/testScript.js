let calcWorker = new Worker('evalWorker.js');
calcWorker.onmessage = (event) => {
	let rtnObj =  event.data
	if(rtnObj.type == 'posError'){
		console.log("%c"+rtnObj.mes, "color: red;")
	}
} 
const callCalc = (arry) => new Promise((res, rej) => {
	const channel = new MessageChannel(); 

	channel.port1.onmessage = ({data}) => {
		channel.port1.close();
		if (data.error) {
			rej(data.error);
		}else {
			res(data.result);
		}
	};

	calcWorker.postMessage(arry, [channel.port2]);
});
let array = ['calc', { 'type': 'points', 'target': 'table', 'text': 'Æ' }];
console.log(callCalc(array));
callCalc(array).then(result => console.log(result))