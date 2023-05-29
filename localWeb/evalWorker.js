let runners = [];
let self = this;
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
      return Math.sin(input * getAngleConversion("deg"));
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': ['asin', "arcsin"],
    'funcRadDeg': true,
    'funcLength': [4, 6],
    "inverse": "sin",
    'mth': (arry) => {
      let input = arry[0];
      return Math.asin(input) * getAngleConversion("rad");
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': 'cos',
    'funcRadDeg': true,
    'funcLength': 3,
    "inverse": "acos",
    'mth': (arry) => {
      let input = arry[0];
      return Math.cos(input * getAngleConversion("deg"));
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': ['acos', "arccos"],
    'funcRadDeg': true,
    'funcLength': [4, 6],
    "inverse": "cos",
    'mth': (arry) => {
      let input = arry[0];
      return Math.acos(input) * getAngleConversion("rad");
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': 'tan',
    'funcRadDeg': true,
    'funcLength': 3,
    "inverse": "atan",
    'mth': (arry) => {
      let input = arry[0];
      return Math.tan(input * getAngleConversion("deg"));
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': ['atan', "arctan"],
    'funcRadDeg': true,
    'funcLength': [4, 6],
    "inverse": "tan",
    'mth': (arry) => {
      let input = arry[0];
      return Math.atan(input) * getAngleConversion("rad");
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': 'csc',
    'funcRadDeg': true,
    'funcLength': 3,
    "inverse": "acsc",
    'mth': (arry) => {
      let input = arry[0];
      return 1 / Math.sin(input * getAngleConversion("deg"));
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': ['acsc', "arccsc"],
    'funcRadDeg': true,
    'funcLength': [4, 6],
    "inverse": "csc",
    'mth': (arry) => {
      let input = arry[0];
      return Math.asin(1 / input) * getAngleConversion("rad");
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': 'sec',
    'funcRadDeg': true,
    'funcLength': 3,
    "inverse": "asec",
    'mth': (arry) => {
      let input = arry[0];
      return 1 / Math.cos(input * getAngleConversion("deg"));
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': ['asec', "arcsec"],
    'funcRadDeg': true,
    'funcLength': [4, 6],
    "inverse": "sec",
    'mth': (arry) => {
      let input = arry[0];
      return Math.acos(1 / input) * getAngleConversion("rad");
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': 'cot',
    'funcRadDeg': true,
    'funcLength': 3,
    "inverse": "acot",
    'mth': (arry) => {
      let input = arry[0];
      return 1 / Math.tan(input * getAngleConversion("deg"));
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': ['acot', "arccot"],
    'funcRadDeg': true,
    'funcLength': [4, 6],
    "inverse": "cot",
    'mth': (arry) => {
      let input = arry[0];
      return Math.atan(1 / input) * getAngleConversion("rad");
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': 'abs',
    'funcRadDeg': false,
    'funcLength': 3,
    'mth': (arry) => {
      let input = arry[0];
      return Math.abs(input);
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': 'mod',
    'funcRadDeg': false,
    'funcLength': 3,
    'mth': (arry) => {
      let input = arry[0];
      return Math.abs(input);
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': 'abs',
    'funcRadDeg': false,
    'funcLength': 3,
    'mth': (arry) => {
      let input = arry[0];
      return Math.abs(input);
    },
    "predef": true
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
    },
    "predef": true
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
        //console.log(array)
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
    },
    "predef": true
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
    },
    "predef": true
  },
  {
    'type': 'method',
    'func': 'pow',
    'funcRadDeg': false,
    'funcLength': 3,
    'mth': (arry) => {
      let base = arry[0]
      let arg = arry[1]
      return Math.pow(base, arg);
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
  let testString = this;
  for (let func of funcList) {
    if (testString.includes(func.func)) {
      testString.replaceAll(func.func, "");
    }
  }
  if (testString.includes(tVar)) {
    return true;
  } else {
    return false;
  }
  /*for (let idx of posArry) {
    for (let func of posFunc) {
      if (idx >= func.idx && this.length - idx >= func.name.length - func.idx) {
        if (this.substring(idx - func.idx, idx - func.idx + func.name.length) != func.name) {
          console.log("false condition is true")
          return false;
        }
      }
    }
    return true;
  }*/
};
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
  if(arguments[2] != undefined){
    direction = arguments[2];
  }
  let fromIndex = direction ? 0 : copyString.length;
  while (true) {
    let startIndex = direction ? copyString.indexOf(start, fromIndex): copyString.lastIndexOf(start, fromIndex);
    console.log("start index: " + startIndex)
    let endIndex = direction ? copyString.indexOf(end, fromIndex) : copyString.lastIndexOf(end, fromIndex);
    console.log("end index: " + endIndex)
    if (startIndex > -1 && endIndex > -1) {
      if (direction ? startIndex < endIndex : startIndex > endIndex) {
        fromIndex = direction ? endIndex + end.length : startIndex;
      } else {
        matchIdx = direction ? endIndex : startIndex+start.length;
        break;
      }
    } else if (direction ? endIndex > -1 : startIndex > -1) {
      matchIdx = direction ? endIndex : startIndex+start.length;
      break;
    } else if (startIndex == -1 && endIndex == -1) {
      matchIdx = direction ? this.length : 0;
      break;
    }
  }
  return matchIdx;
}
String.prototype.findCharMatch = function (char){
  console.log('find Char ')
  let direction = true;
  if(arguments[3] != undefined){
    direction = arguments[3];
  }
  let indexes = this.indexOfAll(char);
  
  console.log(indexes)
  for(let i = direction ? 0 : indexes.length-1; direction ? i < indexes.length : i >= 0; direction ? i++ : i--){
    if(isOperator(direction ? this[indexes[i]-1] : this[indexes[i]+1])){
      i++;
      continue;
    }else{
      return indexes[i];
    }
  }
  return direction ? this.length : 0;
}
class TextTerm {
  constructor(string){
    this.type = "term"
    this.ogString = string;
  }
  get text(){
    return this.ogString;
  }
}
class solveEnv {
  constructor(object) {
    this.id = object.id
    this.vars = [];
  }
  calcSingle(equation) {
    let solvableEquat = setVarEquat(equation, this.vars);
    return fullSolve(solvableEquat, this.vars)
  }
  calcPoints(type, equation) {
    if (type == "graph" || type == "table") {
      let solvableEquat = setVarEquat(equation, this.vars);
      if (type == "graph") {
        return { "points": calculatePoints(solvableEquat, this.envVars.gMin, this.envVars.gMax, settings.gR, settings), "extrema": calculateExtrema(setVarEquat(equation, this.vars)) }
      } else {
        return calculatePoints(solvableEquat, settings.tMin, settings.tMax, settings.tC, settings)
      }
    } else if (type = "array") {
      let retArray = [];
      for (let equat of equation) {
        let solvableEquat = setVarEquat(equat, this.vars);
        let single;
        try {
          single = this.calcSingle(solvableEquat, this.vars)
        } catch (e) {
          single = "error"
        }
        retArray.push(single)
      }
      return retArray;
    }
  }
  setEnvVar(object) {
    this.envVars = {
      ...this.envType,
      ...object
    }
  }

}
class StaticEnv extends solveEnv {
  constructor(object) {
    super(object)
    this.envType = "static"
    this.envVars = {
      "gMin": settings.gMin,
      "gMax": settings.gMax
    };
    this.id = object.id

    this.equation = object.equation;
    if (object.isFunc) {
      this.func = getByName(this.id);
      this.isFunc = object.isFunc;
      this.vars = this.func.vars;
    } else {
      this.isFunc = false;
      this.vars = object.vars;
    }
    if (this.equation.includes('=')) {
      this.type = "mutiSide"
      for (let varI of this.vars) {
        varI.equalTo = findValueOf(varI.letter, this.equation)
      }
    } else {
      this.type = "singleSide"
    }
    this.getUndefVars();
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
        return assembly([...this.func.funcParse], funcMap)
      }

    } else {
      return setVarEquat(this.equation, this.vars, false);
    }
  }
  changeEquat(equat) {
    this.vars = varInEquat(equat);
    this.equation = equat;
    if (this.equation.includes('=')) {
      this.type = "mutiSide"
    } else {
      this.type = "singleSide"
    }
    this.checkCalculable();
  }
  setVar(target, value) {
    let targElem = this.vars.find(elem => elem.letter == target);
    targElem.value = value
    return this.checkCalculable();
  }
  getUndefVars() {
    let undef = [];
    this.vars.forEach(elem => {
      if (!elem.value) {
        undef.push(elem)
      }
    });
    this.undefVars = undef;
    return undef;
  }
  calcEquation(verified) {
    if (verified) {
      return this.calcSingle(this.equation);
    } else {
      let undef = this.undefVars;
      if (undef.length == 1) {
        if (this.type == "mutiSide") {
          this.tempEquation = arryToString(createSidedEquation(this.equation, undef[0].letter))
          return this.calcSingle(this.tempEquation);
        }
      } else if (undef.length == 0) {
        return this.calcSingle(this.equation);
      } else {
        return "";
      }
    }
  }
  calcGraph(verified) {
    if (verified) {
      return this.calcPoints("graph", this.equation);
    } else {
      let undef = this.undefVars;
      if (undef.length == 1 && this.type != "mutiSide") {
        return this.calcPoints("graph", this.equation);
      } else {
        return [];
      }
    }
  }
  calcTable(verified) {
    if (verified) {
      return this.calcPoints("table", this.equation);
    } else {
      let undef = this.undefVars;
      if (undef.length == 1 && this.type != "mutiSide") {
        return this.calcPoints("table", this.equation);
      } else {
        return [];
      }
    }
  }
  checkCalculable() {
    this.getUndefVars();
    let pointCalc = this.calcEquation();
    let graphCalc = this.calcGraph();
    let tableCalc = this.calcTable();
    let rtnVal = {
      result: this.getParsedEquation(),
      point: pointCalc,
      graph: graphCalc,
      table: tableCalc
    }
    return rtnVal;
  }
}
class DynamicEnv extends solveEnv {
  constructor(object) {
    super(object)
    this.type = "dynamic"
    this.target = object.target
    if (this.target == "graph") {
      this.envVars = {
        "gMin": settings.gMin,
        "gMax": settings.gMax
      };
    }
  }
  calcArray(arry) {
    for (let item of arry) {

    }
  }
  isVar() {
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
  isCalculable(equation) {
    //console.log(typeof equation)
    let equatVars = varInEquat(equation)
    let defVars = this.vars.filter(elem => elem.value != undefined && elem.value != "")
    let undefVars = equatVars.filter(elem => !defVars.find(elem2 => elem.letter == elem2.letter))
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
  solveEquation(equation) {
    if (!isVar(equation)) {
      let calc = this.isCalculable(equation);
      if (calc == "cant") {
        return "cant"
      } else if (calc == "r") {
        let result = this.calcSingle(equation);
        return result
      } else if (calc == "ds") {
        let solvableEquat = setVarEquat(equation, this.vars);
        let front = solvableEquat.substring(0, solvableEquat.indexOf('='))
        let back = solvableEquat.substring(solvableEquat.indexOf('=') + 1)
        let result1 = this.calcSingle(front)
        let result2 = this.calcSingle(back)
        return +result1 == +result2
      }
    }
  }
  solvePointArray(arry) {
    this.vars = [];
    if (this.target == "graph" || this.target == "table") {
      let retArry = [];
      for (let equation of arry) {
        let isCalc = this.isCalculable(equation);
        if (isCalc != "cant" && isCalc != "dS") {
          let result = this.calcPoints(this.target, equation);
          retArry.push(result)
        } else {
          retArry.push(undefined)
        }
      }
      return retArry;
    } else {
      return "Not a valid target"
    }
  }
  setVar(target, value) {
    if (this.vars.find(entry => entry.letter == target)) {
      this.vars.find(entry => entry.letter == target).value = value
    } else {
      this.vars.push({ "letter": target, "value": value })
    }

  }
  clearVars() {
    this.vars = [];
  }
}
onmessage = function (e) {
  let object = e.data;
  let port = e.ports[0];
  if (object.set != undefined) {
    if (object.set == "settings") {
      if (object.id == undefined) {
        if (object.settings.degRad != undefined) {
          settings.degRad = object.settings.degRad;
        }
        if (object.settings.gMin != undefined) {
          settings.gMin = object.settings.gMin;
        }
        if (object.settings.gMax != undefined) {
          settings.gMax = object.settings.gMax;
        }
        if (object.settings.gR != undefined) {
          settings.gR = object.settings.gR;
        }
        if (object.settings.tMin != undefined) {
          settings.tMin = object.settings.tMin;
        }
        if (object.settings.tMax != undefined) {
          settings.tMax = object.settings.tMax;
        }
        if (object.settings.tC != undefined) {
          settings.tC = object.settings.tC;
        }
      } else {
        let env = runners.find(elem => elem.id == object.id);
        console.log(runners)
        if (env != undefined) {
          env.setEnvVar(object.settings);
          if (env.envType == "static") {
            port.postMessage({ result: env.calcGraph() });
          } else {
            port.postMessage({ result: "Done" });
          }

        }

      }
    } else if (object.set == "env") {
      if (!runners.find(elem => elem.id == object.id)) {
        if (object.type == "static") {
          runners.push(new StaticEnv(object))
          console.log(runners);
        } else {
          runners.push(new DynamicEnv(object))
          console.log(runners);
        }
        port.postMessage({ result: true })
      } else {
        port.postMessage({ error: "env already exists" })
      }
    } else if (object.set == "envClear") {
      if (object.id != undefined) {
        let env = runners.find(elem => elem.id == object.id);
        if (env != undefined) {
          env.clearVars();
        }
      }
    } else if (object.set == "var") {
      if (object.id == undefined) {
        if (GlobalVars.find(elem => elem.name == object.varName)) {
          GlobalVars.find(elem => elem.name == object.varName).value = object.value;
        } else {
          GlobalVars.push({ name: object.varName, value: object.varValue })
        }
      } else {
        port.postMessage({ result: runners.find(elem => { return elem.id == object.id }).setVar(object.varName, object.varValue), return: true })
      }
    } else if (object.set == "func") {
      let list = Array.isArray(object.funcs) ? object.funcs : [object.funcs]
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
        this.postMessage({ 'type': 'posError', 'mes': `Issue adding functions to algo` });
      }

    } else if (object.set == "changeFunc") {
      if (object.name == undefined && object.changes == undefined) {
        port.postMessage({ result: changeFunc(object.name, object.changes) });
      }
    } else if (object.set == "removeFunc") {
      removeFunction(object.name)
    }
  } else if (object.get != undefined) {
    if (object.get == "func") {
      if (object.name != undefined) {
        port.postMessage({ result: getMethod(object.name) });
      }
    } else if (object.get == "list") {
      port.postMessage({ result: getNameList() })
    } else if (object.get == "vars") {
      if (object.name == undefined) {
        port.postMessage({ result: varInEquat(object.equation) })
      } else {
        let thing = funcList.find(elem => {
          if (Array.isArray(elem.func)) {
            return elem.func.includes(object.name);
          } else {
            return elem.func == object.name;
          }
        }
        )
        port.postMessage({
          result: thing.vars
        })
      }

    } else if (object.get == "equationParse") {
      if (object.id == undefined) {
        port.postMessage({
          result: setVarEquat(object.equation, object.vars, false)
        });
      } else {
        let env = runners.find(elem => elem.id == object.id)
        port.postMessage({
          result: env.getParsedEquation()
        });
      }
    } else if (object.get == "calc") {
      if (object.id == undefined) {
        if (object.target == "single") {
          port.postMessage({
            result: fullSolve(object.equation, settings)
          })
        }
      } else {
        let targetEnv = runners.find(elem => elem.id == object.id);
        console.log(targetEnv)
        if (targetEnv.type == "dynamic") {
          if (targetEnv.target == "single") {
            port.postMessage({
              result: targetEnv.solveEquation(object.equation)
            })
          } else {
            port.postMessage({
              result: targetEnv.solvePointArray(object.array)
            })
          }
        } else if (targetEnv.type == "static") {
          if (object.type == "point") {
            port.postMessage({
              result: targetEnv.calcEquation()
            })
          } else if (object.type == "graph") {
            port.postMessage({
              result: targetEnv.calcGraph()
            })
          } else if (object.type == "table") {
            port.postMessage({
              result: targetEnv.calcTable()
            })
          }

        }
      }
    } else if (object.get == "calcPacket") {
      console.log("callingPacket")
      if (object.id == undefined) {
        let env = runners.find(elem => elem.id == object.id);
        port.postMessage({ result: env.checkCalculable() })
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
function assembly(parsedFunc, values) {
  let i = 1;
  while (true) {
    let numVar = "v" + i;
    if (parsedFunc.includes(numVar)) {
      parsedFunc = parsedFunc.replaceAll(numVar, values[i - 1])
      i++;
    } else {
      break;
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
    parsedFunc = assembly(funcTemp, values);
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
  let direction = true;
  if(arguments[1] != undefined){
    direction = arguments[1];
  }
  let endIdx = sub.findMatch("(",")",direction);
  return direction ? sub.substring(0,endIdx) : sub.substring(endIdx);
}
//A method to find the beginning of a parenthesis and make one if there is none
/*function parEncap2(sub) {
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
}*/
//A method to find the ending of a superscript html tag. Doesn't make one if there is none
function supEncap(sub) {
  let direction = true;
  if(arguments[1] != undefined){
    direction = arguments[1];
  }
  let endIdx
  if(arguments[2] != undefined){
    endIdx = arguments[2];
  }else{
    endIdx = sub.findMatch("<sup","</sup>",direction);
  }
  
  return direction ? sub.substring(0, endIdx): sub.substring(sub.indexOf(">",endIdx)+1);
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
  console.log(equation)
  equation = equation.replaceAll('×', '*');
  equation = equation.replaceAll('÷', '/');
  let indexValue = equation.indexOf("√");
  while(indexValue >= 0){
    let root = "2";
    let from = indexValue;
    console.log(equation.substring(indexValue - 7, indexValue))
    if(indexValue > 6 && equation.substring(indexValue - 6, indexValue) == "</sup>"){
      let matchSup = equation.substring(0,indexValue - 6).findMatch("<sup","</sup>",false);
      root = findTerm(equation.substring(0,indexValue - 6),false);
      from = matchSup - 4;  
    }
    
    let term = findTerm(equation.substring(indexValue + 1));
    let replacement = "(" + term + "^(1/" + root + "))";
    if(from != 0 && !isOperator(equation[from - 1])){
      replacement = "*" + replacement;
    }
    equation = equation.substring(0,from)  + replacement + equation.substring(indexValue + term.length + 1);
    indexValue = equation.indexOf("√");
  }
  indexValue = equation.indexOf("|");
  while(indexValue >= 0){
    let matchEnd = equation.substring(indexValue+1).findCharMatch("|",true) + indexValue ;
    let replacement = "abs(" + equation.substring(indexValue + 1,matchEnd+1) + ")";
    if(indexValue - 1 >= 0 && !isOperator(equation[indexValue - 1])){
      replacement = "*" + replacement;
    }
    if(matchEnd + 2 <= equation.length && !isOperator(equation[matchEnd + 2])){
      replacement = replacement + "*";
    }
    equation = equation.substring(0,indexValue) + replacement + equation.substring(matchEnd+2);
    console.log("post operation: "+equation)
    indexValue = equation.indexOf("|");
  }
  indexValue = equation.indexOf("<sup");
  while(indexValue >= 0){
    console.log(equation.substring(equation.indexOf(">",indexValue)+1).findMatch("<sup","</sup>"))
    let matchEnd = equation.substring(equation.indexOf(">",indexValue)+1).findMatch("<sup","</sup>") + indexValue + equation.substring(indexValue, equation.indexOf(">",indexValue)+1).length;
    console.log(matchEnd);
    let term = findTerm(equation.substring(equation.indexOf(">",indexValue) + 1));
    equation = equation.substring(0,indexValue) + "^(" + term + ")" + equation.substring(matchEnd+6);
    console.log(equation)
    indexValue = equation.indexOf("<sup");
  }
  return equation;
}
//A method that finds the end of a number from the start of the number
function backward(sub) {
  let outputSub = "";
  for (i = 0; i <= sub.length - 1; i++) {
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
//A method that finds the start of a number from the end of the number
function forward(sub) {
  let outputSub = "";
  for (let i = sub.length - 1; i >= 0; i--) {
    if (sub.charAt(i) != '×' && sub.charAt(i) != '*' && sub.charAt(i) != '÷' && sub.charAt(i) != '/' && sub.charAt(i) != '√' && sub.charAt(i) != '²' && sub.charAt(i) != '^' && sub.charAt(i) != '(' && sub.charAt(i) != ')' && sub.charAt(i) != '%' && sub.charAt(i) != '!' && sub.charAt(i) != ',' && sub.charAt(i) != '|') {
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
function findTerm(equation){
  let direction = true;
  let endIndex = 0;
  if(arguments[1] != undefined){
    direction = arguments[1];
  }
  for(let i = direction ? 0: equation.length - 1; direction ? i < equation.length : i >= 0; direction ? i++ : i--){
    if(equation[i] == "(" || equation[i] == ")"){
      let nextIndex = direction ? equation.substring(i).findMatch("(",")",direction) : equation.substring(0,i-1).findMatch("(",")",direction);
      if(nextIndex != -1 ){
        i = nextIndex - 1 ;
        endIndex = i;
      }
    }else if (equation[i] == '+' || equation[i] == '-' ||equation[i] == '×' ||equation[i] == '<'||equation[i] == '>' || equation[i] == '*' || equation[i] == '÷' || equation[i] == '/' || equation[i] == '√' || equation[i] == '^' || equation[i] == '%' || equation[i] == '!' || equation[i] == ',' || equation[i] == '|'){
      endIndex = i; 
      break;
    }
    endIndex = endIndex + (direction ? 1 : -1);
  }
  return direction ? equation.substring(0,endIndex) : equation.substring(endIndex+1);
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
  return object;
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
    returnedObject.ogFunc = func;
    returnedObject.funcParse = parseable;
    returnedObject.inputs = cacInputs(parseable);
    returnedObject.vars = varInEquat(func);
    returnedObject.funcRadDeg = false;
    returnedObject.funcLength = name.length;
  } else if (arguments[0] == "method") {
    let funcString = arguments[1];
    returnedObject = parseFunction(funcString);
    //console.log(returnedObject)
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
function createSidedEquation(equation, target) {
  let decSide = false;
  let side1 = equation.substring(0, equation.indexOf('='))
  let side2 = equation.substring(equation.indexOf('=') + 1)
  if (side1.varIns(target) > side2.varIns(target)) {
    decSide = true;
  } else {
    decSide = false;
  }
  let part1Parse = combineTerms(solveFor(side1, target));
  console.log(arryToString(part1Parse))
  let part2Parse = combineTerms(solveFor(side2, target));
  console.log(arryToString(part2Parse))
  console.log(decSide)
  console.log(arryToString(part1Parse));
  console.log(part1Parse);
  let trace = equatTrace(decSide ? part1Parse : part2Parse, target)
  console.log(trace);
  let sided = solveForSide(decSide ? part1Parse : part2Parse, decSide ? part2Parse : part1Parse, trace)
  console.log(arryToString(sided[1]))
  return arryToString(sided[1])
}
function solveForSide(vSide, mSide, trace) {
  if (trace.length > 0) {
    let targetedElem = trace[0].term;
    let indOfElem = trace[0].index;
    let addArry = [...vSide]
    if (vSide.length != 1) {
      if (indOfElem != addArry.length - 1) {
        addArry.splice(indOfElem + 1, 1)
      } else {
        addArry.splice(indOfElem - 1, 2)
      }
      addArry.splice(indOfElem, 1);
      addArry.unshift({ 'type': 'op', 'subtype': 'Minus', 'text': '-' });
      mSide = mSide.concat(addArry);
      vSide = [targetedElem]
    }
    if (trace[0].loc == "textArray" || trace[0].loc == "letter") {
      if (vSide[0].getComputedMuti != 1 && vSide[0].getComputedMuti != undefined) {
        //console.log(vSide[0])
        let postMuti = swapMuti(vSide[0], mSide)
        mSide = postMuti[0]
      }
      if (vSide[0].getComputedPow != 1 && vSide[0].getComputedPow != undefined) {
        let postPow = swapPow(vSide[0], mSide)
        mSide = postPow[0]
      }
      if (targetedElem.subtype == "cmpxTerm") {
        //console.log("is complex term")
        if (targetedElem.func) {
          //console.log("has func")
          let intFunc = getByName(targetedElem.func.text)
          //console.log(targetedElem.func)
          //console.log(typeof intFunc)
          if (intFunc.inverse) {
            let replacement = [...targetedElem.textArray]
            replacement.splice(trace[1].index, 1, ...mSide)
            mSide = [new CmpxTerm(replacement, 0, { "type": "term", "text": '1', "pos": 0 }, { "type": "term", "text": '1', "pos": 0 }, { "type": "func", "text": intFunc.inverse })]
          }
        }
      }
      //console.log(vSide)
      vSide = vSide[0].textArray
      //console.log(vSide)
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
  //console.log(term)
  mSide.push({ 'type': 'op', 'subtype': 'ParEnd', 'text': ')', 'matchPar': 0 })
  mSide.unshift({ 'type': 'op', 'subtype': 'ParStart', 'text': '(', 'matchPar': mSide.length });
  let newMuti = [{ 'type': 'op', 'subtype': 'ParStart', 'text': '(', 'matchPar': term.mutiplican.length + 2 }, { "type": "term", "text": '1', "pos": 0 }, { "type": "op", "subtype": "Div", "text": "/" }]
  newMuti = newMuti.concat(term.mutiplican)
  newMuti.push({ 'type': 'op', 'subtype': 'ParEnd', 'text': ')', 'matchPar': 0 })
  //console.log(arryToString(mSide).hasVar())
  //console.log(arryToString(newMuti).hasVar())
  if (arryToString(mSide).hasVar() || arryToString(newMuti).hasVar()) {
    if (mSide.legnth == 1 && mSide[0].type == 'cmpxTerm') {
      mSide[0].mutiplican.concat(newMuti)
    } else {
      mSide = [new CmpxTerm(mSide.slice(0, mSide.length), 0, newMuti, { "type": "term", "text": '1', "pos": 0 }, undefined)]
    }
    term.mutiplican = []
  } else {
    //console.log(arryToString(mSide) + "*" + arryToString(newMuti));
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
  //console.log(arryToString(mSide).hasVar())
  //console.log(arryToString(newPow).hasVar())
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
  //console.log(arry)
  arry.forEach((term, i) => {
    let textualVal = "" + term.text
    console.log(textualVal);
    console.log(tVar)
    if (textualVal.innerVar(tVar)) {
      console.log("var in term");
      if (term.subtype == "cmpxTerm") {
        console.log(term)
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
          //console.log("var term found")
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
      highTerms.push(elem)
    }
  })
  return highTerms;
}
function matchingPowers(array1, array2) {

}
function solveFor(equat, varDef) {
  let returned = opsInEquat(equat);
  equat = returned.equat
  let fullArray = returned.arry;
  console.log(arryToString(fullArray))
  console.log(equat)
  fullArray = termsInEquat(equat, fullArray);
  for (let i = 0; i < fullArray.length; i++) {
    fullArray[i] = fullArray[i].subtype == "varContainer" ? fullArray[i] = parseTextTerm(fullArray[i], varDef) : fullArray[i];
  }
  fullArray = parLinkMap(fullArray);
  return fullArray
}
//********************************************** */
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
    //console.log(this.mutiplican)
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
      //console.log(taegElem)
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
    //console.log(this.endElem.pow)
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
    //console.log(array)
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
class VarTerm {
  constructor(input) {
    this.subtype = "var"

    this.letter = input;
  }
  get getNumeric() {
    for (let varI of GlobalVars) {
      if (varI.name == this.letter) {
        return varI.value
      }
    }
    return this.letter
  }

}
function parseEquation(equation) {
  let equatParse = [];
  let parseObj={
    "type": "equat",
    "equatArry": [],
    "par":[],
    "pow":[],
    "muti":[],
    "add":[],
  }
  cutLength = 0;
  while (true) {
    let cutString = 0;
    let currentSec = [];
    let termText = backward(equation);
    let currTerm;
    let currOp;
    let func;
    if(termText){
      currTerm = { 'type': "term", "text": termText, "pos": 0 };
      cutString += currTerm.text.length;
      currentSec.push(currTerm);
      console.log("The term text is "+termText)
      func = funcMatch(currTerm.text, false);
      if (func != "") {
        console.log("The function is "+func.func)
        if (currTerm.text.replace(func.func, "").length != 0) {
          currTerm.text = currTerm.text.replace(func.func, "")
          currentSec.push(...[{ 'type': "op", "subtype": "Muti", "text": "*", "pos": i }, { 'type': "func", "text": func.func, "pos": i }]);
        } else {
          currentSec.shift();
          currentSec.unshift({ 'type': "func", "text": func.func, "pos": i });
        }
      }
      if(varInEquat(currTerm.text).length != 0){
        //here
        currentSec.shift();
        currentSec.unshift(...parseTextTerm({ "type": "term", "subtype": 'varContainer', "text": currTerm.text, "pos": null }));
      }
    }
    if (equation.substring(cutString) != "") {
      currOp = createOp(equation.substring(cutString));
      let opIndex = parseObj.equatArry.length + currentSec.length;
      switch (currOp.group) {
        case "par":
          parseObj.par.push(opIndex);
          break;
        case "pow":
          parseObj.pow.push(opIndex);
          break;
        case "muti":
          parseObj.muti.push(opIndex);
          break;
        case "add":
          parseObj.add.push(opIndex);
          break;
      }
      if (currOp.subtype == "ParStart") {
        if (func == ""&& currTerm != undefined) {
          currentSec.splice(1, 0, { 'type': "op", "subtype": "Muti", "text": "*", "pos": i });
        }
        let encap = parEncap(equation.substring(cutString+1));
        cutString += encap.length + 2;
        let encapParse = parseEquation(encap);
        currentSec.push({type: "parSec", "text": encap, "pos": i, "parse": encapParse});
      }else{
        currentSec.push(currOp);
        cutString ++;
      }
    }
    cutLength += cutString;
    equation = equation.substring(cutString);
    parseObj.equatArry.push(...currentSec);
    if(equation.length == 0){
      break;
    }
  }
  return parseObj;
}
function solveParse(parse){

}
function mapEquation(equatArry) {

}
function createOp(section) {
  const ops = ['+', '-', '*', '/', '!', '^', "√", '%', '(', ')', ',',"|"]
  const typeIndex = ["Plus", "Minus", "Muti", "Div", 'factor', "Pow", "Sqrt", 'Percent', "ParStart", "ParEnd", 'Comma', "Abs"]
  const group = ["add", "add", "muti", "muti", "muti", "pow", "pow", "muti", "par", "par", "non", "non"];
  return { 'type': "op", "subtype": typeIndex[ops.indexOf(section.charAt(0))], "text": section.charAt(0), "pos": null, "group": group[ops.indexOf(section.charAt(0))] };
}
function opsInEquat(equation) {
  //console.log(`Equation before the ops method ${equation}`)
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
function formatEquation(equation){
let defs = [
  {
    "type": "op",
    "def": "%",
    "postEcap": ["(", "/100)"],
  },
  {
    "type": "encap",
    "def": "<sup",
    "termination" : ">",
    "endDef": "</sup>",
    "pre": "^(",
    "post": ")",
  }
];
}
function termsInEquat(equation, fullArray) {
  let modEquat = equation
  let completeArray = fullArray.length > 0 ? fullArray : [{ 'type': "term", "text": equation, "pos": 0 }]
  for (let item of fullArray) {
    let diff = equation.length - modEquat.length
    let index = item.pos;
    let modIndex = index - diff
    let termBefore = forward(modEquat.substring(0, modIndex));
    let termAfter = backward(modEquat.substring(modIndex + 1));
    let prelength = termAfter.length;
    let beforeFunc = false
    if (funcMatch(termBefore, false) != "") {
      beforeFunc = true;
      let func = funcMatch(termBefore, false);
      let aindex = completeArray.indexOf(item);
      completeArray.splice(aindex, 0, { 'type': "func", 'text': func.func, "pos": [index + (termAfter.length - (func.func.length)), index + termAfter.length] })
      termBefore = termBefore.substring(0, termBefore.length - (func.func.length))

    }
    if (funcMatch(termAfter, false) != "") {
      let func = funcMatch(termAfter, false)
      let aindex = completeArray.indexOf(item);
      completeArray.splice(aindex + 1, 0, { 'type': 'func', 'text': func.func, 'pos': [index + (termAfter.length - (func.func.length) + 1), index + termAfter.length] })
      termAfter = termAfter.substring(0, termAfter.length - (func.func.length))
    }
    termBefore = basicNumInter(termBefore);
    termAfter = basicNumInter(termAfter);
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
    modEquat = modEquat.substring(modIndex + prelength + 1)
  }
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
    let endElem = fullArray[start.matchPar]
    let startPos = endElem.matchPar;
    let endPos = start.matchPar;
    let sub = fullArray.slice(startPos, start.matchPar + 1);
    let stringVer = arryToString(sub)
    if (sub.filter(elem => elem.type == 'defTerm').length > 0) {
      let termB = endElem.matchPar > 0 ? fullArray[endElem.matchPar - 1] : undefined;
      let term = new CmpxTerm(fullArray.slice(endElem.matchPar + 1, start.matchPar), [start.pos + 1, endElem.pos], { 'type': 'term', 'text': 1 }, { 'type': 'term', 'text': 1 }, termB)
      if (term.func == undefined) {
        fullArray.splice(startPos, start.matchPar - endElem.matchPar + 1, term)
        let result = term.text
        updateFullArray(startPos, fullArray, -(stringVer.length - result.length + 1), start.matchPar - endElem.matchPar)
      } else {
        let func = getByName(term.func.text);
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
          let resultValue = parseableConverter([...func.funcParse], termInOrder, varDef);
          fullArray.splice(startPos - 1, sub.length + 1, resultValue);
        } else {
          fullArray.splice(startPos - 1, sub.length + 1, term)
          let result = term.text
          updateFullArray(startPos, fullArray, -(stringVer.length - result.length - 1), sub.length)
        }
      }
    } else {
      //console.log(stringVer)
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
      //console.log(fullArray)
      if (startPos - 1 > 0 && fullArray.length > 1 && (fullArray[startPos - 1].type != 'op' && fullArray[startPos - 1].type != 'func')) {
        fullArray.splice(startPos - 1, 0, { 'type': 'op', 'subtype': 'Muti', 'text': '*' })
        additions++;
      }
      if (startPos + 1 != fullArray.length && fullArray[startPos + 1].type != 'op') {
        fullArray.splice(startPos + 1, 0, { 'type': 'op', 'subtype': 'Muti', 'text': '*' })
        additions++;
      }
      //console.log(fullArray)
      updateFullArray(startPos + 1, fullArray, changePos, changeIndex - additions)
    }
    parStarts = fullArray.filter(elem => elem.subtype == "ParStart")
  }
  //console.log(fullArray.text)
  //Pow processing
  for (let i = 0; i < fullArray.length; i++) {
    if (fullArray[i].subtype == 'Pow') {
      let index = i;
      let termBefore = fullArray[index - 1]
      let termAfter = fullArray[index + 1]
      if (termBefore.type == "defTerm") {
        //console.log(termAfter)
        termBefore.changePow([{ 'type': 'op', 'subtype': 'Muti', 'text': '*' }, termAfter])
        fullArray.splice(index, 2);
        i = i - 2
      } else if (termAfter.type == "defTerm") {
        let termB = index - 2 > 0 ? fullArray[index - 3] : undefined;
        let newTermBefore = new CmpxTerm(fullArray.slice(index - 1, index), termBefore.pos, { 'type': 'term', 'text': 1 }, termAfter, termB)
        //console.log(newTermBefore);
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
    if (fullArray[i].subtype == 'Plus' || fullArray[i].subtype == 'Minus') {
      let termBefore = fullArray[i - 1];
      let termAfter = fullArray[i + 1];
      if (termBefore.type != "defTerm" && termAfter.type != "defTerm") {
        let op = fullArray[i].text;
        let calculated = "" + fullSolve(`${termBefore.text}${op}${termAfter.text}`)
        fullArray.splice(i - 1, 3, { 'type': "term", "text": calculated })
        i = i - 2
      }
    }
  }
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
function updateFullArray(startPos, fullArray, changeInPos, changeInArry) {
  //console.log("Updating")
  //console.log(changeInPos)
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
function parseTextTerm(elem) {
  let retArry = [];
  let text = elem.text;
  let nums = numInEquat(text);
  let product = 1;
  for(let num of nums){
    product *= num;
  }
  if(product != 1){
    retArry.push({'type': "term", "text": product, "pos": 0 });
    retArry.push(createOp("*"));
  }
  let varList = varInEquat(text);
  for(let varIn of varList){
    retArry.push(new VarTerm(varIn.letter));
    if(varIn.positions.length > 1){
      retArry.push(createOp("^"));
      retArry.push({'type': "term", "text": varIn.positions.length, "pos": 0 });
    }
    retArry.push(createOp("*"));
  }
  retArry.pop();
  return retArry;
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
function replaceVars(arry, vars) {
  //console.log(arry)
  //console.log(vars)
  let value = vars.length
  let genVars = generateVars(value)
  //console.log(genVars)
  arry.forEach((eElem, idx) => {
    if (eElem.subtype == "var") {
      //console.log(vars.at(genVars.indexOf(eElem.letter))[0])
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

  resultArry = replaceVars(resultArry, varsInOrder)
  //console.log("%c result", "color: yellow", arryToString(resultArry))
  return new CmpxTerm(resultArry, 0, { 'type': 'term', 'text': 1 }, { 'type': 'term', 'text': 1 }, undefined);
}
//end
/*********************************************************spill over***************************************** */
function varInEquat(equation) {
  //console.log(`Equation is ${equation}`)
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
        //console.log(isVar(equation.substring(i)))
        i += isVar(equation.substring(i)) - 1;
      }
    }
  }
  return varArray;
}
function numInEquat(equation){
  let numArry = []; 
  let currentNum = "";
  for (let i = 0; i < equation.length; i++) {
    if(!isNaN(equation[i])){
      currentNum += equation[i];
    }else if(currentNum != ""){
      numArry.push(currentNum);
      currentNum = "";
    }
  }
  return numArry;
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
function createParseEquat(equation) {
  let vars = varInEquat(equation);
  let solveArry = [];
  if (vars.length == 1) {
    let pos = vars[0].positions.reverse();
    for (let i = 0; i < pos.length; i++) {
      let sec = equation.substring(pos[i] + 1)
      solveArry.unshift(sec)
      equation = equation.substring(0, pos[i])
      if (pos[i] == pos.length - 1 || pos.length == 1) {
        solveArry.unshift(equation)
      }
    }
  } else {
    solveArry = [equation]
  }
  //console.log(solveArry)
  return solveArry
}
function calculatePoints(equation, start, end, res) {
  let pointArray = [];
  let parseEquation = createParseEquat(equation);
  let invRes = 1 / res;
  let step = Math.abs(end - start) * invRes;

  start = Math.floor(start)
  end = Math.ceil(end)

  for (let i = start; i <= end; i += step) {
    let newPoint = {};
    newPoint.x = i;
    if (i < 0.00000001 && i > -0.00000001) {
      newPoint.x = Math.round(i);
    }
    let proper = parseEquation.length > 0 ? parseEquation.join(newPoint.x) : "" + newPoint.x;
    newPoint.y = fullSolve(proper);
    pointArray.push(newPoint);

  }
  return pointArray;
}
function calculateExtrema(equation) {
  let extrema = [];
  let parseEquation = createParseEquat(equation);
  //console.log("%c parseEquation", "color: yellow", parseEquation)
  let copy = parseEquation.length > 0 ? parseEquation.join("x") : "x";
  console.log("%c parseEquation", "color: yellow", copy)
  if (varInEquat(copy).length == 1) {
    extrema.push({ x: fullSolve(createSidedEquation(copy + "=0", "x"), settings.degRad), y: 0 })
  }
  let proper = parseEquation.length > 0 ? parseEquation.join('0') : '0';
  extrema.push({ x: 0, y: fullSolve(parseEquation.join("0")) })
  return extrema;
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
function isOperator(entry) {
  let operators = ["+", "-", "*", "/", "^"]
  return operators.includes(entry);
}
function changeImplemented(oldName, newObject) {
  let oldConfig = getByName(oldName)
  let oldIndex = funcList.indexOf(oldConfig);
  funcList.splice(oldIndex, 1, newObject);
}
function changeFunc(name, newObject) {
  let target = funcList.find(elem => elem.func == name);
  let object = {};
  if (newObject.type == "Function") {
    object = parseFuncEntry("function", newObject.name, newObject.equation);
  } else if (newObject.type == "Hybrid" && !newObject.code.includes('XMLHttpRequest')) {
    object = parseFuncEntry("method", newObject.code);
  }
  runners.forEach((runner) => {
    if (runner.isFunc == true && runner.func == target) {
      runner.equation = newObject.equation;
      runner.func = object;
      runner.vars = object.vars;
    }
  });
  funcList.splice(funcList.indexOf(target), 1, object);
  return object;
}
function getMethod(name) {
  return JSON.parse(JSON.stringify(getByName(name)));
}
function setVarEquat(equation, varList) {
  for (let data of varList) {
    for (let i = 0; i < equation.length; i++) {
      let funcMatchVar = funcMatch(equation.substring(i), true);
      if (funcMatchVar != "") {
        i += funcMatchVar.func.length - 1;
      } else if (equation.substring(i, i + data.letter.length) == data.letter) {
        if (data.value != "" && data.value != undefined) {
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
function getAngleConversion(type) {
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
console.log("things from eval")
console.log(builtInFunc("<sup>42</sup>√23"))
console.log(createNewFunction("function", 'testor', "x*5+u"))
console.log(parseEquation("testor(23)+9xxf"))
console.log(solveFor("x*5+(u)", "x"))
console.log(parEncap("((78)",false))

console.log(createNewFunction("method", 'function methodTest(test,thing){\ntest*thing;\n}'))
console.log("%c testor", "color: yellow;", createSidedEquation("testor((6),x)=0", "x"))