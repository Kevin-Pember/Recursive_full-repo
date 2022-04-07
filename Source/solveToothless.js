let funcList = [
  {
    'func': "acsc",
    'funcParse': ["Math.asin(1/", "v1", ")","toRad"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 4,
  },
  {
    'func': "asec",
    'funcParse': ["Math.acos(1/", "v1", ")", "toRad"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 4,
  },
  {
    'func': "acot",
    'funcParse': ["Math.atan(1/", "v1", ")", "toRad"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 4,
  },
  {
    'func': "asin",
    'funcParse': ["Math.asin(", "v1", ")", "toRad"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 4,
  },
  {
    'func': "acos",
    'funcParse': ["Math.acos(", "v1", ")", "toRad"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 4,
  },
  {
    'func': "atan",
    'funcParse': ["Math.atan(", "v1", ")", "toRad"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 4,
  },
  {
    'func': "sin",
    'funcParse': ["Math.sin(", "v1","toDeg",")"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 3,
  },
  {
    'func': "cos",
    'funcParse': ["Math.cos(", "v1", "toDeg", ")"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 3,
  },
  {
    'func': "tan",
    'funcParse': ["Math.tan(", "v1", "toDeg", ")"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 3,
  },
  {
    'func': "csc",
    'funcParse': ["1/Math.sin(", "v1", "toDeg", ")"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 3,
  },
  {
    'func': "sec",
    'funcParse': ["1/Math.cos(1/", "v1", "toDeg", ")"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 3,
  },
  {
    'func': "cot",
    'funcParse': ["1/Math.tan(1/", "v1", "toDeg", ")"],
    'inputs': 1,
    'funcRadDeg': true,
    'funcLength': 3,
  },
  {
    'func': "ln",
    'funcParse': ["Math.log(", "v1", ")"],
    'inputs': 1,
    'funcRadDeg': false,
    'funcLength': 2,
  },
  {
    'func': "log",
    'funcParse': ["Math.log10(", "v1", ")"],
    'inputs': 1,
    'funcRadDeg': false,
    'funcLength': 3,
  },
  {
    'func': "mod",
    'funcParse': ["v1", "%", "v2"],
    'inputs': 2,
    'funcRadDeg': false,
    'funcLength': 3,
  },
  {
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
//Main method called to parse an Equation
function solveInpr(equation, degRad) {
  equation = builtInFunc(equation);
  console.log('Inpr ran');
  for (let i = 0; i < equation.length; i++) {
    if (funcMatch(equation.substring(i)) != "") {
      let func = getByName(funcMatch(equation.substring(i)));
      let innerRAW = parEncap(
        equation.substring(i+func.funcLength)
      );
      let values = recrSolve(innerRAW.substring(1, innerRAW.length - 1),func,degRad);
      let funcTemp = findMethod(func,degRad);
      let parsedFunc = assembly(func, funcTemp, values);
      equation = equation.substring(0, i)+parsedFunc+equation.substring(i+func.funcLength+innerRAW.length);
      i = i+parsedFunc.length-1;
    }
  }
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
  for (let func of funcList) {
    let check = equation.substring(0, (func.funcLength));
    if (check == func.func) {
      return func.func;
    }
  }
  for (let func of secondList) {
    let check = equation.substring(0, (func.length));
    if (check == func) {
      console.log("%cfuncG: " + func, "color: red");
      return func;
    }
  }
  return "";
}
//A method to parse for functions that are defined diffrenely depending on weather or not in rad or deg
function findMethod(func,degRad) {
  let array = func.funcParse;
  if (func.funcRadDeg) {
    if(degRad){
      if(array.includes("toDeg")){
        array.splice(func.funcParse.indexOf("toDeg"), 1, "*(Math.PI/180)");
      }else{
        array.splice(func.funcParse.indexOf("toRad"), 1, "*(180/Math.PI)");
      }
    }else{
      if(array.includes("toDeg")){
        array.splice(func.funcParse.indexOf("toDeg"), 1, "");
      }else{
        array.splice(func.funcParse.indexOf("toRad"), 1, "");
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
function recrSolve(equation,func, degRad) {
  let inputs = func.inputs;
  if(inputs == 1){
    return [equatInner(equation, degRad)];
  }else {
    let values = [];
    for(let i = 1; i <= inputs; i++){
      if(i != inputs){
        values.push(equatInner(equation.substring(0, equation.indexOf(",")),degRad));
        equation = equation.substring(equation.indexOf(",") + 1);
      }else {
        values.push(equatInner(equation,degRad));
        break;
      }
    }
      return values
  }
}
//A method to solve for the inner values of encapsulated functions
function equatInner(equation,degRad){
  equation = solveInpr(equation,degRad);
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
function builtInFunc(equation){
  equation = equation.replaceAll('‎','');
  equation = equation.replaceAll('e','Math.E');
  equation = equation.replaceAll('×','*');
  equation = equation.replaceAll('÷','/');
  for(let i = 0; i < equation.length; i++){
    if(equation.substring(i, i + 5) == "<sup>"){
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
    }else if(equation.charAt(i) == "^"){
      let exponent = "";
      let exponentRAW = "";
      let base = "";
      let baseRAW = "";
      if(equation.charAt(i-1) == ")"){
        base = equatInner(parEncap2(equation.substring(0,i)).substring(1,parEncap2(equation.substring(0,i)).length-1));
        baseRAW = parEncap2(equation.substring(0,i));
      }else{
        base = forward(equation.substring(0,i));
        baseRAW = forward(equation.substring(0,i));
      }
      if(equation.charAt(i+1) == "("){
        exponent = equatInner(parEncap(equation.substring(i+1)));
        exponentRAW = parEncap(equation.substring(i+1));
      }else{
        exponent = backward(equation.substring(i+1));
        exponentRAW = backward(equation.substring(i+1));
      }
      equation = equation.substring(0,i-baseRAW.length) + "Math.pow(" + base + "," + exponent + ")" + equation.substring(i+exponentRAW.length+1);
    }else if(equation.charAt(i) == "√"){
      if (equation.charAt(i + 1) == '(') {
        equation = equation.substring(0, i) + "Math.sqrt" + equation.substring(i + 1);
      } else {
        let inner = equatInner(backward(equation.substring(i + 1)));
        let innerRAW = backward(equation.substring(i + 1));
        equation = equation.substring(0, i) + "Math.sqrt(" + inner + ")" + equation.substring(i+innerRAW.length + 1);
        i = i + inner.length +7;
      }
    }else if(equation.charAt(i) == "π"){
      let parseString = "Math.PI";
      if(backward(equation.substring(i+1)).length > 0){
        let number = backward(equation.substring(i+1));
        parseString = Math.PI * Number(number);
        equation = equation.substring(0, i)+ parseString + equation.substring(i+number.length+1);
        break;
      }
      if(forward(equation.substring(0,i)).length > 0){
        let number = forward(equation.substring(0,i));
        parseString = Math.PI * Number(number);
        equation = equation.substring(0,i-number.length) + parseString + equation.substring(i+1);
        break;
      }
      equation = equation.substring(0, i) + parseString + equation.substring(i + 1);
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
function getNameList(){
  let nameList = [];
  for(let func of funcList){
    nameList.push(func.func);
  }
  return nameList;
}
