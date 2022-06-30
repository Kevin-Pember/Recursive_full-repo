console.log(varInEquat("x+x"))
let TextColorGlobal = "";
let BackgroundColorGlobal = "";
let colorArray = [];
let definedPages = [
  {
    "srtConfig": {
      "name": "mainPage",
    },
    "tabPage": document.getElementById("MainContent"),
    "tab": document.getElementById("mainTab"),
  }
];
let imgList = [
  {
    'name': 'aboutUS',
    'white': 'Images/aboutUSWhite.svg',
    'black': 'Images/aboutUS.svg'
  },
  {
    'name': 'addObject',
    'white': 'Images/addObjectWhite.svg',
    'black': 'Images/addObject.svg'
  },
  {
    'name': 'backIcon',
    'white': 'Images/backIconWhite.svg',
    'black': 'Images/backIcon.svg'
  },
  {
    'name': 'calculatorIcon',
    'white': 'Images/calculatorIconWhite.svg',
    'black': 'Images/calculatorIcon.svg'
  },
  {
    'name': 'Calipiers',
    'white': 'Images/CalipiersWhite.svg',
    'black': 'Images/Calipiers.svg'
  },
  {
    'name': 'checkmark',
    'white': 'Images/checkmarkWhite.svg',
    'black': 'Images/checkmark.svg'
  },
  {
    'name': 'Colors',
    'white': 'Images/ColorsWhite.svg',
    'black': 'Images/Colors.svg'
  },
  {
    'name': 'customFunctionIcon',
    'white': 'Images/customFunctionIconWhite.svg',
    'black': 'Images/customFunctionIcon.svg'
  },
  {
    'name': 'EditIcon',
    'white': 'Images/EditIconWhite.svg',
    'black': 'Images/EditIcon.svg'
  },
  {
    'name': 'help',
    'white': 'Images/helpWhite.svg',
    'black': 'Images/help.svg'
  },
  {
    'name': 'historyIcon',
    'white': 'Images/historyIconWhite.svg',
    'black': 'Images/historyIcon.svg'
  },
  {
    'name': 'minusIcon',
    'white': 'Images/minusIconWhite.svg',
    'black': 'Images/minusIcon.svg'
  },
  {
    'name': 'mobileTabsIcon',
    'white': 'Images/mobileTabsIconWhite.svg',
    'black': 'Images/mobileTabsIcon.svg'
  },
  {
    'name': 'MoreFuncArrow',
    'white': 'Images/MoreFuncArrowWhite.svg',
    'black': 'Images/MoreFuncArrow.svg'
  },
  {
    'name': 'resize',
    'white': 'Images/resizeWhite.svg',
    'black': 'Images/resize.svg'
  },
  {
    'name': 'SettingsCog',
    'white': 'Images/SettingsCogWhite.svg',
    'black': 'Images/SettingsCog.svg'
  },
  {
    'name': 'settingsPageIcon',
    'white': 'Images/settingsPageIconWhite.svg',
    'black': 'Images/settingsPageIcon.svg'
  },
  {
    'name': 'xIcon',
    'white': 'Images/xIconWhite.svg',
    'black': 'Images/xIcon.svg'
  },
  {
    'name': 'graphMode',
    'white': 'Images/graphModeWhite.svg',
    'black': 'Images/graphMode.svg'
  },
  {
    'name': 'mainMode',
    'white': 'Images/mainModeWhite.svg',
    'black': 'Images/mainMode.svg'
  },
  {
    'name': 'tableMode',
    'white': 'Images/tableModeWhite.svg',
    'black': 'Images/tableMode.svg'
  }
];
let keyTargets = { "scroll": document.getElementById('uifCalculator'), "input": document.getElementById('enterHeader') }
var settings;
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
setSettings();
let graphModeChart = createGraph(document.getElementById('graphModeCanvas'))
graphModeChart.options.plugins.zoom.zoom.onZoomComplete = function () {
  graphInMode()
}
graphModeChart.options.plugins.zoom.pan.onPanComplete = function () {
  graphInMode()
}
if (document.getElementById("mainBody") != null) {
  var funcs = getFuncList();
  for (let funcObject of funcs) {
    console.log(funcObject);
    addImplemented(funcObject);
    switch (funcObject.type) {
      case "Function":
        custButton(funcObject, ['customFuncDisplayGrid', 'custFuncGridPopup', 'funcGrid']);
        break;
      case "Code":
        custButton(funcObject, ['customFuncDisplayGrid', 'custFuncGridPopup', 'funcGrid']);
        break;
      case "Hybrid":
        custButton(funcObject, ['customFuncDisplayGrid', 'custFuncGridPopup', 'funcGrid']);
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
    openElement("mainPage")
  });

  //new media queries
  const shit = window.matchMedia("(screen and max-height: 450px)");
  const mobileLandscape = {
    "q": window.matchMedia("screen and (max-height: 450px)"),
    "styling": `
    .tabcontent {
      top: 40px;
      border-radius: 0 25px 0 0;
    }
    #tab {
      height: 40px
    }
  
    #settingsCogIcon {
      width: 40px;
      height: 40px;
    }
    #modeButton{
      left: 20px;
      right: unset;
    }
    #displayClip {
      width: calc(33.3333% - 15px);
      height: calc(100% - 20px);
      max-width: 100%;
    }
  
    #Container {
      background-color: var(--functionsColor);
    }
  
    #overlayDiv {
      bottom: 55%;
    }
    #keypad{
      width: calc(33.3333% - 15px);
      left: calc(66.6666% + 5px);
      height: calc(100% - 60px);
      top: 50px;
      bottom: 0;
      padding: 0px;
      position: absolute;
      border-radius: 25px;
      overflow: hidden;
    }
    #mainCacGrid {
      width: 100%;
      height: 100%;
      grid-template-columns: 16.666% 16.666% 16.666% 16.666% 16.666% 16.666%;
      grid-template-rows: 25% 25% 25% 25%;
      grid-template-areas:
        "pow num1 num2 num3 plus moreFuncBut"
        "pow2 num4 num5 num6 minus backspace"
        "sqrt num7 num8 num9 mutiplication pars"
        "enter pi num0 point division percent";
    }
    #extendedKeypad{
      position: absolute;
      top: 0;
      height: 100%;
      width: calc(33.3333% - 10px);
      height: calc(100% - 20px);
      left: calc(33.3333% + 5px);
      top: 10px;
      visibility: inherit;
    }
    #extendedFuncGrid {
      top: 0;
      height: 100%;
      width: 100%;
      left: 0;
      max-width: 100%;
      grid-template-columns: 33.3333% 33.3333% 33.3333%;
      grid-template-rows: 16.6666% 16.6666% 16.6666% 16.6666% 16.6666% 16.6666%;
      grid-template-areas:
        "help func ac"
        "vars abs d-f"
        "deg inv arc"
        "sin cos tan"
        "mod log10 fact"
        "log ln e";
    }
    
    #EquationFunc{
      font-size: 30px;
    }

    #varsDiv {
      top: 0;
      height: 100%;
      width: 33.3333%;
      left: 0;
      max-width: 100%;
      display: grid;
      grid-template-columns: 20% 20% 20% 20% 20%;
      grid-template-rows: 20% 20% 20% 20% 20%;
      position: absolute;
      z-index: 4;
    }
  
  
    #arrowIcon {
      visibility: hidden;
      animation: 0.25s ease-in 0s 1 normal forwards running toDown;
    }
  
    #deleteHistory{
      left: unset;
      right: 10px;
    }
  
    #overlayDiv {
      width: 66.6666%;
    }
  
    #customFuncDisplay {
      background-color: var(--functionsColor);
      visibility: visible;
      width: 33.333%;
      left: 100%;
      position: absolute;
      z-index: 1;
      border-radius: 0 0 0 0;
    }
  
    #backExMini {
      position: absolute;
      z-index: 1;
      left: 10px;
      top: 8.5px;
    }
  
    #customFuncDisplayGrid .button {
      width: 95%;
      height: 90%;
      top: 5%;
      right: 2.5%;
      border-radius: 25px;
      border: none;
      background-color: var(--numbersColor);
    }
  
    #customFuncDisplayGrid {
      grid-template-columns: 100%;
    }
  
    .text-area {
      direction: rtl;
    }
  
    #customFuncDisplayRecentText {
      color: transparent;
    }
  
    #nameCreator {
      width: 20%
    }
  
    #mainCreator {
      width: calc(80% - 30px);
      left: calc(20% + 20px);
      top: 50px;
    }
  
    .modeSelectButton{
      height: calc(100% - 20px);
      width: calc(32% - 10px);
      margin-top: 10px;
    }
    .modeIcon{
      height: unset;
      width: calc(100% - 40px);
    }
    .dynamicModeContainer{
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-areas: 
      "graph controls";
      grid-template-columns: 66.6666% 33.3333%;
      grid-template-rows: unset;
      position: absolute;
    }
    .dynamicModePane{
      height: calc(100% - 20px);
      width: calc(100% - 10px);
      margin-left: 10px;
    }
    .dynamicModeControls{
      width: calc(100% - 20px);
      margin-top: 10px;
      height: calc(100% - 20px)
      margin-left: 10px;
    }
    #navColumn{
      width: calc(25% - 15px);
      margin-left: 10px;
    }
    .settingTabContent{
      left: calc(25% + 5px);
      width: calc(75% - 15px);
      overflow: auto;
    }
    #funcGrid{
      grid-template-columns: 33.3333% 33.3333% 33.3333%;
    }
    #graphContainer{
      height: 80%;
    }
    .navButtons{
      height: 50px;
      text-indent: 50px;
    }`
  };
  const mobilePortrait = {
    "q": window.matchMedia("screen and (max-aspect-ratio: 3/4) and (max-width: 450px)"),
    "styling": `
    #tab {
      height: 50px;
    }
  
    #mobileTabs {
      visibility: visible;
      left: 0;
    }
  
    .tablinks {
      visibility: hidden;
    }
  
    .tabcontent {
      position: absolute;
      top: 50px;
      bottom: 0;
    }
  
    .mainCacGrid {
      height: 100%;
      width: 100%;
      grid-template-areas:
        "num1 num2 num3 moreFuncBut"
        "num4 num5 num6 backspace"
        "num7 num8 num9 plus"
        "pi num0 point minus"
        "percent pars pow mutiplication"
        "enter pow2 sqrt division";
    }
  
    #extendedFuncGrid {
      left: 100%;
    }
  
    #moreFunctionsButton {
      border-radius: 0 15px 0 0;
    }
  
    #arrowIcon {
      opacity: 1;
    }
  
    #backExMini {
      visibility: hidden;
    }
  
    #DisplayLabel {
      initial-value: "Display";
    }
  
    #customFuncDisplay {
      visibility: hidden;
    }
  
    #settingsCogIcon {
      width: 50px;
      height: 50px;
      position: absolute;
    }
    #navColumn {
      width: 100%;
    }
  
    #colorsTab {
      visibility: hidden;
      left: 100%;
    }
  
    #PreferencesTab {
      visibility: hidden;
      left: 100%;
    }
  
    #AboutTab {
      visibility: hidden;
      left: 100%;
    }
  
    .navButtons {
      text-indent: 100px;
      height: 100px;
    }
  
    #customFuncDisplayGrid {
      visibility: hidden;
    }
    #navColumn {
      width: calc(100% - 20px);
      margin-left: 10px;
    }
  
    #mainCalculatorHelp {
      visibility: hidden;
      left: 100%;
    }
  
    #customFuncHelp {
      visibility: hidden;
      left: 100%;
    }
  
    #settingsHelp {
      visibility: hidden;
      left: 100%;
    }`
  }
  var tabletLandscape = {
    "q": window.matchMedia("screen and (min-aspect-ratio: 4/3) and (max-aspect-ratio: 16/9)"),
    "styling": `
    #tab {
      height: 40px
    }
  
    #settingsCogIcon {
      width: 40px;
      height: 40px;
      top: 0;
    }
  
    .tabcontent {
      top: 40px;
    }
  
    .tablinks {
      left: 0;
    }
  
    #displayClip {
      width: 66.6666%;
      max-width: 100%;
      border-radius: 0 25px 25px 0;
    }
  
    #keypad {
      width: 66.6666%;
      bottom: 0;
      padding: 0px;
    }
  
    #extendedFuncGrid {
      top: 0;
      height: 100%;
      width: 33.3333%;
      left: 66.6666%;
      max-width: 100%;
    }
  
    #varsDiv {
      top: 0;
      height: 40%;
      width: 33.3333%;
      left: 66.6666%;
      max-width: 100%;
      grid-template-columns: 20% 20% 20% 20% 20%;
      grid-template-rows: 20% 20% 20% 20% 20%;
    }
  
    #arrowIcon {
      visibility: hidden;
      animation: 0.25s ease-in 0s 1 normal forwards running toDown;
    }
  
    #extraFuncPopUp {
      visibility: hidden;
    }
  
    #overlayDiv {
      width: 66.6666%;
    }
  
    #customFuncDisplay {
      background-color: var(--functionsColor);
      visibility: visible;
      width: 33.333%;
      left: 100%;
      position: absolute;
      z-index: 1;
      border-radius: 0 0 0 0;
    }
  
    #backExMini {
      position: absolute;
      z-index: 1;
      left: 10px;
      top: 8.5px;
    }
  
    #customFuncDisplayGrid .button {
      width: 95%;
      height: 90%;
      top: 5%;
      right: 2.5%;
      border-radius: 25px;
      border: none;
      background-color: var(--numbersColor);
    }
  
    #customFuncDisplayGrid {
      grid-template-columns: 100%;
    }
  
    .text-area {
      direction: rtl;
    }
  
    #customFuncDisplayRecentText {
      color: transparent;
    }
    `
  };
  var tabletPortrait = {
    "q": window.matchMedia("screen and (min-aspect-ratio: 3/4) and (max-aspect-ratio: 4/3)"),
    "styling": `
    .navButtons {
      text-indent: 50px;
      height: 50px;
    }
  
    #navColumn {
      width: 27%;
    }
  
    .settingTabContent {
      width: 73%;
      left: 27%;
    }`
  }
  var largeFormat = {
    "q": window.matchMedia("screen and (max-aspect-ratio: 16/9)"),
    "styling": ` 
    #displayClip {
      width: 40%;
      max-width: 100%;
      resize: none;
      border-radius: 0 25px 25px 0;
    }
  
    #keypad {
      width: 40%;
      bottom: 0;
      padding: 0px;
    }
  
    #extendedFuncGrid {
      top: 0;
      height: 100%;
      width: 20%;
      left: 40%;
      max-width: 100%;
    }
  
    #arrowIcon {
      visibility: hidden;
    }
  
    #customFuncDisplay {
      visibility: visible;
      height: 100%;
      width: 40%;
      left: 60%;
      background-color: var(--displayColor);
      position: absolute;
      z-index: 1;
      border-radius: 25px 0 0 0;
    }
  
    #extraFuncPopUp {
      visibility: hidden;
    }
  
    #overlayDiv {
      width: 40%;
    }
  
    #customFuncDisplayRecentText {
      color: var(--textColor);
      text-align: center;
    }
  
    #customFuncDisplayGrid {
      grid-template-columns: 50% 50%;
    }
  
    #backExMini {
      visibility: hidden;
    }`
  }
  function queryMethod() {
    console.log("queryMethod")
    var styleElem;
    if (document.getElementById('screenStyle') == null) {
      styleElem = document.createElement('style');
      styleElem.id = 'screenStyle';
      document.getElementsByTagName('body')[0].appendChild(styleElem);
    } else {
      styleElem = document.getElementById('screenStyle');
    }

    if (mobileLandscape.q.matches) {
      styleElem.innerHTML = mobileLandscape.styling;
      styleElem.className = "mobileLandscape"
    } else if (mobilePortrait.q.matches) {
      styleElem.innerHTML = mobilePortrait.styling;
      styleElem.className = "mobilePortrait"
    } else if (tabletLandscape.q.matches) {
      styleElem.innerHTML = tabletLandscape.styling;
      styleElem.className = "tabletLandscape"
    } else if (tabletPortrait.q.matches) {
      styleElem.innerHTML = tabletPortrait.styling;
      styleElem.className = "tabletPortrait"
    } else if (largeFormat.q.matches) {
      styleElem.innerHTML = largeFormat.styling;
      styleElem.className = "largeFormat"
    } else {
      console.log('Default Styling')
    }

  }
  queryMethod();
  mobileLandscape.q.addEventListener("change", () => {
    queryMethod();
  })
  mobilePortrait.q.addEventListener("change", () => {
    queryMethod();
  })
  tabletLandscape.q.addEventListener("change", () => {
    queryMethod();
  })
  tabletPortrait.q.addEventListener("change", () => {
    queryMethod();
  })
  largeFormat.q.addEventListener("change", () => {
    queryMethod();
  })
  //new event listeners for the portable keypad
  let initGraphEquation = document.getElementById('initGraphEquation');
  keypadEquationMapper(initGraphEquation)
  document.getElementById('addGraphEquation').addEventListener('click', () => {
    let gEContainer = document.getElementById('graphFuncGrid')
    let clon = document.getElementById('dynamicEquationTemp').content.cloneNode(true);
    keypadEquationMapper(clon.getElementById('equation'));
    gEContainer.insertBefore(clon, document.getElementById('addGraphEquation'))
  })
  initGraphEquation.addEventListener('input', function (e) {
    console.log("change")
    graphInMode()
  })

  let initTableEquation = document.getElementById('initTableEquation');
  keypadEquationMapper(initTableEquation)
  document.getElementById('addTableEquation').addEventListener('click', () => {
    let gEContainer = document.getElementById('tableFuncGrid')
    let clon = document.getElementById('dynamicEquationTemp').content.cloneNode(true);
    keypadEquationMapper(clon.getElementById('equation'));
    gEContainer.insertBefore(clon, document.getElementById('addTableEquation'))
  })

  document.getElementById('mobileTabs').addEventListener("click", function (e) {
    if (document.getElementById('tabContainer').style.visibility != "visible") {
      console.log("toggled")
      hideAllTabs();
      changeTabAs(true);
      document.getElementById('keypad').style.visibility = "hidden";
    } else {
      console.log("toggled other")
      openElement("mainPage")
      changeTabAs(false);
      document.getElementById('keypad').style = undefined;
    }
  });
  document.getElementById('settingsCogIcon').addEventListener("click", function () { sessionStorage.setItem("facing", "settingsOut"); openPage("settingsPage") });

  //modeSwitcher section
  document.getElementById('modeButton').addEventListener("click", () => {
    switchMode('selectorMode')
  });
  document.getElementById('mainModeSelector').addEventListener("click", () => {
    switchMode('mainMode')
  })
  document.getElementById('graphModeSelector').addEventListener("click", () => {
    switchMode('graphMainMode')
  })
  document.getElementById('tableModeSelector').addEventListener("click", () => {
    switchMode('tableMainMode')
  })
  //keypad button Elems
  let keypadButtons = [
    {
      "id": 'num1',
      "name": "one",
      "function": () => {
        frontButtonPressed('1');
      },
      "repeatable": true,
    },
    {
      "id": 'num2',
      "name": "two",
      "function": () => {
        frontButtonPressed('2');
      },
      "repeatable": true,
    },
    {
      "id": 'num3',
      "name": "three",
      "function": () => {
        frontButtonPressed('3');
      },
      "repeatable": true,
    },
    {
      "id": 'moreFunctionsButton',
      "name": "Functions Page",
      "function": () => {
        sessionStorage.setItem("facing", "moreFunctionsPage");
        openPage("moreFunctionsPage");
      },
      "repeatable": false,
    },
    {
      "id": 'arrowIcon',
      "name": "More Functions Menu",
      "function": () => {
        popup();
        setSelect(keyTargets.input, keyTargets.input.lastChild.length);
      },
      "repeatable": false,
    },
    {
      "id": 'num4',
      "name": "four",
      "function": () => {
        frontButtonPressed('4');
      },
      "repeatable": true,
    },
    {
      "id": 'num5',
      "name": "five",
      "function": () => {
        frontButtonPressed('5');
      },
      "repeatable": true,
    },
    {
      "id": 'num6',
      "name": "six",
      "function": () => {
        frontButtonPressed('6');
      },
      "repeatable": true,
    },
    {
      "id": 'backspace',
      "name": "back space",
      "function": () => {
        backPressed();
      },
      "repeatable": true,
    },
    {
      "id": 'num7',
      "name": "seven",
      "function": () => {
        frontButtonPressed('7');
      },
      "repeatable": true,
    },
    {
      "id": 'num8',
      "name": "eight",
      "function": () => {
        frontButtonPressed('8');
      },
      "repeatable": true,
    },
    {
      "id": 'num9',
      "name": "nine",
      "function": () => {
        frontButtonPressed('9');
      },
      "repeatable": true,
    },
    {
      "id": 'plus',
      "name": "plus",
      "function": () => {
        frontButtonPressed('+');
      },
      "repeatable": false,
    },
    {
      "id": 'piButton',
      "name": "pie",
      "function": () => {
        frontButtonPressed('π');
      },
      "repeatable": true,
    },
    {
      "id": 'num0',
      "name": "zero",
      "function": () => {
        frontButtonPressed('0');
      },
      "repeatable": true,
    }, {
      "id": 'pointButton',
      "name": "point",
      "function": () => {
        frontButtonPressed('.');
      },
      "repeatable": false,
    },
    {
      "id": 'minus',
      "name": "minus",
      "function": () => {
        frontButtonPressed('-');
      },
      "repeatable": false,
    },
    {
      "id": 'percent',
      "name": "percent",
      "function": () => {
        frontButtonPressed('%');
      },
      "repeatable": false,
    },
    {
      "id": 'pars',
      "name": "Parenthesis",
      "function": () => {
        parsMethod();
      },
      "repeatable": false,
    },
    {
      "id": 'pow',
      "name": "Parenthesis",
      "function": () => {
        pow('1');
      },
      "repeatable": false,
    },
    {
      "id": 'mutiplication',
      "name": "mutiplication",
      "function": () => {
        frontButtonPressed('×');
      },
      "repeatable": false,
    },
    {
      "id": 'enter',
      "name": "enter",
      "function": () => {
        enterPressed(keyTargets.input.innerHTML);
      },
      "repeatable": false,
    },
    {
      "id": 'pow2',
      "name": "power of 2",
      "function": () => {
        pow('2');
      },
      "repeatable": true,
    },
    {
      "id": 'sqrt',
      "name": "square root",
      "function": () => {
        frontButtonPressed('√');
      },
      "repeatable": true,
    },
    {
      "id": 'divison',
      "name": "divison",
      "function": () => {
        frontButtonPressed('÷');
      },
      "repeatable": false,
    },
    {
      "id": 'addIconPopup',
      "name": "add Custom Function",
      "function": () => {
        if (keyTargets.input.innerHTML != "‎" && keyTargets.input.innerHTML != "") {
          openPopup();
        } else {
          sessionStorage.setItem("facing", "creatorPage")
          openPage("custCreatorPage")
        }
      },
      "repeatable": false,
    },

    {
      "id": 'minusIconPopup',
      "name": "remove Custom Function",
      "function": () => {
        //method needs to be added
      },
      "repeatable": false,
    },

    {
      "id": 'functionPopup',
      "name": " deprecated Button",
      "function": () => {
      },
      "repeatable": false,
    },

    {
      "id": 'acPopup',
      "name": "Clear all",
      "function": () => {
        clearMain();
        keyTargets.scroll.scrollTop = keyTargets.scroll.scrollHeight;
      },
      "repeatable": false,
    },

    {
      "id": 'deciToFracPopup',
      "name": "decimal to fraction",
      "function": () => {
        frontButtonPressed('d→f(');
      },
      "repeatable": false,
    },
    {
      "id": 'helpPopup',
      "name": "Help Page",
      "function": () => {
        document.location = 'help.html';
        setState();
        sessionStorage.setItem("facing", "helpOut");
      },
      "repeatable": false,
    },
    {
      "id": 'log10Popup',
      "name": "log ten",
      "function": () => {
        frontButtonPressed('log₁₀(')
      },
      "repeatable": true,
    },
    {
      "id": 'lnPopup',
      "name": "natural log",
      "function": () => {
        frontButtonPressed('ln(');
      },
      "repeatable": true,
    },
    {
      "id": 'ePopup',
      "name": "Euler's number",
      "function": () => {
        frontButtonPressed('e');
      },
      "repeatable": true,
    },
    {
      "id": 'factorialPopup',
      "name": "factorial",
      "function": () => {
        frontButtonPressed('!');
      },
      "repeatable": true,
    },
    {
      "id": 'degPopup',
      "name": "Angle Mode :" + document.getElementById('degPopup').innerHTML,
      "function": () => {
        setDegMode();
      },
      "repeatable": false,
    },
    {
      "id": 'arcPopup',
      "name": "arc is :" + document.getElementById('arcPopup').innerHTML,
      "function": () => {
        setArc();
      },
      "repeatable": false,
    },
    {
      "id": 'invPopup',
      "name": "Inverse is :" + document.getElementById('invPopup').innerHTML,
      "function": () => {
        setInverse();
      },
      "repeatable": false,
    },
    {
      "id": 'sinPopup',
      "name": "sine",
      "function": (e) => {
        trigPressed(e);
      },
      "repeatable": true,
    },
    {
      "id": 'cosPopup',
      "name": "cosine",
      "function": (e) => {
        trigPressed(e);
      },
      "repeatable": true,
    },
    {
      "id": 'tanPopup',
      "name": "tangent",
      "function": (e) => {
        trigPressed(e);
      },
      "repeatable": true,
    },
    {
      "id": 'absPopup',
      "name": "absolute Value",
      "function": (e) => {
        frontButtonPressed('|');
      },
      "repeatable": true,
    },
    {
      "id": 'modPopup',
      "name": "Modulo",
      "function": (e) => {
        frontButtonPressed('mod(');
      },
      "repeatable": true,
    },
    {
      "id": 'sinPopup',
      "name": "sine",
      "function": (e) => {
        trigPressed(e);
      },
      "repeatable": true,
    },
    {
      "id": 'sinPopup',
      "name": "sine",
      "function": (e) => {
        trigPressed(e);
      },
      "repeatable": true,
    },

  ];
  buttonMapper(keypadButtons)

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

  /*
    document.getElementById('num1').addEventListener("click", function () {  });
    document.getElementById('num2').addEventListener("click", function () { frontButtonPressed('2'); });
    document.getElementById('num3').addEventListener("click", function () { frontButtonPressed('3'); });
    document.getElementById('moreFunctionsButton').addEventListener("click", function () { sessionStorage.setItem("facing", "moreFunctionsPage"); openPage("moreFunctionsPage") });
    document.getElementById('arrowIcon').addEventListener("click", function () {
      popup();
      setSelect(keyTargets.input, keyTargets.input.lastChild.length);
    });
    document.getElementById('num4').addEventListener("click", function () { frontButtonPressed('4'); });
    document.getElementById('num5').addEventListener("click", function () { frontButtonPressed('5'); });
    document.getElementById('num6').addEventListener("click", function () { frontButtonPressed('6'); });
    document.getElementById('backspace').addEventListener("click", function () { backPressed(); });
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
    document.getElementById('enter').addEventListener("click", function () { enterPressed(keyTargets.input.innerHTML) });
    document.getElementById('pow2').addEventListener("click", function () { pow('2'); });
    document.getElementById('sqrt').addEventListener("click", function () { frontButtonPressed('√'); });
    document.getElementById('divison').addEventListener("click", function () { frontButtonPressed('÷'); });
  */

  document.getElementById('helpEx').addEventListener("click", function () { document.location = 'help.html'; setState(); sessionStorage.setItem("facing", "helpOut"); });
  document.getElementById('functionEx').addEventListener("click", function () {
    if (window.innerWidth / window.innerHeight > 3 / 4 && window.innerWidth / window.innerHeight < 2 / 1) {
      document.getElementById('extendedFuncGrid').style.animation = "0.15s ease-in 0s 1 reverse forwards running fadeEffect";
      setTimeout(function () { document.getElementById('extendedFuncGrid').style.visibility = "hidden"; document.getElementById('extendedFuncGrid').style.animation = null; }, 150);
      document.getElementById('customFuncDisplay').style.animation = "0.15s ease-in 0s 1 normal forwards running slideFromSide";
      sessionStorage.setItem("facing", "mainFlip")
    }
  });
  document.getElementById('deleteHistory').addEventListener("click", function () { deleteHistory(); });
  document.getElementById('deciToFracEx').addEventListener("click", function () { frontButtonPressed('d→f('); });
  document.getElementById('absEx').addEventListener("click", function () { frontButtonPressed('|'); });
  document.getElementById('acEx').addEventListener('click', () => {
    clearMain(); keyTargets.scroll.scrollTop = keyTargets.scroll.scrollHeight;
  })
  document.getElementById('modEx').addEventListener("click", function () { frontButtonPressed('mod('); });
  document.getElementById('degEx').addEventListener("click", function (e) {
    setDegMode();
  });
  document.getElementById('arcEx').addEventListener("click", function () { setArc(); });
  document.getElementById('invEx').addEventListener("click", function () { setInverse(); });
  document.getElementById('sinEx').addEventListener("click", function (e) { trigPressed(e); });
  document.getElementById('cosEx').addEventListener("click", function (e) { trigPressed(e); });
  document.getElementById('tanEx').addEventListener("click", function (e) { trigPressed(e); });
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

  document.getElementById('confirmNameEntry').addEventListener("click", function () {
    createFunc('Function', document.getElementById('nameEntryArea').value, keyTargets.input.innerHTML);
    universalBack();
  });
  document.getElementById('exitNameEntry').addEventListener("click", function () {
    universalBack();
  });

  document.getElementById('exitConfirmPage').addEventListener("click", function () {
    closeConfirm();
  });

  document.getElementById('backCreator').addEventListener("click", function () {
    universalBack();
  });
  let movable = document.getElementById("custCreatorUnder");
  movable.dataset.pos = 0;
  document.getElementById('funcCreatorButton').addEventListener("click", function () {
    console.log("things")
    animateModes(parseInt(movable.dataset.pos), 0, movable);
    funcCreatorPages("funcTypePage")
    document.getElementById('nameCreator').placeholder = "Name"
    document.getElementById('nameCreator').readOnly = false;
  });
  document.getElementById('hybdCreatorButton').addEventListener("click", function () {
    animateModes(parseInt(movable.dataset.pos), 75, movable);
    funcCreatorPages("hybridCodeTypePage")
    document.getElementById('nameCreator').placeholder = "defined by function"
    document.getElementById('nameCreator').readOnly = true;
  });
  document.getElementById('codeCreatorButton').addEventListener("click", function () {
    animateModes(parseInt(movable.dataset.pos), 150, movable);
    funcCreatorPages("hybridCodeTypePage")
    document.getElementById('nameCreator').placeholder = "Name"
    document.getElementById('nameCreator').readOnly = false;
  });
  document.getElementById('saveCreator').addEventListener("click", function () {
    if (movable.dataset.pos == 0) {
      createFunc("Function", document.getElementById('nameCreator').value, document.getElementById('creatorEquationFunc').innerHTML)
    } else if (movable.dataset.pos == 75) {
      console.log(document.getElementById('hybridEditor').value)
      let object = parseFunction(document.getElementById('hybridEditor').value)
      createFunc("Hybrid", object.func, document.getElementById('hybridEditor').value)
    } else if (movable.dataset.pos == 150) {
      createFunc("Code", document.getElementById('nameCreator').value, document.getElementById('hybridEditor').value)
    }
    universalBack();
  });
  createCodeTerminal(document.getElementById('creatorEditor'), "hybridEditor")

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
  //point of half assed settings merge
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
  if (TextColorGlobal != "#000000") {
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

  document.getElementById('backIconFunc').addEventListener("click", function () { universalBack(); });
  document.getElementById('addIcon').addEventListener('click', function () {
    console.log('clicked')
    openPage("custCreatorPage")
    document.getElementById('moreFunctionsPage').style.zIndex = 3;
    sessionStorage.setItem('facing', 'creatorMorePage')
  })
  document.getElementById('searchArea').addEventListener('input', function () {
    let list = getFuncList();
    let filtered = list.filter(function (value) {
      console.log(searchAlgo(value.name, document.getElementById('searchArea').value))

      return searchAlgo(value.name, document.getElementById('searchArea').value)
    })
    console.log(filtered);
    let funcGrid = document.getElementById('funcGrid');
    removeAllChildNodes(funcGrid)
    for (let item of filtered) {
      custButton(item, ['funcGrid']);
    }
  })
} else if (document.getElementById("settingsBody") != null) {

} else if (document.getElementById('helpBody') != null) {
  /*&let rootCss = document.querySelector(':root');
  rootCss.style.setProperty('--displayColor', localStorage.getItem('displayColor'));
  rootCss.style.setProperty('--numbersColor', localStorage.getItem('numsColor'));
  rootCss.style.setProperty('--functionsColor', localStorage.getItem('funcColor'));
  rootCss.style.setProperty('--textColor', localStorage.getItem('textColor'));*/
  if (TextColorGlobal == "#000000") {
    let addIcons = document.getElementsByClassName('backIcon');
    for (let item of addIcons) {
      item.src = getSource('MoreFuncArrow');
    }
    document.getElementById('calcIcon').src = getSource('CalculatorIcon');

    document.getElementById('funcsIcon').src = getSource('customFunctionIcon');

    document.getElementById('setIcon').src = getSource('settingsPageIcon');
  }
  document.getElementById('backButton').addEventListener("click", function () { document.location = 'Recursive.html'; });
  document.getElementById('LooknFeel').addEventListener("click", function () { helpTabChange('mainCalculatorHelp') });
  document.getElementById('Preferences').addEventListener("click", function () { helpTabChange('customFuncHelp') });
  document.getElementById('About').addEventListener("click", function () { helpTabChange('settingsHelp') });
  document.getElementById('mainCalBack').addEventListener("click", function () { helpBack('mainCalculatorHelp'); });
  document.getElementById('customFuncBack').addEventListener("click", function () { helpBack('customFuncHelp') });
  document.getElementById('settingsBack').addEventListener("click", function () { helpBack('settingsHelp') });
}
/**********************************************|Main Page UI|*********************************************************/
//Responsible for animating pages on top of the main calculator (currently only used for creator page)
function openPage(id) {
  let element = document.getElementById(id);
  element.style.zIndex = 5;
  element.style.animation = "0.15s ease 0s 1 normal forwards running pageup";
  setTimeout(function () {
    element.style.animation = undefined;
    element.style.bottom = "0px";
  }, 150);
}
//Responsible for hiding pages that where placed on top of the main calculator
function closePage(id) {
  let element = document.getElementById(id);
  element.style.animation = "0.15s ease 0s 1 reverse forwards running pageup"
  setTimeout(function () {
    element.style.animation = undefined;
    element.style.bottom = "100%";
    element.style.zIndex = 1;
  }, 150)
}
//Responsible for handling the popup part of the virtKeyboard on the page
function popup() {
  if (document.getElementById('arrowIcon').style.animation == "0.25s ease-in 0s 1 normal forwards running toUp") {
    document.getElementById('arrowIcon').style.animation = "0.25s ease-in 0s 1 normal forwards running toDown";
    document.getElementById('extraFuncPopUp').style.animation = "0.25s ease-in 0s 1 normal forwards running toSlideDown";
    sessionStorage.setItem("facing", "");
    setTimeout(donothing, 500);
    document.getElementById('arrowIcon').style.transform = 'rotate(90deg);';
  } else {
    document.getElementById('arrowIcon').style.animation = "0.25s ease-in 0s 1 normal forwards running toUp";
    document.getElementById('extraFuncPopUp').style.animation = "0.25s ease-in 0s 1 normal forwards running toSlideUp";
    sessionStorage.setItem("facing", "mainPopup");
    setTimeout(donothing, 500);
    document.getElementById('arrowIcon').style.transform = 'rotate(270deg);';
  }

}
//Responsible for hiding elements on main screen
function hideAllTabs() {
  let tabs = document.getElementsByClassName('tabcontent');
  if (document.getElementById('keypad').style.visibility == "visible") {
    keypadVis(false);
  }
  for (let tab of tabs) {
    tab.style.visibility = "hidden";
  }
}
//Responsible for hiding and bring up tab elements
function changeTabAs(change) {
  let visibility = "", bases = document.getElementsByClassName('displayBase'), tabstyle = "", tablinks = document.getElementsByClassName('tablinks');
  console.log(bases)
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
  for (let i = 0; i < bases.length - 1; i++) {
    bases[i].style.visibility = visibility;
    tablinks[i].style = tabstyle;
  }
}
//Responsible for handling the tab number for mobile tabs
function setNumOfTabs() {
  let tabs = document.getElementsByClassName('tablinks');
  document.getElementById("tabNum").innerHTML = tabs.length;
}
function getSource(name) {
  if (TextColorGlobal == "#FFFFFF" || TextColorGlobal == "#ffffff") {
    return "Images/" + name + "White.svg";
  } else {
    return "Images/" + name + ".svg";
  }
}
function setImages(color) {
  let type = true;
  if (color == "#FFFFFF" || color == "#ffffff") {
    type = false;
  }
  let images = document.getElementsByTagName('img');
  for (let elem of images) {
    let image = elem.src;
    if (image.includes("White.svg")) {
      image = image.substring(image.indexOf('Images/') + 7, image.indexOf('White.svg'));
    } else {
      image = image.substring(image.indexOf('Images/') + 7, image.indexOf('.svg'));
    }
    for (let item of imgList) {
      if (image == item.name) {
        if (type) {
          elem.src = item.black;
          break;
        } else {
          elem.src = item.white;
          break;
        }
      }
    }
  }
}
//END
/********************************************|Main Page Button Handling|*********************************************/
//Responsible for most keypresses on main input. Handles focus and adding of characters to method
function frontButtonPressed(input) {
  let display = keyTargets.input;
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
  if (keyTargets.input.contains(sel.focusNode) && sel.focusNode != null) {
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
  keyTargets.scroll.scrollTop = keyTargets.scroll.scrollHeight;
}
//Responsible for handling the pars button on main calc buttons
function parsMethod() {
  let badIdea = keyTargets.input.selectionStart;
  let lazyAfterthought = 0;
  for (let i = 0; i < keyTargets.input.innerHTML.length; i++) {
    if (document.getElementById("enterHeader").innerHTML.charAt(i) == '(') {
      lazyAfterthought = lazyAfterthought + 1;
    }
    if (document.getElementById("enterHeader").innerHTML.charAt(i) == ')') {
      lazyAfterthought = lazyAfterthought - 1;
    }
  }
  if (lazyAfterthought >= 1 && keyTargets.input.innerHTML.charAt(badIdea - 1) != '(') {
    frontButtonPressed(')');
  } else {
    frontButtonPressed('(');
  }
}
//Responsible (I Think) for handling all power of event for main calc buttons
function pow(type) {
  let display = keyTargets.input;
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
//Responsible for handling trig button presses
function trigPressed(event) {
  let eventTarget = event.target;
  frontButtonPressed(eventTarget.innerHTML + "(");
}
//Responsible (I Think) to patch weird behavior with default HTML behavior SUP
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
  if (eve.keyCode == 8 && (sel.focusNode.nodeValue.substring(lower, higher).includes('‎') || sel.focusNode.nodeValue == '‎') && sel.focusNode.parentNode == keyTargets.input) {
    eve.preventDefault();
    let childNodes = keyTargets.input.childNodes;
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
//Responsible for controlling the angle mode switch in settings
function degRadSwitch(mode) {
  document.getElementById('degModeBut').className = "settingsButton";
  document.getElementById('radModeBut').className = "settingsButton";
  if (mode) {
    document.getElementById('degModeBut').className = "settingsButton active";
  } else {
    document.getElementById('radModeBut').className = "settingsButton active";
  }
}
//Responsible for inverse settings on main calc bittons (main input)
function setInverse() {
  let trig = [{ "base": "sin", "inverse": "csc" }, { "base": "cos", "inverse": "sec" }, { "base": "tan", "inverse": "cot" }];
  let elements = ['sinEx', 'cosEx', 'tanEx', 'sinPopup', 'cosPopup', 'tanPopup'];
  let invButtons = ['invPopup', 'invEx'];
  let arc = false;
  let text = "";
  if (document.getElementById('sinPopup').innerHTML.substring(0, 1) == "a") {
    arc = true;
  }
  //sets the text of inv buttons 
  if (document.getElementById('invPopup').innerHTML == "inv") {
    text = "reg"
  } else {
    text = "inv"
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
//Responsible for arc settings on main calc buttons (main input)
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
    } else {
      document.getElementById(elem).innerHTML = text.substring(1);
    }
  }
}
//Responsible for the backspace button on the main calc buttons
function backPressed() {
  let uifCalculator = keyTargets.input;
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
        let childNodes = keyTargets.input.childNodes;
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
        keyTargets.input.removeChild(childNodes[i]);
      }
    }
  }
  keyTargets.scroll.scrollTop = keyTargets.scroll.scrollHeight;
}
//Responsible for the ac button clearing all text from the enter header
function clearMain() {
  let enterHeader = keyTargets.input;
  let range = document.createRange();
  let sel = document.getSelection();
  console.log(sel)
  enterHeader.innerHTML = '‎';
  range.setStart(enterHeader.lastChild, enterHeader.firstChild.data.length);
  range.collapse(true);
  sel.removeAllRanges()
  sel.addRange(range);
}
//Responsible for removing all element form the history header and the local storage element
function deleteHistory() {
  document.getElementById('historyHeader').innerHTML = "";
  localStorage.setItem("historyOut", "");
}
//Responsible for handling enter events on main cac button
function enterPressed(input) {
  let display = keyTargets.input;
  let nonparse = input;
  display.innerHTML = inputSolver(input, "Couldn't calculate");
  historyMethod(nonparse)
  keyTargets.scroll.scrollTop = keyTargets.scroll.scrollHeight;
  setSelect(display, display.lastChild.length);
}
//Responsible for handling the navigation buttons on the main calc tab
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
function switchMode(modeId) {
  let modes = document.getElementsByClassName('mode')
  let hidingElems = [];
  let showingElems = [document.getElementById(modeId)];
  let modeButton = document.getElementById('modeButton');
  for (let mode of modes) {
    if (mode.style.visibility != 'hidden') {
      hidingElems.push(mode)
    }
  }
  keypadVis(false);
  if (modeId == "selectorMode") {
    hidingElems.push(modeButton)
  } else {
    if (modeId == "mainMode") {
      showingElems.push(document.getElementById('keypad'))
    }
    showingElems.push(modeButton)
  }
  hideElements(hidingElems);
  pullUpElements(showingElems)
}
//END
/*******************************************|Main Page Custom Func Editing|*******************************************/
//Responsible for the naming page for when a new func is typed in the enter header but needs a name
function openPopup() {
  console.log("open popup ran")
  sessionStorage.setItem("facing", "createNaming");
  document.getElementById('nameEntry').style.visibility = "visible";
}
//Respinsible for the visible of pages on creator page. Takes the id and that is the page that becomes visible
function funcCreatorPages(elemID) {
  for (let elem of document.getElementsByClassName('creatorPage')) {
    elem.style.visibility = "hidden";
  }
  document.getElementById(elemID).style.visibility = "visible";
}
function openConfirm(message, method) {
  document.getElementById('confirmPage').style.visibility = "visible";
  document.getElementById('confirmMessage').innerHTML = message;
  document.getElementById('confirmButton').addEventListener('click', function () {
    method();
    closeConfirm();
  });
}
function closeConfirm() {
  let elem = document.getElementById('confirmButton')
  let newElem = elem.cloneNode(true);
  elem.parentNode.replaceChild(newElem, elem);
  document.getElementById('confirmMessage').innerHTML = "";
  document.getElementById('confirmPage').style.visibility = "hidden";
}
//END
/***********************************************|Main Page Backend|*************************************************/
//Responsible for adding current equation to history header
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
//Responsible for handling the focusing certain elements on main calc page
function setSelect(node, index) {
  let sel = window.getSelection();
  let range = document.createRange();
  let higher = 0;
  let lower = 0;
  if (node.lastChild == undefined) {
    let textNode = document.createTextNode('‎')
    node.appendChild(textNode)
  }
  range.setStart(node.lastChild, index);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}
