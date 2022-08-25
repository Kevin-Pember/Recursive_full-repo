let calcWorker = new Worker('evalWorker.js');

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
//let value = await callCalc(['calc', {'type':"solve", 'text':"4+4*7"}])
let array = ['calc', {'type':"solve", 'text':"gamma(4)"}];
//console.log(await callCalc(array));
callCalc(array).then(result => console.log(result))