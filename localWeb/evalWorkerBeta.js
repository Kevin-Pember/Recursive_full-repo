import Decimal from './packages/decimal.mjs';
console.log("Beta Worker Loaded");
let settings = { "version": 1, "oL": "auto", "degRad": true, "notation": "simple", "theme": "darkMode", "acc": "blue", "tC": 5, "tMin": -10, "tMax": 10, "gR": 100, "gMin": -10, "gMax": 10 };
let funcList = {
    list: [],
    getAngleConversion: function (type) {
        if (settings.degRad) {
            if (type == 'deg') {
                return new Decimal.acos(-1).div(new Decimal(180));
            } else if (type = "rad") {
                return new Decimal(180).div(Decimal.acos(-1));
            }
        } else {
            return new Decimal(1);
        }
    },
    createFunction: function () {
        let object = {};
        if (arguments[0] == "function") {
            object = new TextFunc(arguments[1], arguments[2], arguments[3]);
        } else if (arguments[0] == "method" && !arguments[1].includes('XMLHttpRequest')) {
            object = new HybridFunc(arguments[1], arguments[2]);
        }
        this.list.push(object);
        return object;
    },
    removeFunction: function (name) {
        this.list = this.list.filter(value => value.name != name)
    },
    getFunction: function (name){
        var largest = {size: 0};
        this.list.forEach(value => {
            if(name.length >= value.size && value.size > largest.size && name.includes(value.name)){
                largest = value;
            }
        })
        return largest.funcObject;
    }
};
class func {
    constructor(name) {
        this.name = name;
        this.size = name.length;
    }
}
class HybridFunc extends func {
    constructor(funcString) {
        if (typeof arguments[0] == "string"&& typeof arguments[1] == "function") {
            let name = arguments[0];
            super(name);
            this.mth = arguments[1];
            if(arguments[2]){
                this.inverse = arguments[2];
            }
        } else{
            let cutString = funcString;
            cutString = cutString.substring(cutString.indexOf("function") + 9)

            super(cutString.substring(0, cutString.indexOf("(")).trim());
            this.vars = cutString.substring(1, method.indexOf(")")).split(",").map((e) => {
                if (e != "") {
                    return e.trim()
                }
            })
            this.string = cutString.substring(cutString.indexOf("{"));
            this.full = funcString;

            let copyString = this.string;
            for (let i = this.vars.length - 1; i >= 0; i--) {
                copyString = copyString.substring(0, 1) + `var ${this.vars[i]} = array[${i}];` + copyString.substring(1);
            }
            copyString = `var ${this.name} = function (array)${copyString} \n return ${this.name};`;
            this.mth = Function(copyString)();
            if(arguments[1]){
                this.inverse = arguments[1];
            }
        }
        this.type = "method";
    }
    get funcObject() {
        return this
    }
    ParseValue(innerParse) {
        if (innerParse.find(elem => elem.type == "var")) {
            return false;
        } else {
            return new textTerm(this.mth(innerParse.map(elem => {
                if (elem.type == "term") {
                    return Number(elem.text)
                }
            })).toString())
        }
    }
}
class TextFunc extends func {
    constructor(name, func) {
        super(name);
        this.type = "function";
        this.ogFunc = func;
        this.funcParse = parseEquation(func);
        this.vars = varInEquat(func);
        if(arguments[2]){
            this.inverse = arguments[2];
        }

    }
    get funcObject() {
        return this
    }
    ParseValue(innerParse) {
        let argArray = [];
        if (!Array.isArray(innerParse)) {
            innerParse = [innerParse]
        }
        let findMethod = (e) => {
            return (e.subtype == "Comma")
        }
        let commaIndex = innerParse.findIndex(findMethod);
        while (commaIndex > -1) {
            argArray.push(innerParse.splice(0, commaIndex));
            innerParse.shift();
            commaIndex = innerParse.findIndex(findMethod);
        }
        argArray.push(innerParse);
        return combineParse(parseVars(this.funcParse, argArray));
    }
}
class RefFunc extends func {
    constructor(name, ref) {
        super(name);
        this.type = "ref";
        this.ref = ref;
        if(!(funcList.list.includes(this.ref))){
            funcList.list.push(this.ref);
        }
    }
    get FuncObject() {
        let refFunc = { ...ref.FuncObject };
        refFunc.name = this.name;
        refFunc.size = this.size;
    }
    ParseValue(innerParse) {
        return this.ref.ParseValue(innerParse);
    }
}
funcList.list.concat([
    new HybridFunc("sin", (arry) => {
        let input = new Decimal(arry[0]);
        return input.mul(funcList.getAngleConversion("deg")).sin().toString();
    }, "asin"),
    new RefFunc("arcsin", new HybridFunc("asin", (arry) => {
        let input = new Decimal(arry[0]);
        return input.asin().mul(funcList.getAngleConversion("rad")).toString();
    }, "sin")),
    new HybridFunc("cos", (arry) => {
        let input = new Decimal(arry[0]);
        return input.mul(funcList.getAngleConversion("deg")).cos().toString();
    }, "acos"),
    new RefFunc("arccos", new HybridFunc("acos", (arry) => {
        let input = new Decimal(arry[0]);
        return input.acos().mul(funcList.getAngleConversion("rad")).toString();
    }, "cos")),
    new HybridFunc("tan", (arry) => {
        let input = new Decimal(arry[0]);
        return input.mul(funcList.getAngleConversion("deg")).tan().toString();
    }, "atan"),
    new RefFunc("arctan", new HybridFunc("atan", (arry) => {
        let input = new Decimal(arry[0]);
        return input.atan().mul(funcList.getAngleConversion("rad")).toString();
    }, "tan")),
    new HybridFunc("csc", (arry) => {
        let input = new Decimal(arry[0]);
        return new Decimal(1).div(input.mul(funcList.getAngleConversion("deg")).sin()).toString();
    }, "acsc"),
    new RefFunc("arccsc", new HybridFunc("acsc", (arry) => {
        let input = new Decimal(arry[0]);
        return new Decimal(1).div(input).asin().mul(funcList.getAngleConversion("rad")).toString();
    }, "csc")),
    new HybridFunc("sec", (arry) => {
        let input = new Decimal(arry[0]);
        return new Decimal(1).div(input.mul(funcList.getAngleConversion("deg")).cos()).toString();
    }, "asec"),
    new RefFunc("arcsec", new HybridFunc("asec", (arry) => {
        let input = new Decimal(arry[0]);
        return new Decimal(1).div(input).acos().mul(funcList.getAngleConversion("rad")).toString();
    }, "sec")),
    new HybridFunc("cot", (arry) => {
        let input = new Decimal(arry[0]);
        return new Decimal(1).div(input.mul(funcList.getAngleConversion("deg")).tan()).toString();
    }, "acot"),
    new RefFunc("arccot", new HybridFunc("acot", (arry) => {
        let input = new Decimal(arry[0]);
        return new Decimal(1).div(input).atan().mul(funcList.getAngleConversion("rad")).toString();
    }, "cot")),
    new HybridFunc("abs", (arry) => {
        let input = new Decimal(arry[0]);
        return input.abs().toString();
    }),
    new HybridFunc("mod", (arry) => {
        let x = new Decimal(arry[0]);
        let y = new Decimal(arry[1]);
        return Decimal.mod(x, y).toString();
    }),
    new HybridFunc("sigma", (arry) => {
        let srt = arry[0]
        let end = arry[1]
        let equat = arry[2]
        let parse = parseEquation(equat)
        let vars = parse.filter(x => x.type == 'var')
        let value = new Decimal(0);
        if (vars.length == 1) {
            for (let i = srt; i <= end; i++) {
                value.plus(new Decimal(combineParse(parseVars(parse, [textTerm(i)]))))
            }
            return value.toString();
        }
    }),
    new HybridFunc("logB", (arry) => {
        let base = new Decimal(arry[0])
        let arg = new Decimal(arry[1])
        return Decimal.log(arg, base);
    }),
    new HybridFunc("pow", (arry) => {
        let base = new Decimal(arry[0])
        let arg = new Decimal(arry[1])
        return Decimal.pow(base, arg);
    })
]);
class parseTerm {
    constructor() {
        this.opCount = 0;
    }
}
class funcTerm extends parseTerm {
    constructor(func) {
        super();
        this.type = "func";
        this.text = func.name;
        this.funcStore = func;
    }
}
class parSec extends parseTerm {
    constructor(text) {
        super();
        this.type = "parSec";
        this.subtype = "ParStart";
        this.text = text;
        this.parse = parseEquation(text);
    }
}
class textTerm extends parseTerm {
    constructor(text) {
        super();
        this.type = "term";
        this.text = "" + text;
    }
}
class varTerm extends parseTerm {
    constructor(letter) {
        super();
        this.type = "var";
        this.subtype = "var";
        this.letter = letter;
    }
}
class opTerm extends parseTerm {
    constructor(opText) {
        super();
        this.type = "op";
        this.text = opText.charAt(0);
        this.typeIndex = ['+', '-', '*', '/', '!', '^', "√", '%', '(', ')', ',', "|"].indexOf(opText.charAt(0));
        this.subtype = ["Plus", "Minus", "Muti", "Div", 'factor', "Pow", "Sqrt", 'Percent', "ParStart", "ParEnd", 'Comma', "Abs"][this.typeIndex];
        this.group = ["add", "add", "muti", "muti", "muti", "pow", "pow", "muti", "par", "par", "non", "non"][this.typeIndex];
        this.groupIndex = [0, 0, 1, 1, 1, 2, 2, 1, 3, 3, 4, 4][this.typeIndex];
    }
}