//Responsible for getting the funclist from local Storage
function getFuncList() {
  let parseString = localStorage.getItem("funcList");
  let array = [];
  let finalArray = [];
  if (parseString == undefined) {
    array = [];
  } else {
    while (parseString.includes('⥾')) {
      array.push(parseString.substring(0, parseString.indexOf('⥾')));
      parseString = parseString.substring(parseString.indexOf('⥾') + 1);
    }

  }
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
        report("Non-parsable Func found", false);
        break;
    }
    finalArray.push(funcJSON);
  }
  return finalArray;
}
//Responsible for setting global angle mode main calc buttons (main input)
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
//END
/**************************************************|Graph Mode Methods|**************************************************/
function graphInMode() {
  let equationGrid = document.getElementById("graphFuncGrid");
  let equationElems = equationGrid.querySelectorAll('.dynamicEquation')
  console.log(graphModeChart.data.datasets)
  let def = { "chart": graphModeChart }
  let graphVars = getGraphVars(def)
  let datasets = [];
  let accents = [
    colorArray[1],
    "#e6cc4e",
    "#4ecfe6",
    "#b169f0",
    "#f06970",
    "#87f069",
    "#69f0c5",
    "#f0a469",
    "#69f0ed",
    "#697bf0",
    "#69f077",
  ]
  for (let elem of equationElems) {
    let equation = elem.innerHTML
    let vars = varInEquat(equation)
    if (vars.length <= 1) {
      let parsedEquation = "";
      let parsedArray = createParseable(equation);
      for (let item of parsedArray) {
        if (item == "v1") {
          item = 'Æ';
        }
        parsedEquation += item;
      }
      let dataColor = accents[(datasets.length) % 11]
      datasets.push({
        data: calculatePoints(parsedEquation, Number(graphVars.bottom), Number(graphVars.top), Number(graphVars.step)),
        label: "hidden",
        fontColor: '#FFFFFF',
        borderColor: dataColor,
        backgroundColor: dataColor,
        showLine: true,
      });
    } else {
      report("Equation needs single variable", false)
    }
  }
  def.chart.data.datasets = datasets;
  console.log(datasets)
  def.chart.update();
}

