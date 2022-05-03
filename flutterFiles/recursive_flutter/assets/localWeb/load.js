let TextColorGlobal = "";
let BackgroundColorGlobal = "";
let state = {};
var settings;
console.log();
//parseFunction("function thing(s){ console.log(s); };");
//eval("var thing = function (s) { console.log(s);};")
//thing("hello")
if (localStorage.getItem("settings") != undefined) {
  settings = JSON.parse(localStorage.getItem("settings"));
  console.log("settings got");
  console.log(settings);
} else {
  localStorage.setItem("settings", '{"version": 1,"oL":"auto","degRad": true,"notation": "simple","theme": "darkMode","acc":"blue","tS" : 1,"tC" : 5,"gDS" : 1,"gDMin" : -10,"gDMax" : 10,"gRS" : 1,"gRMin" : -10,"gRMax" : 10}');
  settings = JSON.parse(localStorage.getItem("settings"));
  console.log(settings);
}
let themeElem = {};
let themes = getThemes();
for (let theme of themes) {
  if (theme.name == settings.theme) {
    setRoot(theme.getMth());
    themeElem = theme;
  }
}
//Deprecated method for web apps
/*
BackgroundColorGlobal = settings.func;
var allMetaElements = document.getElementsByTagName('meta');
for (var i = 0; i < allMetaElements.length; i++) {
  if (allMetaElements[i].getAttribute("name") == "theme-color") {
    allMetaElements[i].setAttribute('content', BackgroundColorGlobal);
    break;
  }
}*/
if (document.getElementById("mainBody") != null) {
  console.log(createParseable("8+v+9*9"))
  if (!settings.degRad) {
    setDegMode();
  }
  let images = [
    {
      "type": "single",
      "id": "settingsCogIcon",
      "src": "Images/SettingsCog.svg"
    },
    {
      "type": "single",
      "id": "backspcaeIcon",
      "src": "Images/backIcon.svg"
    },
    {
      "type": "single",
      "id": "mobileTabIcon",
      "src": "Images/mobileTabsIcon.svg"
    },
    {
      "type": "mutiple",
      "class": "helpIcon",
      "src": "Images/help.svg"
    },
    {
      "type": "mutiple",
      "class": "historyIcon",
      "src": "Images/historyIcon.svg"
    },
    {
      "type": "mutiple",
      "class": "addIcon",
      "src": "Images/addObject.svg"
    },
    {
      "type": "mutiple",
      "class": "minusIcon",
      "src": "Images/minusIcon.svg"
    },
    {
      "type": "mutiple",
      "class": "arrows",
      "src": "Images/MoreFuncArrow.svg"
    }
  ];
  if (TextColorGlobal == "#000000") {
    setImages(images);
  }
  if (sessionStorage.getItem("state") == undefined) {
    let object = { "eT": "", "tS": [false, false], "fO": [] }
    state = object;
    sessionStorage.setItem("state", JSON.stringify(state));
  } else {
    state = JSON.parse(sessionStorage.getItem("state"));
    document.getElementById('enterHeader').innerHTML = state.eT;
    let funcAry = state.fO;
    for (let item of funcAry) {
      createTab(findFuncConfig(item))
    }
    if (state.tS[0]) {
      setInverse();
    }
    if (state.tS[1]) {
      setArc();
    }
  }
  var funcs = getFuncList();
  console.log(funcs)
  for (let funcObject of funcs) {
    addImplemented(funcObject);
    switch (funcObject.type) {
      case "Function":
        custButton(funcObject, ['customFuncDisplayGrid', 'custFuncGridPopup']);
        break;
      case "Code":
        custButton(funcObject, ['customFuncDisplayGrid', 'custFuncGridPopup']);
        break;
      case "Hybrid":
        custButton(funcObject, ['customFuncDisplayGrid', 'custFuncGridPopup']);
        break;
    }
  }

  document.getElementById('uifCalculator').addEventListener("click", function (e) {
    if (e.target != document.getElementById('enterHeader')) {
      let enterheader = document.getElementById('enterHeader');
      let range = document.createRange();
      let sel = window.getSelection();
      if (enterheader.innerHTML.length == 0) {
        let textNode = document.createTextNode("‎");
        enterheader.appendChild(textNode);
      }
      range.setStart(enterheader.lastChild, enterheader.firstChild.data.length);
      range.collapse(true);
      sel.removeAllRanges()
      sel.addRange(range);
      document.getElementById("uifCalculator").scrollTop = document.getElementById("uifCalculator").scrollHeight;
    }
  });

  document.getElementById('historyHeader').innerHTML = localStorage.getItem("historyOut");
  document.getElementById("uifCalculator").scrollTop = document.getElementById("uifCalculator").scrollHeight;
  document.getElementById('mainTab').addEventListener("click", function (e) {
    if (window.innerWidth / window.innerHeight < 3 / 4) {
      changeTabAs(false);
    }
    openElement(document.getElementById('mainTab'))
  });
  document.getElementById('mobileTabs').addEventListener("click", function (e) {
    if (document.getElementById('tabContainer').style.visibility != "visible") {
      console.log("toggled")
      hideAllTabs();
      changeTabAs(true);
    } else {
      console.log("toggled other")
      openElement(document.getElementById('mainTab'))
      changeTabAs(false);
    }
  });
  document.getElementById('settingsCogIcon').addEventListener("click", function () { sessionStorage.setItem("facing", "settingsOut"); setState(); document.location = 'Settings.html' });
  document.getElementById('MRCOverlay').addEventListener("click", function () {
    let enteredText = document.getElementById('enterHeader').innerHTML
    let mrmText = document.getElementById('memoryText').innerHTML;
    if (mrmText == enteredText.substring(enteredText.length - mrmText.length)) {
      document.getElementById('memoryText').innerHTML = ""
      document.getElementById('memoryTextBoarder').style = undefined;
    } else {
      document.getElementById('enterHeader').innerHTML = document.getElementById('enterHeader').innerHTML + document.getElementById('memoryText').innerHTML;
    }
  });
  document.getElementById('MAddOverlay').addEventListener("click", function () {
    document.getElementById('memoryTextBoarder').style.visibility = "visible";
    let enteredText = document.getElementById('enterHeader').innerHTML;
    document.getElementById('memoryText').innerHTML = inputSolver(enteredText, "error adding to memory");
  });
  document.getElementById('leftOverlayNav').addEventListener("click", function () { navigateButtons(false) });
  document.getElementById('rightOverlayNav').addEventListener("click", function () { navigateButtons(true) });
  document.getElementById('num1').addEventListener("click", function () { frontButtonPressed('1'); console.log(JSON.stringify({"func": function(input){},"name": "hello"}))});
  document.getElementById('num2').addEventListener("click", function () { frontButtonPressed('2'); });
  document.getElementById('num3').addEventListener("click", function () { frontButtonPressed('3'); });
  document.getElementById('moreFunctionsButton').addEventListener("click", function () { document.location = 'moreFunctions.html'; });
  document.getElementById('arrowIcon').addEventListener("click", function () { popup(); preventFocus(); sessionStorage.setItem("facing", "mainPopup") });
  document.getElementById('num4').addEventListener("click", function () { frontButtonPressed('4'); });
  document.getElementById('num5').addEventListener("click", function () { frontButtonPressed('5'); });
  document.getElementById('num6').addEventListener("click", function () { frontButtonPressed('6'); });
  document.getElementById('backspace').addEventListener("click", function () { backPressed(); });
  document.getElementById('ac').addEventListener("click", function () { clearMain(); document.getElementById('uifCalculator').scrollTop = document.getElementById('uifCalculator').scrollHeight; });
  document.getElementById('num7').addEventListener("click", function () { frontButtonPressed('7'); });
  document.getElementById('num8').addEventListener("click", function () { frontButtonPressed('8'); });
  document.getElementById('num9').addEventListener("click", function () { frontButtonPressed('9'); });
  document.getElementById('plus').addEventListener("click", function () { frontButtonPressed('+'); });
  document.getElementById('piButton').addEventListener("click", function () { frontButtonPressed('π'); });
  document.getElementById('num0').addEventListener("click", function () { frontButtonPressed('0'); });
  document.getElementById('pointButton').addEventListener("click", function () { frontButtonPressed('.'); });
  document.getElementById('minus').addEventListener("click", function () { frontButtonPressed('-'); });
  document.getElementById('percent').addEventListener("click", function () { frontButtonPressed('%'); });
  document.getElementById('pars').addEventListener("click", function () { parsMethod(); });
  document.getElementById('pow').addEventListener("click", function () { pow('1'); });
  document.getElementById('mutiplication').addEventListener("click", function () { frontButtonPressed('×'); });
  document.getElementById('enter').addEventListener("click", function () { enterPressed(document.getElementById('enterHeader').innerHTML) });
  document.getElementById('pow2').addEventListener("click", function () { pow('2'); });
  document.getElementById('sqrt').addEventListener("click", function () { frontButtonPressed('√'); });
  document.getElementById('divison').addEventListener("click", function () { frontButtonPressed('÷'); });
  document.getElementById('helpEx').addEventListener("click", function () { document.location = 'help.html'; setState(); sessionStorage.setItem("facing", "helpOut"); });
  document.getElementById('functionEx').addEventListener("click", function () {
    if (window.innerWidth / window.innerHeight > 3 / 4 && window.innerWidth / window.innerHeight < 2 / 1) {
      document.getElementById('extendedFuncGrid').style.animation = "0.15s ease-in 0s 1 reverse forwards running fadeEffect";
      setTimeout(function () { document.getElementById('extendedFuncGrid').style.visibility = "hidden"; document.getElementById('extendedFuncGrid').style.animation = null; }, 150);
      document.getElementById('customFuncDisplay').style.animation = "0.15s ease-in 0s 1 normal forwards running slideFromSide";
      sessionStorage.setItem("facing", "mainFlip")
    }
  });
  document.getElementById('historyEx').addEventListener("click", function () { deleteHistory(); });
  document.getElementById('deciToFracEx').addEventListener("click", function () { frontButtonPressed('d→f('); });
  document.getElementById('absEx').addEventListener("click", function () { frontButtonPressed('|'); });
  document.getElementById('modEx').addEventListener("click", function () { frontButtonPressed('mod('); });
  document.getElementById('degEx').addEventListener("click", function (e) {
    setDegMode();
  });
  document.getElementById('arcEx').addEventListener("click", function () { setArc(); });
  document.getElementById('invEx').addEventListener("click", function () { setInverse(); });
  document.getElementById('sinEx').addEventListener("click", function () { trigPressed('sin('); });
  document.getElementById('cosEx').addEventListener("click", function () { trigPressed('cos('); });
  document.getElementById('tanEx').addEventListener("click", function () { trigPressed('tan('); });
  document.getElementById('factorialEx').addEventListener("click", function () { frontButtonPressed('!'); });
  document.getElementById('log10Ex').addEventListener("click", function () { frontButtonPressed('log₁₀('); });
  document.getElementById('lnEx').addEventListener("click", function () { frontButtonPressed('ln('); });
  document.getElementById('backExMini').addEventListener("click", function () {
    document.getElementById('customFuncDisplay').style.animation = null;
    document.getElementById('customFuncDisplay').style.animation = "0.15s ease-in 0s 1 normal reverse running slideFromSide";
    setTimeout(function () {
      document.getElementById('customFuncDisplay').style = undefined;
      document.getElementById('extendedFuncGrid').style = undefined;

    }, 150);
    document.getElementById('extendedFuncGrid').style.animation = "0.15s ease-in 0s 1 normal reverse running slideFromSide";
  });
  document.getElementById('addFunctionEx').addEventListener("click", function () {
    openPopup();
  });
  document.getElementById('minusFunctionEx').addEventListener("click", function () { console.log("Things" + document.getElementById("enterHeader").value); });
  document.getElementById('addIconPopup').addEventListener("click", function () {
    console.log("Icon Popup")
    if(document.getElementById('enterHeader').innerHTML != "‎"){
      openPopup();
    }else{
      openPage("custCreator")
    }
    
  });
  document.getElementById('minusIconPopup').addEventListener("click", function () { });
  document.getElementById('functionPopup').addEventListener("click", function () { console.log("variables Fill In"); });
  document.getElementById('historyPopup').addEventListener("click", function () { deleteHistory(); });
  document.getElementById('deciToFracPopup').addEventListener("click", function () { frontButtonPressed('d→f('); });
  document.getElementById('helpPopup').addEventListener("click", function () { document.location = 'help.html'; setState(); sessionStorage.setItem("facing", "helpOut"); });
  document.getElementById('log10Popup').addEventListener("click", function () { frontButtonPressed('log₁₀('); });
  document.getElementById('lnPopup').addEventListener("click", function () { frontButtonPressed('ln('); });
  document.getElementById('ePopup').addEventListener("click", function () { frontButtonPressed('e'); });
  document.getElementById('factorialPopup').addEventListener("click", function () { frontButtonPressed('!'); });
  document.getElementById('degPopup').addEventListener("click", function (e) {
    setDegMode();
  });
  document.getElementById('arcPopup').addEventListener("click", function () { setArc(); });
  document.getElementById('invPopup').addEventListener("click", function () {
    setInverse();
  })
  document.getElementById('sinPopup').addEventListener("click", function () { trigPressed('sin('); });
  document.getElementById('cosPopup').addEventListener("click", function () { trigPressed('cos('); });
  document.getElementById('tanPopup').addEventListener("click", function () { trigPressed('tan('); });
  document.getElementById('absPopup').addEventListener("click", function () { frontButtonPressed('|'); });
  document.getElementById('modPopup').addEventListener("click", function () { frontButtonPressed('mod(') });

  document.getElementById('confirmNameEntry').addEventListener("click", function () {
    createFunc('Function');
    document.getElementById('nameEntry').style.visibility = "hidden";
  });
  document.getElementById('exitNameEntry').addEventListener("click", function () {
    console.log("things");
    document.getElementById('nameEntry').style.visibility = "hidden";
    document.getElementById('nameEntry').style.animation = null;
    document.getElementById('nameEntryArea').value = "";
  });

  let movable = document.getElementById("custCreatorUnder");
  movable.dataset.pos = 0;
  document.getElementById('funcCreatorButton').addEventListener("click", function (){
    console.log("things")
    animateModes(parseInt(movable.dataset.pos), 0, movable);
  });
  document.getElementById('hybdCreatorButton').addEventListener("click", function (){
    animateModes(parseInt(movable.dataset.pos), 75, movable);
  });
  document.getElementById('codeCreatorButton').addEventListener("click", function (){
    animateModes(parseInt(movable.dataset.pos), 150, movable);
  });

  document.getElementById('firstLine').addEventListener("keyup", function (){
    if (e.key === 'Enter') {
      console.log('ENTER');
    }
  })

  const elem = document.getElementById("memoryTextBoarder");
  let isDown = false;
  let startX;
  let scrollLeft;

  elem.addEventListener('mousedown', (e) => {
    isDown = true;
    elem.classList.add('active');
    startX = e.pageX - elem.offsetLeft;
    scrollLeft = elem.scrollLeft;
  });
  elem.addEventListener('mouseleave', () => {
    isDown = false;
    elem.classList.remove('active');
  });
  elem.addEventListener('mouseup', () => {
    isDown = false;
    elem.classList.remove('active');
  });
  elem.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - elem.offsetLeft;
    const walk = (x - startX) * 3;
    elem.scrollLeft = scrollLeft - walk;
  });
  let letToSybol = [
    {
      'lets': ["pi", "PI", "Pi"],
      "symbol": "π"
    },
    {
      'lets': ["abs", "Abs", "ABS"],
      "symbol": "|"
    }
  ]
  document.getElementById("enterHeader").addEventListener("input", function (e) {
    console.log("checking enter")
    let text = document.getElementById("enterHeader").innerHTML;
    for (let item of letToSybol) {
      for (let letItem of item.lets) {
        if (text.includes(letItem)) {
          text = text.replace(letItem, item.symbol);
          console.log(text + " : " + letItem + " : " + item.symbol);
          document.getElementById("enterHeader").innerHTML = text;
          let sel = window.getSelection();
          let range = document.createRange();
          document.getElementById("enterHeader").childNodes
          break;
        }
      }
    }
  });
} else if (document.getElementById("settingsBody") != null) {
  if (settings.theme == "custPurchasable") {
    document.getElementById('primaryColorPicker').value = settings.p
    document.getElementById('secondaryColorPicker').value = settings.s
    document.getElementById('accentColorPicker').value = settings.a
    toggleCustTheme();
  }
  if (settings.t == "#FFFFFF") {
    document.getElementById('dropbtn').innerHTML = "White <h3 id='displayText' style='color: white;'>t</h3>";
  }
  //coloring UI elements that are images but need sytling
  if (TextColorGlobal == "#000000") {
    let images = [
      {
        "type": "single",
        "id": "ColorsIcon",
        "src": "Images/Colors.svg"
      },
      {
        "type": "single",
        "id": "PreferencesIcon",
        "src": "Images/Calipiers.svg"
      },
      {
        "type": "single",
        "id": "AboutIcon",
        "src": "Images/aboutUS.svg"
      },
      {
        "type": "mutiple",
        "class": "backIcon",
        "src": "Images/MoreFuncArrow.svg"
      },
    ];
    setImages(images);
  } else {
    //document.getElementById('dropbtn').innerHTML = "White <h3 id='displayText' style='color: white;'>t</h3>";
  }

  //Setting the values of elements
  let accents = getAccents();
  let defaultThemes = getThemes();
  let catalog = getCatalog();
  let purchaseList = getPurshaseList();
  for (let acc of accents) {
    document.getElementById(acc.id).style.background = acc.val;
    document.getElementById(acc.id).dataset.color = acc.val;
    if (acc.id === settings.acc) {
      document.getElementById(acc.id).className = "accButton active";
    }
  }
  for (let purchase of purchaseList) {
    if (purchase == "custPurchasable") {
      unlockCustomTheme();
    }
  }
  document.getElementById(settings.theme).className = "themeElem active";
  if (settings.degRad == true) {
    document.getElementById('degModeBut').className = "settingsButton active";
  } else {
    document.getElementById('radModeBut').className = "settingsButton active";
  }
  document.getElementById('outputLength').value = settings.oL;

  document.getElementById("graphDStep").value = settings.gDS;
  document.getElementById("domainBottomG").value = settings.gDMin;
  document.getElementById("domainTopG").value = settings.gDMax;

  document.getElementById("graphRStep").value = settings.gRS;
  document.getElementById("rangeBottomG").value = settings.gRMin;
  document.getElementById("rangeTopG").value = settings.gRMax;

  document.getElementById("tableStep").value = settings.tS;
  document.getElementById("tableCells").value = settings.tC;

  //Adding events to elements
  document.getElementById('primaryColorPicker').addEventListener("input", updatePreview, false);
  document.getElementById('secondaryColorPicker').addEventListener("input", updatePreview, false);
  document.getElementById('accentColorPicker').addEventListener("input", updatePreview, false);
  document.getElementById('selectorBlack').addEventListener("click", function () { dropPressed('Black') });
  document.getElementById('selectorWhite').addEventListener("click", function () { dropPressed('White') });
  document.getElementById('backButton').addEventListener("click", function () { universalBack(); });
  document.getElementById('LooknFeel').addEventListener("click", function () { settingsTabChange('colorsTab') });
  document.getElementById('Preferences').addEventListener("click", function () { settingsTabChange('PreferencesTab') });
  document.getElementById('About').addEventListener("click", function () { settingsTabChange('AboutTab') });
  document.getElementById('colorsBack').addEventListener("click", function () { universalBack(); });
  document.getElementById('PreferencesBack').addEventListener("click", function () { universalBack(); });
  document.getElementById('degModeBut').addEventListener("click", function () { degRadSwitch(true) });
  document.getElementById('radModeBut').addEventListener("click", function () { degRadSwitch(false) });
  document.getElementById('AboutBack').addEventListener("click", function () {
    universalBack();
  });
  document.getElementById('buyCustTheme').addEventListener('click', function () {
    document.getElementById('buyScreen').style.visibility = "visible";
    sessionStorage.setItem("facing", "buyPageOut");

  });
  document.getElementById('buyExit').addEventListener('click', function () {
    universalBack();
  });
  document.getElementById('buyButton').addEventListener('click', function () {
    unlockCustomTheme();
    setPurchase('custPurchasable');
    universalBack();
  });
  let accElems = document.getElementsByClassName('accButton');
  for (let item of accElems) {
    item.addEventListener("click", function () {
      let selectAcc = document.getElementsByClassName('accButton active');
      for (let selc of selectAcc) {
        selc.className = "accButton";
      }
      item.className = "accButton active";
    });
  }
  let themeElems = document.getElementsByClassName('themeElem');
  for (let item of themeElems) {
    item.addEventListener("click", function () {
      let elemID = item.id;
      if (queryPurchase(elemID)) {
        let selectTheme = document.getElementsByClassName('themeElem active');
        for (let selc of selectTheme) {
          selc.className = "themeElem";
        }
        item.className = "themeElem active";
        if (elemID == "custPurchasable") {
          if (document.getElementById('ColorsDiv').style.visibility != 'visible') {
            toggleCustTheme();
          }
        } else {
          if (document.getElementById('ColorsDiv').style.visibility == 'visible') {
            toggleCustTheme();
          }
        }
      }
    });
  }
  let themes = document.getElementsByClassName('themeButton');
} else if (document.getElementById('helpBody') != null) {
  /*&let rootCss = document.querySelector(':root');
  rootCss.style.setProperty('--displayColor', localStorage.getItem('displayColor'));
  rootCss.style.setProperty('--numbersColor', localStorage.getItem('numsColor'));
  rootCss.style.setProperty('--functionsColor', localStorage.getItem('funcColor'));
  rootCss.style.setProperty('--textColor', localStorage.getItem('textColor'));*/
  if (TextColorGlobal == "#000000") {
    let addIcons = document.getElementsByClassName('backIcon');
    for (let item of addIcons) {
      item.src = "Images/MoreFuncArrow.svg";
    }
    document.getElementById('calcIcon').src = "Images/CalculatorIconWhite.svg";

    document.getElementById('funcsIcon').src = "Images/customFunctionIconWhite.svg";

    document.getElementById('setIcon').src = "Images/settingsPageIconWhite.svg";
  }
  document.getElementById('backButton').addEventListener("click", function () { document.location = 'Recursive.html'; });
  document.getElementById('LooknFeel').addEventListener("click", function () { helpTabChange('mainCalculatorHelp') });
  document.getElementById('Preferences').addEventListener("click", function () { helpTabChange('customFuncHelp') });
  document.getElementById('About').addEventListener("click", function () { helpTabChange('settingsHelp') });
  document.getElementById('mainCalBack').addEventListener("click", function () { helpBack('mainCalculatorHelp'); });
  document.getElementById('customFuncBack').addEventListener("click", function () { helpBack('customFuncHelp') });
  document.getElementById('settingsBack').addEventListener("click", function () { helpBack('settingsHelp') });
}
function degRadSwitch(mode) {
  document.getElementById('degModeBut').className = "settingsButton";
  document.getElementById('radModeBut').className = "settingsButton";
  if (mode) {
    document.getElementById('degModeBut').className = "settingsButton active";
  } else {
    document.getElementById('radModeBut').className = "settingsButton active";
  }
}
function inputSolver(equation, errorStatement) {
  equation = solveInpr(equation, settings.degRad)
  try {
    var mySolver = new Solver({
      s: equation,
    })
    return mySolver.solve({})["s"];
  } catch (e) {
    report(errorStatement, false);
  }
}
function createFunc(type) {
  let name = document.getElementById('nameEntryArea').value;
  let text = document.getElementById('enterHeader').innerHTML;
  var funcList = getFuncList();
  if (!custFuncExisting(name, false)) {
    custButton(funcAssebly(type, name, text), ['customFuncDisplayGrid', 'custFuncGridPopup']);
    let object = { "name": name, "type": type };
    switch (type) {
      case "Function":
        object.equation = text;
        break;
      case "Code":
        object.code = text;
        break;
      case "Hybrid":
        object.code = text;
        break;
    }
    funcList.push(object);
    addImplemented(object)
    console.log(`%c resulting funcList is ${funcList}`,"color: green;");
    setFuncList(funcList);
  }
}
function openPopup() {
  console.log("open popup ran")
  sessionStorage.setItem("facing", "createNaming");
  document.getElementById('nameEntry').style.visibility = "visible";
}
function openPage(id){
  let element = document.getElementById(id);
  element.style.zIndex = 5;
  element.style.animation = "0.15s ease-in 0s 1 normal forwards running pageup";
  setTimeout(function () {
    element.style.animation = undefined;
    element.style.bottom = "0px";
  }, 150);
}
function createNewLine(element){
  let temp = document.getElementById('lineTemplate'), clon = temp.content.cloneNode(true);
}
function frontButtonPressed(input) {
  let display = document.getElementById('enterHeader');
  let sel = window.getSelection();
  let range = document.createRange();
  let index = 0;
  let higher = 0;
  let lower = 0;
  if (sel.anchorOffset > sel.focusOffset) {
    higher = sel.anchorOffset;
    lower = sel.focusOffset;
  } else {
    higher = sel.focusOffset;
    lower = sel.anchorOffset;
  }
  if (sel.anchorNode != null) {
    let appendString = sel.focusNode.nodeValue.substring(0, lower) + input;
    sel.focusNode.nodeValue = appendString + sel.focusNode.nodeValue.substring(higher);
    range.setStart(sel.focusNode, appendString.length);
  } else {
    display.innerHTML = input;
    range.setStart(display.childNodes[0], input.length)
  }
  range.collapse(true);
  sel.removeAllRanges()
  sel.addRange(range);
  document.getElementById('uifCalculator').scrollTop = document.getElementById('uifCalculator').scrollHeight;
}
function preventFocus() {
  var ae = document.activeElement;
  setTimeout(function () { ae.focus() }, 1);
}
let facingBack = [
  {
    "elm": "custFunc",
    "backElm": "",
    "prtCont": 'main',
    "mth": function () {
      openElement(document.getElementById('mainTab'))
    },
  },
  {
    "elm": "mainFlip",
    "backElm": "",
    "prtCont": 'main',
    "mth": function () {
      document.getElementById('customFuncDisplay').style.animation = null;
      document.getElementById('customFuncDisplay').style.animation = "0.15s ease-in 0s 1 normal reverse running slideFromSide";
      setTimeout(function () {
        document.getElementById('customFuncDisplay').style = undefined;
        document.getElementById('extendedFuncGrid').style = undefined;

      }, 150);
      document.getElementById('extendedFuncGrid').style.animation = "0.15s ease-in 0s 1 normal reverse running slideFromSide";
    },
  },
  {
    "elm": "mainPopup",
    "backElm": "",
    "prtCont": 'main',
    "mth": function () {
      popup(); preventFocus();
    },
  },
  {
    "elm": "createNaming",
    "backElm": "",
    "prtCont": 'main',
    "mth": function () {
      document.getElementById('nameEntry').style.visibility = "hidden";
      document.getElementById('nameEntry').style.animation = null;
      document.getElementById('nameEntryArea').value = "";
    }
  },
  {
    "elm": "settingsOut",
    "backElm": "",
    "prtCont": 'settings',
    "mth": function () {
      settingExit()
    }
  },
  {
    "elm": "themePageOut",
    "backElm": "settingsOut",
    "prtCont": 'settings',
    "mth": function () {
      SettingsBack('colorsTab');
    }
  },
  {
    "elm": "buyPageOut",
    "backElm": "themePageOut",
    "prtCont": 'settings',
    "mth": function () {
      document.getElementById('buyScreen').style.visibility = "hidden";
    }
  },
  {
    "elm": "prefPageOut",
    "backElm": "settingsOut",
    "prtCont": 'settings',
    "mth": function () {
      SettingsBack('PreferencesTab');
    }
  },
  {
    "elm": "aboutPageOut",
    "backElm": "settingsOut",
    "prtCont": 'settings',
    "mth": function () {
      SettingsBack('AboutTab');
    }
  },
  {
    "elm": "helpOut",
    "backElm": "",
    "prtCont": 'help',
    "mth": function () {
      document.location = 'Recursive.html';
    }
  },
  {
    "elm": "mainCalculatorHelp",
    "backElm": "helpOut",
    "prtCont": 'help',
    "mth": function () {
      helpBack('mainCalculatorHelp')
    }
  },
  {
    "elm": "customFuncHelp",
    "backElm": "helpOut",
    "prtCont": 'help',
    "mth": function () {
      helpBack('customFuncHelp')
    }
  },
  {
    "elm": "settingsHelp",
    "backElm": "helpOut",
    "prtCont": 'help',
    "mth": function () {
      helpBack('settingsHelp')
    }
  }
];
function universalBack() {
  let currentElement = sessionStorage.getItem("facing");
  for (let elem of facingBack) {
    if (elem.elm == currentElement) {
      elem.mth();
      sessionStorage.setItem("facing", elem.backElm);
      break;
    }
  }
}
function backPressed() {
  let uifCalculator = document.getElementById('enterHeader');
  let sel = window.getSelection();
  let range = document.createRange();
  let index = 0;
  let higher = 0;
  let lower = 0;
  if (sel.anchorOffset > sel.focusOffset) {
    higher = sel.anchorOffset;
    lower = sel.focusOffset;
  } else {
    higher = sel.focusOffset;
    lower = sel.anchorOffset;
  }
  if (!(plainSup(sel) && sel.focusNode.nodeValue.length <= 1)) {
    if (sel.anchorOffset == sel.focusOffset) {
      if (sel.focusNode.nodeValue.charAt(sel.anchorOffset - 1) != '‎' && uifCalculator.childNodes[1] != sel.focusNode) {
        let short = sel.focusNode.nodeValue.substring(0, sel.anchorOffset - 1);
        sel.focusNode.nodeValue = short + sel.focusNode.nodeValue.substring(sel.focusOffset);
        range.setStart(sel.focusNode, short.length);
        range.collapse(true);
        sel.removeAllRanges()
        sel.addRange(range);
      } else {
        let childNodes = document.getElementById('enterHeader').childNodes;
        for (let i = 0; i < childNodes.length; i++) {
          if (childNodes[i] == sel.focusNode) {
            range.setStart(childNodes[i - 1].childNodes[0], childNodes[i - 1].childNodes[0].nodeValue.length)
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }
    } else {
      let short = sel.focusNode.nodeValue.substring(0, lower);
      sel.focusNode.nodeValue = short + sel.focusNode.nodeValue.substring(higher);
      range.setStart(sel.focusNode, short.length);
      range.collapse(true);
      sel.removeAllRanges()
      sel.addRange(range);
    }
  } else {
    let childNodes = sel.focusNode.parentNode.parentNode.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      if (childNodes[i] == sel.focusNode.parentNode) {
        range.setStart(childNodes[i - 1], childNodes[i - 1].nodeValue.length)
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        childNodes[i + 1].nodeValue = childNodes[i + 1].nodeValue.substring(1)
        document.getElementById('uifCalculator').childNodes[1].removeChild(childNodes[i]);
      }
    }
  }
  document.getElementById('uifCalculator').scrollTop = document.getElementById('uifCalculator').scrollHeight;
}
function plainSup(sel) {
  if (sel.focusNode.parentElement.tagName == "SUP") {
    return true;
  } else {
    return false;
  }
}
function pow(type) {
  let display = document.getElementById('enterHeader');
  let sel = window.getSelection();
  let range = document.createRange();
  let index = 0;
  let higher = 0;
  let lower = 0;
  if (sel.anchorOffset > sel.focusOffset) {
    higher = sel.anchorOffset;
    lower = sel.focusOffset;
  } else {
    higher = sel.focusOffset;
    lower = sel.anchorOffset;
  }
  for (let i = 0; i < display.childNodes.length; i++) {
    if (sel.focusNode == display.childNodes[i]) {
      index = i;
      break;
    }
  }
  let backend = sel.focusNode.nodeValue.substring(higher);
  sel.focusNode.nodeValue = sel.focusNode.nodeValue.substring(0, lower);
  let superSr = document.createElement("sup");
  if (type == "2") {
    superSr.appendChild(document.createTextNode('‎2'));
  } else {
    superSr.appendChild(document.createTextNode('‎'));
  }
  if (backend == '') {
    backend = '‎';
  }
  if (index == display.childNodes.length) {
    display.appendChild(document.createTextNode(backend));
  } else {
    display.insertBefore(document.createTextNode(backend), display.childNodes[index + 1]);
  }
  window.addEventListener('keydown', keepBlank);
  display.insertBefore(superSr, display.childNodes[index + 1]);
  if (type == "2") {
    range.setStart(display.childNodes[index + 2], 1);
  } else {
    range.setStart(superSr.childNodes[0], 1);
  }
  range.collapse(true);
  sel.removeAllRanges()
  sel.addRange(range);
}
function keepBlank(eve) {
  let sel = window.getSelection();
  let range = document.createRange();
  let higher = 0;
  let lower = 0;
  if (sel.anchorOffset > sel.focusOffset) {
    higher = sel.anchorOffset;
    lower = sel.focusOffset;
  } else {
    higher = sel.focusOffset;
    lower = sel.anchorOffset;
  }
  if (eve.keyCode == 8 && (sel.focusNode.nodeValue.substring(lower, higher).includes('‎') || sel.focusNode.nodeValue == '‎') && sel.focusNode.parentNode == document.getElementById('enterHeader')) {
    eve.preventDefault();
    let childNodes = document.getElementById('enterHeader').childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      if (childNodes[i] == sel.focusNode) {
        range.setStart(childNodes[i - 1].childNodes[0], childNodes[i - 1].childNodes[0].nodeValue.length)
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }
}
function navigateButtons(direction) {
  let parentElement;
  let sel = window.getSelection();
  let isSup = false;
  let range = document.createRange();
  let higher = 0;
  let lower = 0;
  if (sel.anchorOffset > sel.focusOffset) {
    higher = sel.anchorOffset;
    lower = sel.focusOffset;
  } else {
    higher = sel.focusOffset;
    lower = sel.anchorOffset;
  }
  if (sel.focusNode.parentNode.tagName == 'SUP') {
    parentElement = sel.focusNode.parentNode.parentNode;
    isSup = true;
  } else {
    parentElement = sel.focusNode.parentNode;
  }
  let childNodes = parentElement.childNodes;
  if (!direction) {
    if (lower == 0 || sel.focusNode.nodeValue.charAt(lower - 1) == '‎') {
      for (let i = 0; i < childNodes.length; i++) {
        if ((isSup && sel.focusNode.parentNode == childNodes[i]) || sel.focusNode == childNodes[i]) {
          if (childNodes[i - 1].tagName != 'SUP') {
            range.setStart(childNodes[i - 1], childNodes[i - 1].nodeValue.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            break;
          } else {
            range.setStart(childNodes[i - 1].childNodes[0], childNodes[i - 1].childNodes[0].nodeValue.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            break;
          }

        }
      }
    } else {
      range.setStart(sel.focusNode, lower - 1);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  } else {
    if (lower == sel.focusNode.nodeValue.length) {
      for (let i = 0; i < childNodes.length; i++) {
        if ((isSup && sel.focusNode.parentNode == childNodes[i]) || sel.focusNode == childNodes[i]) {
          if (childNodes[i + 1].tagName != 'SUP') {
            range.setStart(childNodes[i + 1], 1);
          } else {
            range.setStart(childNodes[i + 1].childNodes[0], 1);
          }
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          break;
        }
      }
    } else {
      range.setStart(sel.focusNode, lower + 1);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}
function clearMain() {
  let enterHeader = document.getElementById("enterHeader");
  let range = document.createRange();
  let sel = document.getSelection();
  enterHeader.innerHTML = '‎';
  range.setStart(enterHeader.lastChild, enterHeader.firstChild.data.length);
  range.collapse(true);
  sel.removeAllRanges()
  sel.addRange(range);
}
function parsMethod() {
  let badIdea = document.getElementById("enterHeader").selectionStart;
  let lazyAfterthought = 0;
  for (let i = 0; i < document.getElementById("enterHeader").innerHTML.length; i++) {
    if (document.getElementById("enterHeader").innerHTML.charAt(i) == '(') {
      lazyAfterthought = lazyAfterthought + 1;
    }
    if (document.getElementById("enterHeader").innerHTML.charAt(i) == ')') {
      lazyAfterthought = lazyAfterthought - 1;
    }
  }
  if (lazyAfterthought >= 1 && document.getElementById("enterHeader").innerHTML.charAt(badIdea - 1) != '(') {
    frontButtonPressed(')');
  } else {
    frontButtonPressed('(');
  }
}
function custFuncExisting(name, duplicates) {
  let exist = false, existing = document.getElementsByClassName("customFuncLinks");
  for (i = 0; i < existing.length; i++) {
    if (existing[i].querySelector("#nameLabel").innerHTML == name && !duplicates) {
      exist = true;
      break;
    }
  }
  return exist;
}
function funcRemove(e) {
  console.log("helllooooooooo")
  let link = e.target.parentNode
  let buttonName = link.querySelector("#nameLabel").innerHTML;
  removeFunc(link.querySelector("#nameLabel").innerHTML);
  let names = document.getElementsByClassName("custFuncNames");
  for (let i = 0; i < names.length; i++) {
    console.log("looping")
    if (names[i].innerHTML == buttonName) {
      let parent = names[i].parentNode;
      parent.remove();
      i--;
    }
  }
  //document.getElementById('custFuncGridPopup').removeChild(link);
}
function custButton(funcConfig, target) {
  let temp = document.getElementsByClassName("customFuncTemplate")[0], clon = temp.content.cloneNode(true);
  let type = funcConfig.type;
  let name = funcConfig.name;
  let equation = "";
  switch (funcConfig.type) {
    case ("Function"):
      equation = funcConfig.equation;
      break;
    case ("Code"):
      equation = "Coded";
      break;
    case ("Hybrid"):
      equation = "Hybrid";
      break;
  }
  clon.getElementById('equationLabel').innerHTML = equation;
  clon.getElementById('nameLabel').innerHTML = name;
  for (let i = 0; i < target.length; i++) {
    let clonClone = clon.cloneNode(true);
    let buttonNode = clonClone.getElementById("customFuncButton");
    if (TextColorGlobal == "#000000") {
      buttonNode.querySelector('#removeFunc').src = "Images/xIcon.svg";
    }
    buttonNode.querySelector('#removeFunc').addEventListener('click', function (e) {
      console.log("Remove Func ran")
      funcRemove(e);
    });
    buttonNode.addEventListener('click', function (e) {
      let elem = e.target;
      if (e.target.tagName != "BUTTON") {
        elem = e.target.parentNode
      }
      let funcName = elem.querySelector("#nameLabel").innerHTML;
      let funcParse = findFuncConfig(name);
      console.log(funcParse)
      if (e.target.tagName != "IMG") {
        createTab(funcParse)
      }
    });
    document.getElementById(target[i]).appendChild(clonClone);
    setNumOfTabs();
  }

}
function createTab(config) {
  let name = config.name;
  let type = config.type;
  document.getElementById('extraFuncPopUp').visibility = 'hidden';
  document.getElementById('arrowIcon').style.animation = "0s ease-in 0s 1 normal forwards running toDown";
  document.getElementById('extraFuncPopUp').style.animation = "0s ease-in 0s 1 normal forwards running toSlideDown";
  document.getElementById('arrowIcon').style.transform = 'rotate(90deg);';
  document.getElementById('customFuncDisplay').style.visibility = "hidden";
  if (type == "Function") {
    if (!tabOpen(name)) {
      let tabs = document.getElementsByClassName('tabcontent');
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.visibility = 'hidden';
      }
      newCustFuncTab(config);

      let tabClon = document.getElementsByClassName('newTab')[0].content.cloneNode(true);
      tabClon.getElementById('newTabName').innerHTML = name;
      tabClon.getElementById('nameDisplay').innerHTML = name;
      tabClon.getElementById('equtDisplayFunc').innerHTML = config.equation
      tabClon.getElementById('tabButton').dataset.tabmap = JSON.stringify(config);
      if (TextColorGlobal == "#000000") {
        tabClon.getElementById('tabRemove').src = "Images/xIcon.svg";
      }
      let highlight = tabClon.getElementById('tabButton');
      tabClon.getElementById('tabButton').addEventListener("click", function (e) {
        if (e.target.id != "tabRemove") {
          if (window.innerWidth / window.innerHeight < 3 / 4) {
            changeTabAs(false);
          }
          if (e.target != highlight.querySelector("IMG")) {
            openElement(highlight)
            sessionStorage.setItem("facing", "custFunc");
          }
        }

      });
      tabClon.getElementById('tabRemove').addEventListener('click', function (e) {
        removeCustFunc(e);
        setNumOfTabs();
      })
      document.getElementById('tabContainer').appendChild(tabClon);
      setNumOfTabs();
      highlightTab(highlight);
    }

  } else if (type = "Code") {

  } else if (type = "Hybrid") {

  }
}
function removeCustFunc(event) {
  let tabLink = event.target.parentNode;
  console.log(tabLink.parentNode);
  document.getElementById('mainBody').removeChild(matchTab(tabLink.dataset.tabmap, false));
  document.getElementById('tabContainer').removeChild(tabLink);
  if (window.innerWidth / window.innerHeight > 3 / 4) {
    openElement(document.getElementById('mainTab'));
  }

}
function tabOpen(name) {
  let tabs = document.getElementsByClassName('tablinks')

  for (let i = 1; i < tabs.length; i++) {

    if (name == JSON.parse(tabs[i].dataset.tabmap).name) {
      return true;
    }
  }
  return false;
}
function enterPressed(input) {
  let display = document.getElementById('enterHeader');
  let nonparse = input;
  display.innerHTML = inputSolver(input, "Couldn't calculate");
  historyMethod(nonparse)
  document.getElementById('uifCalculator').scrollTop = document.getElementById('uifCalculator').scrollHeight;
  setSelect(display, display.lastChild.length);
}
function historyMethod(equation) {
  console.log(document.getElementsByClassName("historyDateHeader"));
  let historyHeader = document.getElementById('historyHeader');
  let solved = inputSolver(equation, "Couldn't Calculate")
  /*let exportedValue = "<h3 id='historyTimeSubHeader'>" + getTime() + "</h3><h4 id='previousEquation'>" + equation + "=" + inputSolver(equation) + "</h4><br> <br> ";*/
  let dates = document.getElementsByClassName('historyDateHeader');
  if (dates.length == 0 || dates[dates.length - 1].innerHTML != getDate()) {
    let clon = document.getElementsByClassName("historyDateTemp")[0].content.cloneNode(true);
    clon.getElementById('header').innerHTML = getDate();
    historyHeader.appendChild(clon);
  }
  let clon = document.getElementsByClassName("historyHeaders")[0].content.cloneNode(true);
  clon.getElementById('historyTimeSubHeader').innerHTML = getTime();
  clon.getElementById('previousEquation').innerHTML = equation + "=" + inputSolver(equation);
  historyHeader.appendChild(clon);
  localStorage.setItem("historyOut", historyHeader.innerHTML);
}
function getTime() {
  const d = new Date();
  let hours = d.getHours();
  if (hours > 12) {
    hours -= 12;
  }
  var minutes = d.getMinutes()
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return hours + ":" + minutes;
}
function getDate() {
  const d = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}
function deleteHistory() {
  document.getElementById('historyHeader').innerHTML = "";
  localStorage.setItem("historyOut", "");
}
function setSelect(node, index) {
  let sel = window.getSelection();
  let range = document.createRange();
  let higher = 0;
  let lower = 0;
  range.setStart(node.lastChild, index);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}
function openElement(evt) {
  let evtElement = evt;
  let match;
  let tabs = document.getElementsByClassName('tabcontent');
  if (evtElement.dataset.tabmap != "mainTab") {
    if (document.getElementById('arrowIcon').style.animation == "0.25s ease-in 0s 1 normal forwards running toUp") {
      document.getElementById('arrowIcon').style.animation = "0.0 ease-in 0s 1 normal forwards running toDown";
      document.getElementById('extraFuncPopUp').style.animation = "0.0s ease-in 0s 1 normal forwards running toSlideDown";
      setTimeout(donothing, 500);
      document.getElementById('extraFuncPopUp').style.visibility = "hidden";
    }
    document.getElementById('customFuncDisplay').style.visibility = "hidden";
  } else {
    document.getElementById('customFuncDisplay').style.visibility = "";
  }
  match = matchTab(evtElement.dataset.tabmap, false);
  for (let i = 0; i < tabs.length; i++) {
    if (match != tabs[i]) {
      tabs[i].style.visibility = 'hidden';
    }
  }
  highlightTab(evtElement);
  match.style.visibility = 'visible';
}
function highlightTab(element) {
  let activeTabs = document.getElementsByClassName('tablinks active')
  for (let i = 0; i < activeTabs.length; i++) {
    activeTabs[i].className = activeTabs[i].className.replace(" active", "");
  }
  element.className += " active"
}
/*function arcSwitch() {
  if (document.getElementsByClassName('trigButton')[0].innerHTML.charAt(0) == 'a') {
    for (let i = 0; i < document.getElementsByClassName('arcText').length; i++) {
      document.getElementsByClassName('arcText')[i].innerHTML = 'arc';
    }
    for (let i = 0; i < document.getElementsByClassName('trigButton').length; i++) {
      document.getElementsByClassName('trigButton')[i].innerHTML = document.getElementsByClassName('trigButton')[i].innerHTML.substring(1);
    }
  } else {
    for (let i = 0; i < document.getElementsByClassName('arcText').length; i++) {
      document.getElementsByClassName('arcText')[i].innerHTML = 'reg';
    }
    for (let i = 0; i < document.getElementsByClassName('trigButton').length; i++) {
      document.getElementsByClassName('trigButton')[i].innerHTML = "a" + document.getElementsByClassName('trigButton')[i].innerHTML;
    }
  }
}*/
function trigPressed(input) {
  if (document.getElementsByClassName('trigButton')[0].innerHTML.charAt(0) == 'a') {
    frontButtonPressed("a" + input);
  } else {
    frontButtonPressed(input);
  }
}
function popup() {
  if (document.getElementById('arrowIcon').style.animation == "0.25s ease-in 0s 1 normal forwards running toUp") {
    document.getElementById('arrowIcon').style.animation = "0.25s ease-in 0s 1 normal forwards running toDown";
    document.getElementById('extraFuncPopUp').style.animation = "0.25s ease-in 0s 1 normal forwards running toSlideDown";
    setTimeout(donothing, 500);
    document.getElementById('arrowIcon').style.transform = 'rotate(90deg);';
  } else {
    document.getElementById('arrowIcon').style.animation = "0.25s ease-in 0s 1 normal forwards running toUp";
    document.getElementById('extraFuncPopUp').style.animation = "0.25s ease-in 0s 1 normal forwards running toSlideUp";
    setTimeout(donothing, 500);
    document.getElementById('arrowIcon').style.transform = 'rotate(270deg);';
  }

}
function donothing() { }
function settingsTabChange(name) {
  var tabs = document.getElementsByClassName("settingTabContent");
  if (window.innerWidth / window.innerHeight > 3 / 4) {
    for (i = 0; i < tabs.length; i++) {
      tabs[i].style.visibility = "hidden";
    }
    if (name == 'colorsTab') {
      document.getElementById("colorsTab").style.visibility = "visible";
    } else if (name == 'PreferencesTab') {
      document.getElementById('PreferencesTab').style.visibility = "visible";
    } else if (name == 'AboutTab') {
      document.getElementById('AboutTab').style.visibility = "visible";
    } else {
      console.log("nothing")
    }
  } else {
    for (i = 0; i < tabs.length; i++) {
      tabs[i].style.visibility = "hidden";
    }
    if (name == 'colorsTab') {
      document.getElementById("colorsTab").style.visibility = "visible";
      document.getElementById("colorsTab").style.width = "100%";
      document.getElementById("colorsBack").style.visibility = "visible";
      document.getElementById("colorsTab").style.animation = "0.15s ease-in 0s 1 normal forwards running toSlideLeft";
      setTimeout(function () { document.getElementById("navColumn").style.visibility = "hidden"; }, 150);
      sessionStorage.setItem("facing", "themePageOut");
    } else if (name == 'PreferencesTab') {
      document.getElementById("PreferencesTab").style.visibility = "visible";
      document.getElementById("PreferencesTab").style.width = "100%";
      document.getElementById("PreferencesBack").style.visibility = "visible";
      document.getElementById("PreferencesTab").style.animation = "0.15s ease-in 0s 1 normal forwards running toSlideLeft";
      setTimeout(function () { document.getElementById("navColumn").style.visibility = "hidden"; }, 150);
      sessionStorage.setItem("facing", "prefPageOut");
    } else if (name == 'AboutTab') {
      document.getElementById("AboutTab").style.visibility = "visible";
      document.getElementById("AboutTab").style.width = "100%";
      document.getElementById("AboutBack").style.visibility = "visible";
      document.getElementById("AboutTab").style.animation = "0.15s ease-in 0s 1 normal forwards running toSlideLeft";
      setTimeout(function () { document.getElementById("navColumn").style.visibility = "hidden"; }, 150);
      sessionStorage.setItem("facing", "aboutPageOut");
    } else {
      console.log("nothing")
    }
  }
}
function SettingsBack(tab) {
  if (tab == "colorsTab") {
    document.getElementById("colorsBack").style.visibility = "hidden";
    if (window.innerWidth / window.innerHeight > 3 / 4) {
      document.getElementById("colorsTab").style.animation = null;
      document.getElementById('colorsTab').style.width = undefined;
    } else {
      document.getElementById("colorsTab").style.animation = "0.15s ease-in 0s 1 normal forwards running toSlideRight";
      setTimeout(function () { document.getElementById("colorsTab").style = undefined; }, 150);
    }
    document.getElementById("navColumn").style.visibility = "visible";
  } else if (tab == "PreferencesTab") {
    document.getElementById("PreferencesBack").style.visibility = "hidden";
    if (window.innerWidth / window.innerHeight > 3 / 4) {
      document.getElementById("PreferencesTab").style.animation = null;
    } else {
      document.getElementById("PreferencesTab").style.animation = "0.15s ease-in 0s 1 normal forwards running toSlideRight";
      setTimeout(function () { document.getElementById("PreferencesTab").style = undefined; }, 150);
    }
    document.getElementById("navColumn").style.visibility = "visible";
  } else if (tab == "AboutTab") {
    document.getElementById("AboutBack").style.visibility = "hidden";
    if (window.innerWidth / window.innerHeight > 3 / 4) {
      document.getElementById("AboutTab").style.animation = null;
    } else {
      document.getElementById("AboutTab").style.animation = "0.15s ease-in 0s 1 normal forwards running toSlideRight";
      setTimeout(function () { document.getElementById("AboutTab").style = undefined; }, 150);
    }
    document.getElementById("navColumn").style.visibility = "visible";
  }
}
function settingExit() {
  let defaultThemes = getThemes();
  let newSettings = settings;
  let selTheme = document.getElementsByClassName("themeElem active")[0];
  if (selTheme.id == "darkMode" || selTheme.id == "lightMode") {
    newSettings.theme = selTheme.id;
    let selAcc = document.getElementsByClassName("accButton active")[0];
    newSettings.acc = selAcc.id;
  } else if (selTheme.id == "custPurchasable") {
    newSettings.theme = selTheme.id;
    newSettings.p = document.getElementById("primaryColorPicker").value;
    newSettings.s = document.getElementById("secondaryColorPicker").value;
    newSettings.a = document.getElementById("accentColorPicker").value;
  }
  newSettings.gDS = Number(document.getElementById("graphDStep").value);
  newSettings.gDMin = Number(document.getElementById("domainBottomG").value);
  newSettings.gDMax = Number(document.getElementById("domainTopG").value);
  newSettings.gRS = Number(document.getElementById("graphRStep").value);
  newSettings.gRMin = Number(document.getElementById("rangeBottomG").value);
  newSettings.gRMax = Number(document.getElementById("rangeTopG").value);
  if (document.getElementById("degModeBut").className == "settingsButton active") {
    newSettings.degRad = true;
  } else {
    newSettings.degRad = false;
  }
  localStorage.setItem("settings", JSON.stringify(newSettings));
  document.location = 'Recursive.html';
}
/*function openNewFunc() {
  if (document.getElementById('newFunctionsPage').style.animation == "0.25s ease-in 0s 1 normal forwards running toSlideLeft") {
    document.getElementById('newFunctionsPage').style.animation = "0.25s ease-in 0s 1 normal forwards running toSlideRight";
  } else {
    document.getElementById('newFunctionsPage').style.animation = "0.25s ease-in 0s 1 normal forwards running toSlideLeft";
    document.getElementById('newFunctionsPage').style.visibility = "visible";
  }
}*/
function backMoreFunction() {
  if (document.getElementById('newFunctionsPage').style.animation == "0.25s ease-in 0s 1 normal forwards running toSlideLeft") {
    document.getElementById('newFunctionsPage').style.animation = "0.25s ease-in 0s 1 normal forwards running toSlideRight";
    setTimeout(function () { document.getElementById('nameArea').value = ""; document.getElementById('equationArea').value = ""; document.getElementById('newFunctionsPage').style.visibility = "hidden"; }, 250);
  } else {
    document.location = 'Recursive.html';
  }
}
//needs work because deprecatiated
function updatePreview(event) {
  if (event.target.id == "secondaryColorPicker") {
    document.getElementById("displayPreview").style.backgroundColor = event.target.value;
  } else if (event.target.id == "accentColorPicker") {
    document.getElementById("numsPreview").style.backgroundColor = event.target.value;
  } else {
    document.getElementById("funcPreview").style.backgroundColor = event.target.value;
  }
}
/*function customFunctionPress() {
  document.getElementById('newFunctionsPage').style.animation = "0.25s ease-in 0s 1 normal forwards running toSlideRight";
  custButton(document.getElementById('equationArea').value, document.getElementById('nameArea').value, 'funcGrid', false);
  setTimeout(function () { document.getElementById('nameArea').value = ""; document.getElementById('equationArea').value = ""; document.getElementById('newFunctionsPage').style.visibility = "hidden"; }, 250);
}*/
function dropPressed(color) {
  if (color == "Black") {
    document.getElementById("showcaseTextColor").style.color = "#000000";
    document.getElementById('dropbtn').innerHTML = "Black <h3 id='displayText' style='color: black;'>t</h3>";
    settings.t = "#000000";
  } else {
    document.getElementById("showcaseTextColor").style.color = "#FFFFFF";
    document.getElementById('dropbtn').innerHTML = "White <h3 id='displayText' style='color: white;'>t</h3>";
    settings.t = "#FFFFFF";
  }
}
//Method that creates the tab page
function newCustFuncTab(config) {
  let temp = document.getElementsByClassName("custFuncTabTemp")[0], clon = temp.content.cloneNode(true), exist = false, existing = document.getElementsByClassName("tabcontent");
  for (i = 1; i < existing.length; i++) {
    if (existing[i].dataset.tab === JSON.stringify(config)) {
      exist = true;
      break;
    }
  }
  if (!exist) {
    clon = defaultSetup(clon);
    switch (config.type) {
      case ('Function'):
        let name = config.name;
        let equation = config.equation;
        let currentTab = JSON.stringify(config);
        let varGrid = clon.getElementById("varGrid");
        let equationDIV = clon.getElementById("EquationFunc");
        let movable = clon.getElementById("selectorUnder");
        let funcTabs = [clon.getElementById('resultDiv'), clon.getElementById('graphDiv'), clon.getElementById('tableDiv')];
        movable.dataset.pos = 0;

        console.log("%c config is", "color: red;");
        console.log(config)

        clon.getElementById('customFuncTab').dataset.tab = JSON.stringify(config);
        console.log(clon.getElementById('customFuncTab').dataset.tab)
        clon.getElementById("nameFunc").value = name;
        clon.getElementById("EquationFunc").innerHTML = equation;
        clon.getElementById("EquationFunc").dataset.baseE = equation;

        clon.getElementById('nameFunc').addEventListener("input", function (e) {
          let liveTab = e.target.parentNode;
          let oldVal = JSON.parse(e.target.parentNode.dataset.tab);
          let matchPage = matchTab(e.target.parentNode.dataset.tab, true);
          let newVal = JSON.parse(e.target.parentNode.dataset.tab);

          newVal.name = e.target.value;

          matchPage.querySelector("#newTabName").innerHTML = e.target.value;
          matchPage.querySelector("IMG").addEventListener('click', function (e) { removeCustFunc(e); });
          changeFunc(oldVal, newVal, matchPage, liveTab);
        });
        clon.getElementById("EquationFunc").addEventListener("focus", function (e) {
          let initEquation = JSON.parse(e.target.parentNode.parentNode.dataset.tab);
          equationDIV.innerHTML = initEquation.equation;
          setSelect(equationDIV, equationDIV.innerHTML.length);
        });
        clon.getElementById('EquationFunc').addEventListener("input", function (e) {
          let liveTab = e.target.parentNode.parentNode;
          let oldVal = JSON.parse(liveTab.dataset.tab);
          let matchPage = matchTab(liveTab.dataset.tab, true);
          let newValue = JSON.parse(liveTab.dataset.tab);

          //Test this method with a sup subclass
          console.log("%c EquationFunc input", "color: red;");
          checkVar(varGrid, equationDIV, funcTabs);
          newValue.equation = e.target.innerHTML
          equationDIV.dataset.baseE = equationDIV.innerHTML;
          changeFunc(oldVal, newValue, matchPage, liveTab);
        });
        document.getElementById("mainBody").appendChild(clon);
        checkVar(varGrid, equationDIV, funcTabs);
        try {
          parseVariables(varGrid, equationDIV, funcTabs);
        } catch (e) {
          report("Couldn't Calculate", false);
        }
        break;
      case ("Hybrid"):

        break;
    }
    //adding event listeners

  }
}
function defaultSetup(clon) {
  clon.getElementById("minDomainGraph").value = settings.gDMin;
  clon.getElementById("maxDomainGraph").value = settings.gDMax;
  clon.getElementById("stepDomainGraph").value = settings.gDS;
  clon.getElementById("minRangeGraph").value = settings.gRMin;
  clon.getElementById("maxRangeGraph").value = settings.gRMax;
  clon.getElementById("stepRangeGraph").value = settings.gRS;
  clon.getElementById("cellsTable").value = settings.tC;
  clon.getElementById('stepTable').value = settings.tS;
  let chart = clon.getElementById("funcChart");
  var cfcg = new Chart(chart, {
    type: 'line',
    data: {
      labels: [-2, 4],
      datasets: [{
        data: [10, 20],
        label: 'x',
        fontColor: '#FFFFFF',
        borderColor: "#FFFFFF",
        backgroundColor: "#FFFFFF",
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        point: {
          radius: 0
        }
      },
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
          }
        }
      }
    }
  })

  let movable = clon.getElementById("selectorUnder");
  let funcTabs = [clon.getElementById('resultDiv'), clon.getElementById('graphDiv'), clon.getElementById('tableDiv')];
  movable.dataset.pos = 0;
  clon.getElementById('functionMode').addEventListener("click", function () {
    funcTabs[0].style.visibility = "inherit";
    hidModes(parseInt(movable.dataset.pos), funcTabs);
    animateModes(parseInt(movable.dataset.pos), 0, movable);
  });
  clon.getElementById("graphMode").addEventListener("click", function () {
    console.log("Mode Changed  pos: " + movable.dataset.pos + " futPos: " + 75);
    funcTabs[1].style.visibility = "inherit";
    hidModes(parseInt(movable.dataset.pos), funcTabs);
    animateModes(parseInt(movable.dataset.pos), 75, movable);
  });
  clon.getElementById("tableMode").addEventListener("click", function () {
    console.log("Mode Changed  pos: " + movable.dataset.pos + " futPos: " + 150);
    funcTabs[2].style.visibility = "inherit";
    hidModes(parseInt(movable.dataset.pos), funcTabs);
    animateModes(parseInt(movable.dataset.pos), 150, movable);
  });
  let updateElements = [
    "stepTable",
    "cellsTable"
  ];
  for (let element of updateElements) {
    clon.getElementById(element).addEventListener("input", function (e) {
      try {
        parseVariables(varGrid, equationDIV, funcTabs);
      } catch (e) {
        report("Couldn't Calculate", false);
      }

    });
  }
  return clon;
}
function changeFunc(og, newString, tab, page) {
  console.log(og)
  var funcList = getFuncList();
  for (let i = 0; i < funcList.length; i++) {
    console.log(`${JSON.stringify(funcList[i])} vs. ${JSON.stringify(og)}`);
    if (JSON.stringify(funcList[i]) == JSON.stringify(og)) {
      console.log("matched")
      funcList[i] = newString;
    }
  }
  changeImplemented(og, newString);
  console.log(funcList);
  setFuncList(funcList);
  console.log(tab)
  tab.dataset.tabmap = JSON.stringify(newString);
  page.dataset.tab = JSON.stringify(newString);
  updateCustomButtons(og, newString);
}
function changeImplemented(oldConfig, newConfig) {
  let object = {};
  if (oldConfig.type == "Function") {
    let parseable = createParseable(solveInpr(oldConfig.equation, settings.degRad))
    object = {
      "func": oldConfig.name,
      "funcParse": parseable,
      "inputs": cacInputs(parseable),
      "funcRadDeg": containsTrig(oldConfig.equation),
      "funcLength": oldConfig.name.length
    };
    
  }else if(oldConfig.type == "Code"){

  }else if(oldConfig.type == "Hybrid"){

  }
  let indexOf = -1;
  for(let i = 0; i < funcList.length; i++){
    if(JSON.stringify(object) == JSON.stringify(funcList[i])){
      indexOf = i;
    }
  }
  if(oldConfig.type == "Function"){
    let parseable = createParseable(solveInpr(newConfig.equation, settings.degRad))
    let newObject = {
      "func": newConfig.name,
      "funcParse": parseable,
      "inputs": cacInputs(parseable),
      "funcRadDeg": containsTrig(newConfig.equation),
      "funcLength": newConfig.name.length
    };
    funcList[i] = newObject;
  }else if (oldConfig.type == "Code"){

  }else if (oldConfig.type == "Hybrid"){

  }
}
function addImplemented(funcConfig) {
  if (funcConfig.type == "Function") {
    let parseable = createParseable(solveInpr(funcConfig.equation, settings.degRad))
    let object = {
      "func": funcConfig.name,
      "funcParse": parseable,
      "inputs": cacInputs(parseable),
      "funcRadDeg": containsTrig(funcConfig.equation),
      "funcLength": funcConfig.name.length
    };
    funcList.push(object);
  }else if(funcConfig.type == "Code"){

  }else if(funcConfig.type == "Hybrid"){

  }
}
function removeImplemented(oldConfig){
  let object = {};
  if (oldConfig.type == "Function") {
    let parseable = createParseable(solveInpr(oldConfig.equation, settings.degRad))
    object = {
      "func": oldConfig.name,
      "funcParse": parseable,
      "inputs": cacInputs(parseable),
      "funcRadDeg": containsTrig(oldConfig.equation),
      "funcLength": oldConfig.name.length
    };
    
  }else if(oldConfig.type == "Code"){

  }else if(oldConfig.type == "Hybrid"){

  }
  for(let i = 0; i < funcList.length; i++){
    if(JSON.stringify(object) == JSON.stringify(funcList[i])){
      funcList.splice(i, 1)
    }
  }
}
function hidModes(num, tabs) {
  if (num == 0) {
    tabs[0].style.visibility = "hidden";
  } else if (num == 75) {
    tabs[1].style.visibility = "hidden";
  } else if (num == 150) {
    tabs[2].style.visibility = "hidden";
  }
}
function animateModes(from, to, element) {
  if (from == 0 && to == 75) {
    //0 to 75
    element.style.animation = undefined;
    element.style.animation = "0.15s ease-in 0s 0.5 normal forwards running modeSwitch";
    setTimeout(function () { element.style.left = "75px"; element.style.animation = undefined }, 150);
    element.dataset.pos = 75;
  } else if (from == 0 && to == 150) {
    //0 to 150
    element.style.animation = undefined;
    element.style.animation = "0.15s ease-in 0s 1 normal forwards running modeSwitch"
    setTimeout(function () { element.style.left = "150px"; element.style.animation = undefined }, 150);
    element.dataset.pos = 150;
  } else if (from == 75 && to == 150) {
    //75 to 150
    element.style.animation = undefined;
    element.style.animation = "0.15s ease-in 0s 1 normal forwards running sveBacSwitch"
    setTimeout(function () { element.style.left = "150px"; element.style.animation = undefined }, 150);
    element.dataset.pos = 150;
  } else if (from == 75 && to == 0) {
    //75 to 0
    element.style.animation = undefined;
    element.style.animation = "0.15s ease-in 0s 1 normal forwards running sveForSwitch"
    setTimeout(function () { element.style.left = "0px"; element.style.animation = undefined }, 150);
    element.dataset.pos = 0;
  } else if (from == 150 && to == 75) {
    //150 to 75
    element.style.animation = undefined;
    element.style.animation = "0.15s ease-in 0s 0.5 reverse forwards running modeSwitch"
    setTimeout(function () { element.style.left = "75px"; element.style.animation = undefined }, 150);
    element.dataset.pos = 75;
  } else if (from == 150 && to == 0) {
    //150 to 0
    element.style.animation = undefined;
    element.style.animation = "0.15s ease-in 0s 1 reverse forwards running modeSwitch"
    setTimeout(function () { element.style.left = "0px"; element.style.animation = undefined }, 150);
    element.dataset.pos = 0;
  } else {
    console.log(same)
  }
}
function varListAssbely(element) {
  let variables = element.getElementsByClassName("variableContainer");
  let varData = [];
  for (i = 0; i < variables.length; i++) {
    let temp = {
      "Name": variables[i].querySelector('h3').innerHTML,
      "Value": variables[i].querySelector('input').value
    };
    varData.push(temp);
  }
  console.log("retruned Variable list")
  console.log(varData)
  return varData;
}
function parseVar(parsedEquation, data) {
  console.log("Parse var types")
  console.log(typeof data.Value)
  for (let i = 0; i < parsedEquation.length; i++) {
    if (funcMatch(parsedEquation.substring(i)) != "") {
      i += funcMatch(parsedEquation.substring(i)).length;
    } else if (parsedEquation.charAt(i) == data.Name) {
      parsedEquation = parsedEquation.substring(0, i) + "(" + data.Value + ")" + parsedEquation.substring(i + 1);
    }
  }
  return parsedEquation;
}
//Takes a tab element and returns the variables in the tab with their data in json format
function parseVariables(element, equationDIV, funcTabs) {
  console.log("Parse Variables ran");
  let varData = varListAssbely(element);
  let parsedEquation = equationDIV.dataset.baseE
  console.log("%c parsedEquation: " + parsedEquation, "color:red");
  let all = true;
  let first = undefined;
  for (let Vars of varData) {
    if (all) {
      if (Vars.Value == '') {
        all = false;
        first = Vars;
      }
    } else if (Vars.Value == '') {
      first = undefined;
    }
  }
  console.log("first = " + first);
  for (let data of varData) {
    parsedEquation = parseVar(parsedEquation, data);
  }
  console.log(equationDIV.dataset.baseE);
  if (all) {
    solveEquation(parsedEquation, funcTabs);
    solveGraph(varData, equationDIV.innerHTML, first);
    solveTable(parsedEquation, first);
  } else if (first != undefined) {
    solveGraph();
    solveTable(equationDIV.innerHTML, first);
  }
  console.log("%c Check method ran", "color:green")
}
function solveEquation(parsedEquation, funcTabs) {
  console.log("Parsed Equation is " + parsedEquation);
  let result = "=" + inputSolver(parsedEquation, "Couldn't Calculate");
  console.log("%c result: " + result, "color:green");
  funcTabs[0].querySelector('#equalsHeader').innerHTML = result;
}
function solveGraph(varData, parsedEquation, data) {

}
function solveTable(parsedEquation, data) {
  console.log("solve table ran")
  /*
  needs to get the settings table step and number of steps
  then it will run a loop the number of values there are and for each it will
     will run the equation on the designated step by mutiplying the step by number of values
     then insert the number which is the result of mutipling values by loop and step 
     and the value resulted by runing that number in the eqaution into the table
  end method
  */
  let numValue = Number(document.getElementById('cellsTable').value);
  let step = Number(document.getElementById('stepTable').value);
  document.getElementById("funcTable").innerHTML = "<tr><th>x</th><th>y</th></tr>";
  for (let i = 1; i <= numValue; i++) {
    // missing the code that will parse and solve equation
    console.log("Loop " + i);
    let result;
    let currentVal = i * step;
    var newData = data;
    let loopEqua = parsedEquation;
    newData.Value = "" + currentVal;
    result = inputSolver(parseVar(loopEqua, newData), "Error Making Table");
    var newRow = document.getElementById('funcTable').insertRow(i);
    var newXCell = newRow.insertCell(0);
    var newYCell = newRow.insertCell(1);
    newXCell.innerHTML = "" + currentVal;
    newXCell.id = "shit"
    console.log(i * step)
    newYCell.innerHTML = result;
    newYCell.id = "other shit"
  }
}
//Method that finds all instances of the defined function value in buttons and 
function updateCustomButtons(oldVal, newValue) {
  console.log('Old Val is ' + oldVal + " New Value is " + newValue);
  let functionLinks = document.getElementsByClassName('customFuncLinks');
  let Name = oldVal.name;
  let newName = newValue.name;
  let newFunction = "";
  switch (oldVal.type) {
    case ("Function"):
      newFunction = newValue.equation;
      break;
    case ("Code"):
      newFunction = "Code";
      break;
    case ("Hybrid"):
      newFunction = "Hybrid";
      break;
  }
  for (let i = 0; i < functionLinks.length; i++) {
    console.log("Checking " + functionLinks[i].childNodes[1].data + " and " + functionLinks[i].childNodes[0].innerHTML);
    if (functionLinks[i].querySelector("#nameLabel").innerHTML == Name) {
      console.log("Matching Found");
      functionLinks[i].querySelector("#equationLabel").innerHTML = newFunction;
      functionLinks[i].querySelector("#nameLabel").innerHTML = newName;
      //functionLinks[i].data.
    }
  }
}
//Method To Match a tab button in the tab directory to its tab page
function matchTab(info, type) {
  let elements = [];
  if (type) {
    elements = document.getElementsByClassName('tablinks');
  } else {
    elements = document.getElementsByClassName('tabcontent');
  }
  for (let i = 0; i < elements.length; i++) {
    if (type) {
      if (elements[i].dataset.tabmap == info) {
        return elements[i];
      }
    } else {
      if (elements[i].dataset.tab == info) {
        return elements[i];
      }
    }
  }
}
function checkVar(varGrid, equationArea, funcTabs) {
  let tabVarContainers = varGrid.getElementsByClassName("variableContainer");
  let varExisting = [];
  let equation = equationArea.innerHTML;
  for (let cont of tabVarContainers) {
    let name = cont.querySelector('h3').innerHTML;
    varExisting.push({
      "name": name,
      "element": cont
    });
  }
  let varEquation = varInEquat(equationArea.innerHTML);
  let newVars = [];
  for (let eVar of varEquation) {
    matching = false;
    for (let cVar of varExisting) {
      if (eVar.letter == cVar.name) {
        let indexOfVar = varExisting.indexOf(cVar);
        varExisting.splice(indexOfVar, 1);
        matching = true;
        break;
      }
    }
    if (!matching) {
      newVars.push(eVar.letter);
    }
  }
  for (let oldVar of varExisting) {
    varGrid.removeChild(oldVar.element);
  }
  for (let newVar of newVars) {
    newVariable(newVar, varGrid, equationArea, funcTabs, equation);
  }
}
function newVariable(name, varGrid, equationArea, funcTabs, equation) {
  let tempvar = document.getElementsByClassName("variableTemplate")[0];
  let varClon = tempvar.content.cloneNode(true);
  varClon.getElementById('variableName').innerHTML = name;
  varClon.getElementById('variableEntry').addEventListener('input', function (e) {
    if (varClon.getElementById('variableEntry') != '') {
      equationArea.innerHTML = setVar(varGrid, equationArea.dataset.baseE);
      try {
        parseVariables(varGrid, equationArea, funcTabs);
      } catch (e) { }
    }
  });
  varGrid.appendChild(varClon)
}
function varInEquat(equation) {
  let varArray = [];
  for (let i = 0; i < equation.length; i++) {
    if (equation.charCodeAt(i) > 92 && equation.charCodeAt(i) < 123) {
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
        i += isVar(equation.substring(i));
      }
    }
  }
  return varArray;
}
function varInList(list, varLetter) {
  for (let item of list) {
    if (item.letter == varLetter) {
      return item;
    }
  }
  return null;
}
function isVar(entry) {
  let func = funcMatch(entry);
  if (func != "") {
    if (getByName(func) != null) {
      let object = getByName(func);
      return object.funcLength;
    } else {
      return func.length
    }
  } else {
    return 0;
  }
}
function setVar(element, equation) {
  console.log("Parse Variables ran");
  let varData = varListAssbely(element);
  console.log("%c parsedEquation: " + equation, "color:red");
  for (let data of varData) {
    for (let i = 0; i < equation.length; i++) {
      if (funcMatch(equation.substring(i)) != "") {
        i += funcMatch(equation.substring(i)).length;
      } else if (equation.charAt(i) == data.Name) {
        if (data.Value != "") {
          equation = equation.substring(0, i) + "(" + data.Value + ")" + equation.substring(i + 1);
        }
      }
    }
  }

  console.log(varData)
  return equation;
}
function helpTabChange(name) {
  var tabs = document.getElementsByClassName("settingTabContent");
  if (window.innerWidth / window.innerHeight > 3 / 4) {
    for (i = 0; i < tabs.length; i++) {
      tabs[i].style.visibility = "hidden";
    }
    if (name == 'mainCalculatorHelp') {
      document.getElementById("mainCalculatorHelp").style.visibility = "visible";
      console.log("lookn ran");
    } else if (name == 'customFuncHelp') {
      document.getElementById('customFuncHelp').style.visibility = "visible";
    } else if (name == 'settingsHelp') {
      document.getElementById('settingsHelp').style.visibility = "visible";
    } else {
      console.log("nothing")
    }
  } else {
    for (i = 0; i < tabs.length; i++) {
      tabs[i].style.visibility = "hidden";
    }
    if (name == 'mainCalculatorHelp') {
      document.getElementById("mainCalculatorHelp").style.visibility = "visible";
      document.getElementById("mainCalculatorHelp").style.width = "100%";
      document.getElementById("mainCalBack").style.visibility = "visible";
      document.getElementById("mainCalculatorHelp").style.animation = "0.15s ease-in 0s 1 normal forwards running toSlideLeft";
      setTimeout(function () { document.getElementById("navColumn").style.visibility = "hidden"; }, 150);
      sessionStorage.setItem("facing", "mainCalculatorHelp");
      console.log("lookn ran");
    } else if (name == 'customFuncHelp') {
      document.getElementById("customFuncHelp").style.visibility = "visible";
      document.getElementById("customFuncHelp").style.width = "100%";
      document.getElementById("customFuncBack").style.visibility = "visible";
      document.getElementById("customFuncHelp").style.animation = "0.15s ease-in 0s 1 normal forwards running toSlideLeft";
      setTimeout(function () { document.getElementById("navColumn").style.visibility = "hidden"; }, 150);
      sessionStorage.setItem("facing", "customFuncHelp");
    } else if (name == 'settingsHelp') {
      document.getElementById("settingsHelp").style.visibility = "visible";
      document.getElementById("settingsHelp").style.width = "100%";
      document.getElementById("settingsBack").style.visibility = "visible";
      document.getElementById("settingsHelp").style.animation = "0.15s ease-in 0s 1 normal forwards running toSlideLeft";
      setTimeout(function () { document.getElementById("navColumn").style.visibility = "hidden"; }, 150);
      sessionStorage.setItem("facing", "settingsHelp");
    } else {
      console.log("nothing")
    }
  }
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(rgb) {
  let first = rgb.substring(rgb.indexOf('(') + 1, rgb.indexOf(','));
  console.log(first);
  rgb = rgb.substring(rgb.indexOf(', ') + 2);
  let second = rgb.substring(0, rgb.indexOf(','));
  rgb = rgb.substring(rgb.indexOf(', ') + 2);
  let thrid = rgb.substring(0, rgb.indexOf(')'));
  return "#" + componentToHex(Number(first)) + componentToHex(Number(second)) + componentToHex(Number(thrid));
}
function helpBack(tab) {
  if (tab == "mainCalculatorHelp") {
    document.getElementById("mainCalBack").style.visibility = "hidden";
    if (window.innerWidth / window.innerHeight > 3 / 4) {
      document.getElementById("mainCalculatorHelp").style.animation = null;
    } else {
      document.getElementById("mainCalculatorHelp").style.animation = "0.15s ease-in 0s 1 normal forwards running toSlideRight";
      setTimeout(function () { document.getElementById("mainCalculatorHelp").style.animation = null; document.getElementById("mainCalculatorHelp").style.width = null; }, 150);
    }
    document.getElementById("navColumn").style.visibility = "visible";
  } else if (tab == "customFuncHelp") {
    document.getElementById("customFuncBack").style.visibility = "hidden";
    if (window.innerWidth / window.innerHeight > 3 / 4) {
      document.getElementById("customFuncHelp").style.animation = null;
    } else {
      document.getElementById("customFuncHelp").style.animation = "0.15s ease-in 0s 1 normal forwards running toSlideRight";
      setTimeout(function () { document.getElementById("customFuncHelp").style.animation = null; document.getElementById("customFuncHelp").style.width = null; }, 150);
    }
    document.getElementById("navColumn").style.visibility = "visible";
  } else if (tab == "settingsHelp") {
    document.getElementById("settingsBack").style.visibility = "hidden";
    if (window.innerWidth / window.innerHeight > 3 / 4) {
      document.getElementById("settingsHelp").style.animation = null;
    } else {
      document.getElementById("settingsHelp").style.animation = "0.15s ease-in 0s 1 normal forwards running toSlideRight";
      setTimeout(function () { document.getElementById("settingsHelp").style.animation = null; document.getElementById("settingsHelp").style.width = null; }, 150);
    }
    document.getElementById("navColumn").style.visibility = "visible";
  }
}
function mobileTabMethod() {
  hideAllTabs();
  changeTabAs(true);

}
function hideAllTabs() {
  let tabs = document.getElementsByClassName('tabcontent');
  if (document.getElementById('arrowIcon').style.animation == "0.25s ease-in 0s 1 normal forwards running toUp") {
    popup();
  }
  for (let tab of tabs) {
    tab.style.visibility = "hidden";
  }
}
function changeTabAs(change) {
  let visibility = "", bases = document.getElementsByClassName('displayBase'), tabstyle = "", tablinks = document.getElementsByClassName('tablinks');
  if (change) {
    visibility = "visible";
    tabstyle = "visibility: visible; left: 5%; width: 90%; height: 90%; border-radius: 20px; text-align: center;";
    document.getElementById("tab").style = "display: block; height:100%;";
    document.getElementById('tabContainer').style = "display: grid; grid-template-columns: 50% 50%; grid-auto-rows: 300px; position: absolute; visibility: visible; top: 50px; bottom: 0; width: 100%; height: 100%; background-color: var(--translucent); border-radius: 25px 25px 0 0;";
  } else {
    visibility = "hidden";
    tabstyle = undefined;
    document.getElementById("tab").style = undefined;
    document.getElementById('tabContainer').style = undefined;
  }
  for (let i = 0; i < bases.length; i++) {
    bases[i].style.visibility = visibility;
    tablinks[i].style = tabstyle;
    if (change) {
      let parse = tablinks[i].dataset.tabmap;
      parse = parse.substring(parse.indexOf('»') + 1);
      parse = parse.substring(0, parse.indexOf('»'));
      setShowEquat(tablinks[i], parse);
    }
  }
}
function setShowEquat(tablink, equation) {
  if (equation != "") {
    let childern = tablink.childNodes;
    console.log(childern);
    tablink.querySelector("#equtDisplayFunc").innerHTML = equation;
  }
}
function setNumOfTabs() {
  let tabs = document.getElementsByClassName('tablinks');
  document.getElementById("tabNum").innerHTML = tabs.length;
}
function getFuncList() {
  let parseString = localStorage.getItem("funcList");
  let array = [];
  let finalArray = [];
  if (parseString == undefined) {
    array = [];
  } else {
    //array = parseString.split('⥾');
    while (parseString.includes('⥾')) {
      array.push(parseString.substring(0, parseString.indexOf('⥾')));
      parseString = parseString.substring(parseString.indexOf('⥾') + 1);
    }

  }
  console.log(array);
  for (let func of array) {
    let funcJSON = {};
    switch (func.substring(0, 1)) {
      case "F":
        funcJSON.type = "Function";
        func = func.substring(func.indexOf('»') + 1);
        funcJSON.name = func.substring(0, func.indexOf('»'));
        func = func.substring(func.indexOf('»') + 1);
        funcJSON.equation = func.substring(0, func.indexOf('»'));

        break;
      case "H":
        funcJSON.type = "Hybrid";
        func = func.substring(func.indexOf('»') + 1);
        funcJSON.name = func.substring(0, func.indexOf('»'));
        func = func.substring(func.indexOf('»') + 1);
        funcJSON.code = func.substring(0, func.indexOf('»'));
        break;
      case "C":
        funcJSON.type = "Code";
        func = func.substring(func.indexOf('»') + 1);
        funcJSON.name = func.substring(0, func.indexOf('»'));
        func = func.substring(func.indexOf('»') + 1);
        funcJSON.code = func.substring(0, func.indexOf('»'));
        break;
      default:
        console.log("Defa")
        break;
    }
    finalArray.push(funcJSON);
  }
  return finalArray;
}
/*function createParseable(equation){
  let equationArray = [];
  let variablesInOrder = [];
  let varArray = varInEquat(equation);
  for(let i = 0; i < varArray.length; i++){
    varArray[i].letter = "v" + (i+1);
  }
  console.log(varArray);
  variablesInOrder.push({"name": varArray[0].letter, "index": varArray[0].positions[0]});
  varArray.shift();
  for(item of varArray){
    for(let postion of item.positions){
      for(let j = variablesInOrder.length-1; j >= 0; j--){
        console.log(`${postion} vs. ${variablesInOrder[j].index} and ${postion > variablesInOrder[j].index}`)
        if(postion > variablesInOrder[j].index){
          variablesInOrder.splice(j+1, 0, {"name": item.letter, "index": postion});
          break;
        }
      }
    }
  }
  console.log(variablesInOrder)
  for(let i = 0; i < variablesInOrder.length; i++){
    let index = variablesInOrder[i].index;
    let pre = "";
    let vard = "";
    if(i == 0){
      pre = equation.substring(0,index);
      vard = variablesInOrder[i].name;
    }else{
      let prevIndex = variablesInOrder[i-1].index;
      pre = equation.substring(prevIndex+1, index);
      vard = variablesInOrder[i].name;
    }
    if(pre != ""){
      equationArray.push(pre);
    }
    equationArray.push(vard);
    if(i == variablesInOrder.length-1 && equation.substring(index+1) != ''){
      equationArray.push(equation.substring(index+1));
    }
  }
  return equationArray;
}*/
function findFuncConfig(name) {
  let funcList = getFuncList();
  for (let func of funcList) {
    if (func.name == name) {
      return func;
    }
  }
}
function setFuncList(array) {
  let parseString = "";
  console.log(array);
  for (let i = 0; i < array.length; i++) {
    let parsedString = "";
    switch (array[i].type) {
      case "Function":
        parsedString = "F" + "»" + array[i].name + "»" + array[i].equation + "»";
        break;
      case "Hybrid":
        parsedString = "H" + "»" + array[i].name + "»" + array[i].code + "»";
        break;
      case "Code":
        parsedString = "C" + "»" + array[i].name + "»" + array[i].code + "»";
        break;
    }
    parseString += parsedString + "⥾";
  }
  console.log(`parsedString: ${parseString}`);
  localStorage.setItem("funcList", parseString);
}
function removeFunc(funcName) {
  let array = getFuncList();
  console.log(funcName)
  for (let item of array) {
    if (item.name == funcName) {
      //removeImplemented(item);
      array.splice(array.indexOf(item), 1);
    }
  }
  setFuncList(array);
}
function funcAssebly(type, name, text) {
  let object = {};
  switch (type) {
    case "Function":
      object.type = "Function";
      object.name = name;
      object.equation = text;
      break;
    case "Hybrid":
      object.type = "Hybrid";
      object.name = name;
      object.code = text;
      break;
    case "Code":
      object.type = "Code";
      object.name = name;
      object.code = text;
      break;
  }
  return object;
}
function setInverse() {
  let trig = [{ "base": "sin", "inverse": "csc" }, { "base": "cos", "inverse": "sec" }, { "base": "tan", "inverse": "cot" }];
  let elements = ['sinEx', 'cosEx', 'tanEx', 'sinPopup', 'cosPopup', 'tanPopup'];
  let invButtons = ['invPopup', 'invEx'];
  let arc = false;
  let text = "";
  if (document.getElementById('sinPopup').innerHTML.substring(0, 1) == "a") {
    arc = true;
  }
  //sets the text of inv buttons and sets the state value
  if (document.getElementById('invPopup').innerHTML == "inv") {
    text = "reg"
    state.tS[0] = true;
  } else {
    text = "inv"
    state.tS[0] = false;
  }
  for (let elem of invButtons) {
    document.getElementById(elem).innerHTML = text;
  }
  //sets the text of trig buttons based on values
  for (let elem of elements) {
    let elemText = document.getElementById(elem).innerHTML;
    let outText = "";
    if (arc) {
      elemText = elemText.substring(1);
    }
    for (let tr of trig) {
      if (elemText == tr.base) {
        outText = tr.inverse;
      } else if (elemText == tr.inverse) {
        outText = tr.base;
      }
    }
    if (arc) {
      outText = "a" + outText;
    }
    document.getElementById(elem).innerHTML = outText;
  }
}
function setArc() {
  let elements = ['sinEx', 'cosEx', 'tanEx', 'sinPopup', 'cosPopup', 'tanPopup'];
  let invButtons = ['arcPopup', 'arcEx'];
  let arc = false;
  if (document.getElementById('sinPopup').innerHTML.substring(0, 1) == "a") {
    arc = true;
  }
  for (let elem of elements) {
    let text = document.getElementById(elem).innerHTML;
    if (!arc) {
      document.getElementById(elem).innerHTML = "a" + text;
      state.tS[1] = true;
    } else {
      document.getElementById(elem).innerHTML = text.substring(1);
      state.tS[1] = false;
    }
  }
}
function setDegMode() {
  let text = "";
  let elements = ['degEx', 'degPopup'];
  if (document.getElementById('degPopup').innerHTML == "deg") {
    text = "rad"
    settings.degRad = false;
  } else {
    text = "deg"
    settings.degRad = true;
  }
  for (let elem of elements) {
    document.getElementById(elem).innerHTML = text;
  }
}
function setState() {
  state.eT = document.getElementById('enterHeader').innerHTML;
  let tabs = document.getElementsByClassName('tablinks');
  for (let tab of tabs) {
    let tabmap = tab.dataset.tabmap;
    if (tabmap != "mainTab") {
      console.log(tabmap);
      let object = JSON.parse(tabmap);
      state.fO.push(object.name)
    }
  }
  sessionStorage.setItem("state", JSON.stringify(state));
}
function queryPurchase(item) {
  let queryList = getPurshaseList();
  let defaultPurchases = ["darkMode", "lightMode"];
  for (let normal of defaultPurchases) {
    if (normal == item) {
      return true;
    }
  }
  for (let purchased of queryList) {
    if (purchased == item) {
      return true;
    }
  }
  return false;
}
function getPurshaseList() {
  let list = [];
  if (localStorage.getItem('purchased') != undefined) {
    list = JSON.parse(localStorage.getItem('purchased')).purchaseList;
  }
  return list;
}
function setPurchase(name) {
  if (localStorage.getItem('purchased') != undefined) {
    let purchased = JSON.parse(localStorage.getItem('purchased'));
    purchased.purchaseList.push(name)
    localStorage.setItem('purchased', JSON.stringify(purchased));
  } else {
    localStorage.setItem('purchased', JSON.stringify({ "purchaseList": [name] }));
  }
}
function unlockCustomTheme() {
  document.getElementById('buyCustTheme').style = "visibility: hidden; position: absolute; top: 0; left: 0;";
  document.getElementById('custLabel').style = "margin-top: unset; margin-bottom: unset;";
  let colors = themeElem.getMth();
  settings.p = colors[0];
  settings.s = colors[2];
  settings.a = colors[1];
  settings.t = colors[3];
  document.getElementById('primaryColorPicker').value = settings.p
  document.getElementById('secondaryColorPicker').value = settings.s
  document.getElementById('accentColorPicker').value = settings.a
}
function toggleCustTheme() {
  if (document.getElementById('ColorsDiv').style.visibility == 'visible') {
    document.getElementById('ColorsDiv').style = "visibility: hidden; position: absolute;";
    document.getElementById('accentColorDiv').style = "visibility: visible; position: relative;";
  } else {
    document.getElementById('ColorsDiv').style = "visibility: visible; position: relative;";
    document.getElementById('accentColorDiv').style = "visibility: hidden; position: absolute;";
  }
}
function getCatalog() {
  return [
    {
      "name": "custTheme",
      "price": "0.99",
      "have": queryPurchase()
    }
  ];
}
function getThemes() {
  return [
    {
      "name": "lightMode",
      "primary": "#ffffff",
      "secondary": "#dedede",
      'text': '#000000',
      'getMth': function () {
        return ["#ffffff", getColorAcc(settings.acc), "#dedede", "#000000"];
      }
    },
    {
      "name": "darkMode",
      "primary": "#000000",
      "secondary": "#1f1f1f",
      'text': '#FFFFFF',
      'getMth': function () {
        return ["#000000", getColorAcc(settings.acc), "#1f1f1f", '#FFFFFF'];
      }
    },
    {
      "name": "custPurchasable",
      "primary": settings.p,
      "secondary": settings.s,
      "text": settings.t,
      'getMth': function () {
        return [settings.p, settings.a, settings.s, settings.t]
      }
    }
  ];
}
function getColors() {
  console.log("you dick")
  let themes = getThemes();
  for (let theme of themes) {
    if (theme.name == settings.theme) {
      return theme.getMth();
    }
  }
}
function getAccents() {
  return [
    {
      "id": 'red',
      "val": '#d6564d'
    },
    {
      "id": 'orange',
      "val": '#fca31e'
    },
    {
      "id": 'yellow',
      "val": '#e9e455'
    },
    {
      "id": 'green',
      "val": '#68c43e'
    },
    {
      "id": 'blue',
      "val": '#4193ff'
    },
    {
      "id": 'purple',
      "val": '#6a2bfd'
    },
    {
      "id": 'grey',
      "val": '#b8b8b8'
    }
  ];
}
function getColorAcc(acc) {
  let accents = getAccents();
  for (let accent of accents) {
    if (accent.id == acc) {
      console.log(`accent is ${accent.val}`);
      return accent.val;
    }
  }
}
function setRoot(colorArray) {
  let rootCss = document.querySelector(':root');
  rootCss.style.setProperty('--displayColor', colorArray[2]);
  rootCss.style.setProperty('--numbersColor', colorArray[1]);
  rootCss.style.setProperty('--functionsColor', colorArray[0]);
  rootCss.style.setProperty('--textColor', colorArray[3]);
  TextColorGlobal = colorArray[3];
  /*if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    colorMessager.postMessage(colorArray[0]);
  }*/
}
function setImages(imgList) {
  for (let img of imgList) {
    if (img.type == "mutiple") {
      let elems = document.getElementsByClassName(img.class);
      for (elem of elems) {
        elem.src = img.src;
      }
    } else {
      document.getElementById(img.id).src = img.src;
    }
  }
}
function report(message, meaning) {
  console.log("report")
  let consoleD = document.getElementById("popupConsole");
  consoleD.innerHTML = message;
  consoleD.style.visibility = "visible";
  consoleD.style.animation = "1.5s ease-in 0s 1 normal forwards running slideToUpFromBottom";
  let width = consoleD.width / 2;
  let vw = window.innerWidth;
  consoleD.style.left = vw - width + "px";
  if (meaning) {
    consoleD.style.backgroundColor = "#71ec71";
  } else {
    consoleD.style.backgroundColor = "#f74646";
  }
  setTimeout(function () {
    consoleD.style.animation = null;
    consoleD.style.visibility = "hidden";
  }, 1500);
}