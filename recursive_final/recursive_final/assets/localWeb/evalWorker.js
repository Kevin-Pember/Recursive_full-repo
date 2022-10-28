let runners = [];
let GlobalVars = [];
let settings = { "version": 1, "oL": "auto", "degRad": true, "notation": "simple", "theme": "darkMode", "acc": "blue", "tC": 5, "tMin": -10, "tMax": 10, "gR": 100, "gMin": -10, "gMax": 10 };
let funcList = [
  {
    'type': 'method',
    'func': 'sin',
    'funcRadDeg': true,
    'funcLength': 3,
    "inverse": "asin",
    'mth': (arry) => {
      let input = arry[0];
      return Math.sin(input * getAngleCon("deg"));
    }
  },
  {
    'type': 'method',
    'func': ['asin', "arcsin"],
    'funcRadDeg': true,
    'funcLength': [4, 6],
    "inverse": "sin",
    'mth': (arry) => {
      let input = arry[0];
      return Math.asin(input) * getAngleCon("rad");
    }
  },
  {
    'type': 'method',
    'func': 'cos',
    'funcRadDeg': true,
    'funcLength': 3,
    "inverse": "acos",
    'mth': (arry) => {
      let input = arry[0];
      return Math.cos(input * getAngleCon("deg"));
    }
  },
  {
    'type': 'method',
    'func': ['acos', "arccos"],
    'funcRadDeg': true,
    'funcLength': [4, 6],
    "inverse": "cos",
    'mth': (arry) => {
      let input = arry[0];
      return Math.acos(input) * getAngleCon("rad");
    }
  },
  {
    'type': 'method',
    'func': 'tan',
    'funcRadDeg': true,
    'funcLength': 3,
    "inverse": "atan",
    'mth': (arry) => {
      let input = arry[0];
      return Math.tan(input * getAngleCon("deg"));
    }
  },
  {
    'type': 'method',
    'func': ['atan', "arctan"],
    'funcRadDeg': true,
    'funcLength': [4, 6],
    "inverse": "tan",
    'mth': (arry) => {
      let input = arry[0];
      return Math.atan(input) * getAngleCon("rad");
    }
  },
  {
    'type': 'method',
    'func': 'csc',
    'funcRadDeg': true,
    'funcLength': 3,
    "inverse": "acsc",
    'mth': (arry) => {
      let input = arry[0];
      return 1 / Math.sin(input * getAngleCon("deg"));
    }
  },
  {
    'type': 'method',
    'func': ['acsc', "arccsc"],
    'funcRadDeg': true,
    'funcLength': [4, 6],
    "inverse": "csc",
    'mth': (arry) => {
      let input = arry[0];
      return Math.asin(1 / input) * getAngleCon("rad");
    }
  },
  {
    'type': 'method',
    'func': 'sec',
    'funcRadDeg': true,
    'funcLength': 3,
    "inverse": "asec",
    'mth': (arry) => {
      let input = arry[0];
      return 1 / Math.cos(input * getAngleCon("deg"));
    }
  },
  {
    'type': 'method',
    'func': ['asec', "arcsec"],
    'funcRadDeg': true,
    'funcLength': [4, 6],
    "inverse": "sec",
    'mth': (arry) => {
      let input = arry[0];
      return Math.acos(1 / input) * getAngleCon("rad");
    }
  },
  {
    'type': 'method',
    'func': 'cot',
    'funcRadDeg': true,
    'funcLength': 3,
    "inverse": "acot",
    'mth': (arry) => {
      let input = arry[0];
      return 1 / Math.tan(input * getAngleCon("deg"));
    }
  },
  {
    'type': 'method',
    'func': ['acot', "arccot"],
    'funcRadDeg': true,
    'funcLength': [4, 6],
    "inverse": "cot",
    'mth': (arry) => {
      let input = arry[0];
      return Math.atan(1 / input) * getAngleCon("rad");
    }
  },
  {
    'type': 'method',
    'func': 'abs',
    'funcRadDeg': false,
    'funcLength': 3,
    'mth': (arry) => {
      let input = arry[0];
      return Math.abs(input);
    }
  },
  {
    'type': 'method',
    'func': 'mod',
    'funcRadDeg': false,
    'funcLength': 3,
    'mth': (arry) => {
      let input = arry[0];
      return Math.abs(input);
    }
  },
  {
    'type': 'method',
    'func': 'abs',
    'funcRadDeg': false,
    'funcLength': 3,
    'mth': (arry) => {
      let input = arry[0];
      return Math.abs(input);
    }
  },
  {
    'type': 'method',
    'func': 'gamma',
    'funcRadDeg': false,
    "funcLength": 5,
    'inherant': true,
    'mth': (arry) => {
      let g = 7;
      let C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
      let z = arry[0]
      if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
      else {
        z -= 1;

        let x = C[0];
        for (let i = 1; i < g + 2; i++)
          x += C[i] / (z + i);

        let t = z + g + 0.5;
        return trailingRound(Math.sqrt(2 * Math.PI) * Math.pow(t, (z + 0.5)) * Math.exp(-t) * x);
      }
    }
  },
  {
    'type': 'method',
    'func': 'sigma',
    'funcRadDeg': false,
    'funcLength': 5,
    'mth': (arry) => {
      let srt = arry[0]
      let end = arry[1]
      let equat = arry[2]
      let vars = varInEquat(equat)
      let value = 0;
      if (vars.length == 1) {
        let array = []
        let inver = vars[0].positions.reverse();
        for (let pos of inver) {
          let pre = (equat.charCodeAt(pos - 1) > 47 && equat.charCodeAt(pos - 1) < 58) || equat.charCodeAt(pos - 1) == 190 ? equat.substring(0, pos) + '*' : equat.substring(0, pos);
          let post = (equat.charCodeAt(pos + 1) > 47 && equat.charCodeAt(pos + 1) < 58) || equat.charCodeAt(pos + 1) == 190 ? '*' + equat.substring(pos + 1) : equat.substring(pos + 1);
          array.unshift(post)
          array.unshift('VAR')
          equat = pre
          if (pos == inver[inver.length - 1]) {
            array.unshift(equat)
          }
        }
        console.log(array)
        for (let i = srt; i <= end; i++) {
          let dupilicate = [...array]
          dupilicate.replaceAll('VAR', "(" + i + ')')
          let ird = fullSolve(dupilicate.join(""))
          if (srt == i) {
            value = ird
          } else {
            value += ird
          }
        }
        return value;
      }
    }
  },
  {
    'type': 'method',
    'func': 'logB',
    'funcRadDeg': false,
    'funcLength': 4,
    'mth': (arry) => {
      let base = arry[0]
      let arg = arry[1]
      return Math.log10(arg) / Math.log10(base)
    }
  }
];
let ignoreList = [
  "Math.sin",
  "Math.cos",
  "Math.tan",
  "Math.log",
  "Math.log10",
  "Math.abs",
  "Math.sqrt",
  "Math.pow",
  "Math.PI"

];
let secondList = [
  "sup>",
];

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
String.prototype.innerVar = function (tVar) {
  let posArry = this.indexOfAll(tVar);
  let posFunc = funcsContainingVar(tVar);
  for (let idx of posArry) {
    for (let func of posFunc) {
      if (idx >= func.idx && this.length - idx >= func.name.length - func.idx) {
        if (this.substring(idx - func.idx, idx - func.idx + func.name.length) != func.name) {
          return false;
        }
      }
    }
    return true;
  }
};
String.prototype.hasVar = function () {
  if (varInEquat(this).length > 0) {
    return true
  } else {
    return false;
  }
}
class DefinedTerm {
  pow = [];
  mutiplican = [];
  constructor(mutiplican, pow, pos) {
    this.pos = pos

    this.type = "defTerm"

    Array.isArray(mutiplican) ? this.mutiplican = combineTerms(mutiplican) : this.mutiplican = [mutiplican];

    Array.isArray(pow) ? this.pow = combineTerms(pow) : this.pow = [pow]

    this.additions = []

    this.endElem = this;
  }
  get getPow() {

    return arryToString(this.pow);
  }
  get getMutiplican() {
    console.log(this.mutiplican)
    return arryToString(this.mutiplican);
  }
  get getAdditions() {
    return arryToString(this.additions);
  }
  get getComputedPow() {
    return arryToString(this.pow);
  }
  get getComputedMuti() {
    return arryToString(this.mutiplican);
  }
  changeMuti(add) {
    let test = add.find(elem => {
      if (this.subtype == 'var' && elem.subtype == 'var' && this.letter == elem.letter) {
        return true;
      } else if (this.subtype == 'cmpxTerm' && elem.subtype == 'cmpxTerm' && arrayEquals(this.textArray, elem.textArray)) {
        return true;
      }
    })
    if (test != undefined) {
      let taegElem = test;
      console.log(taegElem)
      let addPowArry = [{ 'type': 'op', 'subtype': 'Plus', 'text': '+' }, { "type": 'op', "subtype": "ParStart", 'text': '(', 'matchPar': this.pow.length + taegElem.pow.length + 2 }];
      addPowArry = addPowArry.concat(taegElem.pow)
      addPowArry.push({ "type": 'op', "subtype": "ParEnd", 'text': ')', 'matchPar': this.pow.length + 1 })
      this.changePow(addPowArry)

      let addMutiArray = [{ 'type': 'op', 'subtype': 'Muti', 'text': '*' }, { "type": 'op', "subtype": "ParStart", 'text': '(', 'matchPar': this.mutiplican.length + taegElem.mutiplican.length + 2 }]
      addMutiArray = addMutiArray.concat(taegElem.mutiplican)
      addMutiArray.push({ "type": 'op', "subtype": "ParEnd", 'text': ')', 'matchPar': this.mutiplican.length + 1 })
      this.changeMuti(addMutiArray)
    } else {
      let newArray = this.mutiplican.concat(add);
      this.mutiplican = combineTerms(newArray);
    }
  }