Array.prototype.replaceAll = function (value, replacement) {
    let idxs = [];
    for (let i = 0; i < this.length; i++) {
        if (this[i] == value) {
            idxs.push(i)
        }
    }
    for (let idx of idxs) {
        this[idx] = replacement
    }
    return this;
};
String.prototype.indexOfAll = function (value) {
    let retArry = [];
    let lastIndex = 0;
    while (true) {
        let idx = this.indexOf(value, lastIndex);
        if (idx == -1) {
            break;
        }
        retArry.push(idx);
        lastIndex = idx + 1;
    }
    return retArry;
};
/*String.prototype.innerVar = function (tVar) {
    let testString = this;
    for (let func of funcList.list) {
        if (testString.includes(func.func)) {
            testString.replaceAll(func.func, "");
        }
    }
    if (testString.includes(tVar)) {
        return true;
    } else {
        return false;
    }
};*/
String.prototype.varIns = function (tVar) {
    let count = 0;
    let temp = this
    while (true) {
        if (temp.includes(tVar)) {
            temp = temp.substring(temp.indexOf(tVar) + tVar.length)
            count++;
        } else {
            break;
        }
    }
    return count;
}
String.prototype.hasVar = function () {
    if (varInEquat(this).length > 0) {
        return true
    } else {
        return false;
    }
}
String.prototype.findMatch = function (start, end) {
    let copyString = this;

    let matchIdx = -1;
    let direction = true;
    if (arguments[2] != undefined) {
        direction = arguments[2];
    }
    let fromIndex = direction ? 0 : copyString.length;
    while (true) {
        let startIndex = direction ? copyString.indexOf(start, fromIndex) : copyString.lastIndexOf(start, fromIndex);
        let endIndex = direction ? copyString.indexOf(end, fromIndex) : copyString.lastIndexOf(end, fromIndex);
        if (startIndex > -1 && endIndex > -1) {
            if (direction ? startIndex < endIndex : startIndex > endIndex) {
                fromIndex = direction ? endIndex + end.length : startIndex;
            } else {
                matchIdx = direction ? endIndex : startIndex + start.length;
                break;
            }
        } else if (direction ? endIndex > -1 : startIndex > -1) {
            matchIdx = direction ? endIndex : startIndex + start.length;
            break;
        } else if (startIndex == -1 && endIndex == -1) {
            matchIdx = direction ? this.length : 0;
            break;
        }
    }
    return matchIdx;
}
String.prototype.findCharMatch = function (char) {
    let direction = true;
    if (arguments[3] != undefined) {
        direction = arguments[3];
    }
    let indexes = this.indexOfAll(char);
    for (let i = direction ? 0 : indexes.length - 1; direction ? i < indexes.length : i >= 0; direction ? i++ : i--) {
        if (isOperator(direction ? this[indexes[i] - 1] : this[indexes[i] + 1])) {
            i++;
            continue;
        } else {
            return indexes[i];
        }
    }
    return direction ? this.length : 0;
}
const findTerm = function (equation) {
    let direction = true;
    let endIndex = 0;
    if (arguments[1] != undefined) {
        direction = arguments[1];
    }
    for (let i = direction ? 0 : equation.length - 1; direction ? i < equation.length : i >= 0; direction ? i++ : i--) {
        if (equation[i] == "(" || equation[i] == ")") {
            let nextIndex = direction ? equation.substring(i).findMatch("(", ")", direction) : equation.substring(0, i - 1).findMatch("(", ")", direction);
            if (nextIndex != -1) {
                i = nextIndex - 1;
                endIndex = i;
            }
        } else if (equation[i] == '+' || equation[i] == '-' || equation[i] == '×' || equation[i] == '<' || equation[i] == '>' || equation[i] == '*' || equation[i] == '÷' || equation[i] == '/' || equation[i] == '√' || equation[i] == '^' || equation[i] == '%' || equation[i] == '!' || equation[i] == ',' || equation[i] == '|') {
            endIndex = i;
            break;
        }
        endIndex = endIndex + (direction ? 1 : -1);
    }
    return direction ? equation.substring(0, endIndex) : equation.substring(endIndex + 1);
}
const backward = function (sub) {
    let outputSub = "";
    for (let i = 0; i <= sub.length - 1; i++) {
        if (sub.charAt(i) != '×' && sub.charAt(i) != '*' && sub.charAt(i) != '÷' && sub.charAt(i) != '/' && sub.charAt(i) != '√' && sub.charAt(i) != '²' && sub.charAt(i) != '^' && sub.charAt(i) != '(' && sub.charAt(i) != ')' && sub.charAt(i) != '%' && sub.charAt(i) != '!' && sub.charAt(i) != 'π' && sub.charAt(i) != ',' && sub.charAt(i) != '|') {
            if (i == sub.length - 1) {
                outputSub = sub.substring(0, i + 1);
                break;
            } else if (sub.charAt(i) == '+') {
                if (sub.charAt(i - 1) == 'E') {

                } else {
                    outputSub = sub.substring(0, i);
                    break;
                }
            } else if (sub.charAt(i) == '-') {
                if (i == 0) {

                } else if (sub.charAt(i - 1) == 'E') {

                } else {
                    outputSub = sub.substring(0, i);
                    break;
                }
            }
        } else if (i == 0) {
            outputSub = "";
            break;
        } else {
            outputSub = sub.substring(0, i);
            break;
        }
    }
    return outputSub;
}
const varInEquat = function (equation) {
    let varArray = [];
    for (let i = 0; i < equation.length; i++) {
        if (equation.charCodeAt(i) > 96 && equation.charCodeAt(i) < 123 || equation.charCodeAt(i) == 77) {
            if (isVar(equation.substring(i)) === 0) {
                if (varInList(varArray, equation.substring(i, i + 1)) == null) {
                    varArray.push(
                        {
                            "letter": equation.substring(i, i + 1),
                            "positions": [i]
                        }
                    );
                } else {
                    let func = varInList(varArray, equation.substring(i, i + 1));
                    func.positions.push(i);
                }
            } else {
                i += isVar(equation.substring(i)) - 1;
            }
        }
    }
    return varArray;
}
const numInEquat = function (equation) {
    let numArry = [];
    let currentNum = "";
    for (let i = 0; i < equation.length; i++) {
        if (!isNaN(equation[i])) {
            currentNum += equation[i];
        } else if (currentNum != "") {
            numArry.push(currentNum);
            currentNum = "";
        }
    }
    return numArry;
}
const parseTextTerm = function (text) {
    let retArray = [];
    let nums = numInEquat(text);
    let product = 1;
    for (let num of nums) {
        product *= num;
    }
    if (product != 1) {
        retArray.push(new textTerm(product));
        retArray.push(new opTerm("*"));
    }
    let varList = varInEquat(text);
    for (let varIn of varList) {
        retArray.push(new varTerm(varIn.letter));
        if (varIn.positions.length > 1) {
            retArray.push(new opTerm("^"));
            retArray.push(new textTerm(varIn.positions.length));
        }
        retArray.push(new opTerm("*"));
    }
    retArray.pop();
    return retArray;
}
const parInnerString = function (sub) {
    let direction = true;
    if (arguments[1] != undefined) {
        direction = arguments[1];
    }
    let endIdx = sub.findMatch("(", ")", direction);
    return direction ? sub.substring(0, endIdx) : sub.substring(endIdx);
}
const builtInFunc = function (equation) {
    equation = equation.replaceAll('×', '*');
    equation = equation.replaceAll('÷', '/');
    let indexValue = equation.indexOf("√");
    while (indexValue >= 0) {
        let root = "2";
        let from = indexValue;
        if (indexValue > 6 && equation.substring(indexValue - 6, indexValue) == "</sup>") {
            let matchSup = equation.substring(0, indexValue - 6).findMatch("<sup", "</sup>", false);
            root = findTerm(equation.substring(0, indexValue - 6), false);
            from = matchSup - 4;
        }

        let term = findTerm(equation.substring(indexValue + 1));
        let replacement = "(" + term + "^(1/" + root + "))";
        if (from != 0 && !isOperator(equation[from - 1])) {
            replacement = "*" + replacement;
        }
        equation = equation.substring(0, from) + replacement + equation.substring(indexValue + term.length + 1);
        indexValue = equation.indexOf("√");
    }
    indexValue = equation.indexOf("|");
    while (indexValue >= 0) {
        let matchEnd = equation.substring(indexValue + 1).findCharMatch("|", true) + indexValue;
        let replacement = "abs(" + equation.substring(indexValue + 1, matchEnd + 1) + ")";
        if (indexValue - 1 >= 0 && !isOperator(equation[indexValue - 1])) {
            replacement = "*" + replacement;
        }
        if (matchEnd + 2 <= equation.length && !isOperator(equation[matchEnd + 2])) {
            replacement = replacement + "*";
        }
        equation = equation.substring(0, indexValue) + replacement + equation.substring(matchEnd + 2);
        indexValue = equation.indexOf("|");
    }
    indexValue = equation.indexOf("<sup");
    while (indexValue >= 0) {
        let matchEnd = equation.substring(equation.indexOf(">", indexValue) + 1).findMatch("<sup", "</sup>") + indexValue + equation.substring(indexValue, equation.indexOf(">", indexValue) + 1).length;
        let term = findTerm(equation.substring(equation.indexOf(">", indexValue) + 1));
        equation = equation.substring(0, indexValue) + "^(" + term + ")" + equation.substring(matchEnd + 6);
        indexValue = equation.indexOf("<sup");
    }
    return equation;
}
const parseEquation = function (equation) {
    let equatParse = [];
    let cutLength = 0;
    while (true) {
        let cutString = 0;
        let currentSec = [];
        let termText = backward(equation);
        let currTerm;
        let currOp;
        let func;
        if (termText) {
            currTerm = new textTerm(termText);
            cutString += currTerm.text.length;
            currentSec.push(currTerm);
            func = funcList.getFunction(currTerm.text);
            if (func) {
                if (currTerm.text.replace(func.name, "").length != 0) {
                    currTerm.text = currTerm.text.replace(func.name, "")
                    currentSec.push(...[new opTerm("*"), new funcTerm(func)]);
                } else {
                    currentSec.shift();
                    currentSec.unshift(new funcTerm(func));
                }
            }
            if (varInEquat(currTerm.text).length != 0) {
                currentSec.shift();
                currentSec.unshift(...parseTextTerm(currTerm.text));
            }
        }
        if (equation.substring(cutString) != "") {
            currOp = new opTerm(equation.substring(cutString));
            if (currOp.subtype == "ParStart") {
                if (func == "" && currTerm != undefined) {
                    currentSec.splice(1, 0, new opTerm("*"));
                }
                let encap = parInnerString(equation.substring(cutString + 1));
                cutString += encap.length + 2;
                currentSec.push(new parSec(encap));
            } else {
                currentSec.push(currOp);
                cutString++;
            }
        }
        cutLength += cutString;
        equation = equation.substring(cutString);
        equatParse.push(...currentSec);
        if (equation.length == 0) {
            break;
        }
    }
    console.log(equatParse);
    return equatParse;
}
const inverseParse = function (targetParse, inverseParse){
    let targetVar
    if(arguments[2] != undefined){
        targetVar = arguments[2];
    }else{
        targetParse.find((element) => (element.type == "var"));
    }
    while(true){
        let first = targetParse.findIndex(element => element.type == "op");
        let last = targetParse.findLastIndex(element => element.type == "op");
        if(targetParse[last].groupIdx <= targetParse[first].groupIdx){

        }
    }
}
const combinable = function (index, parse) {
    let [termType, borderTerms, combineType] = [parse[index].groupIdx, [parse[index - 1], parse[index + 1]], -1];
    if (borderTerms[0].ignore != true && borderTerms[1].ignore != true && borderTerms[0].subtype != "var" && borderTerms[1].subtype != "var") {
        combineType = -2;
    } else if (borderTerms[1].ignore != true && borderTerms[1].subtype != "var" && (borderTerms[0].ignore == true || borderTerms[0].subtype == "var")) {
        let sameIdx = parse.findLastIndex((element, idx) => (element.groupIdx == termType && idx < index && element.ignore != true));
        let diffIdx = parse.findLastIndex((element, idx) => (element.groupIdx < termType && idx < index && element.ignore != true));
        if (sameIdx > diffIdx) {
            combineType = sameIdx;
        }
    }
    return combineType;
}
const combineParse = function (parse) {
    /* The object of this function is to go thorugh a function parse using a find method to exmaine various
    parts of the parse and combine them into a single term. If there is a variable in the way of the
    combination then it will be left alone and have an ignore tag added to it so that the function
    will move on to the next term.
    */
    let target;
    let ignoreIndex = -1;
    let targetIndex;
    let getFuncParse;
    let combineIdx;
    /*Parenthesis Secition************************************************/
    getFuncParse = (e, i) => {
        targetIndex = i;
        return (e.type == 'parSec' && e.ignore != true && i > ignoreIndex)
    };
    target = parse.find(getFuncParse);
    while (target) {
        let combinePar = combineParse(target.parse);
        if (parse[targetIndex - 1].type == "func") {
            let func = funcList.getFunction(parse[targetIndex - 1].text);
            parse.splice(targetIndex - 1, 2,func.ParseValue(combinePar))
        } else {
            if (Array.isArray(combinePar)) {
                target.ignore = true;
                target.parse = combinePar;
                ignoreIndex = targetIndex + 1;
            } else {
                parse.splice(targetIndex, 1, combinePar);
                ignoreIndex = targetIndex + 1;
            }
        }

        target = parse.find(getFuncParse);
    }
    console.log(parse)
    //end*******************************************************************
    ignoreIndex = 0;
    /*Powers Secition******************************************************/
    console.log("powersSection")
    getFuncParse = (e, i) => {
        targetIndex = i;
        return (e.group == 'pow' && e.ignore != true && i > ignoreIndex)
    }
    target = parse.find(getFuncParse);
    while (target) {
        combineIdx = combinable(targetIndex, parse);
        if (combineIdx == -2) {
            parse[targetIndex - 1].text = new Decimal(parse[targetIndex - 1].text).pow(Number(parse[targetIndex + 1].text)).toString();
            parse.splice(targetIndex, 2);
        } else {
            parse[targetIndex - 1].ignore = true;
            target.ignore = true;
            parse[targetIndex + 1].ignore = true;
            ignoreIndex = targetIndex + 2;
        }

        target = parse.find(getFuncParse);
    }
    //end*******************************************************************
    ignoreIndex = 0;
    /*Muti Secition********************************************************/
    console.log("mutiSection")
    console.log(parse)
    getFuncParse = (e, i) => {
        targetIndex = i;
        return (e.group == 'muti' && e.ignore != true && i > ignoreIndex)
    }
    target = parse.find(getFuncParse);
    while (target) {
        combineIdx = combinable(targetIndex, parse);
        console.log(combineIdx)
        if (combineIdx == -2) {
            console.log(parse[targetIndex - 1].text)
            if (target.subtype == 'Div') {
                parse[targetIndex - 1].text = new Decimal(parse[targetIndex - 1].text).div(Number(parse[targetIndex + 1].text)).toString();
            } else if (target.subtype == 'Muti') {
                parse[targetIndex - 1].text = new Decimal(parse[targetIndex - 1].text).times(Number(parse[targetIndex + 1].text)).toString();
            }
            parse.splice(targetIndex, 2);
        } else if (combineIdx > -1) {
            console.log(parse[targetIndex + 1])
            parse[combineIdx - 1].text = new Decimal(parse[combineIdx - 1].text).plus(Number(parse[targetIndex + 1].text)).toString();
            parse.splice(targetIndex, 2);
        } else {
            parse[targetIndex - 1].ignore = true;
            target.ignore = true;
            parse[targetIndex + 1].ignore = true;
            ignoreIndex = targetIndex + 2;
        }
        target = parse.find(getFuncParse);
    }
    //end*******************************************************************
    ignoreIndex = 0;
    /*Add Secition*********************************************************/
    console.log("addSection")
    getFuncParse = (e, i) => {
        targetIndex = i;
        return (e.group == 'add' && e.ignore != true && i > ignoreIndex)
    }
    target = parse.find(getFuncParse);
    while (target) {
        console.log("found an add")
        combineIdx = combinable(targetIndex, parse);
        console.log(target.subtype)
        if (combineIdx == -2) {
            if (target.subtype == 'Plus') {
                console.log(JSON.parse(JSON.stringify(parse)));
                parse[targetIndex - 1].text = new Decimal(parse[targetIndex - 1].text).plus(Number(parse[targetIndex + 1].text)).toString();
            } else if (target.subtype == 'Minus') {
                parse[targetIndex - 1].text = new Decimal(parse[targetIndex - 1].text).minus(Number(parse[targetIndex + 1].text)).toString();
            }
            parse.splice(targetIndex, 2);
        } else if (combineIdx > -1) {
            parse[combineIdx - 1].text = new Decimal(parse[combineIdx - 1].text).plus(Number(parse[targetIndex + 1].text)).toString();
            parse.splice(targetIndex, 2);
        } else {
            parse[targetIndex - 1].ignore = true;
            target.ignore = true;
            parse[targetIndex + 1].ignore = true;
            ignoreIndex = targetIndex + 2;
        }
        target = parse.find(getFuncParse);
    }
    //end*******************************************************************
    console.log(parse)
    if (parse.length == 1) {
        return parse[0]
    } else {
        parse.complete = false;
        return parse
    }
}
const varInList = function (list, varLetter) {
    for (let item of list) {
        if (item.letter == varLetter) {
            return item;
        }
    }
    return null;
}
const parseVars = function (parse, varArray) {
    console.log(parse)
    for (let varDef of varArray) {
        let varIndex = parse.findIndex((element) => (element.subtype == "var" && element.text == varDef.name));
        if (varIndex > -1) {
            parse.splice(varIndex, 1, ...Array.isArray(varDef) ? varDef : [varDef]);
        }
    }
    return parse;
}
//end CombineMethods*******************************************************************
const isVar = function (entry) {
    let func = funcList.getFunction(entry);
    if (func) {
        return func.size;
    } else {
        return 0;
    }
}
const cleanObject = function (object) {
    return JSON.parse(JSON.stringify(object));
}
console.log(funcList.list)
console.log("done loading beta worker");
console.log(funcList.getFunction("asin"))
console.log(parseEquation(builtInFunc("<sup>42</sup>√23")))
console.log(funcList.createFunction("function", 'testor', "x*5+u"))
console.log(funcList.getFunction("testor"))
console.log(combineParse(parseEquation("testor(23,3)*43")))