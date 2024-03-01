import Decimal from './packages/decimal.mjs';
console.log("Beta Worker Loaded");

let instance = {
    settings: { "version": 1, "oL": "auto", "degRad": true, "notation": "simple", "theme": "darkMode", "acc": "blue", "tC": 5, "tMin": -10, "tMax": 10, "gR": 100, "gMin": -10, "gMax": 10 },
}

//Method Extensions
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

//General Helper Functions

const varInEquat = function (equation) {
    let varArray = new Map();
    for (let i = 0; i < equation.length; i++) {
        if (equation.charCodeAt(i) > 96 && equation.charCodeAt(i) < 123 || equation.charCodeAt(i) == 77) {
            let isFunc = funcList.getFunction(equation.substring(i))
            console.log(isFunc)
            if (isFunc === 0) {
                if (varArray.get(equation.substring(i, i + 1)) == null) {
                    varArray.set(equation.substring(i, i + 1),{"positions": [i]});
                } else {
                    varArray.get(equation.substring(i, i + 1)).positions.push(i);
                }
            } else {
                i += isFunc - 1;
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
const getParseVars = function (parse) {
    let varList = [];
    parse.forEach(item => {
        if (item.subtype == 'var') {
            varList.push(item.text);
        } else if (item.type == "parSec") {
            varList.concat(getParseVars(item.parse))
        }
    });
    return varList;
}
const cleanObject = function (object) {
    return JSON.parse(JSON.stringify(object));
}


//Preprocessing Methods and helpers
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

//Custom Functions, Classes and Methods
let operators = new Map([
    ["+" , (object)=> {
        object.inverse = "-";
        object.subtype = "Plus";
        object.groupIdx = 0;
    }],
    ["-", (object)=> {
        object.inverse = "+";
        object.subtype = "Minus";
        object.groupIdx = 0;
    }],
    ["*", (object)=> {
        object.inverse = "/";
        object.subtype = "Muti";
        object.groupIdx = 1;
    }],
    ["/", (object)=> {
        object.inverse = "*";
        object.subtype = "Div";
        object.groupIdx = 1;
    }],
    ["!", (object)=> {
        object.inverse = "!";
        object.subtype = "factor";
        object.groupIdx = 1;
    }],
    ["^", (object)=> {
        object.inverse = "^";
        object.subtype = "Pow";
        object.groupIdx = 2;
    }],
    ["√", (object)=> {
        object.inverse = "√";
        object.subtype = "Sqrt";
        object.groupIdx = 2;
    }],
    ["%", (object)=> {
        object.inverse = "%";
        object.subtype = "Percent";
        object.groupIdx = 1;
    }],
    ["(", (object)=> {
        object.inverse = ")";
        object.subtype = "ParStart";
        object.groupIdx = 3;
    }],
    [")", (object)=> {
        object.inverse = "(";
        object.subtype = "ParEnd";
        object.groupIdx = 3;
    }],
    [",", (object)=> {
        object.inverse = ",";
        object.subtype = "Comma";
        object.groupIdx = -1;
    }],
    ["|", (object)=> {
        object.inverse = "|";
        object.subtype = "Abs";
        object.groupIdx = -1;
    }],
    ["=", (object)=> {
        object.inverse = "=";
        object.subtype = "Equals";
        object.groupIdx = -1;
        object.calcIndicator = true;
    }],
    ["<", (object)=> {
        object.inverse = ">";
        object.subtype = "LessThan";
        object.groupIdx = -1;
        object.calcIndicator = true;
    }],
    [">", (object)=> {
        object.inverse = "<";
        object.subtype = "GreaterThan";
        object.groupIdx = -1;
        object.calcIndicator = true;
    }],
    ["≤", (object)=> {
        object.inverse = "≥";
        object.subtype = "LessThanEqual";
        object.groupIdx = -1;
        object.calcIndicator = true;
    }],
    ["≥", (object)=> {
        object.inverse = "≤";
        object.subtype = "GreaterThanEqual";
        object.groupIdx = -1;
        object.calcIndicator = true;
    }]
]);
let funcList = {
    list: [],
    getAngleConversion: function (type) {
        if (instance.settings.degRad) {
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
    getFunction: function (name) {
        var largest = { size: 0 };
        this.list.forEach(value => {
            if (name.length >= value.size && value.size > largest.size && name.includes(value.name)) {
                largest = value;
            }
        })
        return largest.funcObject ? largest.funcObject : 0;
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
        if (typeof arguments[0] == "string" && typeof arguments[1] == "function") {
            let name = arguments[0];
            super(name);
            this.mth = arguments[1];
            if (arguments[2]) {
                this.inverse = arguments[2];
            }
        } else {
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
            if (arguments[1]) {
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
        this.vars = this.funcParse.vars;
        if (arguments[2]) {
            this.inverse = arguments[2];
        }

    }
    get funcObject() {
        return this
    }
    ParseValue(innerParse) {
        let parsedInner = parseEquation(innerParse).a;
        let argArray = cleanObject(this.funcParse.vars);
        //let findMethod = 
        let commaIndex = 0;
        while (commaIndex > -1) {
            commaIndex = parsedInner.findIndex((e) => {
                return (e.subtype == "Comma")
            });
            argArray.push(parsedInner.splice(0, commaIndex));
            parsedInner.shift();
        }
        argArray.push(parsedInner);
        return combineParse(setVarEquat(this.funcParse.a, argArray));
    }
}
class RefFunc extends func {
    constructor(name, ref) {
        super(name);
        this.type = "ref";
        this.ref = ref;
        if (!(funcList.list.includes(this.ref))) {
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
const parseVars = function (parse, varArray) {
    for (let varDef of varArray) {
        let varIndex = parse.findIndex((element) => (element.type == "var" && element.text == varDef.name));
        if (varIndex > -1) {
            parse.splice(varIndex, 1, ...Array.isArray(varDef) ? varDef : [varDef]);
        }
    }
    return parse;
}
funcList.list.concat([
    new HybridFunc("sin", (arry) => {
        let input = new Decimal(arry[0]);
        let convertor = funcList.getAngleConversion(arguments[1] ? arguments[1] : "deg");
        return input.mul(convertor).sin().toString();
    }, "asin"),
    new RefFunc("arcsin", new HybridFunc("asin", (arry) => {
        let input = new Decimal(arry[0]);
        let convertor = funcList.getAngleConversion(arguments[1] ? arguments[1] : "deg");
        return input.asin().mul(convertor).toString();
    }, "sin")),
    new HybridFunc("cos", (arry) => {
        let input = new Decimal(arry[0]);
        let convertor = funcList.getAngleConversion(arguments[1] ? arguments[1] : "deg");
        return input.mul(convertor).cos().toString();
    }, "acos"),
    new RefFunc("arccos", new HybridFunc("acos", (arry) => {
        let input = new Decimal(arry[0]);
        let convertor = funcList.getAngleConversion(arguments[1] ? arguments[1] : "rad");
        return input.acos().mul(convertor).toString();
    }, "cos")),
    new HybridFunc("tan", (arry) => {
        let input = new Decimal(arry[0]);
        let convertor = funcList.getAngleConversion(arguments[1] ? arguments[1] : "deg");
        return input.mul(convertor).tan().toString();
    }, "atan"),
    new RefFunc("arctan", new HybridFunc("atan", (arry) => {
        let input = new Decimal(arry[0]);
        let convertor = funcList.getAngleConversion(arguments[1] ? arguments[1] : "rad");
        return input.atan().mul(convertor).toString();
    }, "tan")),
    new HybridFunc("csc", (arry) => {
        let input = new Decimal(arry[0]);
        let convertor = funcList.getAngleConversion(arguments[1] ? arguments[1] : "deg");
        return new Decimal(1).div(input.mul(convertor).sin()).toString();
    }, "acsc"),
    new RefFunc("arccsc", new HybridFunc("acsc", (arry) => {
        let input = new Decimal(arry[0]);
        let convertor = funcList.getAngleConversion(arguments[1] ? arguments[1] : "rad");
        return new Decimal(1).div(input).asin().mul(convertor).toString();
    }, "csc")),
    new HybridFunc("sec", (arry) => {
        let input = new Decimal(arry[0]);
        let convertor = funcList.getAngleConversion(arguments[1] ? arguments[1] : "deg");
        return new Decimal(1).div(input.mul(convertor).cos()).toString();
    }, "asec"),
    new RefFunc("arcsec", new HybridFunc("asec", (arry) => {
        let input = new Decimal(arry[0]);
        let convertor = funcList.getAngleConversion(arguments[1] ? arguments[1] : "rad");
        return new Decimal(1).div(input).acos().mul(convertor).toString();
    }, "sec")),
    new HybridFunc("cot", (arry) => {
        let input = new Decimal(arry[0]);
        let convertor = funcList.getAngleConversion(arguments[1] ? arguments[1] : "deg");
        return new Decimal(1).div(input.mul(convertor).tan()).toString();
    }, "acot"),
    new RefFunc("arccot", new HybridFunc("acot", (arry) => {
        let input = new Decimal(arry[0]);
        let convertor = funcList.getAngleConversion(arguments[1] ? arguments[1] : "deg");
        return new Decimal(1).div(input).atan().mul(convertor).toString();
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

//Parse Classes and Methods
class Parse {
    constructor() {
        this.a = [];
        this.type = "test"
        this.indicator;
        this.vars = []
    }
}
class parseTerm {
    constructor() {
        this.opCount = 0;
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
    constructor(letter,value) {
        super();
        this.type = "var";
        this.letter = letter;
        this.value = value;
        this.powId = {};
        this.mutiId = {};
    }
}
class opTerm extends parseTerm {
    constructor(opText) {
        super();
        this.type = "op";
        this.setVal(opText.charAt(0));
    }
    setInverse() {
        this.setVal(this.inverse);
    }
    setVal(text) {
        this.text = text;
        operators.get(text)(this)
    };
}
const backward = function (sub) {
    let outputSub = "";
    for (let i = 0; i <= sub.length - 1; i++) {
        if (!operators.get(sub.charAt(i))){//sub.charAt(i) != '×' && sub.charAt(i) != '*' && sub.charAt(i) != '÷' && sub.charAt(i) != '/' && sub.charAt(i) != '√' && sub.charAt(i) != '²' && sub.charAt(i) != '^' && sub.charAt(i) != '(' && sub.charAt(i) != ')' && sub.charAt(i) != '%' && sub.charAt(i) != '!' && sub.charAt(i) != 'π' && sub.charAt(i) != ',' && sub.charAt(i) != '|' && sub.charAt(i) != '=') {
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
const parInnerString = function (sub) {
    let direction = true;
    if (arguments[1] != undefined) {
        direction = arguments[1];
    }
    let endIdx = sub.findMatch("(", ")", direction);
    return direction ? sub.substring(0, endIdx) : sub.substring(endIdx);
}
const parseEquation = function (equation) {
    let equatParse = new Parse();
    let cutLength = 0;
    while (true) {
        let cutString = 0, 
        currentSec = [],
        termText = backward(equation),
        currTerm,
        currOp,
        func;
        if (termText) {
            currTerm = new textTerm(termText);
            cutString += currTerm.text.length;
            currentSec.push(currTerm);
            func = funcList.getFunction(currTerm.text);
            if (func) {
                if (currTerm.text.replace(func.name, "").length != 0) {
                    currTerm.text = currTerm.text.replace(func.name, "")
                } else {
                    currentSec.shift();
                }
            }
            let varList = varInEquat(currTerm.text)
            if (varList.size != 0) {
                currentSec.shift();
                
                let retArray = [],
                nums = numInEquat(currTerm.text),
                product = 1,
                newVar;

                for (let num of nums) {
                    product *= num;
                }
                if (product != 1) {
                    retArray.push(new textTerm(product));
                    retArray.push(new opTerm("*"));
                }
                for (let varIn of varList) {
                    newVar = new varTerm(varIn[0])
                    retArray.push(newVar);
                    equatParse.vars.push(newVar)
                    if (varIn[1].positions.length > 1) {
                        retArray.push(new opTerm("^"));
                        retArray.push(new textTerm(varIn[1].positions.length));
                    }
                    retArray.push(new opTerm("*"));
                }
                retArray.pop();
                currentSec.unshift(...retArray);
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
                let parSection = new parSec(encap);
                if (func) {
                    parSection.func = func;
                }
                currentSec.push(parSection);
            } else {
                if(currOp.calcIndicator){
                    equatParse.indicator = currOp
                }
                currentSec.push(currOp);
                cutString++;
            }
        }
        cutLength += cutString;
        equation = equation.substring(cutString);
        equatParse.a.push(...currentSec);
        if (equation.length == 0) {
            break;
        }
    }
    return equatParse;
}
const inverseParse = function (targetParse, inverseParse, targetElem) {
    let targetVar
    let ignoreElem = targetParse[targetElem];
    let first = 0;
    let last = 0;
    let targetIdx = 0;
    let firstLast = false;
    if (arguments[2] != undefined) {
        targetVar = arguments[2];
    } else {
        targetVar = targetParse.find((element) => (element.type == "var"));
    }
    let iter = 0;
    while (true) {
        if (targetParse.length == 1) {
            if (targetParse[0].type == "parSec") {
                targetParse = targetParse[0].parse;
            } else {
                break;
            }
        }
        let first = targetParse.findIndex(element => element.type == "op");
        let last = targetParse.findLastIndex(element => element.type == "op");

        if (targetParse[last].groupIdx <= targetParse[first].groupIdx) {
            targetIdx = last;
            firstLast = false;
        } else {
            targetIdx = first;
            firstLast = true;
        }
        if (targetIdx - 1 == targetElem) {
            firstLast = true;
        } else if (targetIdx + 1 == targetElem) {
            firstLast = false;
        }
        if (targetParse[targetIdx - 1].type == "parSec" && targetParse[targetIdx - 1].type == "var" && targetParse[targetIdx + 1].type != "var" && targetParse[targetIdx + 1].type != "parSec") {
            inverseParse = inverseParse.concat([targetParse[targetIdx], targetParse[targetIdx + 1]]);
            targetParse.splice(targetIdx, 2);
        } else if (targetParse[targetIdx + 1].type == "parSec" && targetParse[targetIdx + 1].type == "var" && targetParse[targetIdx - 1].type != "var" && targetParse[targetIdx - 1].type != "parSec") {
            inverseParse = inverseParse.concat([targetParse[targetIdx], targetParse[targetIdx - 1]]);
            targetParse.splice(targetIdx - 1, 2);
        } else {
            targetParse[targetIdx].setInverse();
            if (firstLast) {
                inverseParse = inverseParse.concat([targetParse[targetIdx], targetParse[targetIdx + 1]]);
                targetParse.splice(targetIdx, 2);
            } else {
                inverseParse = inverseParse.concat([targetParse[targetIdx], targetParse[targetIdx - 1]]);
                targetParse.splice(targetIdx - 1, 2);
            }
        }
        iter++;
        if (iter > 100) {
            break;
        }

    }
    return inverseParse;
}
const combinable = function (index, parse) {
    let [borderTerms, combineType] = [[parse[index - 1], parse[index + 1]], -2];
    if (borderTerms[0].ignore == true || borderTerms[1].ignore == true) {
        combineType = -1;
    } else if (parse[index].groupIndex > 0 && (borderTerms[0].type == "var" || borderTerms[1].type == "var")) {
        combineType = -1;
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
        if (target.func) {
            parse.splice(targetIndex, 1, target.func.ParseValue(combinePar))
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
    //end*******************************************************************
    ignoreIndex = 0;
    /*Powers Secition******************************************************/
    getFuncParse = (e, i) => {
        targetIndex = i;
        return (e.groupIdx == 3 && e.ignore != true && i > ignoreIndex)
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
    getFuncParse = (e, i) => {
        targetIndex = i;
        return (e.groupIdx == 2 && e.ignore != true && i > ignoreIndex)
    }
    target = parse.find(getFuncParse);
    while (target) {
        combineIdx = combinable(targetIndex, parse);
        if (combineIdx == -2) {
            if (target.subtype == 'Div') {
                parse[targetIndex - 1].text = new Decimal(parse[targetIndex - 1].text).div(Number(parse[targetIndex + 1].text)).toString();
            } else if (target.subtype == 'Muti') {
                parse[targetIndex - 1].text = new Decimal(parse[targetIndex - 1].text).times(Number(parse[targetIndex + 1].text)).toString();
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
    ignoreIndex = 0;
    /*Add Secition*********************************************************/
    getFuncParse = (e, i) => {
        targetIndex = i;
        return (e.groupIdx == 1 && e.ignore != true && i > ignoreIndex)
    }
    target = parse.find(getFuncParse);
    while (target) {
        combineIdx = combinable(targetIndex, parse);
        if (combineIdx == -2) {
            if (target.subtype == 'Plus') {
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
    if (parse.length == 1) {
        return parse[0]
    } else {
        parse.complete = false;
        return parse
    }
}

//Solve Environment, Classes and Methods
const fullSolver = function (equation) {

    /*let parsedEquat = parseEquation(builtInFunc(equation));
    if (hasEqual > -1) {

    } else {
        return combineParse(parsedEquat.a);
    }*/
    let indicator = equation.a.find((elem) => elem.calcIndicator == true)
    if(equation.defVars.length == 1){
        
    }
}
const setVarEquat = function (equation, varList) {
    let setEquation;
    
    for (let data in varList) {
        if (data.value != undefined) {
            
            setEquation = equation.map((elem) => {
                if (elem.type == "var" && elem.letter == data.letter) {
                    elem.text = data.value;
                    return elem;
                } else {
                    return elem;
                }
            })
        }
    }
    return setEquation;
}
class SolveEnv {
    constructor(object) {
        this.id = object.id
        this.vars = [];
        this.envSettings = {
            "gMin": instance.settings.gMin,
            "gMax": instance.settings.gMax,
            "degRad": instance.settings.degRad
        };
    }
    calc(equation) {
        return fullSolver(setVarEquat(equation, this.vars))
    }
    calcArray(type, equation) {
        if (type == "graph" || type == "table") {
            let solvableEquat = setVarEquat(equation, this.vars);
            if (type == "graph") {
                return { "points": calculatePoints(solvableEquat, this.envSettings.gMin, this.envSettings.gMax, settings.gR, settings), "extrema": calculateExtrema(setVarEquat(equation, this.vars)) }
            } else {
                return calculatePoints(solvableEquat, instance.settings.tMin, instance.settings.tMax, instance.settings.tC, instance.settings)
            }
        } else if (type = "array") {
            let retArray = [];
            for (let equat of equation) {
                let solvableEquat = setVarEquat(equat, this.vars);
                let single;
                try {
                    single = this.calc(solvableEquat, this.vars)
                } catch (e) {
                    single = "error"
                }
                retArray.push(single)
            }
            return retArray;
        }
    }
    setVar(target, value) {
        let varDef = this.vars.find(elem => elem.letter == target);
        if (!varDef) {
            this.vars.push({ "letter": target, "value": value })
            varDef = this.vars[this.vars.length - 1]
        }
        varDef.value = value;
    }
    getParsedEquation() {
        if (this.isFunc) {
            let funcMap = this.vars.map(val => {
                if (val.value != undefined && val.value != "") {
                    return `(${val.value})`
                } else {
                    return val.letter
                }
            })
            if (this.func.type == "method") {
                return `${this.func.func}(${funcMap.join(",")})`
            } else {
                return combineFuncParse([...this.func.funcParse], funcMap)
            }

        } else {
            return setVarEquat(this.equation, this.vars, false);
        }
    }
    
    isCalculable(equation) {
        //console.log(typeof equation)
        //let equatVars = varInEquat(equation)
        let undefVars = this.vars.filter(elem => elem.value == undefined || elem.value == "")
        let hasEqual = equation.includes('=');
        if (undefVars.length == 1) {
            if (!hasEqual) {
                if (this.target == "graph" || this.target == "table") {
                    return "r"
                } else {
                    return `cant`
                }
            }
        } else if (undefVars.length == 0) {
            if (hasEqual) {
                return "dS"
            } else {
                return "r"
            }
        } else {
            return "cant"
        }

    }
    clearVars() {
        this.vars = [];
    }
}
class StaticEnv extends SolveEnv {
    constructor(object) {
        super(object)
        this.envType = "static"
        this.id = object.id

        this.equation = parseEquation(object.equation);
        if (object.isFunc) {
            this.func = getFuncByName(this.id);
            this.isFunc = true;
            this.vars = this.func.vars;
        } else {
            this.isFunc = false;
            this.vars = this.equation.vars;
        }
        this.getUndefinedVars();
    }
    calc() {
        return super.calc(this.equation, this.vars);
    }
    changeEquation(equation) {
        this.equation = parseEquation(equation)
        this.vars = this.equation.vars;
        this.checkCalculable();
    }
    setVar(target, value) {
        super.setVar(target, value);
        return this.checkCalculable();
    }
    getData(type) {

    }
    //Still working on rewriting methods don't know if getUndef
}
class DynamicEnv extends SolveEnv {
    constructor(object) {
        super(object)
        this.type = "dynamic"
        this.target = object.target
        if (this.target == "graph") {

        }
    }
    calcArray(arry) {
        for (let item of arry) {

        }
    }
    isVar(equation) {
        let equatVars = varInEquat(equation)
        let defVars = this.vars.filter(elem => elem.value != undefined && elem.value != "")
        let undefVars = equatVars.filter(elem => !defVars.find(elem2 => elem.letter == elem2.letter))
        let hasEqual = equation.includes('=');
        if (undefVars.length == 1) {
            let targetVar = undefVars[0];
            if (hasEqual) {
                let value = createSidedEquation(equation, targetVar.letter)
                setVar(targetVar.letter, +value)
                return value;
            }
        }
        return undefined;
    }

}
let outObject = {};

funcList.createFunction("function", 'tester', "x*5+u")
let funcTester = funcList.getFunction("tester");
if(funcTester){
    outObject.Func_Test = ["✅ Tester Func Found", funcTester];
}else{
    outObject.Func_Test = ["❌ Tester Func failed", funcTester]
}
let basicParse = parseEquation("x*43.3+7+y")
if(JSON.stringify(basicParse) === `{"a":[{"opCount":0,"type":"var","letter":"x","powId":{},"mutiId":{}},{"opCount":0,"type":"op","text":"*","inverse":"/","subtype":"Muti","groupIdx":1},{"opCount":0,"type":"term","text":"43.3"},{"opCount":0,"type":"op","text":"+","inverse":"-","subtype":"Plus","groupIdx":0},{"opCount":0,"type":"term","text":"7"},{"opCount":0,"type":"op","text":"+","inverse":"-","subtype":"Plus","groupIdx":0},{"opCount":0,"type":"var","letter":"y","powId":{},"mutiId":{}}],"type":"test","vars":[{"opCount":0,"type":"var","letter":"x","powId":{},"mutiId":{}},{"opCount":0,"type":"var","letter":"y","powId":{},"mutiId":{}}]}`){
    outObject.Basic_Parse_Test = ["✅ Basic Parse Match", basicParse]
}else{
    outObject.Basic_Parse_Test = ["❌ Basic Parse failed", basicParse]
}
let challengeParse = parseEquation("tester(23,3)*43=0")
if(JSON.stringify(challengeParse) === `{"a":[{"opCount":0,"type":"parSec","subtype":"ParStart","text":"23,3","parse":{"a":[{"opCount":0,"type":"term","text":"23"},{"opCount":0,"type":"op","text":",","inverse":",","subtype":"Comma","groupIdx":-1},{"opCount":0,"type":"term","text":"3"}],"type":"test","vars":[]},"func":{"name":"tester","size":6,"type":"function","ogFunc":"x*5+u","funcParse":{"a":[{"opCount":0,"type":"var","letter":"x","powId":{},"mutiId":{}},{"opCount":0,"type":"op","text":"*","inverse":"/","subtype":"Muti","groupIdx":1},{"opCount":0,"type":"term","text":"5"},{"opCount":0,"type":"op","text":"+","inverse":"-","subtype":"Plus","groupIdx":0},{"opCount":0,"type":"var","letter":"u","powId":{},"mutiId":{}}],"type":"test","vars":[{"opCount":0,"type":"var","letter":"x","powId":{},"mutiId":{}},{"opCount":0,"type":"var","letter":"u","powId":{},"mutiId":{}}]},"vars":[{"opCount":0,"type":"var","letter":"x","powId":{},"mutiId":{}},{"opCount":0,"type":"var","letter":"u","powId":{},"mutiId":{}}]}},{"opCount":0,"type":"op","text":"*","inverse":"/","subtype":"Muti","groupIdx":1},{"opCount":0,"type":"term","text":"43"},{"opCount":0,"type":"op","text":"=","inverse":"=","subtype":"Equals","groupIdx":-1,"calcIndicator":true},{"opCount":0,"type":"term","text":"0"}],"type":"test","vars":[],"indicator":{"opCount":0,"type":"op","text":"=","inverse":"=","subtype":"Equals","groupIdx":-1,"calcIndicator":true}}`){
    outObject.Challenge_Parse_Test = ["✅ Challenge Parse Match", challengeParse]
}else{
    outObject.Challenge_Parse_Test = ["❌ Challenge Parse failed", challengeParse]
}
console.log(JSON.stringify(challengeParse))
console.log("%cTest Cases","color: #90EE90; font-family:sans-serif; font-size: 20px");
console.dir(outObject)