  changePow(add) {
    let newArray = this.endElem.pow.concat(add)
    this.pow = combineTerms(newArray)
    console.log(this.endElem.pow)
  }

  changeAddition(add) {
    let test = add.find(elem => {
      if (this.subtype == 'var' && elem.subtype == 'var' && this.letter == elem.letter && arrayEquals(this.pow, elem.pow)) {
        return true;
      } else if (this.subtype == 'cmpxTerm' && elem.subtype == 'cmpxTerm' && arrayEquals(this.textArray, elem.textArray) && arrayEquals(this.pow, elem.pow)) {
        return true;
      }
    });
    if (test != undefined) {
      let targetedElem = test;
      let addMutiArray = [{ 'type': 'op', 'subtype': 'Plus', 'text': '+' }, { "type": 'op', "subtype": "ParStart", 'text': '(', 'matchPar': this.mutiplican.length + targetedElem.mutiplican.length + 2 }]
      addMutiArray = addMutiArray.concat(targetedElem.mutiplican)
      addMutiArray.push({ "type": 'op', "subtype": "ParEnd", 'text': ')', 'matchPar': this.mutiplican.length + 1 })
      this.changeMuti(addMutiArray)

      let addAdditiveArray = [{ 'type': 'op', 'subtype': 'Plus', 'text': '+' }, { "type": 'op', "subtype": "ParStart", 'text': '(', 'matchPar': this.additions.length + targetedElem.additions.length + 2 }]
      addAdditiveArray = addAdditiveArray.concat(targetedElem.additions)
      addAdditiveArray.push({ "type": 'op', "subtype": "ParEnd", 'text': ')', 'matchPar': this.additions.length + 1 })
      this.changeAddition(addAdditiveArray)
    } else {
      if (this.additions.length == 0) {
        add.shift()
      }
      let newArray = this.additions.concat(add)
      this.additions = combineTerms(newArray)
    }
  }
}
class CmpxTerm extends DefinedTerm {
  constructor(array, pos, mutiplican, pow, elemB) {
    super(mutiplican, pow, pos)
    this.subtype = "cmpxTerm";
    console.log(array)
    this.textArray = combineTerms(array)
    if (elemB) {
      if (elemB.type == "func") {
        this.func = elemB
      }
    }
  }
  get text() {
    let stringPow = this.getComputedPow != "1" ? "^(" + this.getComputedPow + ')' : '';
    let stringMutiplican = this.getComputedMuti != '1' ? this.getComputedMuti + "*" : '';
    let stringAddican = this.getAdditions.length != 0 ? '+' + this.getAdditions : '';
    let stringFunc = this.func != undefined ? this.func.text : '';

    return stringFunc + stringMutiplican + "(" + arryToString(this.textArray) + ")" + stringPow + stringAddican;
  }
}
class VarTerm extends DefinedTerm {
  constructor(input, pos, mutiplican, pow, innerPos) {
    super(mutiplican, pow, pos)
    this.subtype = "var"

    this.letter = input;

    this.innerPos = innerPos
  }
  get getNumeric() {
    for (let varI of GlobalVars) {
      if (varI.name == this.letter) {
        return varI.value
      }
    }
    return this.letter
  }
  get text() {
    let stringPow = this.getComputedPow != "1" ? "^(" + this.getComputedPow + ')' : '';
    let strignMutiplican = this.getComputedMuti != '1' ? this.getComputedMuti + "*" : '';
    let stringAddican = this.getAdditions.length != 0 ? '+' + this.getAdditions : '';
    return strignMutiplican + this.getNumeric + stringPow + stringAddican;
  }

}
class solveEnv {
  constructor(object) {
    this.id = object.id
    this.vars = [];
  }
}
class StaticEnv extends solveEnv {
  constructor(object) {
    super(object)
    this.envType = "static"
    this.id = object.id
    this.vars = object.vars;
    this.equation = object.equation;
    if (this.equation.includes('=')) {
      this.type = "mutiSide"
      for (let varI of this.vars) {
        varI.equalTo = findValueOf(varI.letter, this.equation)
      }
    } else {
      this.type = "singleSide"
    }
  }
  calcSingle() {
    if (this.type === "mutiSide") {
      let target = arguments[0]
      let tarElem = this.vars.find(elem => elem.letter == target)
      return fullSolve(setVarEquat(arryToString(tarElem.equalTo), this.vars))
    } else {
      return fullSolve(setVarEquat(this.equation, this.vars), this.vars)
    }
  }
  calcPoints(type, target) {
    let tarElem = this.vars.find(elem => elem.letter == target)
    if (type == "graph") {
      let param = arguments[2]
      return calculatePoints(setVarEquat(arryToString(tarElem.equalTo)), param.min, param.max, param.res, settings)
    } else {
      return calculatePoints(setVarEquat(arryToString(tarElem.equalTo)), settings.tMin, settings.tMax, settings.tC, settings)
    }
  }
  changeEquat(equat) {
    this.vars = varInEquat(equat);
    this.equation = equat;
    if (this.equation.includes('=')) {
      this.type = "mutiSide"
      for (let varI of this.vars) {
        varI.equalTo = findValueOf(varI.letter, this.equation)
      }
    } else {
      this.type = "singleSide"
    }
  }
  setVar(target, value) {
    let targElem = this.vars.find(elem => elem.letter == target);
    targElem.value = value
  }
}
class DynamicEnv extends solveEnv {
  constructor(object) {
    super(object)
    this.vars = []
    this.type = "dynamic"
  }
  calcSingle(equation) {
    if (equation.includes('=')) {
      let target = arguments[1]
      let forArry = findValueOf(target, equation)
      return fullSolve(setVarEquat(arryToString(forArry), this.vars))
    } else {
      return fullSolve(setVarEquat(equation, this.vars), this.vars)
    }
  }
  calcPoints(type, target, equation) {
    let forArry = findValueOf(target, equation)
    if (type == "graph") {
      let param = arguments[3]
      return calculatePoints(setVarEquat(arryToString(forArry)), param.min, param.max, param.res)
    } else {
      return calculatePoints(setVarEquat(arryToString(forArry)), settings.tMin, settings.tMax, settings.tC)
    }
  }
  setVar(target, value) {
    this.vars.push({ 'letter': target, 'value': value })
  }
}
onmessage = function (e) {
  let object = e.data;
  console.log(object)
  let port = e.ports[0];

  if (object.callType == "set") {
    if (object.method == 'init') {
      //{callType: "set", method: "init", settings: blank for brevity}
      try {
        settings = object.settings;
        port.postMessage({ result: "Set Settings" })
      } catch (eve) {
        console.log(eve)
        port.postMessage({ error: eve })
        this.postMessage({ 'type': 'posError', 'mes': `Error Setting Calc settings` })
      }
    } else if (object.method == "var") {
      if (object.targetEnv == undefined) {
        let targVar = GlobalVars.find(elem => elem.name == object.target)
        targVar.value = object.value
        port.postMessage({ result: "Set Var" })
      } else {
        runners.find(elem => elem.id == object.targetEnv).setVar(object.target, object.value)
        port.postMessage({ result: "Set Var" })
      }

    } else if (object.method == "env") {
      if (object.envType == "static") {
        runners.push(new StaticEnv(object))
      } else {
        runners.push(new DynamicEnv(object))
      }
    } else if (object.method == "envEquat") {
      runners.find(elem => elem.id == object.targetEnv).changeEquat(object.equation)
    }
  } else if (object.callType == "get") {
    if (object.method == 'list') {
      port.postMessage({ result: getNameList() })
    } else if (object.method == 'vars') {
      //{callType: "get", method: "vars", text : blank for brevity}
      if (object.existing == undefined) {
        port.postMessage({ result: varInEquat(object.text) })
      } else if (object.existing == true) {
        port.postMessage({
          result: funcList.find(elem => {
            if (Array.isArray(elem.func)) {
              return elem.func.includes(object.funcName);
            } else {
              return elem.func == object.funcName;
            }
          }
          ).inputs
        })
      }

    } else if (object.method == 'func') {
      //{callType: "get", method: "func", name : blank for brevity}
      port.postMessage({ result: getMethod(object.name) })
    } else if (object.method == 'parsedMeth') {
      //{callType: "get", method: "parsedMeth", text : blank for brevity}
      port.postMessage({ result: parseFunction(object.text) })
    }

  } else if (object.callType == "func") {
    if (object.method == 'add') {
      //{callType: "func", method: "add", newFuncs : blank for brevity}
      let list = Array.isArray(object.newFuncs) ? object.newFuncs : [object.newFuncs]
      try {
        for (let def of list) {
          if (!getByName(def.name)) {
            if (def.type == 'Function') {
              try {
                port.postMessage({ result: createNewFunction('function', def.name, def.equation) })
              } catch (eve) {
                this.postMessage({ 'type': 'posError', 'mes': `Issue adding ${def.name} to algo` })
              }
            } else if (def.type == 'Hybrid') {
              try {
                port.postMessage({ result: createNewFunction('method', def.code) })
              } catch (e) {
                this.postMessage({ 'type': 'posError', 'mes': `Issue adding hybrid to algo` })
              }
            }
          }
        }
      } catch (eve) {
        port.postMessage({ error: eve })
        this.postMessage({ 'type': 'posError', 'mes': `Issue adding functions to algo` })
        console.log('issues adding to algo')
      }
    } else if (object.method == 'change') {
      //{callType: "func", method: "change", level: blank for brevity, name: blank for brevity, params: blank for brevity, equation: blank for brevity}
      if (object.level == 'part') {
        changeFunc('part', object.name, object.params)
      } else if (object.level == 'full') {
        changeFunc('full', object.name, arguments[1])
      }
    } else if (object.remove == 'remove') {
      removeFunction(object.name)
    }
  } else if (object.callType == 'calc') {
    if (object.method == 'solve') {
      console.log('solve Called')
      //{callType: "calc", method: "solve", text : blank for brevity}
      try {
        if (object.targetEnv == undefined) {
          console.log('basic calc')
          port.postMessage({ result: fullSolve(object.text, settings) })
        } else {
          let tarEnv = runners.find(elem => elem.id == object.targetEnv);
          if (tarEnv.type == "dynamic") {
            port.postMessage({ result: tarEnv.calcSingle(object.equation) })
          } else {
            port.postMessage({ result: tarEnv.calcSingle(object.target) })
          }
        }

      } catch (eve) {
        port.postMessage({ error: 'eve' })
        this.postMessage({ 'type': 'posError', 'mes': `Error Solving` })
      }
    } else if (object.method == 'points') {
      //{callType: "calc", method: "points", target: "graph"|"table", text : blank for brevity, if graph dime: {min, max, res}}
      console.log('geting points')
      if (object.target == 'graph') {
        try {
          if (object.targetEnv == undefined) {
            port.postMessage({ "result": calculatePoints(object.text, object.dime.min, object.dime.max, object.dime.res) })
          } else {
            let tarEnv = runners.find(elem => elem.id == object.targetEnv);
            if (tarEnv.type == "dynamic") {
              port.postMessage({ "result": tarEnv.calcPoints("graph", object.target, object.equation, object.dime) })
            } else {
              port.postMessage({ "result": tarEnv.calcPoints("graph", object.target, object.dime) })
            }
          }
        } catch (eve) {
          port.postMessage({ error: eve })
          this.postMessage({ 'type': 'posError', 'mes': `Error Calculating points for graph` })
        }
      } else {
        console.log('Solving for table')
        try {
          if (object.targetEnv == undefined) {
            port.postMessage({ "result": calculatePoints(object.text, settings.tMin, settings.tMax, settings.tC) })
          } else {
            let tarEnv = runners.find(elem => elem.id == object.targetEnv);
            if (tarEnv.type == "dynamic") {
              port.postMessage({ "result": tarEnv.calcPoints("table", object.target, object.equation) })
            } else {
              port.postMessage({ "result": tarEnv.calcPoints("table", object.target) })
            }
          }
        } catch (eve) {
          port.postMessage({ error: eve })
          this.postMessage({ 'type': 'posError', 'mes': `Error Calculating points for table` })
        }
      }
    }
  }
};
/*********************************************Solve Toothless****************************************** */

