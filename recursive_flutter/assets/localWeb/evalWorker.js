let settings = {
  'degRad': true,
  "tC": 5,
  "tMin": -10,
  "tMax": 10,
  "gR": 100,
  "gMin": -10,
  "gMax": 10
}
let inverseList = [
  {"reg": '+', 'inv': '-'},
  {"reg": '-', 'inv': '+'},
  {"reg": '*', 'inv': '/'},
  {"reg": '/', 'inv': '*'},
  {"reg": '+', 'inv': '-'},
  {"reg": '+', 'inv': '-'},
  {"reg": '+', 'inv': '-'},
];
let pageSettings = []
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
onmessage = function (e) {
  let valArry = e.data;
  let port = e.ports[0];
  if (valArry[0] == "set") {
    if (valArry[1] == 'set') {
      try {
        settings = valArry[2];
        port.postMessage({ result: "Set Settings" })
      } catch (eve) {
        console.log(eve)
        port.postMessage({ error: eve })
        this.postMessage({ 'type': 'posError', 'mes': `Error Setting Calc settings` })
      }
    } else if (valArry[1] == 'change') {
      try {
        let newSet = valArry[2];
        let nameArry = Object.getOwnPropertyNames(newSet)
        for (let name of nameArry) {
          settings[name] = newSet[name];
        }
      } catch (eve) {
        console.log(eve)
        port.postMessage({ error: eve })
        this.postMessage({ 'type': 'posError', 'mes': `Issue Modifing Settings` })
      }
    }
  } else if (valArry[0] == "get") {
    let object = valArry[1]
    if (object.item == 'list') {
      port.postMessage({ result: getNameList() })
    } else if (object.item == 'vars') {
      if (object.type == 'equat') {
        port.postMessage({ result: varInEquat(object.text) })
      } else {
        port.postMessage({ result: varInFunc(object.text) })
      }
    } else if (object.item == 'func') {
      port.postMessage({ result: getMethod(object.name) })
    } else if (object.item == 'parsedMethod') {
      port.postMessage({ result: parseFunction(object.text) })
    }

  } else if (valArry[0] == "func") {
    if (valArry[1] == 'add') {
      let list = Array.isArray(valArry[2]) ? valArry[2] : [valArry[2]]
      try {
        for (let def of list) {
          if (!getByName(def.name)) {
            if (def.type == 'Function') {
              try {
                createNewFunction('function', def.name, def.equation)
              } catch (eve) {
                this.postMessage({ 'type': 'posError', 'mes': `Issue adding ${def.name} to algo` })
              }
            } else if (def.type == 'Hybrid') {
              try {
                createNewFunction('method', def.code)
              } catch (e) {
                this.postMessage({ 'type': 'posError', 'mes': `Issue adding hybrid to algo` })
              }
            }
          }
        }
        port.postMessage({ result: 'Added Functions' })
      } catch (eve) {
        port.postMessage({ error: eve })
        this.postMessage({ 'type': 'posError', 'mes': `Issue adding functions to algo` })
        console.log('issues adding to algo')
      }
    } else if (valArry[1] == 'change') {
      let object = valArry[2]
      if(object.type == 'part'){
        changeFunc('part',object.name, object.chgPara)
      }else if (object.type == 'full'){
        changeFunc('full', object.name, arguments[1])
      }
    }
  } else if (valArry[0] == 'calc') {
    let object = valArry[1]
    if (object.type == 'solve') {
      try {
        port.postMessage({ result: fullSolve(object.text) })
      } catch (eve) {
        port.postMessage({ error: 'eve' })
        this.postMessage({ 'type': 'posError', 'mes': `Error Solving` })
      }
    } else if (object.type == 'points') {
      console.log('geting points')
      if (object.target == 'graph') {
        console.log('getting graph points')
        try {
          port.postMessage({"result":calculatePoints(object.text, object.min, object.max, object.res)})
        } catch (eve) {
          port.postMessage({ error: eve })
          this.postMessage({ 'type': 'posError', 'mes': `Error Calculating points for graph` })
        }
      } else {
        console.log('Solving for table')
        try {
          port.postMessage({"result":calculatePoints(object.text, settings.tMin, settings.tMax, settings.tC)})
        } catch (eve) {
          port.postMessage({ error: eve })
          this.postMessage({ 'type': 'posError', 'mes': `Error Calculating points for table` })
        }
      }
    }
  }
};
/*********************************************Solve Toothless****************************************** */
let defaultAngle = true;
let funcList = [
  {
    'type': "function",
    'func': "acsc",
    'funcParse': ["Math.asin(1/", "v1", ")", "toRad"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 4,
  },
  {
    'type': "function",
    'func': "asec",
    'funcParse': ["Math.acos(1/", "v1", ")", "toRad"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 4,
  },
  {
    'type': "function",
    'func': "acot",
    'funcParse': ["Math.atan(1/", "v1", ")", "toRad"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 4,
  },
  {
    'type': "function",
    'func': "asin",
    'funcParse': ["Math.asin(", "v1", ")", "toRad"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 4,
  },
  {
    'type': "function",
    'func': "acos",
    'funcParse': ["Math.acos(", "v1", ")", "toRad"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 4,
  },
  {
    'type': "function",
    'func': "atan",
    'funcParse': ["Math.atan(", "v1", ")", "toRad"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 4,
  },
  {
    'type': "function",
    'func': "sin",
    'funcParse': ["Math.sin(", "v1", "toDeg", ")"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 3,
  },
  {
    'type': "function",
    'func': "cos",
    'funcParse': ["Math.cos(", "v1", "toDeg", ")"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 3,
  },
  {
    'type': "function",
    'func': "tan",
    'funcParse': ["Math.tan(", "v1", "toDeg", ")"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 3,
  },
  {
    'type': "function",
    'func': "csc",
    'funcParse': ["1/Math.sin(", "v1", "toDeg", ")"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 3,
  },
  {
    'type': "function",
    'func': "sec",
    'funcParse': ["1/Math.cos(1/", "v1", "toDeg", ")"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 3,
  },
  {
    'type': "function",
    'func': "cot",
    'funcParse': ["1/Math.tan(1/", "v1", "toDeg", ")"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 3,
  },
  {
    'type': "function",
    'func': "ln",
    'funcParse': ["Math.log(", "v1", ")"],
    'inputs': 1,
    'funcRadDeg': false,
    'funcLength': 2,
  },
  {
    'type': "function",
    'func': "log",
    'funcParse': ["Math.log10(", "v1", ")"],
    'inputs': 1,
    'funcRadDeg': false,
    'funcLength': 3,
  },
  {
    'type': "function",
    'func': "mod",
    'funcParse': ["v1", "%", "v2"],
    'inputs': 2,
    'funcRadDeg': false,
    'funcLength': 3,
  },
  {
    'type': "function",
    "func": "abs",
    "funcParse": ["Math.abs(", "v1", ")"],
    "inputs": 1,
    "funcRadDeg": false,
    "funcLength": 3,
  },
  {
    'type': 'method',
    'func': 'gamma',
    'funcRadDeg': false,
    "funcLength": 5,
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
//Main method called to parse an Equation
function solveInpr(equation, degRad) {
  defaultAngle = degRad;
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
  let match = funcList.find(elem => elem.func == name)
  if (match) {
    return false;
  } else {
    return match;
  }
}
//A secondary method to match postions with functions but this one returns the function ength in order to skip through that in a loop
function funcMatch(equation, way) {
  var returned = "";
  for (let func of funcList) {
    let check
    if (way) {
      check = equation.substring(0, (func.funcLength));
    } else {
      check = equation.substring(equation.length - func.funcLength);
    }
    if (check == func.func) {
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
  let degRad = defaultAngle;
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
    nameList.push(func.func);
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
/*(var, var2){
  console.log(var + var2)
}*/
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
function stringFunction(object) {
  let name = object.func;
  let string = object.string;
  let vars = object.variables;
  for (let i = vars.length - 1; i >= 0; i--) {
    string = string.substring(0, 1) + `var ${vars[i].letter} = array[${i}];` + string.substring(1);
  }
  string = `var ${name} = function (array)${string} \n return ${name};`;
  return Function(string);
}
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
    "variables": variables,
    'full': preserved,
    "inputs": variables.length,
    "funcRadDeg": false,
    "funcLength": name.length
  }
  return finalObject;
}
function createNewFunction() {
  let object = {};
  if (arguments[0] == "function") {
    object = parseFuncEntry(arguments[0], arguments[1], arguments[2]);
  } else if (arguments[0] == "method" && !arguments[1].includes('XMLHttpRequest')) {
    object = parseFuncEntry(arguments[0], arguments[1]);
  }
  funcList.push(object);
}
function parseFuncEntry() {
  let returnedObject = {}
  if (arguments[0] == "function") {
    let name = arguments[1];
    let func = arguments[2];
    let parseable = createParseable(func, defaultAngle);
    returnedObject.type = arguments[0];
    returnedObject.func = name;
    returnedObject.funcParse = parseable;
    returnedObject.inputs = cacInputs(parseable);
    returnedObject.funcRadDeg = false;
    returnedObject.funcLength = name.length;
  } else if (arguments[0] == "method") {
    let funcString = arguments[1];
    returnedObject = parseFunction(funcString);
    returnedObject.mth = stringFunction(returnedObject)();
  }
  return returnedObject;
}
function removeFunction(name) {
  funcList = funcList.filter(function (value, index, arr) {
    return value.func != name;
  })
}
function indexOfAll(string, value) {
  let index = 0;
  let array = [];
  while (string.indexOf(value, index) != -1) {
    let newIndex = string.indexOf(value, index);
    array.push(newIndex);
    index = newIndex + 1;
  }
  return array;
}
function fullSolve(input) {
  if (!input.includes('XMLHttpRequest')) {
    return eval(solveInpr(input, true))
  } else {
    return undefined;
  }
}
//end
/***********************************************Solve For Algo*****************************************/

class definedTerm {
  pow = [];
  mutiplican = [];
  constructor(mutiplican, pow, pos) {
    this.pos = pos

    this.type = "defTerm"

    typeof mutiplican !== typeof [] ? this.mutiplican = mutiplican : this.mutiplican = [mutiplican];

    typeof pow !== typeof [] ? this.pow = pow : this.pow = [pow]

    this.additions = []

    this.endElem = this;
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

      let addMutiArray = [{ 'type': 'op', 'subtype': 'Muti', 'text': '×' }, { "type": 'op', "subtype": "ParStart", 'text': '(', 'matchPar': this.mutiplican.length + taegElem.mutiplican.length + 2 }]
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
    this.endElem.pow = combineTerms(newArray)
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
class cmpxTerm extends definedTerm {
  constructor(start, end, fullArray, pos, mutiplican, pow) {
    super(mutiplican, pow, pos)
    this.subtype = "cmpxTerm";

    this.textArray = fullArray.slice(start + 1, end)

    console.log(fullArray)
    console.log(start)
    if (fullArray[start - 1].type == "func") {
      this.func = fullArray[start - 1]
    }
  }
  get text() {
    let stringPow = arryToString(this.pow) != "1" ? "^(" + arryToString(this.pow) + ')' : '';
    let stringMutiplican = arryToString(this.mutiplican) != '1' ? arryToString(this.mutiplican) : '';
    let stringAddican = arryToString(this.additions).length != 0 ? '+' + arryToString(this.additions) : '';
    let stringFunc = this.func != undefined ? this.func.text : '';

    return stringFunc + stringMutiplican + arryToString(this.textArray) + stringPow + stringAddican;
  }
}
class varTerm extends definedTerm {
  constructor(input, pos, mutiplican, pow, innerPos) {
    super(mutiplican, pow, pos)
    this.subtype = "var"

    this.letter = input;

    this.innerPos = innerPos
  }
  get text() {
    let stringPow = arryToString(this.pow) != "1" ? "^(" + arryToString(this.pow) + ')' : '';
    let strignMutiplican = arryToString(this.mutiplican) != '1' ? arryToString(this.mutiplican) : '';
    let stringAddican = arryToString(this.additions).length != 0 ? '+' + arryToString(this.additions) : '';
    return strignMutiplican + this.letter + stringPow + stringAddican;
  }

}
function findValueOf(tVar, equat){
  let side1 = equat.substring(0,equat.indexOf('='));
  let side2 = equat.substring(equat.indexOf('=')+1);
  let conS1 = solveFor(side1,tVar);
  let conS2 = solveFor(side2,tVar);
  
  if((hasVar(conS1,tVar).length == 0) != (hasVar(conS2,tVar).length == 0)){

  }else{

  }
}
function hasVar(arry, dVar){
  let listOfIn = [];
  for(let val of arry){
    if(val.text.indexOf(dVar) != -1){
      listOfIn.push(val)
    }
  }
  return listOfIn;
}
function matchingPowers(array1, array2){

}
function solveFor(equat, varDef) {
  let returned = opsInEquat(equat);
  equat = returned.equat
  let fullArray = returned.arry;
  let termSheet = termsInEquat(equat, fullArray, varDef)

  for (let term of termSheet) {
    let pos = term.pos
    for (let i = 0; i < fullArray.length; i++) {
      if (typeof [] !== typeof pos) {
        if (fullArray[i].pos < pos && pos < fullArray[i + 1].pos) {
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
  }

  for (let i = 0; i < fullArray.length; i++) {
    fullArray[i] = fullArray[i].subtype == "varContainer" ? fullArray[i] = parseTextTerm(fullArray[i], varDef) : fullArray[i];
  }
  fullArray = parLinkMap(fullArray);
  fullArray = combineTerms(fullArray)

  return fullArray
}
function hasTerm(item, target){
  let fullArray = [];
  let nextTrm = item[0]
  while(nextTrm.ad.undefined ){

  }
}

function opsInEquat(equation) {
  console.log(`Equation before the ops method ${equation}`)
  let opsArry = []
  const ops = ['+', '-', '×', '÷', '!', '^', "√", '%', '(', ')', ',']
  const typeIndex = ["Plus", "Minus", "Muti", "Div", 'factor', "Pow", "Sqrt", 'Percent', "ParStart", "ParEnd", 'Comma']
  for (let i = 0; i < equation.length; i++) {
    console.log()
    if (ops.includes(equation.charAt(i))) {
      opsArry.push({ 'type': "op", "subtype": typeIndex[ops.indexOf(equation.charAt(i))], "text": equation.charAt(i), "pos": i })
    }
    switch (equation.charAt(i)) {
      case ('/'):
        opsArry.push({ 'type': "op", "subtype": "Div", "text": '÷', "pos": i })
        break;
      case ('*'):
        opsArry.push({ 'type': "op", "subtype": "Muti", "text": '×', "pos": i })
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
function termsInEquat(equation, fullArray, varDef) {
  let modEquat = equation
  let termArry = []
  let diff = 0;
  for (let item of fullArray) {
    let diff = equation.length - modEquat.length
    let index = item.pos;
    let modIndex = index - diff
    let termBefore = basicNumInter(forward(modEquat.substring(0, modIndex)));
    let termAfter = basicNumInter(backward(modEquat.substring(modIndex + 1)));
    let prelength = termAfter.length;
    let afterFunc = null

    if (index != diff && equation != modEquat) {
      console.log(`%c Incont: diff and index don't match`, "color: red;")
    }
    if (funcMatch(termBefore, false) != "") {
      let func = funcMatch(termBefore, false);
      termArry.push({ 'type': "func", 'text': func.func, "pos": [index + (termAfter.length - (func.func.length)), index + termAfter.length] })
      termBefore = termBefore.substring(0, termBefore.length - (func.func.length))

    }
    if (funcMatch(termAfter, false) != "") {
      let func = funcMatch(termAfter, false)
      afterFunc = { 'type': 'func', 'text': func.func, 'pos': [index + (termAfter.length - (func.func.length) + 1), index + termAfter.length] }
      termAfter = termAfter.substring(0, termAfter.length - (func.func.length))
    }
    if (termBefore) {
      let pos = termBefore.length > 1 ? [index - termBefore.length, index] : index - 1;
      if (varInEquat(termBefore).length != 0) {
        termArry.push({ "type": "term", "subtype": 'varContainer', "text": termBefore, "pos": pos });
      } else {
        termArry.push({ "type": "term", "text": termBefore, "pos": pos });
      }
    }
    if (termAfter) {
      let pos = termAfter.length > 1 ? [index + 1, index + termAfter.length] : index + 1;
      if (varInEquat(termAfter).length != 0) {
        termArry.push({ "type": "term", "subtype": 'varContainer', "text": termAfter, "pos": pos });
      } else {
        termArry.push({ "type": "term", "text": termAfter, "pos": pos });
      }
    }
    if (afterFunc != null) {
      termArry.push(afterFunc)
    }
    modEquat = modEquat.substring(modIndex + prelength + 1)
    console.log(modEquat)
  }
  return termArry;
}
function combineTerms(fullArray) {
  //par processing
  let parStarts = fullArray.filter(elem => elem.subtype == "ParStart")
  for (let start of parStarts) {
    let endElem = fullArray[start.matchPar]
    let startPos = endElem.matchPar;
    let sub = fullArray.slice(startPos, start.matchPar + 1);
    let stringVer = arryToString(sub)
    if (sub.filter(elem => elem.type == 'defTerm').length > 0) {
      let term = new cmpxTerm(endElem.matchPar, start.matchPar, fullArray, [start.pos, endElem.pos], { 'type': 'term', 'text': 1 }, { 'type': 'term', 'text': 1 })
      if (term.func != undefined) {
        fullArray.splice(startPos - 1, sub.length + 1, term)
        let result = term.text
        updateFullArray(startPos, fullArray, -(stringVer.length - result.length - 1), sub.length)
      } else {

      }
    } else {
      console.log(stringVer)
      let repElem = { "type": 'term', "text": undefined }
      let result = undefined
      let changePos = undefined;
      let changeIndex = undefined;
      if (fullArray[startPos - 1].type != 'func') {
        result = "" + fullSolve(stringVer)
        repElem.text = result;
        fullArray.splice(startPos, sub.length, repElem)
        changePos = -(stringVer.length - result.length - 1)
        changeIndex = (sub.length - 1)
      } else {
        result = "" + fullSolve(`${fullArray[startPos - 1].text}(${stringVer})`)
        repElem.text = result;
        fullArray.splice(startPos - 1, sub.length + 1, repElem)
        changePos = -(stringVer.length + fullArray[startPos - 1].text.length - result.length - 2)
        changeIndex = (sub.length)
        startPos--;
      }
      console.log(startPos)
      let additions = 0;
      if (startPos - 1 != 0 && (fullArray[startPos - 1].type != 'op' && fullArray[startPos - 1].type != 'func')) {
        fullArray.splice(startPos - 1, 0, { 'type': 'op', 'subtype': 'Muti', 'text': '×' })
        additions++;
      }
      if (startPos + 1 != fullArray.length && fullArray[startPos + 1].type != 'op') {
        fullArray.splice(startPos + 1, 0, { 'type': 'op', 'subtype': 'Muti', 'text': '×' })
        additions++;
      }
      console.log(fullArray)
      updateFullArray(startPos + 1, fullArray, changePos, changeIndex - additions)
    }

  }
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
        termBefore.changePow([{ 'type': 'op', 'subtype': 'Muti', 'text': '×' }, termAfter])
        fullArray.splice(index, 2);
        i = i - 2
      } else if (termAfter.type == "defTerm") {
        let newTermBefore = new cmpxTerm(index - 2, index, fullArray, termBefore.pos, { 'type': 'term', 'text': 1 }, termAfter)
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
      let sign = fullArray[i].subtype == 'Div' ? ['Div', '÷'] : ['Muti', '×'];
      if (fullArray[i].subtype == 'Percent') {
        if (termAfter.type == 'def') {
          let shortArry = [{ 'type': 'op', 'subtype': 'ParStart', 'text': '(' }, termAfter, { 'type': 'op', 'subtype': 'Div', 'text': '÷' }, { "type": "term", "text": '100', "pos": null }, { 'type': 'op', 'subtype': 'ParEnd', 'text': ')' }];
          termAfter = cmpxTerm(0, shortArry.length - 1, shortArry, null, { 'type': 'term', 'text': 1 }, { 'type': 'term', 'text': 1 })
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
      if (termBefore.type != "defTerm" && termAfter.type != "defTerm")  {
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
function parInArray(subArray) {

}

function updateFullArray(startPos, fullArray, changeInPos, changeInArry) {
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
  let pos = elem.pos;
  let varList = varInEquat(text)
  let textualArry = []
  let locals = []
  let targetVar = varList.filter(elem => elem.letter == target)
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

  if (targetVar.length > 0) {
    let targetVarDef = new varTerm(targetVar[0].letter, pos, textualArry.length > 0 ? textualArry[0] : { "type": 'term', 'text': '1' }, { "type": 'term', 'text': targetVar[0].positions.length }, targetVar[0].positions);
    console.log(targetVar[0].positions)
    if (varList.length > 1) {
      let otherVars = varList.filter(elem => elem.letter != target)
      let max = targetVar[0].positions[targetVar[0].positions.length - 1]
      let targetMaxElem = targetVarDef
      for (let oVar of otherVars) {
        let newVarDef = new varTerm(oVar.letter, pos, { 'type': 'term', 'text': 1 }, { 'type': 'term', 'text': oVar.positions.length }, oVar.positions);
        targetVarDef.changeMuti([{ 'type': 'op', 'subtype': 'Muti', 'text': '×' }, newVarDef])
        if (oVar.positions[oVar.positions.length - 1] > max) {
          max = oVar.positions[oVar.positions.length - 1]
          targetMaxElem = newVarDef
        }
      }
      targetVarDef.endElem = targetMaxElem;
    }
    console.log(targetVarDef)
    return targetVarDef
  } else {
  }
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
  console.log(ignore)
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
  }else{
    let tarName = arguments[1]
    let object = arguments[2]
    let target = getByName(tarName)
    let newFunc = {};
    if(object.type == 'function'){
      newFunc = parseFuncEntry(object.type, object.name, object.func);
    }else if (object.type == 'method'){
      newFunc = parseFuncEntry(object.type, object.text);
    }
    funcList.splice(funcList.indexOf(target), 1 , newFunc)
  }
}
function getNameList() {
  return funcList.map((elem) => elem = elem.func)
}
function getMethod(name) {
  return JSON.parse(JSON.stringify(getByName(name)));
}
function getParsedMethod(text) {
  return parseFunction(text)
}
//end
console.log(solveInpr('gamma(3)', true))