//END
/************************************************|Custom Func UI|****************************************************/
//Responsible for the orignal creatation of functions (probably doesn't need to be a method but it is)
function createFunc(type, name, text) {
  var funcList = getFuncList();
  if (findFuncConfig(name) === false) {

    let object = { "name": name, "type": type };
    switch (type) {
      case "Function":
        object.equation = text;
        custButton(funcAssebly(type, name, text), ['customFuncDisplayGrid', 'custFuncGridPopup', 'funcGrid']);
        break;
      case "Code":
        object.code = text;
        custButton(funcAssebly(type, name, "Hybrid"), ['customFuncDisplayGrid', 'custFuncGridPopup', 'funcGrid']);
        break;
      case "Hybrid":
        object.code = text;
        custButton(funcAssebly(type, name, "Code"), ['customFuncDisplayGrid', 'custFuncGridPopup', 'funcGrid']);
        break;
    }
    funcList.push(object);
    addImplemented(object)
    setFuncList(funcList);
  }
}
//Responsible for creating the cust func buttons and adding them to the elements in target array
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
  let button = clon.getElementById('customFuncButton');
  for (let i = 0; i < target.length; i++) {
    let clonClone = clon.cloneNode(true);
    let buttonNode = clonClone.getElementById("customFuncButton");
    buttonNode.querySelector('#removeFunc').src = getSource('xIcon');

    buttonNode.querySelector('#removeFunc').addEventListener('click', function (e) {
      openConfirm("Are you sure you want to delete this Function?", function () {
        funcRemove(e);
      });

    });
    buttonNode.addEventListener('click', function (e) {
      if (e.target.tagName != "IMG") {
        let elem = e.target;
        if (e.target.tagName != "BUTTON") {
          elem = e.target.parentNode
        }
        let funcName = elem.querySelector("#nameLabel").innerHTML;
        let funcParse = findFuncConfig(funcName);
        keypadVis(false);
        if (matchPage(funcName) == null) {
          createTab(funcParse)
        } else {
          openElement(funcName);
        }
      }
    });
    document.getElementById(target[i]).appendChild(clonClone);
    setNumOfTabs();
  }

}
//Responsible for removing the cust func button from page after remove func is pressed
function funcRemove(e) {
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
//Responsible for the creation of tab and tab page of the given config
function createTab(config) {

  let tabs = document.getElementsByClassName('tabcontent');
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].style.visibility = 'hidden';
  }
  if (config.type == "Function") {
    definedPages.push((new EquatPage(config)).def);
  } else if (config.type == "Hybrid") {
    definedPages.push((new HybridPage(config)).def);
  }
}
//Responsible for the creation of a tab button that links to the tab
function newTabButton(config, tabPage) {
  let name = config.name;
  let tabClon = document.getElementsByClassName('newTab')[0].content.cloneNode(true);
  let nameElem = tabClon.getElementById('newTabName');
  let buttonCopy = tabClon.getElementById('tabButton');
  tabClon.getElementById('newTabName').innerHTML = name;
  tabClon.getElementById('nameDisplay').innerHTML = name;
  if (config.type == "Function") {
    tabClon.getElementById('equtDisplayFunc').innerHTML = config.equation
  } else if (config.type == "Code") {
    tabClon.getElementById('equtDisplayFunc').innerHTML = "Code";
  } else if (config.type == "Hybrid") {
    tabClon.getElementById('equtDisplayFunc').innerHTML = "Hybrid";
  }
  tabClon.getElementById('tabButton').dataset.tabmap = JSON.stringify(config);
  tabClon.getElementById('tabRemove').src = getSource('xIcon');

  let highlight = tabClon.getElementById('tabButton');
  tabClon.getElementById('tabButton').addEventListener("click", function (e) {
    if (e.target.id != "tabRemove") {
      if (window.innerWidth / window.innerHeight < 3 / 4) {
        changeTabAs(false);
      }
      if (e.target != highlight.querySelector("IMG")) {
        openElement(nameElem.innerHTML);
        sessionStorage.setItem("facing", "custFunc");
      }
    }
  });
  tabClon.getElementById('tabRemove').addEventListener('click', function (e) {
    let tabLink = e.target.parentNode;
    definedPages = definedPages.filter(function (item) {
      return !(item.srtConfig.name == config.name)
    });
    console.log(definedPages)
    document.getElementById('mainPage').removeChild(tabPage);
    document.getElementById('tabContainer').removeChild(tabLink);
    if (window.innerWidth / window.innerHeight > 3 / 4) {
      openElement("mainPage");
    }
    setNumOfTabs();
  })
  highlightTab(highlight);
  document.getElementById('tabContainer').appendChild(tabClon);
  setNumOfTabs();
  return buttonCopy;
}
//Responsible for handling which pages are visible on cust func default (Deprecated the creator page methods need implementing here)
function hidModes(num, tabs) {
  if (num == 0) {
    tabs[0].style.visibility = "hidden";
  } else if (num == 75) {
    tabs[1].style.visibility = "hidden";
  } else if (num == 150) {
    tabs[2].style.visibility = "hidden";
  }
}
//Responsible for handling animations between the default cust func pages (also somewhat deprecated) 
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
    console.log("same")
  }
}
//Responsible for changing the color of the tab that is currently open
function highlightTab(element) {
  let activeTabs = document.getElementsByClassName('tablinks active')
  for (let i = 0; i < activeTabs.length; i++) {
    activeTabs[i].className = activeTabs[i].className.replace(" active", "");
  }
  element.className += " active"
}
//Responsible for the handling of tab opens whenever a tab button is pressed 
function openElement(name) {
  let match = matchPage(name);
  console.log(match)
  let tabs = document.getElementsByClassName('tabcontent');
  if (name != "mainPage") {
    document.getElementById('customFuncDisplay').style.visibility = "hidden";
    keypadVis(false);
  } else {
    document.getElementById('customFuncDisplay').style.visibility = "";
    if (mainMode.style.visibility == "inherit") {
      keypadVis(true);
    }
    keypadController(
      {
        "reset": true,
        "rePage": () => { },
      }
    );
  }
  for (let i = 0; i < tabs.length; i++) {
    if (match.tabPage != tabs[i]) {
      tabs[i].style.visibility = 'hidden';
    }
  }
  highlightTab(match.tab);
  match.tabPage.style.visibility = 'visible';
}
//Responsible for matching a tab with its tab page
function matchPage(name) {
  for (let pageObj of definedPages) {
    console.log(pageObj)
    console.log(name)
    if (pageObj.srtConfig.name == name) {
      return pageObj;
    }
  }
  return null;
}
//END
/*********************************************|Custom Func Updating|************************************************/
//Responsible for handle UI changes in order to open the editor section of custom functions
function openEdit(elem, definition) {
  hideElements([elem.querySelector('#varEquationContainer'), elem.querySelector('#resultPane'), elem.querySelector('#nameFunc')]);
  pullUpElements([elem.querySelector('#editDiv')])
  elem.querySelector('#custEdit').value = definition;
}
function closeEdit(elem) {
  hideElements([elem.querySelector('#editDiv')]);
  pullUpElements([elem.querySelector('#varEquationContainer'), elem.querySelector('#resultPane'), elem.querySelector('#nameFunc')]);
}
//Responsible for handing the changing of a cust func on the default tab page
function changeFunc(og, newString, def) {
  let tab = def.tab;
  let page = def.tabPage;
  console.log(og)
  var funcList = getFuncList();
  for (let i = 0; i < funcList.length; i++) {
    if (funcList[i].name == og.name) {
      funcList[i] = newString;
    }
  }
  tab.querySelector('#newTabName').innerHTML = newString.name;
  tab.querySelector('#nameDisplay').innerHTML = newString.name;
  changeImplemented(og, newString);
  console.log(funcList);
  setFuncList(funcList);
  tab.dataset.tabmap = JSON.stringify(newString);
  page.dataset.tab = JSON.stringify(newString);
  tab.querySelector("#newTabName").innerHTML = newString.name;
  tab.querySelector('#nameDisplay').innerHTML = newString.name;
  def.srtConfig = newString
  if (og.type == "Function") {
    tab.querySelector('#equtDisplayFunc').innerHTML = newString.equation;
  }

  updateCustomButtons(og, newString);
}
//Responsible for changing the name and equation value on the a cust func link 
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
//Responsible for changing a cust func entry in the interpreter 
function changeImplemented(oldConfig, newObject) {
  let object = {};
  if (oldConfig.type == "Function") {
    object = parseFuncEntry("function", oldConfig.name, oldConfig.equation);
  } else if (oldConfig.type == "Hybrid") {
    object = parseFuncEntry("method", oldConfig.code)
  }
  let indexOf = -1;
  for (let i = 0; i < funcList.length; i++) {
    if (JSON.stringify(object) == JSON.stringify(funcList[i])) {
      indexOf = i;
    }
  }
  if (oldConfig.type == "Function") {
    newObject = parseFuncEntry("function", newObject.name, newObject.equation);
  } else if (oldConfig.type == "Hybrid") {
    newObject = parseFuncEntry("method", newObject.code);
  }
  funcList[i] = newObject;
}
//Responsible for adding a cust func entry into interpreter
function addImplemented(funcConfig) {
  if (funcConfig.type == "Function") {
    createNewFunction("function", funcConfig.name, funcConfig.equation);
  } else if (funcConfig.type == "Hybrid") {
    createNewFunction("method", funcConfig.code)
  }
}
//Responsible for taking the funclist and making it into a localStorage value (main backend)
function setFuncList(array) {
  let parseString = "";
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
  localStorage.setItem("funcList", parseString);
}
//Responsible for removing a value for the funcList (main backend)
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
//END
/**********************************************|Custom Func backend|*************************************************/
//Responsible for creating an array of the variables in a variable container and the value it has
function varListAssbely(element) {
  console.log(element)
  let variables = element.getElementsByClassName("variableContainer");
  let varData = [];
  for (i = 0; i < variables.length; i++) {
    let temp = {
      "Name": variables[i].querySelector('h3').innerHTML,
      "Value": variables[i].querySelector('input').value,
      "element": variables[i]
    };
    varData.push(temp);
  }
  return varData;
}
//Responsible for handling the parsing of string equations with the variables on in the var container
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
function parseVarFunc(name, varData) {
  let innerVars = varData[0].Value;
  for (let i = 1; i < varData.length; i++) {
    innerVars += "," + varData[i].Value;
  }
  console.log(`Parsed method is ${name}(${innerVars})`)
  return `${name}(${innerVars})`;
}
//Responsible for checking and solving for varables on defaut cust func page depending on how many variables are filled
function parseVariables(element, def) {
  let clon = def.tabPage
  console.log(clon)
  let varData = varListAssbely(element);
  console.log(def)
  console.log(clon)
  let name = clon.querySelector('#nameFunc').value;
  let method = "";
  let all = true;
  let first = undefined;
  if (varData.length > 0) {
    for (let Vars of varData) {
      if (all) {
        if (Vars.Value == '') {
          all = false;
          first = Vars;
          Vars.Value = "Æ";
        }
      } else if (Vars.Value == '') {
        first = undefined;
      }
    }
    /*for (let data of varData) {
      parsedEquation = parseVar(parsedEquation, data);
    }*/
    method = parseVarFunc(name, varData);
  } else {
    method = name + "()";
  }
  if (all) {
    solveEquation(method, clon);
    solveGraph(method, def);
    solveTable(method, clon);
  } else if (first != undefined) {
    solveGraph(method, def);
    solveTable(method, clon);
  }
}
//Responsible for solving the parsedEquation on the default cust func page
function solveEquation(method, clon) {
  console.log("Solve Equation ran")
  let result = "=" + inputSolver(method, "Couldn't Calculate");
  clon.querySelector('#equalsHeader').innerHTML = result;
}
//Responsible for solving the parsedEquation with one open vairable graphically
function solveGraph(parsedEquation, def) {
  let vars = getGraphVars(def);
  //Number(def.tabPage.querySelector('#stepDomainGraph').value) * mutplier;
  let result = calculatePoints(parsedEquation, Number(vars.bottom), Number(vars.top), Number(vars.step));
  def.chart.data.datasets[0].data = result;
  console.log(def.chart.data.datasets)
  def.chart.update();
}
//Responsible for solving the parsedEquation with one open variable table wise
function solveTable(parsedEquation, clon) {

  let numValue = Number(clon.querySelector('#cellsTable').value);
  let step = Number(clon.querySelector('#stepTable').value);
  clon.querySelector("#funcTable").innerHTML = "<tr><th>x</th><th>y</th></tr>";
  for (let i = 1; i <= numValue; i++) {
    let result;
    let currentVal = i * step;
    result = inputSolver(parsedEquation.replace('Æ', currentVal), "Error Making Table");
    var newRow = clon.querySelector('#funcTable').insertRow(i);
    var newXCell = newRow.insertCell(0);
    var newYCell = newRow.insertCell(1);
    newXCell.innerHTML = "" + currentVal;
    newXCell.id = "shit"
    console.log(i * step)
    newYCell.innerHTML = result;
    newYCell.id = "other shit"
  }
}
function calculatePoints(parsedEquation, start, end, step) {
  let pointArray = [];
  for (let i = start; i <= end; i += step) {
    let newPoint = {};
    newPoint.x = i;
    if (i < 0.00000001 && i > -0.00000001) {
      newPoint.x = Math.round(i);
    }
    newPoint.y = inputSolver(parsedEquation.replaceAll('Æ', newPoint.x), "Error Making Graph");
    pointArray.push(newPoint);
  }
  return pointArray;
}
//creates an array of all variables needed for calculatePoints
let denfinedConstraints = {

}
function getGraphVars(def){
  let varArray = {}
  if(denfinedConstraints.scales != def.chart.getScales() || denfinedConstraints.zoom != def.chart.getZoomLevel()){
    denfinedConstraints = {"scales": def.chart.getScales(), "zoom": def.chart.getZoomLevel()}
  }
  let mutiplier = 1 / denfinedConstraints.zoom;
  varArray = {
    "bottom": Number(denfinedConstraints.scales.x.min) * mutiplier,
    "top": Number(denfinedConstraints.scales.x.max) * mutiplier,
    "step": def.tabPage === undefined ? settings.gDS : def.tabPage.querySelector('#stepDomainGraph').value
  }
  varArray.step * mutiplier
  return varArray
}
//Responsible for (IDFK work on this later)
function checkVar(type, clon, checkList, def) {
  let varGrid = clon.querySelector("#varGrid");
  let funcTabs = [clon.querySelector('#functionDiv'), clon.querySelector('#graphDiv'), clon.querySelector('#tableDiv')]
  let varExisting = varListAssbely(varGrid);
  let newVars = [];
  for (let eVar of checkList) {
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
  //Ext var removal
  for (let oldVar of varExisting) {
    varGrid.removeChild(oldVar.element);
  }
  //Var Creatation part
  for (let newVar of newVars) {
    let name = newVar;
    let varGrid = clon.querySelector("#varGrid");

    let tempvar = document.getElementsByClassName("variableTemplate")[0];
    let varClon = tempvar.content.cloneNode(true);
    varClon.getElementById('variableName').innerHTML = name;
    varClon.getElementById('variableEntry').addEventListener('input', function (e) {
      if (type == "function") {
        let equationArea = clon.querySelector('#EquationFunc')
        if (varClon.getElementById('variableEntry') != '') {
          equationArea.innerHTML = setVar(varGrid, equationArea.dataset.baseE);
        }
      }
      if (varClon.getElementById('variableEntry') != '') {
        try {
          parseVariables(varGrid, def);
        } catch (e) { }
      }
    });
    varGrid.appendChild(varClon);
  }
}
//Matches a funcConfig from funclist with a name
function findFuncConfig(name) {
  let funcList = getFuncList();
  for (let func of funcList) {
    if (func.name == name) {
      return func;
    }
  }
  return false;
}
//Responsible for taking inputs and parsing them into the funclist
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
//END
/***********************************************|Settings basic UI|*************************************************/
//Responsible for handling tab changes on settings page
function settingsTabChange(name) {
  var tabs = document.getElementsByClassName("settingTabContent");
  if (window.innerWidth / window.innerHeight > 3 / 4) {
    for (i = 0; i < tabs.length; i++) {
      tabs[i].style.visibility = "hidden";
    }
    document.getElementById(name).style.visibility = "visible";
  } else {
    for (i = 0; i < tabs.length; i++) {
      tabs[i].style.visibility = "hidden";
    }
    if (name == 'colorsTab' || name == 'PreferencesTab' || name == 'AboutTab') {
      document.getElementById(name).style = "visibility: visible; width: calc(100% - 20px); margin-left: 10px;"
      document.getElementById(name).style.animation = "0.15s ease-in 0s 1 normal forwards running toSlideLeft";
      setTimeout(function () { document.getElementById("navColumn").style.visibility = "hidden"; }, 150);
      sessionStorage.setItem("facing", "themePageOut");
    }
    if (name == 'colorsTab') {
      document.getElementById("colorsBack").style.visibility = "inherit";
    } else if (name == 'PreferencesTab') {
      document.getElementById("PreferencesBack").style.visibility = "inherit";
    } else if (name == 'AboutTab') {
      document.getElementById("AboutBack").style.visibility = "inherit";
    } else {
      console.log("nothing")
    }
  }
}
//Responsible for handling back buttons in settings (I think its only used once so might be roled into uni back)
function SettingsBack() {
  var target;
  let tabs = document.getElementsByClassName('settingTabContent');
  console.log(tabs)
  for (let tab of tabs) {
    if (tab.style.visibility == "visible") {
      target = tab;
    }
  }
  document.getElementById("colorsBack").style.visibility = "hidden";
  document.getElementById("PreferencesBack").style.visibility = "hidden";
  document.getElementById("AboutBack").style.visibility = "hidden";
  if (window.innerWidth / window.innerHeight > 3 / 4) {
    target.style.animation = null;
    target.style.width = undefined;
  } else {
    target.style.animation = "0.15s ease-in 0s 1 normal forwards running toSlideRight";
    setTimeout(function () { target.style = undefined; }, 150);
  }
  document.getElementById("navColumn").style.visibility = "visible";

}
//Responsible for handling the color changes on color input for cust theme DLC
function updatePreview(event) {
  if (event.target.id == "secondaryColorPicker") {
    document.getElementById("displayPreview").style.backgroundColor = event.target.value;
  } else if (event.target.id == "accentColorPicker") {
    document.getElementById("numsPreview").style.backgroundColor = event.target.value;
  } else {
    document.getElementById("funcPreview").style.backgroundColor = event.target.value;
  }
}
//Responsible for handling the text color dropdown on the cust theme DLC
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
//Responsible for unlocking the custom theme on settings
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
//Responsible for handling a click event on cust themes
function toggleCustTheme() {
  if (document.getElementById('ColorsDiv').style.visibility == 'visible') {
    document.getElementById('ColorsDiv').style = "visibility: hidden; position: absolute;";
    document.getElementById('accentColorDiv').style = "visibility: visible; position: relative;";
  } else {
    document.getElementById('ColorsDiv').style = "visibility: visible; position: relative;";
    document.getElementById('accentColorDiv').style = "visibility: hidden; position: absolute;";
  }
}
//END
/************************************************|Settings Backend|**************************************************/
//Responsible for handling settings exit on settings page
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
  settings = JSON.parse(localStorage.getItem("settings"));
  setSettings();

  closePage('settingsPage')
}
//Responsible for handling if purchases have been completed by the user
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
//Responsible for reporting the purchased list for items that have been purchased
function getPurshaseList() {
  let list = [];
  if (localStorage.getItem('purchased') != undefined) {
    list = JSON.parse(localStorage.getItem('purchased')).purchaseList;
  }
  return list;
}
//Responsible for seting a purchase as purchased on purchase list
function setPurchase(name) {
  if (localStorage.getItem('purchased') != undefined) {
    let purchased = JSON.parse(localStorage.getItem('purchased'));
    purchased.purchaseList.push(name)
    localStorage.setItem('purchased', JSON.stringify(purchased));
  } else {
    localStorage.setItem('purchased', JSON.stringify({ "purchaseList": [name] }));
  }
}
//END
/************************************************|General Backend|**************************************************/
//Array of all facing situations and what to do when the back button is pressed
let facingBack = [
  {
    "elm": "custFunc",
    "backElm": "",
    "prtCont": 'main',
    "mth": function () {
      openElement("mainPage")
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
    "backElm": "mainPopup",
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
  },
  {
    "elm": "creatorPage",
    "backElm": 'mainPopup',
    "prtCont": 'main',
    "mth": function () {
      closePage('custCreatorPage');
    },
  },
  {
    "elm": "moreFunctionsPage",
    "backElm": '',
    "prtCont": 'main',
    "mth": function () {
      closePage('moreFunctionsPage');
    }
  },
  {
    'elm': 'creatorMain',
    "backElm": '',
    'prtCont': 'main',
    "mth": function () {
      closePage("custCreatorPage")
    }
  },
  {
    'elm': 'creatorMorePage',
    "backElm": 'moreFunctionsPage',
    'prtCont': 'main',
    "mth": function () {
      closePage("custCreatorPage")
    }
  }
];
//Responsible for all back buttons and back in android 
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
//Responsible for giving out the list of purchasable items
function getCatalog() {
  return [
    {
      "name": "custTheme",
      "price": "0.99",
      "have": queryPurchase()
    }
  ];
}
//Responsible for geting a list of avable themes and how to get the theme colors for them
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
//Responsible for geting the colors for whatever theme is listed in the settings
function getColors() {
  let themes = getThemes();
  for (let theme of themes) {
    if (theme.name == settings.theme) {
      return theme.getMth();
    }
  }
}
//Responsible for getting a list of accent colors
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
//Responsible for matching its respected accent name with its color
function getColorAcc(acc) {
  let accents = getAccents();
  for (let accent of accents) {
    if (accent.id == acc) {
      return accent.val;
    }
  }
}
//Responsible for setting the root values of a page which controll all color styling
function setSettings() {
  let themes = getThemes();

  for (let theme of themes) {
    if (theme.name == settings.theme) {
      colorArray = theme.getMth();
      themeElem = theme;
    }
  }
  let rootCss = document.querySelector(':root');
  rootCss.style.setProperty('--displayColor', colorArray[2]);
  rootCss.style.setProperty('--numbersColor', colorArray[1]);
  rootCss.style.setProperty('--functionsColor', colorArray[0]);
  rootCss.style.setProperty('--textColor', colorArray[3]);
  setImages(colorArray[3]);
  TextColorGlobal = colorArray[3];
  if (!settings.degRad) {
    setDegMode();
  }
  /*if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    colorMessager.postMessage(colorArray[0]);
  }*/
}
//Responsible for handling popup console. Animates, sets color, and sets text value
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
//END
/********************************************|Offloadable useful fluff|***********************************************/
//Called when ever something needs solving
/*errorStatement is what appears in the popup console */
function inputSolver(equation, errorStatement) {
  equation = solveInpr(equation, settings.degRad)
  try {
    return eval(equation);
  } catch (e) {
    console.log(e)
    report(errorStatement, false);
  }
}
//Responsible for assebiling the code terminal throughout the program
function createCodeTerminal(element, name) {
  let container = document.createElement("div")
  container.id = "creatorEditor";
  container.className = "creatorDiv";

  let numberIndex = document.createElement("div")
  numberIndex.id = "lineLabel";
  container.appendChild(numberIndex)

  let textarea = document.createElement('textarea')
  textarea.className = "codeEditor";
  textarea.id = name;
  textarea.addEventListener("input", function (e) {
    this.style.height = "";
    this.style.height = this.scrollHeight + "px"
    recaculateNums(numberIndex, textarea.value)
  })
  container.appendChild(textarea)

  createNumHeader(numberIndex, 1);

  element.appendChild(container);
}
//Responsible for handling the numbering on the terminal 
function recaculateNums(parentElem, text) {
  let numOfO = (text.match(/\n/g) || []).length;
  numOfO++;
  let childern = parentElem.querySelectorAll('.numberedHeader');
  if (childern.length > numOfO) {
    for (let i = childern.length - 1; i > numOfO - 1; i--) {
      childern[i].remove();
    }
  } else {
    for (let i = 0; i < numOfO - childern.length; i++) {
      createNumHeader(parentElem, numOfO)
    }
  }
}
//Responsible for the individual numbering headers in the code terminal
function createNumHeader(parentElem, num) {
  let initial = document.createElement('h3');
  initial.className = "numberedHeader";
  initial.innerHTML = num;
  console.log()
  parentElem.appendChild(initial)
}
//Responsible (I think) for preventing focus being lost while other element on a page are being clicked
function preventFocus() {
  var ae = document.activeElement;
  setTimeout(function () { ae.focus() }, 1);
}
//Method for fining whether or not the focus is on a superscript element (might be implemented in back pressed because that is the only refrence)
function plainSup(sel) {
  if (sel.focusNode.parentElement.tagName == "SUP") {
    return true;
  } else {
    return false;
  }
}
//Responsible for geting the time for the time enter in new history header entries
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
//Responsible for getting the current date for the history header
function getDate() {
  const d = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}
//Intended for animating the hiding of elements. Implementation coming soon (IDK if it is coming soon because I lazy)
function hideElements(elements) {
  for (let element of elements) {
    element.style.animation = "0.15s ease-in 0s 1 reverse forwards running fadeEffect"
    setTimeout(function () {
      element.style.animation = undefined;
      element.style.visibility = "hidden";
    }, 150);
  }
}
//Intended for animating the enter of an element to the page but again im lazy and may not get implemented
function pullUpElements(elements) {
  for (let element of elements) {
    element.style.visibility = "inherit";
    element.style.animation = "0.15s ease-in 0s 1 normal forwards running fadeEffect"
    setTimeout(function () {
      element.style.animation = undefined;
    }, 150);
  }
}
//Responsible for finding where variables are in a given equation
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
//Responsible for matching a var name with its value in a list
function varInList(list, varLetter) {
  for (let item of list) {
    if (item.letter == varLetter) {
      return item;
    }
  }
  return null;
}
//Responsible for checking if a position in an equation is a variable or not
function isVar(entry) {
  let func = funcMatch(entry);
  let ignore = ignoreTest(entry);
  console.log(ignore)
  if (func != "") {
    if (getByName(func) != null) {
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
//Responsible for parsing a variable to its value in an equation 
function setVar(element, equation) {
  let varData = varListAssbely(element);
  console.log(`%c seVar ran`, "color: red;");
  console.log(varData)
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
//Deprecated method for rgb to hex
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
//deprecated method for rgb conversion
function rgbToHex(rgb) {
  let first = rgb.substring(rgb.indexOf('(') + 1, rgb.indexOf(','));
  console.log(first);
  rgb = rgb.substring(rgb.indexOf(', ') + 2);
  let second = rgb.substring(0, rgb.indexOf(','));
  rgb = rgb.substring(rgb.indexOf(', ') + 2);
  let thrid = rgb.substring(0, rgb.indexOf(')'));
  return "#" + componentToHex(Number(first)) + componentToHex(Number(second)) + componentToHex(Number(thrid));
}
function searchAlgo(string, checking) {
  let rawArray = checking.split('');
  let charArray = [...new Set(rawArray)];
  for (let char of charArray) {
    if (!(string.includes(char))) {
      return false
    }
  }
  return true
}
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
function createGraph(chart) {
  let defChart = new Chart(chart, {
    type: 'scatter',
    data: {
      datasets: [{
        data: [{ "x": 3, "y": 4 }, { "x": 4, "y": 3 }, { "x": 50, "y": 90 }],
        label: "hidden",
        fontColor: '#FFFFFF',
        borderColor: colorArray[1],
        backgroundColor: colorArray[1],
        showLine: true,
      }]
    },
    options: {
      scales: {
        x: {
          grid: {
            drawBorder: false,
            color: colorArray[3],
          },
          ticks: {
            color: colorArray[3],
          }
        },
        y: {
          grid: {
            drawBorder: false,
            color: colorArray[3],
          },
          ticks: {
            color: colorArray[3],
          }
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        point: {
          radius: 0
        }
      },
      plugins: {
        legend: {
          display: false
        },
        zoom: {
          limits: {
          },
          pan: {
            enabled: true,
            mode: 'xy',
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true
            },
            mode: 'xy',
            onZoomComplete({ chart }) {
              chart.update('none');
            }
          }
        }
      }
    }
  })
  defChart.setScales({ 'x': { 'min': Number(settings.gDMin), 'max': Number(settings.gDMax) }, 'y': { 'min': Number(settings.gRMin), 'max': Number(settings.gRMax) } })
  return defChart;
}
/*
  keyController object dev guide
{
  "keyElems": { "scroll": document.getElementById('uifCalculator'), "input": document.getElementById('enterHeader') },
  "reset": false, //OR even undefined
  "upPage": () => {//not Denfined},
  "rePage": () => {//not Denfined but reverse of the upPage},
  "keyStyling": "" //string of a css file which java will pull the keypadStyle class from that document
}
*/
function keypadController(object) {
  console.log("keypadController ran")
  if (object.reset != undefined && object.reset == false) {
    let styling = document.createElement('style');
    let builtInStyling = `
    #arrowPosition{
      display: grid;
      justify-content: center;
      align-content: center;
      background-color: var(--functionsColor);
    }
    #arrowIcon{
      position: unset;
      width: 50px;
      visibility: visible;
    }
    #moreFunctionsButton{
      visibility: hidden;
    }
    #custFuncGridPopup{
      visibility: hidden;
    }
    #addIconPopup{
      visibility: hidden;
    }
    #minusIconPopup{
      visibility: hidden;
    }
    #customFuncDisplayPopup{
      border-radius: 25px;
      height: 16.6666%;
    }
    #extraFuncPopUpGrid{
      top: 16.6666%;
      height: 83.3333%;
    }`;
    styling.id = 'keypadStyling';
    let keypad = document.getElementById("keypad")
    styling.innerHTML = object.keyStyling + builtInStyling;
    document.getElementsByTagName('body')[0].appendChild(styling);
    keypad.className = "keypadStyle";
    keyTargets = object.keyElems
  } else {
    console.log('reset')
    let keypad = document.getElementById("keypad")
    keypad.className = "pane";
    let styleElem = document.getElementById('keypadStyling');
    if (styleElem != null) {
      document.getElementsByTagName('body')[0].removeChild(styleElem);
    }
    keyTargets = { "scroll": document.getElementById('uifCalculator'), "input": document.getElementById('enterHeader') };
  }
}
let keypadVis = (visible) => {
  if (visible) {
    document.getElementById('keypad').style.visibility = 'visible';
  } else {
    document.getElementById('keypad').style.visibility = "hidden";
  }
}
function keypadEquationMapper(elem) {
  elem.addEventListener("focus", function (e) {
    if (document.getElementById('keypad').style.visibility == "hidden") {
      setSelect(elem, elem.innerHTML.length);
      keypadVis(true);
      keypadController(
        {
          "keyElems": { "scroll": elem, "input": elem },
          "reset": false,
          "keyStyling": `
            #keypad {
              top: calc(40% + 30px);
              bottom: 10px;
              width: calc(100% - 20px);
              left: 10px;
              position: absolute;
            }
            .dynamicModeContainer{
              height: 40%;
              grid-template-rows: 0px 100%;

            }
            #fullGraph{
              visibility: hidden;
            }
            @media only screen and (max-height: 450px){
              #keypad{
                width: calc(33.3333% - 15px);
                left: calc(66.6666% + 5px);
                height: calc(100% - 60px);
                top: 50px;
                bottom: 0;
                padding: 0px;
                position: absolute;
                border-radius: 25px;
                overflow: hidden;
              }
              .dynamicModeContainer{
                width: 66.6666%;
                grid-template-columns: 50% 50%;
                height: 100%;
                grid-template-rows: unset;
              }
              #fullGraph{
                visibility: visible;
              }
            }`
        }
      );
    }
  });
  elem.addEventListener('focusout', (e) => {
    setTimeout(() => {
      let sel = window.getSelection();
      if (!elem.contains(sel.focusNode) || sel.anchorOffset == 0) {
        if (elem.innerHTML.length == 1) {
          elem.innerHTML = "";
        }
        keypadVis(false);
        keypadController(
          {
            "keyElems": { "scroll": document.getElementById('uifCalculator'), "input": document.getElementById('enterHeader') },
            "reset": true,
            "rePage": () => {

            },
          }
        );
      }
    })
  });
}
function isHidden(el) {
  return (el.offsetParent === null)
}
/*
Format of objects input to button mapper
{
  'id': "entry",
  'name': "entry",
  'function': () => {function},
  "repeatable": true,
}
*/
function buttonMapper(elemArray) {
  for (let elem of elemArray) {
    var repeater;
    let elemDef = document.getElementById(elem.id);
    elemDef.addEventListener('click', (e) => {
      elem.function(e);
    });
    if (elem.repeatable) {
      let mouseDown = (e) => {
        let event = e;
        repeater = setInterval(() => { elem.function(event) }, 200)
      };
      let mouseUp = () => { clearInterval(repeater) };
      elemDef.addEventListener("mousedown", (e) => { mouseDown(e) })
      elemDef.addEventListener("mouseup", (e) => { mouseUp(e) })
      elemDef.addEventListener('touchstart', (e) => { mouseDown(e) })
      elemDef.addEventListener('touchend', (e) => { mouseUp(e) })
      elemDef.addEventListener('contextmenu', function (e) { e.preventDefault(); return false; });
    }
  }
}

function calculateGraph(){

}
//END
/************************************************|help page|**************************************************/
//Responsible for handling tab changes in help page (deprecated like everything on help page)
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
//Responsible for handing help back (currently not linked to anything because deprecated like everything on help page)
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
//END
/*********************************************|Deprecated Beyond use|**************************************************/
//Probably should delete this but I think I breaks everthing if I remember right
function donothing() { }
//Seemingly deprecated method that will soon be deleted
function backMoreFunction() {
  if (document.getElementById('newFunctionsPage').style.animation == "0.25s ease-in 0s 1 normal forwards running toSlideLeft") {
    document.getElementById('newFunctionsPage').style.animation = "0.25s ease-in 0s 1 normal forwards running toSlideRight";
    setTimeout(function () { document.getElementById('nameArea').value = ""; document.getElementById('equationArea').value = ""; document.getElementById('newFunctionsPage').style.visibility = "hidden"; }, 250);
  } else {
    document.location = 'Recursive.html';
  }
}
//Responsible for checking wheather a custom function is already opened (seeming a dupilicate method)
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
class FuncPage {
  constructor(config) {
    this.def = {}
    this.def.srtConfig = config
  }
}
class TemplatePage extends FuncPage {
  constructor(config) {
    super(config)
    let temp = document.getElementsByClassName("custFuncTabTemp")[0], clon = temp.content.cloneNode(true);
    this.clone = clon;
    let parent = clon.getElementById('customFuncTab');
    let chart = clon.getElementById("funcChart");
    let funcTabs = [clon.getElementById('functionDiv'), clon.getElementById('graphDiv'), clon.getElementById('tableDiv')];
    let name = config.name;
    let tabCopy = clon.getElementById('customFuncTab');
    this.def.tabPage = tabCopy;
    this.def.tab = newTabButton(config, tabCopy);
    let varGrid = clon.getElementById("varGrid");
    console.log(varGrid)
    let movable = clon.getElementById("selectorUnder");
    let updateElements = [
      "stepTable",
      "cellsTable"
    ];
    movable.dataset.pos = 0;

    if (TextColorGlobal == "#000000") {
      clon.getElementById("editIcon").src = getSource('EditIcon');
    }
    clon.getElementById("minDomainGraph").value = settings.gDMin;
    clon.getElementById("maxDomainGraph").value = settings.gDMax;
    clon.getElementById("stepDomainGraph").value = settings.gDS;
    clon.getElementById("minRangeGraph").value = settings.gRMin;
    clon.getElementById("maxRangeGraph").value = settings.gRMax;
    clon.getElementById("stepRangeGraph").value = settings.gRS;
    clon.getElementById("cellsTable").value = settings.tC;
    clon.getElementById('stepTable').value = settings.tS;
    clon.getElementById('customFuncTab').dataset.tab = JSON.stringify(config);
    clon.getElementById("nameFunc").value = name;

    this.def.chart = createGraph(chart)
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
    for (let element of updateElements) {
      clon.getElementById(element).addEventListener("input", function (e) {
        try {
          parseVariables(varGrid, this.def);
        } catch (e) {
          report("Couldn't Calculate", false);
        }

      });
    }
  }
}
class HybridPage extends TemplatePage {

  constructor(config) {
    super(config)
    console.log(this.def)
    let clon = this.clone;
    let fullConfig = this.def;
    let tabCopy = fullConfig.tabPage;

    clon.getElementById("editIcon").style = "";
    clon.getElementById("editIcon").src = getSource("EditIcon");
    clon.getElementById('editExit').src = getSource("xIcon");
    clon.getElementById('confirmEdit').src = getSource('checkmark')
    createCodeTerminal(clon.getElementById('textEditorEdit'), "custEdit")
    clon.getElementById('creatorEditor').style = "height: fit-content; max-height: calc(100% - 20px); top: 10px; overflow: scroll; ";
    let nameElem = clon.getElementById('nameFunc');
    let subElem = clon.getElementById("EquationFunc");
    let equationContain = clon.getElementById('EquationFunc');
    subElem.innerHTML = "Hybrid";
    subElem.contentEditable = false;

    nameElem.addEventListener("input", function (e) {
      let oldVal = fullConfig.srtConfig;
      let newVal = JSON.parse(JSON.stringify(oldVal));
      let oldParse = parseFunction(oldVal.code)
      oldParse.func = e.target.value;
      let newStringifyFunc = stringifyMethod(oldParse);

      newVal.name = e.target.value;
      newVal.code = newStringifyFunc;
      console.log(fullConfig)
      changeFunc(oldVal, newVal, fullConfig);
    });

    clon.getElementById('editIcon').addEventListener("click", function (e) {
      let json = JSON.parse(tabCopy.dataset.tab)
      openEdit(tabCopy, json.code);
      recaculateNums(tabCopy.querySelector('#lineLabel'), json.code)
    });
    clon.getElementById('editExit').addEventListener('click', function () {
      closeEdit(tabCopy)
    });
    clon.getElementById('confirmEdit').addEventListener('click', function () {
      let oldVal = fullConfig.srtConfig;
      let newVal = JSON.parse(JSON.stringify(oldVal));
      let newFunc = tabCopy.querySelector('#custEdit').value

      let oldParse = parseFunction(newFunc)
      newVal.name = oldParse.func;
      newVal.code = stringifyMethod(oldParse);
      changeFunc(oldVal, newVal, fullConfig);
      closeEdit(tabCopy)
    })
    document.getElementById("mainPage").appendChild(clon);
    checkVar("hybrid", tabCopy, funcConfig.variables, fullConfig)
  }
}
class EquatPage extends TemplatePage {
  constructor(config) {
    super(config)
    let clon = this.clone;
    let fullConfig = this.def;
    let tabCopy = fullConfig.tabPage;
    let equation = config.equation;
    let equationDIV = clon.getElementById("EquationFunc");


    equationDIV.innerHTML = equation;
    equationDIV.dataset.baseE = equation;

    clon.getElementById('nameFunc').addEventListener("input", function (e) {
      let oldVal = fullConfig.srtConfig;
      let newVal = JSON.parse(JSON.stringify(oldVal));
      newVal.name = e.target.value;

      changeFunc(oldVal, newVal, fullConfig);
    });
    equationDIV.addEventListener('focus', () => { })
    equationDIV.addEventListener("focus", function (e) {
      if (document.getElementById('keypad').style.visibility == "hidden") {
        console.log("focusthrone")
        let initEquation = JSON.parse(e.target.parentNode.parentNode.parentNode.dataset.tab);
        equationDIV.innerHTML = initEquation.equation;
        setSelect(equationDIV, equationDIV.innerHTML.length);
        keypadVis(true);
        keypadController(
          {
            "keyElems": { "scroll": equationDIV, "input": equationDIV },
            "reset": false,
            "keyStyling": `
              #keypad {
                top: calc(40% + 40px);
                bottom: 10px;
                width: calc(100% - 20px);
                left: 10px;
                position: absolute;
              }
              @media only screen and (max-height: 450px){
                #keypad{
                  width: calc(33.3333% - 15px);
                  left: calc(66.6666% + 5px);
                  height: calc(100% - 60px);
                  top: 50px;
                  bottom: 0;
                  padding: 0px;
                  position: absolute;
                  border-radius: 25px;
                  overflow: hidden;
                }
                #funcContainer{
                  width: calc(66.6666%)
                }
              }`
          }
        );
      }
    });
    equationDIV.addEventListener('focusout', () => {
      setTimeout(() => {
        let sel = window.getSelection();
        if (!equationDIV.contains(sel.focusNode)) {
          keypadVis(false);
          keypadController(
            {
              "keyElems": { "scroll": document.getElementById('uifCalculator'), "input": document.getElementById('enterHeader') },
              "reset": true,
              "rePage": () => {

              },
            }
          );
        }
      })
    });
    equationDIV.addEventListener("change", function (e) {
      let oldVal = fullConfig.srtConfig;
      let newVal = JSON.parse(JSON.stringify(oldVal));
      checkVar("function", tabCopy, varInEquat(e.target.innerHTML), fullConfig);
      newVal.equation = e.target.innerHTML;
      equationDIV.dataset.baseE = equationDIV.innerHTML;
      changeFunc(oldVal, newVal, fullConfig);
    });
    fullConfig.chart.options.plugins.zoom.zoom.onZoomComplete = function () {
      parseVariables(tabCopy.querySelector('#varGrid'), fullConfig)
      console.log("shit")
    }
    fullConfig.chart.options.plugins.zoom.pan.onPanComplete = function () {
      parseVariables(tabCopy.querySelector('#varGrid'), fullConfig)
      console.log("shit")
    }
    document.getElementById("mainPage").appendChild(clon);
    checkVar("function", tabCopy, varInEquat(equationDIV.innerHTML), fullConfig);
    //try {
    parseVariables(tabCopy.querySelector('#varGrid'), fullConfig);
    /*} catch (e) {
      report("Couldn't Calculate", false);
    }*/
  }
}
/**************************************Func filter**************************************************/
let numLimit = [
  "function",
  "Function",
  "cust",
  "let",
  "var",
  ".log"
]
