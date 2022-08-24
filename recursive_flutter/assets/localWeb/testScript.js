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