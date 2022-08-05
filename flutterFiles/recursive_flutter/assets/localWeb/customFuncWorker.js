let elemDef = undefined;
onmessage = function (e) {
    let valArry = e.data;

    if (valArry[0] == "init") {
        let mainBody = valArry[1];
        let codeString = valArry[2];
        eval(codeString);
    }else if (valArry[0] == 'newElem'){
        elemDef = valArry[1];
    }else if (valArry[0] == "test"){
        console.log('Hello fuck wit')
    }
};
function createElement(tag) {
    postMessage(["createElement", tag]);
}

