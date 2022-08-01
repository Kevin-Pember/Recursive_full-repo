onmessage = function(e){
    let valArry = e.data;
    let mainBody = valArry[0];
    let codeString = valArry[1];
    eval(codeString)
}