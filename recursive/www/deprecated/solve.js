//var algebra = require("algebra.js");

//const algebra = require("algebra.js");

//var Solver = require("js-solver");
var Fraction = algebra.Fraction;
var Expression = algebra.Expression;
var Equation = algebra.Equation;
parseForCust("acot(1)+cos(x)+cos(2)+cos(2)+7+sin(5)+acot(2)=y", "thins", "x");

{
  var degRad = true;
}
//Parses the equation for a target or variable
function parseForCust(equation, varGrid, target) {
  degRad = false;
  if (target == "y") {
  } else {
    let containsTrig = false;
    var foundTrig = [];
    let functionList = [];
    let funcList = [
      "acsc",
      "asec",
      "acot",
      "asin",
      "acos",
      "atan",
      "sin",
      "cos",
      "tan",
      "csc",
      "sec",
      "cot",
      "ln",
      "log",
      "mod",
      "d→f"
    ];
    let subEquation = equation;
    for (let func of funcList) {
      while (subEquation.includes(func)) {
        if (subEquation.indexOf(func) > -1) {
          containsTrig = true;
          let contains = false;
          if (
            parEncap(
              subEquation.substring(subEquation.indexOf(func) + func.length)
            ).includes(target)
          ) {
            contains = true;
          }
          let inner = parEncap(
            subEquation.substring(subEquation.indexOf(func) + func.length)
          );
          foundTrig.push(
            JSON.parse(
              '{"func":"' +
                func +
                '", "index":' +
                funcIndex(func, equation, foundTrig) +
                ',"inner":"' +
                inner.substring(1, inner.length - 1) +
                '", "contains":' +
                contains +
                "}"
            )
          );
          subEquation = subEquation.substring(0, subEquation.indexOf(func)) + subEquation.substring(subEquation.indexOf(func) + func.length + inner.length);
        }
      }
    }
    console.log("Found Trig Before");

    foundTrig.sort(function (a, b) {
      let returnVal = -1;
      if (a.index > b.index) {
        returnVal = 1;
      }
      return returnVal;
    });
    if (containsTrig) {
      console.log(degRad);
      console.log("%c Running Func Loop", "color: blue");
      let funcInner = [];
      while (foundTrig.length > 0) {
        let trig = foundTrig[0];
        console.log(trig);
        if (!trig.contains) {
          let computed = 0.0;
          switch (trig.func) {
            case "sin":
              if (degRad) {
                computed = eval("Math.sin(" + trig.inner + "*(Math.PI/180))");
                console.log("Sin computed " + computed);
              } else {
                computed = eval("Math.sin(" + trig.inner + ")");
              }
              break;
            case "cos":
              if (degRad) {
                computed = eval("Math.cos(" + trig.inner + "*(Math.PI/180))");
              } else {
                computed = eval("Math.cos(" + trig.inner + ")");
              }
              break;
            case "tan":
              if (degRad) {
                computed = eval("Math.tan(" + trig.inner + "*(Math.PI/180))");
              } else {
                computed = eval("Math.tan(" + trig.inner + ")");
              }
              break;
            case "asin":
              if (degRad) {
                computed = eval("Math.asin(" + trig.inner + ")*(180/Math.PI)");
              } else {
                computed = eval("Math.asin(" + trig.inner + ")");
              }
              break;
            case "acos":
              if (degRad) {
                computed = eval("Math.acos(" + trig.inner + ")*(180/Math.PI)");
              } else {
                computed = eval("Math.acos(" + trig.inner + ")");
              }
              break;
            case "atan":
              if (degRad) {
                computed = eval("Math.atan(" + trig.inner + ")*(180/Math.PI)");
              } else {
                computed = eval("Math.atan(" + trig.inner + ")");
              }
              break;
            case "csc":
              if (degRad) {
                computed = eval(
                  "1/(Math.sin(" + trig.inner + "*(Math.PI/180)))"
                );
              } else {
                computed = eval("1/(Math.sin(" + trig.inner + "))");
              }
              break;
            case "sec":
              if (degRad) {
                computed = eval(
                  "1/(Math.cos(" + trig.inner + "*(Math.PI/180)))"
                );
              } else {
                computed = eval("1/(Math.cos(" + trig.inner + "))");
              }
              break;
            case "cot":
              if (degRad) {
                computed = eval(
                  "1/(Math.tan(" + trig.inner + "*(Math.PI/180)))"
                );
              } else {
                computed = eval("1/(Math.tan(" + trig.inner + "))");
              }
              break;
            case "acsc":
              if (degRad) {
                computed = eval(
                  "Math.asin(1/" + trig.inner + ")*(180/Math.PI)"
                );
              } else {
                computed = eval("Math.asin(1/" + trig.inner + ")");
              }
              break;
            case "asec":
              if (degRad) {
                computed = eval(
                  "Math.acos(1/" + trig.inner + ")*(180/Math.PI)"
                );
              } else {
                computed = eval("Math.acos(1/" + trig.inner + ")");
              }
              break;
            case "acot":
              if (degRad) {
                computed = eval(
                  "Math.atan(1/" + trig.inner + ")*(180/Math.PI)"
                );
              } else {
                computed = eval("Math.atan(1/" + trig.inner + ")");
              }
              break;
            case "ln":
              computed = eval("Math.log(" + trig.inner + ")");
              break;
            case "log":
              computed = eval("Math.log10(" + trig.inner + ")");
              break;
            case "mod":
              
          }
          console.log("%c Changing Equation", "color: lightgreen");
          equation =
            equation.substring(0, trig.index) +
            computed +
            equation.substring(
              trig.index + trig.inner.length + trig.func.length + 2
            );
          console.log("%c" + equation, "color: gray");
          foundTrig.shift();
          let offset =
            computed.toString().length -
            (trig.func.length + trig.inner.length + 2);
          for (let funcs of foundTrig) {
            funcs.index += offset;
          }
        } else {
          console.log("%c Running Bottom", "color: red");
          funcInner.push(foundTrig[0]);
          foundTrig.shift();
        }
        if (foundTrig.length == 0) {
          break;
        }
      }
      console.log("Trig loop done");
      console.log(equation);
      console.log(funcInner);
      if (funcInner.length > 0) {
        let sideOne = 0;
        let sideTwo = 0;
        //determines Which side to solve first in order to isolate the target
        let indexEquals = equation.indexOf("=");
        for (let innerTrig of funcInner) {
          if (innerTrig.contains && innerTrig.index < indexEquals) {
            sideOne++;
          } else {
            sideTwo++;
          }
        }
        let solveSide = "";
        let equatSide = "";
        if (sideOne > sideTwo) {
          solveSide = equation.substring(0, indexEquals);
          equatSide = equation.substring(indexEquals + 1);
        } else {
          solveSide = equation.substring(indexEquals + 1);
          equatSide = equation.substring(0, indexEquals);
        }
        console.log("Equation " + equation);
        console.log("Solve Side " + solveSide);
        console.log("Equat Side " + equatSide);
        for (let trig of funcInner) {
          let openVariable = findSafeVar(equation);
          solveSide = solveSide.replace(
            trig.func + "(" + trig.inner + ")",
            openVariable
          );
          console.log("Solve Side post " + solveSide);
          var x1 = algebra.parse("1/5 * x * 1");
          var x2 = algebra.parse("1/7 * x + 4");  
          var expr = new Expression("x");
          //expr = expr.subtract(3);
          //expr = expr.add("x");
          //console.log(expr.toString());
          var eq = new Equation(x1, x2);
          console.log(eq.toString());
          var x = eq.solveFor("x");

          console.log("x = " + x.toString());
        }
      }
    } else {
    }
  }
}
//Long Form
function findSafeVar(equation) {
  let posiableVar = [
    "a",
    "b",
    "c",
    "d",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "z",
  ];
  for (let i = 0; i < posiableVar.length; i++) {
    if (!equation.includes(posiableVar[i])) {
      return posiableVar[i];
    }
  }
}
function parComplete(input) {
  for (let i = 0; i < input.length; i++) {
    if (input.charAt(i) == "(") {
      if (
        i + parEncap(input.substring(i)).length >= input.length &&
        input.charAt(input.length - 1) != ")"
      ) {
        console.log("par coimplete complete par");
        input += ")";
      }
    }
  }
  return input;
}
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
function printArray(arr) {
  console.log("{");
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
  console.log("}");
}
function funcIndex(func, equation, funcList) {
  let has = false;
  var hasVal = -1;
  for (let i = funcList.length - 1; i >= 0; i--) {
    if (funcList[i].func == func) {
      has = true;
      console.log(funcList[i].index);
      if (hasVal < funcList[i].index) {
        hasVal = funcList[i].index + funcList[i].func.length;
      }
    }
  }
  console.log("Has is " + has + " hasVal index is " + hasVal);
  if (has) {
    return hasVal + equation.substring(hasVal).indexOf(func);
  } else {
    return equation.indexOf(func);
  }
}
