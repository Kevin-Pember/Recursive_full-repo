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
  }
];
let secondList = [
  "sup>",
];
parseFunction("function hello(var,shit){}")
//Main method called to parse an Equation
function solveInpr(equation, degRad) {
  console.log('Inpr ran');
  for (let i = 0; i < equation.length; i++) {
    if (funcMatch(equation.substring(i)) != "") {
      let func = getByName(funcMatch(equation.substring(i)));
      let innerRAW = parEncap(
        equation.substring(i + func.funcLength)
      );
      let values = recrSolve(innerRAW.substring(1, innerRAW.length - 1), func, degRad);
      let parsedFunc = "";
      if (func.type == "function") {
        let funcTemp = findMethod(func, degRad);
        parsedFunc = assembly(func, funcTemp, values);
      } else if (func.type == "method") {
        parsedFunc = func.mth(values)
      }
      equation = equation.substring(0, i) + parsedFunc + equation.substring(i + func.funcLength + innerRAW.length);
      i = i + parsedFunc.length - 1;
    }
  }
  equation = builtInFunc(equation);
  console.log(`Equation: ${equation}`);
  return equation;
}
//Func method to find if the current postion has a function defined in the funclist
function getByName(name) {
  for (let func of funcList) {
    if (func.func == name) {
      return func;
    }
  }
  return null;
}
//A secondary method to match postions with functions but this one returns the function ength in order to skip through that in a loop
function funcMatch(equation) {
  var returned = "";
  for (let func of funcList) {
    let check = equation.substring(0, (func.funcLength));
    if (check == func.func) {
      console.log(`%c func matched ${func.func}`, "color: yellow;")
      returned = func.func;
    }
  }
  for (let func of secondList) {
    let check = equation.substring(0, (func.length));
    if (check == func) {
      returned =  "";
    }
  }
  return returned;
}
//A method to parse for functions that are defined diffrenely depending on weather or not in rad or deg
function findMethod(funcUn, degRad) {
  let func = JSON.parse(JSON.stringify(funcUn));
  let array = func.funcParse;
  console.log(`%cfunc Parse ${array}`, "color: blue")
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
    let index = parsedFunc.indexOf("v" + i);
    parsedFunc[index] = values[i - 1];
  }
  let parsedString = parsedFunc.join("");
  return parsedString;
}
//A method which takes the inputs value from a func object in the funclist and gets how many inputs that function has and parses each
function recrSolve(equation, func, degRad) {
  let inputs = func.inputs;
  if (inputs == 1) {
    return [equatInner(equation, degRad)];
  } else {
    let values = [];
    for (let i = 1; i <= inputs; i++) {
      if (i != inputs) {
        values.push(equatInner(equation.substring(0, equation.indexOf(",")), degRad));
        equation = equation.substring(equation.indexOf(",") + 1);
      } else {
        values.push(equatInner(equation, degRad));
        break;
      }
    }
    return values
  }
}
//A method to solve for the inner values of encapsulated functions
function equatInner(equation, degRad) {
  equation = solveInpr(equation, degRad);
  //eval(equation)
  return equation;
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
  console.log("Sub is " + sub);
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
      let exponent = equatInner(supEncap(equation.substring(i)).substring(5,supEncap(equation.substring(i)).length-6));
      let exponentRAW = supEncap(equation.substring(i));
      let base = "";
      let baseRAW = "";
      if(equation.charAt(i-1) == ")"){
        base = equatInner(parEncap2(equation.substring(0,i)).substring(1,parEncap2(equation.substring(0,i)).length-1));
        baseRAW = parEncap2(equation.substring(0,i));
      }else{
        base = forward(equation.substring(0,i));
        baseRAW = forward(equation.substring(0,i));
      }
      equation = equation.substring(0,i-baseRAW.length) + "Math.pow(" + base + "," + exponent + ")" + equation.substring(i+exponentRAW.length);
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
  console.log("Outputsub is " + outputSub);
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
/*function findSign(sub) {
  let type = false;
  if (sub.charAt(0) == "(") {
    type = true;
    sub = sub.substring(1);
  }

  for (let i = 1; i < sub.length; i++) {
    if (sub.charAt(i) == "|" && sub.charAt(i + 1) != ")" && !type) {

    } else if (sub.charAt(i) == "|" && sub.charAt(i + 1) == ")" && type) {

    }
  }
}*/
//Takes string and returns an array for funclist
function createParseable(equation) {
  let equationArray = [];
  let variablesInOrder = [];
  let varArray = varInEquat(equation);
  for (let i = 0; i < varArray.length; i++) {
    varArray[i].letter = "v" + (i + 1);
  }
  console.log(varArray);
  variablesInOrder.push({ "name": varArray[0].letter, "index": varArray[0].positions[0] });
  varArray.shift();
  for (item of varArray) {
    for (let postion of item.positions) {
      for (let j = variablesInOrder.length - 1; j >= 0; j--) {
        if (postion > variablesInOrder[j].index) {
          variablesInOrder.splice(j + 1, 0, { "name": item.letter, "index": postion });
          break;
        }
      }
    }
  }
  for (let i = 0; i < variablesInOrder.length; i++) {
    let index = variablesInOrder[i].index;
    let pre = "";
    let vard = "";
    if (i == 0) {
      pre = equation.substring(0, index);
      vard = variablesInOrder[i].name;
    } else {
      let prevIndex = variablesInOrder[i - 1].index;
      pre = equation.substring(prevIndex + 1, index);
      vard = variablesInOrder[i].name;
    }
    if (pre != "") {
      equationArray.push(pre);
    }
    equationArray.push(vard);
    if (i == variablesInOrder.length - 1 && equation.substring(index + 1) != '') {
      equationArray.push(equation.substring(index + 1));
    }
  }
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
function stringifyMethod(object){
  let name = object.func;
  let string = object.string;
  let vars = object.variables;
  let parsedVariables = "";
  for (let i = 0; i < vars.length; i++) {
    if(i == 0){
      parsedVariables += vars[i].letter;
    }else{
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
  console.log(string)
  return Function(string);
}
function parseFunction(StringFunction) {
  console.log(StringFunction)
  StringFunction = StringFunction.substring(StringFunction.indexOf("function") + 9)
  let name = StringFunction.substring(0, StringFunction.indexOf("(")).trim();
  StringFunction = StringFunction.substring(StringFunction.indexOf("("))
  let variableDefs = StringFunction.substring(1, StringFunction.indexOf(")")).trim();
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
  StringFunction = StringFunction.substring(StringFunction.indexOf("{"));
  console.log(`%c ${variables[0]}`, "color: green;")
  let finalObject = {
    "func": name,
    "type": "method",
    "string": StringFunction,
    "variables": variables,
    "inputs": variables.length,
    "funcRadDeg": false,
    "funcLength": name.length
  }
  //stringFunction(name, StringFunction)
  //funcList.push(finalObject)
  return finalObject;
}
function createNewFunction() {
  let object = {};
  if (arguments[0] == "function") {
    object = parseFuncEntry(arguments[0], arguments[1], arguments[2]);
    /*let name = arguments[1];
    let func = arguments[2];
    let parseable = createParseable(solveInpr(func), defaultAngle);
    object.type = arguments[0];
    object.func = name;
    object.funcParse = parseable;
    object.inputs = cacInputs(parseable);
    object.funcRadDeg = containsTrig(func);
    object.funcLength = name.length;
    funcList.push(object);*/
  } else if (arguments[0] == "method") {
    object = parseFuncEntry(arguments[0], arguments[1]);
    /*let funcString = arguments[1];
    let funcObject = parseFunction(funcString);
    funcObject.mth = stringFunction(funcObject)();
    funcList.push(funcObject);*/
  }
  console.log(object)
  funcList.push(object);
}
function parseFuncEntry() {
  let returnedObject = {}
  if (arguments[0] == "function") {
    let name = arguments[1];
    let func = arguments[2];
    let parseable = createParseable(solveInpr(func), defaultAngle);
    returnedObject.type = arguments[0];
    returnedObject.func = name;
    returnedObject.funcParse = parseable;
    returnedObject.inputs = cacInputs(parseable);
    returnedObject.funcRadDeg = containsTrig(func);
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