//Main method called to parse an Equation
function solveInpr(equation, degRad) {
  for (let i = 0; i < equation.length; i++) {
    let func = funcMatch(equation.substring(i), true);
    if (func != "") {
      let innerRAW = parEncap(
        equation.substring(i + func.funcLength)
      );
      let parsedFunc = solveFunc(equation, i)
      equation = equation.substring(0, i) + parsedFunc + equation.substring(i + func.funcLength + innerRAW.length);
      i = i + parsedFunc.length - 1;
    }
  }
  equation = builtInFunc(equation);
  return equation;
}
//Func method to find if the current postion has a function defined in the funclist
function getByName(name) {
  for (let func of funcList) {
    if (Array.isArray(func.func)) {
      if (func.func.includes(name)) {
        return func;
      }
    } else {
      if (func.func == name) {
        return func;
      }
    }
  }
  return false;
}
//A secondary method to match postions with functions but this one returns the function ength in order to skip through that in a loop
function funcMatch(equation, way) {
  var returned = "";
  var longestMatch = "";
  for (let func of funcList) {
    let check = "";
    if (Array.isArray(func.func)) {
      for (let funcName of func.func) {
        if (equation.includes(funcName)) {
          check = funcName;
        }
      }
    } else {
      if (equation.includes(func.func)) {
        check = func.func;
      }
    }
    if (check.length > longestMatch.length) {
      longestMatch = check;
      returned = func;
    }
  }
  for (let func of secondList) {
    let check = equation.substring(0, (func.length));
    if (check == func) {
      returned = "";
    }
  }
  return returned;
}
function ignoreTest(equation) {
  const ignore = ignoreList.find(element => equation.substring(0, element.length) == element);
  if (ignore != undefined) {
    return ignore.length;
  } else {
    return undefined;
  }
}
//A method to parse for functions that are defined diffrenely depending on weather or not in rad or deg
function findMethod(funcUn, degRad) {
  let func = JSON.parse(JSON.stringify(funcUn));
  let array = func.funcParse;
  if (func.funcRadDeg) {
    if (degRad) {
      if (array.includes("toDeg")) {
        array.splice(func.funcParse.indexOf("toDeg"), 1, "*(Math.PI/180)");
      } else {
        array.splice(func.funcParse.indexOf("toRad"), 1, "*(180/Math.PI)");
      }
    } else {
      if (array.includes("toDeg")) {
        array.splice(func.funcParse.indexOf("toDeg"), 1);
      } else {
        array.splice(func.funcParse.indexOf("toRad"), 1);
      }
    }
  }
  return array;
}
//A method to parse a function array into a string so it can be add to the equation string
function assembly(func, parsedFunc, values) {
  inputs = func.inputs;
  for (let i = 1; i <= inputs; i++) {
    let numVar = "v" + i;
    let vararray = parsedFunc.filter(elem => elem == numVar);
    for (let vare of vararray) {
      let index = parsedFunc.indexOf(numVar);
      parsedFunc[index] = values[i - 1];
    }
  }
  let parsedString = parsedFunc.join("");
  return parsedString;
}
//A method which takes the inputs value from a func object in the funclist and gets how many inputs that function has and parses each
function recrSolve(equation) {
  let values = [];
  while (equation.length != 0) {
    if (equation.includes(',')) {
      values.push(equation.substring(0, equation.indexOf(",")));
      equation = equation.substring(equation.indexOf(",") + 1);
    } else {
      values.push(equation);
      break;
    }
  }
  values = values.filter(e => e != "");
  return values
}
//A method to solve for the inner values of encapsulated functions
function equatInner(equation, degRad) {
  equation = solveInpr(equation, degRad);
  return equation;
}
function solveFunc(equation, index) {
  let degRad = settings.degRad;
  let i = index;
  let func = funcMatch(equation.substring(i), true);
  let innerRAW = parEncap(
    equation.substring(i + func.funcLength)
  );
  let values = recrSolve(innerRAW.substring(1, innerRAW.length - 1), func);
  let parsedFunc = "";
  if (func.type == "function") {
    let funcTemp = findMethod(func, degRad);
    parsedFunc = assembly(func, funcTemp, values);
  } else if (func.type == "method") {
    parsedFunc = func.mth(values)
  }
  return parsedFunc;
}
//A meothod for creating the end of a parenthesis
function parComplete(input) {
  for (let i = 0; i < input.length; i++) {
    if (input.charAt(i) == "(") {
      if (
        i + parEncap(input.substring(i)).length >= input.length &&
        input.charAt(input.length - 1) != ")"
      ) {
        input += ")";
      }
    }
  }
  return input;
}
//A method to find the end of a parenthesis and make one if there is none
function parEncap(sub) {
  for (let i = 1; i < sub.length; i++) {
    if (sub.charAt(i) == "(") {
      i = i + parEncap(sub.substring(i)).length;
    } else if (sub.charAt(i) == ")") {
      sub = sub.substring(0, i + 1);
      break;
    } else if (i == sub.length - 1) {
      sub = sub + ")";
      break;
    }
  }
  return sub;
}
//A method to find the beginning of a parenthesis and make one if there is none
function parEncap2(sub) {
  for (let i = sub.length - 2; i >= 0; i--) {
    if (sub.charAt(i) == ')') {
      i = i + parEncap2(sub.substring(0, i + 1)).length;
    } else if (sub.charAt(i) == '(') {
      sub = sub.substring(i);
      break;
    } else if (i == 0) {
      sub = "(" + sub;
      break;
    }
  }
  return sub;
}
//A method to find the ending of a superscript html tag. Doesn't make one if there is none
function supEncap(sub) {
  for (let i = 5; i < sub.length; i++) {
    if (sub.substring(i, i + 5) == "<sup>") {
      i = i + supEncap(sub.substring(i)).length;
    } else if (sub.substring(i, i + 6) == "</sup>") {
      sub = sub.substring(0, i + 6);
      break;
    }
  }
  return sub;
}
//A deprecated Method to find the postion of a function in the equation string
function funcIndex(func, equation, funcList) {
  let has = false;
  var hasVal = -1;
  for (let i = funcList.length - 1; i >= 0; i--) {
    if (funcList[i].func == func) {
      has = true;
      if (hasVal < funcList[i].index) {
        hasVal = funcList[i].index + funcList[i].func.length;
      }
    }
  }
  if (has) {
    return hasVal + equation.substring(hasVal).indexOf(func);
  } else {
    return equation.indexOf(func);
  }
}
//A method to parse functions that don't fit into the conventions of the function list 
function builtInFunc(equation) {
  equation = equation.replaceAll('‎', '');
  equation = equation.replaceAll('e', 'Math.E');
  equation = equation.replaceAll('×', '*');
  equation = equation.replaceAll('÷', '/');
  for (let i = 0; i < equation.length; i++) {
    if (equation.substring(i, i + 5) == "<sup>") {
      let exponent = equatInner(supEncap(equation.substring(i)).substring(5, supEncap(equation.substring(i)).length - 6));
      let exponentRAW = supEncap(equation.substring(i));
      let base = "";
      let baseRAW = "";
      if (equation.charAt(i - 1) == ")") {
        base = equatInner(parEncap2(equation.substring(0, i)).substring(1, parEncap2(equation.substring(0, i)).length - 1));
        baseRAW = parEncap2(equation.substring(0, i));
      } else {
        base = forward(equation.substring(0, i));
        baseRAW = forward(equation.substring(0, i));
      }
      equation = equation.substring(0, i - baseRAW.length) + "Math.pow(" + base + "," + exponent + ")" + equation.substring(i + exponentRAW.length);
    } else if (equation.charAt(i) == "^") {
      let exponent = "";
      let exponentRAW = "";
      let base = "";
      let baseRAW = "";
      if (equation.charAt(i - 1) == ")") {
        base = equatInner(parEncap2(equation.substring(0, i)).substring(1, parEncap2(equation.substring(0, i)).length - 1));
        baseRAW = parEncap2(equation.substring(0, i));
      } else {
        base = forward(equation.substring(0, i));
        baseRAW = forward(equation.substring(0, i));
      }
      if (equation.charAt(i + 1) == "(") {
        exponent = equatInner(parEncap(equation.substring(i + 1)));
        exponentRAW = parEncap(equation.substring(i + 1));
      } else {
        exponent = backward(equation.substring(i + 1));
        exponentRAW = backward(equation.substring(i + 1));
      }
      equation = equation.substring(0, i - baseRAW.length) + "Math.pow(" + base + "," + exponent + ")" + equation.substring(i + exponentRAW.length + 1);
    } else if (equation.charAt(i) == "√") {
      if (equation.charAt(i + 1) == '(') {
        equation = equation.substring(0, i) + "Math.sqrt" + equation.substring(i + 1);
      } else {
        let inner = equatInner(backward(equation.substring(i + 1)));
        let innerRAW = backward(equation.substring(i + 1));
        equation = equation.substring(0, i) + "Math.sqrt(" + inner + ")" + equation.substring(i + innerRAW.length + 1);
        i = i + inner.length + 7;
      }
    } else if (equation.charAt(i) == "π") {
      let parseString = "Math.PI";
      if (backward(equation.substring(i + 1)).length > 0) {
        let number = backward(equation.substring(i + 1));
        parseString = Math.PI * Number(number);
        equation = equation.substring(0, i) + parseString + equation.substring(i + number.length + 1);
        break;
      }
      if (forward(equation.substring(0, i)).length > 0) {
        let number = forward(equation.substring(0, i));
        parseString = Math.PI * Number(number);
        equation = equation.substring(0, i - number.length) + parseString + equation.substring(i + 1);
        break;
      }
      equation = equation.substring(0, i) + parseString + equation.substring(i + 1);
    } else if (equation.charAt(i) == "|") {
      let sub = "";
      if (equation.charAt(i - 1) == "(") {
        sub = equation.substring(i - 1);
      } else {
        sub = equation.substring(i);
      }
      let type = false;
      if (sub.charAt() == "(") {
        type = true;
        sub = sub.substring(1);
      }

      for (let i = 1; i < sub.length; i++) {
        if (sub.charAt(i) == "|" && sub.charAt(i + 1) != ")" && !type) {

        } else if (sub.charAt(i) == "|" && sub.charAt(i + 1) == ")" && type) {

        }
      }
    }
  }
  return equation;
}
//A method that finds the end of a number from the start of the number
function backward(sub) {
  let outputSub = "";
  for (i = 0; i <= sub.length - 1; i++) {
    if (sub.charAt(i) != '×' && sub.charAt(i) != '*' && sub.charAt(i) != '÷' && sub.charAt(i) != '/' && sub.charAt(i) != '√' && sub.charAt(i) != '²' && sub.charAt(i) != '^' && sub.charAt(i) != '(' && sub.charAt(i) != ')' && sub.charAt(i) != '%' && sub.charAt(i) != '!' && sub.charAt(i) != 'π' && sub.charAt(i) != 'e' && sub.charAt(i) != ',' && sub.charAt(i) != '|') {
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
//A method that finds the start of a number from the end of the number
function forward(sub) {
  let outputSub = "";
  for (let i = sub.length - 1; i >= 0; i--) {
    if (sub.charAt(i) != '×' && sub.charAt(i) != '*' && sub.charAt(i) != '÷' && sub.charAt(i) != '/' && sub.charAt(i) != '√' && sub.charAt(i) != '²' && sub.charAt(i) != '^' && sub.charAt(i) != '(' && sub.charAt(i) != ')' && sub.charAt(i) != '%' && sub.charAt(i) != '!' && sub.charAt(i) != 'π' && sub.charAt(i) != 'e' && sub.charAt(i) != ',' && sub.charAt(i) != '|') {
      if (i == 0) {
        outputSub = sub.substring(i);
        break;
      } else if (sub.charAt(i) == '+') {
        if (sub.charAt(i - 1) == 'E') {

        } else {
          outputSub = sub.substring(i + 1);
          break;
        }
      } else if (sub.charAt(i) == '-') {
        if (i == 0) {

        } else if (sub.charAt(i - 1) == 'E') {

        } else {
          outputSub = sub.substring(i + 1);
          break;
        }
      }
    } else if (i == sub.length - 1) {
      outputSub = "";
      break;
    } else {
      outputSub = sub.substring(i + 1);
      break;
    }
  }
  return outputSub;
}
//A method that returns an array of the names of the funcs that are in the Funclist
function getNameList() {
  let nameList = [];
  for (let func of funcList) {
    if (Array.isArray(func.func)) {
      nameList.concat(func.func)
    } else {
      nameList.push(func.func);
    }
  }
  return nameList;
}
//Takes string and returns an array for funclist
function createParseable(equation) {

  for (let i = equation.length - 1; i >= 0; i--) {
    let func = funcMatch(equation.substring(i), true);
    if (func != "") {
      let innerRAW = parEncap(
        equation.substring(i + func.funcLength)
      );
      let parsedFunc = solveFunc(equation, i)
      equation = equation.substring(0, i) + parsedFunc + equation.substring(i + func.funcLength + innerRAW.length);
      i = i - parsedFunc.length + 1;
    }
  }
  let equationArray = [equation];
  let variables = varInEquat(equation);
  let variableIndexes = [];
  for (let i = 0; i < variables.length; i++) {
    variables[i].numVar = 'v' + (i + 1);
  }
  for (let data of variables) {
    for (let i = 0; i < equation.length; i++) {
      let ignore = ignoreTest(equation.substring(i));
      if (ignore != undefined) {
        i += ignore - 1;
      } else if (equation.charAt(i) == data.letter) {
        variableIndexes.push(i);
      }
    }
  }
  variableIndexes.sort(function (a, b) {
    return b - a;
  });
  for (let index of variableIndexes) {
    let temp = equationArray[0].charAt(index);
    let match = variables.find(e => e.letter == temp);
    let newarry = [];
    newarry.push(equationArray[0].substring(0, index));
    newarry.push(match.numVar);
    newarry.push(equationArray[0].substring(index + 1));
    equationArray.splice(0, 1, ...newarry);
  }
  equationArray = equationArray.filter(val => val != "" && val != "‎");
  return equationArray;
}
//calculate inputs
function cacInputs(array) {
  let num = 0;
  for (let item of array) {
    if (item.charAt(0) == 'v') {
      num++;
    }
  }
  return num;
}
let trigDef = [
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'arcsin',
  'arccos',
  'arctan',
  'csc',
  'sec',
  'cot',
  'acsc',
  'asec',
  'acot',
  'arccsc',
  'arcsec',
  'arccot',
];
//searches an equation string for any trig and returns a true or false question
function containsTrig(string) {
  for (let statement of trigDef) {
    return string.includes(statement);
  }
}
//Return the string forms of a function defined in the function list
function stringifyMethod(object) {
  let name = object.func;
  let string = object.string;
  let vars = object.variables;
  let parsedVariables = "";
  for (let i = 0; i < vars.length; i++) {
    if (i == 0) {
      parsedVariables += vars[i].letter;
    } else {
      parsedVariables += "," + vars[i].letter;
    }
  }
  return `function ${name}(${parsedVariables}) ${string}`;
}
//a method that takes the object from the function list and parses it into a fuunction
function stringFunction(object) {
  let name = object.func;
  let string = object.string;
  let vars = object.vars;
  for (let i = vars.length - 1; i >= 0; i--) {
    string = string.substring(0, 1) + `var ${vars[i].letter} = array[${i}];` + string.substring(1);
  }
  string = `var ${name} = function (array)${string} \n return ${name};`;
  return Function(string);
}
//Method that takes a string function and uses the text to get all needed info
function parseFunction(StringFunction) {
  let preserved = StringFunction;
  StringFunction = StringFunction.substring(StringFunction.indexOf("function") + 9)
  console.log("%c"+StringFunction,"color: grey;")
  let name = StringFunction.substring(0, StringFunction.indexOf("(")).trim();
  let variables = varInFunc(StringFunction)
  StringFunction = StringFunction.substring(StringFunction.indexOf("{"));
  let finalObject = {
    "func": name,
    "type": "method",
    "string": StringFunction,
    "vars": variables,
    'full': preserved,
    "inputs": variables.length,
    "funcRadDeg": false,
    "funcLength": name.length
  }
  return finalObject;
}
//A basic method that takes an input and determine which type of function should be added to the func list
function createNewFunction() {
  let object = {};
  if (arguments[0] == "function") {
    object = parseFuncEntry(arguments[0], arguments[1], arguments[2]);
  } else if (arguments[0] == "method" && !arguments[1].includes('XMLHttpRequest')) {
    object = parseFuncEntry(arguments[0], arguments[1]);
  }
  funcList.push(object);
  return object.func;
}
//Method that takes a type and text info to get all atritbutes of a funcList element
function parseFuncEntry() {
  let returnedObject = {}
  if (arguments[0] == "function") {
    let name = arguments[1];
    let func = arguments[2];
    let parseable = createParseable(func, settings.degRad);
    returnedObject.type = arguments[0];
    returnedObject.func = name;
    returnedObject.funcParse = parseable;
    returnedObject.inputs = cacInputs(parseable);
    returnedObject.vars = varInEquat(func);
    returnedObject.funcRadDeg = false;
    returnedObject.funcLength = name.length;
  } else if (arguments[0] == "method") {
    let funcString = arguments[1];
    returnedObject = parseFunction(funcString);
    console.log(returnedObject)
    returnedObject.mth = stringFunction(returnedObject)();
  }
  return returnedObject;
}
//Responsible for removal of functions from the func list
function removeFunction(name) {
  funcList = funcList.filter(function (value, index, arr) {
    if (Array.isArray(value.func)) {
      return !value.func.includes(name);
    } else {
      return value.func != name;
    }
  })
}
function fullSolve(input) {
  if (!input.includes('XMLHttpRequest')) {
    return eval(solveInpr(input, settings.degRad))
  } else {
    return undefined;
  }
}
//end
/***********************************************Solve For Algo*****************************************/
function findValueOf(tVar, equat) {
  let side1 = equat.substring(0, equat.indexOf('='));
  let side2 = equat.substring(equat.indexOf('=') + 1);
  let conS1 = solveFor(side1, tVar);
  let conS2 = solveFor(side2, tVar);
  if ((highTerms(conS2).length > 0 && highTerms(conS1).length > 0) && (conS2.text.includes(tVar) && conS1.text.includes(tVar))) {
    let longSide = highTerms(conS1, tVar).length > highTerms(conS2, tVar).length ? highTerms(conS1, tVar) : highTerms(conS2, tVar);
    let shortSide = highTerms(conS1, tVar).length > highTerms(conS2, tVar).length ? highTerms(conS2, tVar) : highTerms(conS1, tVar);
  } else {

  }

}
function solveForSide(vSide, mSide, trace) {
  console.log(vSide)
  console.log(mSide)
  if (trace.length > 0) {
    let targetedElem = trace[0].term;
    let indOfElem = trace[0].index;
    let addArry = [...vSide]
    if (vSide.length != 1) {
      indOfElem != addArry.length - 1 ? addArry.splice(indOfElem + 1, 1) : null;
      addArry.splice(indOfElem, 1);
      addArry.unshift({ 'type': 'op', 'subtype': 'Minus', 'text': '-' });
      mSide = mSide.concat(addArry);
    }
    if (trace[0].loc == "textArray" || trace[0].loc == "letter") {
      if (vSide[0].getComputedMuti != 1) {
        let postMuti = swapMuti(vSide[0], mSide)
        mSide = postMuti[0]
      }
      if (vSide[0].getComputedPow != 1) {
        let postPow = swapPow(vSide[0], mSide)
        mSide = postPow[0]
      }
      if (targetedElem.subtype == "cmpxTerm") {
        console.log("is complex term")
        if (targetedElem.func) {
          console.log("has func")
          let intFunc = getByName(targetedElem.func.text)
          console.log(targetedElem.func)
          console.log(typeof intFunc)
          if (intFunc.inverse) {
            let replacement = [...targetedElem.textArray]
            replacement.splice(trace[1].index, 1, ...mSide)
            mSide = [new CmpxTerm(replacement, 0, { "type": "term", "text": '1', "pos": 0 }, { "type": "term", "text": '1', "pos": 0 }, { "type": "func", "text": intFunc.inverse })]
          }
        }
      }
      console.log(vSide)
      vSide = vSide[0].textArray
      console.log(vSide)
    } else if (trace[0].loc == "pow") {
      if (vSide[0].getComputedMuti != 1) {
        let postMuti = swapMuti(vSide[0], mSide)
        mSide = postMuti[0]
      }
      let postBase = swapBase(vSide[0], mSide)
      mSide = postBase[0]
      vSide = vSide[0].pow
    }
    let final = solveForSide(vSide, mSide, trace.slice(1));
    vSide = final[0]
    mSide = final[1]
  }
  return [vSide, mSide]
}
function swapMuti(term, mSide) {
  console.log(term)
  mSide.push({ 'type': 'op', 'subtype': 'ParEnd', 'text': ')', 'matchPar': 0 })
  mSide.unshift({ 'type': 'op', 'subtype': 'ParStart', 'text': '(', 'matchPar': mSide.length });
  let newMuti = [{ 'type': 'op', 'subtype': 'ParStart', 'text': '(', 'matchPar': term.mutiplican.length + 2 }, { "type": "term", "text": '1', "pos": 0 }, { "type": "op", "subtype": "Div", "text": "/" }]
  newMuti = newMuti.concat(term.mutiplican)
  newMuti.push({ 'type': 'op', 'subtype': 'ParEnd', 'text': ')', 'matchPar': 0 })
  console.log(arryToString(mSide).hasVar())
  console.log(arryToString(newMuti).hasVar())
  if (arryToString(mSide).hasVar() || arryToString(newMuti).hasVar()) {
    if (mSide.legnth == 1 && mSide[0].type == 'cmpxTerm') {
      mSide[0].mutiplican.concat(newMuti)
    } else {
      mSide = [new CmpxTerm(mSide.slice(0, mSide.length), 0, newMuti, { "type": "term", "text": '1', "pos": 0 }, undefined)]
    }
    term.mutiplican = []
  } else {
    console.log(arryToString(mSide) + "*" + arryToString(newMuti));
    let solved = fullSolve(arryToString(mSide) + "*" + arryToString(newMuti))
    mSide = [{ "type": "term", "text": solved, "pos": 0 }]
    term.mutiplican = []
  }
  return [mSide, term]
}
function swapPow(term, mSide) {
  mSide.push({ 'type': 'op', 'subtype': 'ParEnd', 'text': ')', 'matchPar': 0 })
  mSide.unshift({ 'type': 'op', 'subtype': 'ParStart', 'text': '(', 'matchPar': mSide.length });
  let newPow = [{ 'type': 'op', 'subtype': 'ParStart', 'text': '(', 'matchPar': term.pow.length + 2 }, { "type": "term", "text": '1', "pos": 0 }, { "type": "op", "subtype": "Div", "text": "/" }]
  newPow = newPow.concat(term.pow)
  newPow.push({ 'type': 'op', 'subtype': 'ParEnd', 'text': ')', 'matchPar': 0 })
  console.log(arryToString(mSide).hasVar())
  console.log(arryToString(newPow).hasVar())
  if (arryToString(mSide).hasVar() || arryToString(newPow).hasVar()) {
    if (mSide.legnth == 1 && mSide[0].type == 'cmpxTerm') {
      mSide[0].pow.concat(newPow)
    } else {
      mSide = [new CmpxTerm(mSide.slice(0, mSide.length), 0, { "type": "term", "text": '1', "pos": 0 }, newPow, undefined)]
    }
    term.pow = []
  } else {
    let solved = fullSolve(arryToString(mSide) + "^" + arryToString(newPow))
    mSide = [{ "type": "term", "text": solved, "pos": 0 }]
    term.pow = []
  }
  return [mSide, term]
}
function swapBase(term, mSide) {
  let newBase = [{ 'type': 'op', 'subtype': 'ParStart', 'text': '(', 'matchPar': term.textArray.length },]
  newBase = newBase.concat(term.textArray)
  newBase = newBase.concat([{ 'type': 'op', 'subtype': 'ParEnd', 'text': ')', 'matchPar': 0 }, { "type": "op", "subtype": "Comma", "text": "," }, ...mSide])
  mSide = [new CmpxTerm(newBase, 0, { "type": "term", "text": '1', "pos": 0 }, { "type": "term", "text": '1', "pos": 0 }, { "type": "func", "text": "logB" })]
  term = term.pow
  return [mSide, term]
}
function equatTrace(arry, tVar) {
  let termArry = []
  console.log(arry)
  arry.forEach((term, i) => {
    let textualVal = "" + term.text
    if (textualVal.innerVar(tVar)) {
      if (term.subtype == "cmpxTerm") {
        console.log("term")
        let textAryVar = arryToString(term.textArray);
        let powVar = term.getComputedPow;
        let mutiVar = term.getComputedMuti;
        if (textAryVar.innerVar(tVar)) {
          termArry.push({ "term": term, "index": i, "loc": "textArray" })
          termArry = termArry.concat(equatTrace(term.textArray, tVar))
          return termArry;
        } else if (powVar.innerVar(tVar)) {
          termArry.push({ "term": term, "index": i, "loc": "pow" })
          termArry = termArry.concat(equatTrace(term.pow, tVar))
          return termArry;
        } else if (mutiVar.innerVar(tVar)) {
          termArry.push({ "term": term, "index": i, "loc": "muti" })
          termArry = termArry.concat(equatTrace(term.mutiplican, tVar))
          return termArry;
        }
      } else if (term.subtype == "var") {
        if (term.letter == tVar) {
          console.log("var term found")
          termArry.push({ "term": term, "index": i, "loc": "letter" })
          return termArry
        }
      }
    }
  });
  return termArry;
}
function highTerms(arry, varDef) {
  var highTerms = [];
  arry.forEach(elem => {
    if (typeof DefinedTerm === elem && elem.text.includes(varDef)) {
      hasTerm.push(elem)
    }
  })
}
function matchingPowers(array1, array2) {

}
function solveFor(equat, varDef) {
  let returned = opsInEquat(equat);
  equat = returned.equat
  let fullArray = returned.arry;
  fullArray = termsInEquat(equat, fullArray)

  /*for (let term of termSheet) {
    let pos = term.pos
    if (fullArray.length == 0) { fullArray.push(term) }
    for (let i = 0; i < fullArray.length; i++) {
      if (typeof [] !== typeof pos) {
        console.log(fullArray)
        if (i == fullArray.length - 1 && pos > fullArray[i].pos) {
          fullArray.splice(i + 1, 0, term)
          break;
        } else if (fullArray[i].pos < pos && pos < fullArray[i + 1].pos) {
          fullArray.splice(i + 1, 0, term)
          break;
        } else if (i == 0 && fullArray[i].pos > pos) {
          fullArray.unshift(term)
          break;
        }
      } else {
        if (fullArray[i].pos < pos[0] && pos[1] < fullArray[i + 1].pos) {
          fullArray.splice(i + 1, 0, term)
          break;
        } else if (i == 0 && fullArray[i].pos > pos[0]) {
          fullArray.unshift(term)
          break;
        }
      }
    }
  }*/
  for (let i = 0; i < fullArray.length; i++) {
    fullArray[i] = fullArray[i].subtype == "varContainer" ? fullArray[i] = parseTextTerm(fullArray[i], varDef) : fullArray[i];
  }
  console.log(fullArray)
  console.log(fullArray)
  fullArray = parLinkMap(fullArray);
  return fullArray
}
function hasTerm(item, target) {
  let fullArray = [];
  let nextTrm = item[0]
  while (nextTrm.ad.undefined) {

  }
}

function opsInEquat(equation) {
  console.log(`Equation before the ops method ${equation}`)
  let opsArry = []
  const ops = ['+', '-', '*', '/', '!', '^', "√", '%', '(', ')', ',']
  const typeIndex = ["Plus", "Minus", "Muti", "Div", 'factor', "Pow", "Sqrt", 'Percent', "ParStart", "ParEnd", 'Comma']
  for (let i = 0; i < equation.length; i++) {
    if (ops.includes(equation.charAt(i))) {
      opsArry.push({ 'type': "op", "subtype": typeIndex[ops.indexOf(equation.charAt(i))], "text": equation.charAt(i), "pos": i })
    }
    switch (equation.charAt(i)) {
      case ('÷'):
        opsArry.push({ 'type': "op", "subtype": "Div", "text": '/', "pos": i })
        break;
      case ('×'):
        opsArry.push({ 'type': "op", "subtype": "Muti", "text": '*', "pos": i })
        break;
      case ('<'):
        if (equation.substring(i, i + 5).includes('<sup>')) {
          let sub = supEncap(equation.substring(i))
          let subArry = opsInEquat(sub.substring(5, sub.length - 6)).arry
          for (let item of subArry) {
            item.pos += i + 2;
          }
          let replacement = "^(" + sub.substring(5, sub.length - 6) + ")";
          subArry.unshift({ 'type': "op", "subtype": "Pow", "text": "^", "pos": i }, { 'type': "op", "subtype": "ParStart", "text": "(", "pos": i + 1 })
          subArry.push({ 'type': "op", "subtype": "ParEnd", "text": ')', "pos": (i + replacement.length - 1) })
          opsArry = opsArry.concat(subArry)
          equation = equation.substring(0, i) + replacement + equation.substring(i + sub.length)
          i += replacement.length - 1;
        }
        break;
    }

  }
  return { "arry": opsArry, "equat": equation }
}
function termsInEquat(equation, fullArray) {
  let modEquat = equation
  let termArry = fullArray.length > 0 ? [] : [{ 'type': "term", "text": equation, "pos": 0 }]
  let completeArray = fullArray.length > 0 ? fullArray : [{ 'type': "term", "text": equation, "pos": 0 }]
  let diff = 0;
  for (let item of fullArray) {
    let diff = equation.length - modEquat.length
    let index = item.pos;
    let modIndex = index - diff
    let termBefore = basicNumInter(forward(modEquat.substring(0, modIndex)));
    let termAfter = basicNumInter(backward(modEquat.substring(modIndex + 1)));
    console.log(termBefore)
    console.log(termAfter)
    let prelength = termAfter.length;
    let beforeFunc = false
    if (funcMatch(termBefore, false) != "") {
      beforeFunc = true;
      let func = funcMatch(termBefore, false);
      let aindex = completeArray.indexOf(item);
      completeArray.splice(aindex, 0, { 'type': "func", 'text': func.func, "pos": [index + (termAfter.length - (func.func.length)), index + termAfter.length] })
      //termArry.push({ 'type': "func", 'text': func.func, "pos": [index + (termAfter.length - (func.func.length)), index + termAfter.length] })
      termBefore = termBefore.substring(0, termBefore.length - (func.func.length))

    }
    if (funcMatch(termAfter, false) != "") {
      let func = funcMatch(termAfter, false)
      let aindex = completeArray.indexOf(item);
      //afterFunc = { 'type': 'func', 'text': func.func, 'pos': [index + (termAfter.length - (func.func.length) + 1), index + termAfter.length] }
      completeArray.splice(aindex + 1, 0, { 'type': 'func', 'text': func.func, 'pos': [index + (termAfter.length - (func.func.length) + 1), index + termAfter.length] })
      termAfter = termAfter.substring(0, termAfter.length - (func.func.length))
    }
    if (termBefore) {
      let aindex = completeArray.indexOf(item);
      let pos = termBefore.length > 1 ? [index - termBefore.length, index] : index - 1;
      let term = {};
      if (varInEquat(termBefore).length != 0) {
        //termArry.push({ "type": "term", "subtype": 'varContainer', "text": termBefore, "pos": pos });
        term = { "type": "term", "subtype": 'varContainer', "text": termBefore, "pos": pos }
      } else {
        //termArry.push({ "type": "term", "text": termBefore, "pos": pos });\
        term = { "type": "term", "text": termBefore, "pos": pos }
      }
      if (beforeFunc) {
        completeArray.splice(aindex - 1, 0, term)
      } else {
        completeArray.splice(aindex, 0, term)
      }
    }
    if (termAfter) {
      let aindex = completeArray.indexOf(item);
      let pos = termAfter.length > 1 ? [index + 1, index + termAfter.length] : index + 1;
      let term = {};
      if (varInEquat(termAfter).length != 0) {
        //termArry.push({ "type": "term", "subtype": 'varContainer', "text": termAfter, "pos": pos });
        term = { "type": "term", "subtype": 'varContainer', "text": termAfter, "pos": pos }
      } else {
        //termArry.push({ "type": "term", "text": termAfter, "pos": pos });
        term = { "type": "term", "text": termAfter, "pos": pos }
      }
      completeArray.splice(aindex + 1, 0, term)
    }
    /*if (afterFunc != null) {
      termArry.push(afterFunc)
    }*/
    modEquat = modEquat.substring(modIndex + prelength + 1)
    console.log(modEquat)
  }
  //console.log(termArry)
  console.log(completeArray)
  return completeArray;
}
function combineTerms(fullArray, varDef) {
  parLinkMap(fullArray)
  //par processing

  let parStarts = fullArray.filter(elem => elem.subtype == "ParStart")
  while (true) {
    var start;
    if (parStarts[0] != undefined) {
      start = parStarts[0]
    } else {
      break;
    }
    console.log(fullArray)
    let endElem = fullArray[start.matchPar]
    let startPos = endElem.matchPar;
    let endPos = start.matchPar;
    let sub = fullArray.slice(startPos, start.matchPar + 1);
    let stringVer = arryToString(sub)
    if (sub.filter(elem => elem.type == 'defTerm').length > 0) {
      let termB = endElem.matchPar > 0 ? fullArray[endElem.matchPar - 1] : undefined;
      console.log("%c termB", "color: red", termB)
      let term = new CmpxTerm(fullArray.slice(endElem.matchPar + 1, start.matchPar), [start.pos + 1, endElem.pos], { 'type': 'term', 'text': 1 }, { 'type': 'term', 'text': 1 }, termB)
      console.log("code Reached")
      console.log(term.func)
      if (term.func == undefined) {
        console.log(fullArray)
        fullArray.splice(startPos, start.matchPar - endElem.matchPar + 1, term)
        let result = term.text
        updateFullArray(startPos, fullArray, -(stringVer.length - result.length + 1), start.matchPar - endElem.matchPar)
        console.log(fullArray)
      } else {
        console.log(term.func.text)
        let func = getByName(term.func.text);
        console.log(getByName(term.func.text))
        if (func.type == "function") {
          let arrayed = term.textArray
          let termInOrder = []
          while (true) {
            let comma = arrayed.find(elem => elem.type == 'op' && elem.subtype == 'Comma')
            if (comma == undefined) {
              termInOrder.push(arrayed)
              break;
            } else {
              let index = arrayed.indexOf(comma)
              termInOrder.push(arrayed.slice(0, index))
              arrayed = arrayed.slice(index + 1)
            }
          }
          let resultValue = parseableConverter(func.funcParse, termInOrder, varDef);
          fullArray.splice(startPos - 1, sub.length + 1, resultValue);
        } else {
          fullArray.splice(startPos - 1, sub.length + 1, term)
          let result = term.text
          updateFullArray(startPos, fullArray, -(stringVer.length - result.length - 1), sub.length)
        }
      }
    } else {
      console.log(stringVer)
      let repElem = { "type": 'term', "text": undefined }
      let result = undefined
      let changePos = undefined;
      let changeIndex = undefined;
      if (startPos - 1 > -1 && fullArray[startPos - 1].type == 'func') {
        result = "" + fullSolve(`${fullArray[startPos - 1].text}(${stringVer})`)
        repElem.text = result;
        fullArray.splice(startPos - 1, sub.length + 1, repElem)
        changePos = -(stringVer.length + fullArray[startPos - 1].text.length - result.length - 2)
        changeIndex = (sub.length)
        startPos--;
      } else {
        result = "" + fullSolve(stringVer)
        repElem.text = result;
        fullArray.splice(startPos, sub.length, repElem)
        changePos = -(stringVer.length - result.length - 1)
        changeIndex = (sub.length - 1)
      }
      let additions = 0;
      console.log(fullArray)
      if (startPos - 1 > 0 && fullArray.length > 1 && (fullArray[startPos - 1].type != 'op' && fullArray[startPos - 1].type != 'func')) {
        fullArray.splice(startPos - 1, 0, { 'type': 'op', 'subtype': 'Muti', 'text': '*' })
        additions++;
      }
      if (startPos + 1 != fullArray.length && fullArray[startPos + 1].type != 'op') {
        fullArray.splice(startPos + 1, 0, { 'type': 'op', 'subtype': 'Muti', 'text': '*' })
        additions++;
      }
      console.log(fullArray)
      updateFullArray(startPos + 1, fullArray, changePos, changeIndex - additions)
    }
    parStarts = fullArray.filter(elem => elem.subtype == "ParStart")
  }
  console.log(fullArray.text)
  //Pow processing
  for (let i = 0; i < fullArray.length; i++) {
    if (fullArray[i].subtype == 'Pow') {
      console.log('Pow Found')
      console.log(fullArray[i])
      let index = i;
      let termBefore = fullArray[index - 1]
      console.log(termBefore.type)
      let termAfter = fullArray[index + 1]
      if (termBefore.type == "defTerm") {
        console.log(termAfter)
        termBefore.changePow([{ 'type': 'op', 'subtype': 'Muti', 'text': '*' }, termAfter])
        fullArray.splice(index, 2);
        i = i - 2
      } else if (termAfter.type == "defTerm") {
        let termB = index - 2 > 0 ? fullArray[index - 3] : undefined;
        let newTermBefore = new CmpxTerm(fullArray.slice(index - 1, index), termBefore.pos, { 'type': 'term', 'text': 1 }, termAfter, termB)
        console.log(newTermBefore);
        fullArray.splice(index - 1, 3, newTermBefore)
        i = i - 2
      } else {
        let returned = fullSolve(`Math.pow(${termBefore},${termAfter})`);
        fullArray.splice(index - 1, 3, { 'type': "term", 'text': returned })
        i = i - 2
      }
    }
  }
  //Mutiplican processing
  for (let i = 0; i < fullArray.length; i++) {
    if (fullArray[i].subtype == 'Muti' || fullArray[i].subtype == "Div" || fullArray[i].subtype == 'Percent') {
      let termBefore = fullArray[i - 1]
      let termAfter = fullArray[i + 1]
      let sign = fullArray[i].subtype == 'Div' ? ['Div', '/'] : ['Muti', '*'];
      if (fullArray[i].subtype == 'Percent') {
        if (termAfter.type == 'def') {
          let shortArry = [{ 'type': 'op', 'subtype': 'ParStart', 'text': '(' }, termAfter, { 'type': 'op', 'subtype': 'Div', 'text': '/' }, { "type": "term", "text": '100', "pos": null }, { 'type': 'op', 'subtype': 'ParEnd', 'text': ')' }];
          termAfter = CmpxTerm(shortArry.slice(1, shortArry.length - 1), null, { 'type': 'term', 'text': 1 }, { 'type': 'term', 'text': 1 }, undefined)
        } else {
          termAfter.text = Number(termAfter) / 100;
        }
      }
      if (termBefore.type == "defTerm" && termAfter.type == "defTerm") {
        termBefore.changeMuti([{ 'type': 'op', 'subtype': sign[0], 'text': sign[1] }, termAfter])
        fullArray.splice(i, 2)
        i = i - 2
      } else if (termBefore.type == "defTerm" || termAfter.type == "defTerm") {
        let mutiElm = termBefore.type == 'defTerm' ? termAfter : termBefore;
        let elm = termBefore.type == 'defTerm' ? termBefore : termAfter;
        elm.changeMuti([{ 'type': 'op', 'subtype': sign[0], 'text': sign[1] }, mutiElm]);
        fullArray.splice(i - 1, 3, elm)
        i = i - 2
      } else {
        let result = fullSolve(`${termBefore.text}${sign[1]}${termAfter.text}`);
        let newTermBefore = { "type": 'term', 'text': `${result}` }
        fullArray.splice(i - 1, 3, newTermBefore)
        i = i - 2
      }
    }
  }
  //Additive processing
  for (let i = 0; i < fullArray.length; i++) {
    console.log(fullArray)
    if (fullArray[i].subtype == 'Plus' || fullArray[i].subtype == 'Minus') {
      let termBefore = fullArray[i - 1];
      let termAfter = fullArray[i + 1];
      if (termBefore.type != "defTerm" && termAfter.type != "defTerm") {
        console.log("functional additive")
        let op = fullArray[i].text;
        let calculated = "" + fullSolve(`${termBefore.text}${op}${termAfter.text}`)
        fullArray.splice(i - 1, 3, { 'type': "term", "text": calculated })
        i = i - 2
      }
    }
  }
  console.log(fullArray)
  return fullArray
}
function parLinkMap(fullArray) {
  for (let j = 0; j < fullArray.length; j++) {
    if (fullArray[j].subtype == "ParStart") {
      let returned = parEncapArray(fullArray, j)
      fullArray = returned[0]
      j += returned[1]
    }
  }
  return fullArray;
}
function parEncapArray(fullArray, startIndex) {
  let length = 0;
  for (let i = startIndex + 1; i < fullArray.length; i++) {
    length++
    if (fullArray[i].subtype === "ParStart") {
      let inner = parEncapArray(fullArray, i)
      fullArray = inner[0]
      i = i + inner[1];
    } else if (fullArray[i].subtype === "ParEnd") {
      fullArray[startIndex].matchPar = i;
      fullArray[i].matchPar = startIndex;
      break;
    } else if (i == fullArray.length - 1) {
      fullArray.push({ 'type': "op", "subtype": "ParEnd", "text": ')', "pos": fullArray.length, "matchPar": startIndex });
      fullArray[startIndex].matchPar = fullArray.length - 1;
      break;
    }
  }
  return [fullArray, length];
}
function parInArray(subArray) {

}

function updateFullArray(startPos, fullArray, changeInPos, changeInArry) {
  console.log("Updating")
  console.log(changeInPos)
  for (let i = startPos + 1; i < fullArray.length; i++) {
    let iterItem = fullArray[i];

    iterItem.matchPar != undefined && iterItem.matchPar > startPos ? iterItem.matchPar -= changeInArry : false;
    if (typeof iterItem.pos === typeof []) {
      iterItem.pos = [iterItem.pos[0] += changeInPos, iterItem.pos[1] += changeInPos]
    } else {
      iterItem.pos != undefined ? iterItem.pos += changeInPos : false;
    }
  }
  return fullArray;
}

function arryToString(arry) {
  let string = ""
  for (let item of arry) {
    string += item.text;
  }
  return string;
}
function parseTextTerm(elem, target) {
  let text = elem.text;
  console.log(text)
  let pos = elem.pos;
  let varList = varInEquat(text)
  console.log(varList)
  let textualArry = []
  let locals = []
  let targetVar = varList.filter(elem => elem.letter == target)
  if (targetVar.length == 0) {
    targetVar = [varList[0]]
    //varList.shift();
  }
  let subsituteText = text;
  for (let dVar of varList) {
    locals = locals.concat(dVar.positions);
  }
  locals.sort((a, b) => a - b)
  locals = locals.reverse();

  subsituteText.substring(locals[0] + 1) != '' ? textualArry.unshift({ "text": subsituteText.substring(locals[0] + 1), "pos": locals[0] + 1 == subsituteText.length - 1 ? locals[0] + 1 : [locals[0] + 1, subsituteText.length - 1] }) : false;
  subsituteText.substring(0, locals[0]) != '' ? textualArry.unshift({ "text": subsituteText.substring(0, locals[0]), "pos": 0 == locals[0] ? 0 : [0, locals[0]] }) : false
  locals.shift();
  for (let pos of locals) {
    let temp = textualArry[0].text
    textualArry.shift();
    temp.substring(pos + 1) != '' ? textualArry.unshift({ "text": temp.substring(pos + 1), "pos": pos + 1 == temp.length - 1 ? pos + 1 : [pos + 1, temp.length - 1] }) : false
    temp.substring(0, pos) != '' ? textualArry.unshift({ "text": temp.substring(0, pos), "pos": 0 == pos ? 0 : [0, pos] }) : false
  }
  //filter out targeted var
  console.log(targetVar[0].positions.length)
  let targetVarDef = new VarTerm(targetVar[0].letter, pos, textualArry.length > 0 ? textualArry[0] : { "type": 'term', 'text': '1' }, { "type": 'term', 'text': targetVar[0].positions.length }, targetVar[0].positions);
  console.log(targetVarDef.text)
  if (varList.length > 1) {
    let otherVars = varList.filter(elem => elem.letter != target)
    let max = targetVar[0].positions[targetVar[0].positions.length - 1]
    let targetMaxElem = targetVarDef
    for (let oVar of otherVars) {
      let newVarDef = new VarTerm(oVar.letter, pos, { 'type': 'term', 'text': 1 }, { 'type': 'term', 'text': oVar.positions.length }, oVar.positions);
      targetVarDef.changeMuti([{ 'type': 'op', 'subtype': 'Muti', 'text': '*' }, newVarDef])
      if (oVar.positions[oVar.positions.length - 1] > max) {
        max = oVar.positions[oVar.positions.length - 1]
        targetMaxElem = newVarDef
      }
    }
    targetVarDef.endElem = targetMaxElem;
  }
  console.log(targetVarDef.text)
  return targetVarDef
}
function basicNumInter(equation) {
  let reverEquat = reverseString(equation)
  let replacePos = [];
  for (let i = reverEquat.length - 1; i >= 0; i--) {
    if (reverEquat.charAt(i) == 'π' || reverEquat.charAt(i) == 'e') {
      let returned = reverEquat.charAt(i) == "e" ? Math.E : Math.PI
      let before = reverEquat.charAt(i - 1) == '' ? '' : '×';
      let after = reverEquat.charAt(i - 1) == '' ? '' : '×';
      equation = equation.substring(0, i) + before + returned + after + equation.substring(i + 1);
    }
  }
  return equation;
}
function reverseString(str) {
  return (str === '') ? '' : reverseString(str.substr(1)) + str.charAt(0);
}
function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}
function solveParse(parseArry) {

}
function replaceVars(arry, vars) {
  console.log(arry)
  console.log(vars)
  let value = vars.length
  let genVars = generateVars(value)
  console.log(genVars)
  arry.forEach((eElem, idx) => {
    if (eElem.subtype == "var") {
      console.log(vars.at(genVars.indexOf(eElem.letter))[0])
      arry.splice(idx, 1, ...vars[genVars.indexOf(eElem.letter)])
    }
  })
  return arry
}
function parseableConverter(parseArry, varsInOrder, varDef) {
  let genVars = generateVars(varsInOrder.length)
  for (let i = 0; i < genVars.length; i++) {
    parseArry.replaceAll("v" + (i + 1), "(" + genVars[i] + ")")
  }
  let resultArry = solveFor(parseArry.join(""), varDef)

  /*let filteredTerms = resultArry.filter(elem => elem.subtype == 'cmpxTerm')
  for(let i = 0; i < genVars.length; i++){
    for(let term of filteredTerms){

      if(term.text.includes(genVars[i])){
        resultArry[resultArry.indexOf(term)].termArray = termInOrder[i]
      }
    }
  }*/

  resultArry = replaceVars(resultArry, varsInOrder)
  console.log("%c result", "color: yellow", arryToString(resultArry))
  return new CmpxTerm(resultArry, 0, { 'type': 'term', 'text': 1 }, { 'type': 'term', 'text': 1 }, undefined);
}
//end
/*********************************************************spill over***************************************** */
function varInEquat(equation) {
  console.log(`Equation is ${equation}`)
  let varArray = [];
  for (let i = 0; i < equation.length; i++) {
    if (equation.charCodeAt(i) > 96 && equation.charCodeAt(i) < 123 || equation.charCodeAt(i) == 77) {
      console.log(equation.charAt(i))
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
        console.log(isVar(equation.substring(i)))
        i += isVar(equation.substring(i)) - 1;
      }
    }
  }
  return varArray;
}
function varInFunc(method) {
  method = method.substring(method.indexOf("("))
  let variableDefs = method.substring(1, method.indexOf(")")).trim();
  let variables = [];
  while (variableDefs.length > 0) {
    if (variableDefs.includes(',')) {
      variables.push({ "letter": variableDefs.substring(0, variableDefs.indexOf(',')) });
      variableDefs = variableDefs.substring(variableDefs.indexOf(',') + 1)
    } else {
      variables.push({ "letter": variableDefs });
      variableDefs = 0;
    }
  }
  return variables;
}
function varInList(list, varLetter) {
  for (let item of list) {
    if (item.letter == varLetter) {
      return item;
    }
  }
  return null;
}
function calculatePoints(parsedEquation, start, end, res) {
  console.log('calculating Points')
  let pointArray = [];
  start = Math.floor(start)
  end = Math.ceil(end)
  let invRes = 1 / res;
  let step = Math.abs(end - start) * invRes;
  for (let i = start; i <= end; i += step) {
    let newPoint = {};
    newPoint.x = i;
    if (i < 0.00000001 && i > -0.00000001) {
      newPoint.x = Math.round(i);
    }
    newPoint.y = fullSolve(parsedEquation.replaceAll('Æ', newPoint.x));
    pointArray.push(newPoint);
  }
  console.log(pointArray)
  return pointArray;
}
function trailingRound(num) {
  let stringDef = String(num)
  stringDef = stringDef.substring(stringDef.indexOf('.'))
  let arry = stringDef.split('')
  let count = 0;
  for (let val of arry) {
    if (val == '0') {
      count++
    }
  }
  if (count > 4) {
    return String(num).substring(0, String(num).indexOf('.'))
  } else {
    return num;
  }
}
function isVar(entry) {
  let func = funcMatch(entry, true);
  let ignore = ignoreTest(entry);
  if (func != "") {
    if (getByName(func) != false) {
      let object = getByName(func);
      return object.funcLength;
    } else {
      return func.func.length
    }
  } else if (ignore != undefined) {
    return ignore
  } else {
    return 0;
  }
}
function changeImplemented(oldName, newObject) {
  let oldConfig = getByName(oldName)
  let oldIndex = funcList.indexOf(oldConfig);
  funcList.splice(oldIndex, 1, newObject);
}
function changeFunc(type) {
  if (type == 'part') {
    let name = arguments[1]
    let changes = arguments[2]
    let repNames = Object.getOwnPropertyNames(changes)
    let target = getByName(name)
    for (let prop of repNames) {
      target[prop] = changes[prop]
    }
  } else {
    let tarName = arguments[1]
    let object = arguments[2]
    let target = getByName(tarName)
    let newFunc = {};
    if (object.type == 'function') {
      newFunc = parseFuncEntry(object.type, object.name, object.func);
    } else if (object.type == 'method') {
      newFunc = parseFuncEntry(object.type, object.text);
    }
    funcList.splice(funcList.indexOf(target), 1, newFunc)
  }
}
function getMethod(name) {
  return JSON.parse(JSON.stringify(getByName(name)));
}
function getParsedMethod(text) {
  return parseFunction(text)
}
function setVarEquat(equation, varList) {
  for (let data of varList) {
    for (let i = 0; i < equation.length; i++) {
      if (funcMatch(equation.substring(i), true) != "") {
        i += funcMatch(equation.substring(i), true).length;
      } else if (equation.substring(i,i+data.letter.length) == data.letter) {
        if (data.value != "") {
          equation = equation.substring(0, i) + "(" + data.value + ")" + equation.substring(i + 1);
        }
      }
    }
  }
  return equation;
}
function generateVars(length) {
  let newVars = [];
  for (let i = 0; i < length; i++) {
    newVars.push(String.fromCharCode(97 + i));
  }
  return newVars;
}
function funcsContainingVar(varLetter) {
  let funcs = [];
  for (let func of funcList) {
    if (Array.isArray(func.func)) {
      for (funcName of func.func) {
        if (funcName.includes(varLetter)) {
          funcs.push(funcName)
        }
      }
    } else {
      if (func.func.includes(varLetter)) {
        funcs.push({ "name": func.func, "idx": func.func.indexOf(varLetter) });
      }
    }
  }
  return funcs;
}
function getAngleCon(type) {
  if (settings.degRad) {
    if (type == 'deg') {
      return (Math.PI / 180);
    } else if (type = "rad") {
      return 180 / Math.PI;
    }
  } else {
    return 1;
  }
}
//end
console.log(parseFuncEntry("function",'testor', " x*5+y"))
console.log(parseFuncEntry("method", 'function methodTest(test,thing){\ntest*thing;\n}'))
/*let part1 = "6*5"
let part2 = "5^x"
console.log(part1)
console.log(part2)
let part1pre = solveFor(part1, "x");
let part2pre = solveFor(part2, "x");
console.log("%c here", "color:blue")
console.log(part1pre)
console.log(part2pre)
let part1Parse = combineTerms(part1pre)
let part2Parse = combineTerms(part2pre)
console.log(arryToString(part1Parse))
console.log(arryToString(part2Parse))
let trace = equatTrace(part2Parse, "x")
console.log(trace)
console.log(arryToString(solveForSide(part2Parse, part1Parse, trace)[1]))*/