console.log('hello there')
console.log(document)
let TextColorGlobal = "";

let definedPages = [
  {
    "srtConfig": {
      "name": "mainPage",
    },
    "tabPage": document.getElementById("MainContent"),
    "tab": document.getElementById("mainTab"),
  }
];
//let keypad = document.getElementById('mainKeypad');
let mainHistory = envObject.inputs.filter((elem) => elem.id == "mainHistory")[0];
let mainEntry = envObject.inputs.filter((input) => input.id == "mainEntry")[0];
let quickSettingsPane = document.getElementById('quickSettings');
let mainTabs = document.getElementById('mainTabs');
//console.log(inputs[0].alert())
console.log(mainEntry)
var settings;
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

let themeElem = {};

/*Implementation of Web Worker*/

calcWorker.onmessage = (event) => {
  let rtnObj = event.data
  if (rtnObj.type == 'posError') {
    console.log("%c" + rtnObj.mes, "color: red;")
    report(rtnObj.mes, false)
  } else if (rtnObj.type == 'posComp') {
    report(rtnObj.mes, true)
  } else if (rtnObj.type == "dataPack") {
    console.log(definedPages)
    console.log(rtnObj.name)
    let targetedElem = definedPages.find(function (item) {
      return item.id == rtnObj.name
    });
    console.log(targetedElem)
    targetedElem.packageHandler(rtnObj.packet)
  }
}
window.onmessage = function (e) {
  let valArry = e.data;
  let object = valArry[0]
  console.log(object)
  if (object.call == 'report') {
    report(object.mes, object.meaning)
  }
}
/*web work implementation end */
setSettings();
//let graphModeChart = createGraph(document.getElementById('graphModeCanvas'))
if (document.getElementById("mainBody") != null) {
  //Responsible for creating and implementing the custom functions at runtime ********************************
  var funcs = Object.getPrototypeOf(funcListProxy);
  callCalc({ "callType": 'func', "method": 'add', "newFuncs": funcs });
  for (let funcObject of funcs) {
    switch (funcObject.type) {
      case "Function":
        custButton(funcObject);
        break;
      case "Code":
        custButton(funcObject);
        break;
      case "Hybrid":
        custButton(funcObject);
        break;
    }
  }
  //*********************************************************************************************************

  /*
  //Tab handling code *************************************************************************************
  document.getElementById('mainTab').addEventListener("click", function (e) {
    if (window.innerWidth / window.innerHeight < 3 / 4) {
      changeTabAs(false, () => openElement("mainPage"));
    }

  });
  document.getElementById('mobileTabs').addEventListener("click", function (e) {
    if (document.getElementById('tabContainer').style.visibility != "visible") {
      console.log("toggled")
      hideAllTabs();
      keypad.setVisibility(false)
      changeTabAs(true, () => {});
    } else {
      console.log("toggled other")

      changeTabAs(false,() => {
        openElement('mainPage');
        document.getElementById('keypad').style = undefined;
      });

    }
  });
  document.getElementById('settingsCogIcon').addEventListener("click", function () { sessionStorage.setItem("facing", "settingsOut"); openPage("settingsPage") });
  //********************************************************************************************************
  */


  //Media query for resizing the calculator***********************************
  const shit = window.matchMedia("(screen and max-height: 450px)");
  var mobileLandscape = {
    "q": window.matchMedia("screen and (max-height: 450px)"),
    "styling": `
    .tabcontent {
      top: 40px;
      border-radius: 0 25px 0 0;
    }
    .tabIcons{
      visibility: hidden;
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
      animation: fadeEffect 0.50s linear 1 none;
    }
    #extendedFuncGrid {
      position: absolute;
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
      width: calc(100% - 10px);
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
    }
    #selectorMode{
      grid-template-columns: 33.3333% 33.3333% 33.3333%;
      grid-template-rows: unset;
    }
    `
  };
  var mobilePortrait = {
    "q": window.matchMedia("screen and (max-aspect-ratio: 3/4) and (max-width: 450px)"),
    "styling": `
    #tab {
      height: 50px;
    }
  
    #mobileTabs {
      visibility: visible;
      left: 0;
      aspect-ratio: 1/1;
      height: 50px;
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
  //*****************************************************************


  /*
  //Graph equation switcher********************************************
  let initGraphEquation = document.getElementById('initGraphEquation');
  keypad.setTemp(initGraphEquation)
  document.getElementById('addGraphEquation').addEventListener('click', () => {
    let gEContainer = document.getElementById('graphFuncGrid')
    let clon = document.getElementById('dynamicEquationTemp').content.cloneNode(true);
    //keypadEquationMapper(clon.getElementById('equation'));
    keypad.setTemp(clon.getElementById('equation'))
    clon.getElementById('equation').addEventListener('input', () => {
      graphInMode();
    })
    gEContainer.insertBefore(clon, document.getElementById('addGraphEquation'))
  })
  initGraphEquation.addEventListener('input', function (e) {
    graphInMode()
  })
  //*******************************************************************



  //Table equation switcher********************************************
  let initTableEquation = document.getElementById('initTableEquation');
  keypad.setTemp(initTableEquation)
  document.getElementById('tableControls').addEventListener('change', (e) => { tableInMode() })
  document.getElementById('addTableEquation').addEventListener('click', () => {
    let gEContainer = document.getElementById('tableFuncGrid')
    let clon = document.getElementById('dynamicEquationTemp').content.cloneNode(true);
    //keypadEquationMapper(clon.getElementById('equation'));
    keypad.setTemp(clon.getElementById('equation'))
    clon.getElementById('equation').addEventListener('input', function (e) { tableInMode() });
    gEContainer.insertBefore(clon, document.getElementById('addTableEquation'))
  })
  initTableEquation.addEventListener('input', function (e) { tableInMode() });
  //********************************************************************
  */

  /*
    //Extend Keypad mappings*****************************************************
    document.getElementById('helpEx').addEventListener("click", function () { document.location = 'help.html'; setState(); sessionStorage.setItem("facing", "helpOut"); });
    document.getElementById('functionEx').addEventListener("click", function () {
      if (window.innerWidth / window.innerHeight > 3 / 4 && window.innerWidth / window.innerHeight < 2 / 1) {
        document.getElementById('extendedFuncGrid').style.animation = "0.15s ease-in 0s 1 reverse none running fadeEffect";
        setTimeout(function () { document.getElementById('extendedFuncGrid').style.visibility = "hidden"; document.getElementById('extendedFuncGrid').style.animation = null; }, 150);
        document.getElementById('customFuncDisplay').style.animation = "0.15s ease-in 0s 1 normal none running slideFromSide";
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
    //***************************************************************************************************
  */


  
  //***************************************************************************************************




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
  if (settings.theme == "custPurchasable") {
    document.getElementById('primaryColorPicker').value = settings.p
    document.getElementById('secondaryColorPicker').value = settings.s
    document.getElementById('accentColorPicker').value = settings.a
    document.getElementById('textColorPicker').value = settings.t
    toggleCustTheme();
  }
  document.getElementById(settings.theme).className = "themeElem active";
  //***************************************************************************************************



  //Colors page ***************************************************************************************
  document.getElementById('primaryColorPicker').addEventListener("input", updatePreview, false);
  document.getElementById('secondaryColorPicker').addEventListener("input", updatePreview, false);
  document.getElementById('accentColorPicker').addEventListener("input", updatePreview, false);
  document.getElementById('textColorPicker').addEventListener('input', updatePreview, false);
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
  //***************************************************************************************************



  //Preferences page **********************************************************************************
  document.getElementById('degModeBut').addEventListener("click", function () { degRadSwitch(true) });
  document.getElementById('radModeBut').addEventListener("click", function () { degRadSwitch(false) });
  if (settings.degRad == true) {
    document.getElementById('degModeBut').className = "settingsButton active";
  } else {
    document.getElementById('radModeBut').className = "settingsButton active";
  }
  //***************************************************************************************************



  //Buy Page*******************************************************************************************
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
  //***************************************************************************************************


  //Custom Functions Page******************************************************************************
  document.getElementById('addIcon').addEventListener('click', function () {
    console.log('clicked')
    openPage(document.getElementById("custCreatorPage"))
    document.getElementById('moreFunctionsPage').style.zIndex = 3;
    sessionStorage.setItem('facing', 'creatorMorePage')
  })
  /*document.getElementById('searchArea').addEventListener('input', function () {
    let list = getFuncList();
    let filtered = list.filter(function (value) {
      console.log(searchAlgo(value.name, document.getElementById('searchArea').value))

      return searchAlgo(value.name, document.getElementById('searchArea').value)
    })
    console.log(filtered);
    let funcGrid = document.getElementById('funcGrid');
    removeAllChildNodes(funcGrid)
    for (let item of filtered) {
      custButton(item, ['mainKeypad']);
    }
  })*/
  //***************************************************************************************************
}
/**********************************************|Main Page UI|*********************************************************/
//Responsible for animating pages on top of the main calculator (currently only used for creator page)
function openPage(element) {
  element.style.zIndex = 5;
  animate(element, "0.15s ease 0s 1 normal none running pageup").then(() => {
    console.log("Never Ran")
    element.style.animation = undefined;
    element.style.bottom = "0px";
  });
}
//Responsible for hiding pages that where placed on top of the main calculator
function closePage(element) {
  animate(element, "0.15s ease 0s 1 reverse none running pageup").then(() => {
    element.style.animation = undefined;
    element.style.bottom = "100%";
    element.style.zIndex = 1;
  });
}
//Responsible for handling the popup part of the virtuKeyboard on the page

//Responsible for hiding elements on main screen
function hideAllTabs() {
  let tabs = document.getElementsByClassName('tabcontent');
  if (keypad.style.visibility == "visible") {
    keypad.setVisibility(false);
  }
  for (let tab of tabs) {
    tab.style.visibility = "hidden";
  }
}
//Responsible for hiding and bring up tab elements
function changeTabAs(change, func) {
  let visibility = "", bases = document.getElementsByClassName('displayBase'), tabstyle = "", tablinks = document.getElementsByClassName('tablinks');
  console.log(bases)
  if (change) {
    visibility = "visible";
    tabstyle = "visibility: visible; width: 175px; height: 280px; top: unset; border-radius: 20px; text-align: center;";
    document.getElementById("tab").style = "display: block; height:100%;";
    document.getElementById('tabContainer').style = "display: grid; grid-template-columns: repeat(auto-fill, 175px); padding-top: 20px; position: absolute; visibility: visible; top: 50px; width: 100%; height: 100%; background-color: var(--translucent); border-radius: 25px 25px 0 0; justify-content: space-evenly;justify-items: center; overflow-y: auto;";
    for (let i = 0; i < bases.length - 1; i++) {
      bases[i].style.visibility = visibility;
      tablinks[i].style = tabstyle;
    }
    animate(document.getElementById('tabContainer'), "0.20s ease-in 0s 1 normal none running fadeEffect2").then(() => {
      document.getElementById('tabContainer').style.animation = undefined;
      func();
    });
  } else {
    visibility = "hidden";
    tabstyle = undefined;

    animate(document.getElementById('tabContainer'), "0.20s ease-in 0s 1 reverse none running fadeEffect2").then(() => {
      document.getElementById("tab").style = undefined;
      document.getElementById('tabContainer').style = undefined;
      for (let i = 0; i < bases.length - 1; i++) {
        bases[i].style.visibility = visibility;
        tablinks[i].style = tabstyle;
      }
      func();
    })

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

//END
/********************************************|Main Page Button Handling|*********************************************/
//Responsible for most keypresses on main input. Handles focus and adding of characters to method

//Responsible for handling the navigation buttons on the main calc tab

function nextText(dire, parent, elem) {
  let childNodes = parent.childNodes;
  var nodes = [].slice.call(childNodes);
  let index = nodes.indexOf(elem);
  if (dire) {
    let nextElem = getText(nodes[index + 1]);
    setFocus(nextElem, 1)
  } else {
    let nextElem = getText(nodes[index - 1]);
    setFocus(nextElem, nextElem.textContent.length)
  }
}
function switchMode(modeId) {
  let modes = document.getElementsByClassName('mode')
  let hidingElems = [];
  let showingElems = [document.getElementById(modeId)];
  let modeButton = document.getElementById('modeButton');
  for (let mode of modes) {
    if (mode.style.visibility != 'hidden' && mode.id != modeId) {
      hidingElems.push(mode)
    }
  }
  keypad.setVisibility(false);
  if (modeId == "selectorMode") {
    hidingElems.push(modeButton);
    document.getElementById('selectorMode').style.visibility = 'inherit';
    animate(document.getElementById('selectorMode'), "0.20s ease-in 0s 1 normal none running fadeEffect2").then(() => {
      document.getElementById('selectorMode').style.animation = undefined;
    })
  } else {
    if (modeId == "mainMode") {
      showingElems.push(document.getElementById('mainKeypad'))
    }
    showingElems.push(modeButton)
    pullUpElements(showingElems)
  }
  hideElements(hidingElems);

}
//END
/*******************************************|Main Page Custom Func Editing|*******************************************/

//Respinsible for the visible of pages on creator page. Takes the id and that is the page that becomes visible
function funcCreatorPages(elemID) {
  for (let elem of document.getElementsByClassName('creatorPage')) {
    elem.style.visibility = "hidden";
  }
  document.getElementById(elemID).style.visibility = "visible";
}
//END
/***********************************************|Main Page Backend|*************************************************/
//Responsible for handling the focusing certain elements on main calc page
function setSelect(node, index) {
  let sel = window.getSelection();
  console.log("focus Modified")
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
//END
/************************************************|Custom Func UI|****************************************************/


function compareTable(elems, points) {
  for (let i = 0; i < points.length; i++) {
    if (points[i] != elems[i]) {
      return true;
    }
  }
  return false
}
//Responsible for creating the cust func buttons and adding them to the elements in target array

//Responsible for the creation of tab and tab page of the given config
/*function createTab(config) {

  let tabs = document.getElementsByClassName('tabcontent');
  keypad.setVisibility(false)
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].style.visibility = 'hidden';
  }
  if (config.type == "Function") {
    let def = (new EquatPage(config));
    definedPages.push(def);
  } else if (config.type == "Hybrid") {
    let def = (new HybridPage(config));
    definedPages.push(def);
  } else if (config.type == "Code") {
    let def = (new CustomPage(config));
    definedPages.push(def)
  }
}*/
//Responsible for the creation of a tab button that links to the tab
function newTabButton(config, tabPage) {
  let name = config.name;
  let tabClon = document.getElementsByClassName('newTab')[0].content.cloneNode(true);
  let nameElem = tabClon.getElementById('newTabName');
  let buttonCopy = tabClon.getElementById('tabButton');
  tabClon.getElementById('newTabName').innerHTML = name;
  /*if (config.type == "Function") {
    tabClon.getElementById('equtDisplayFunc').innerHTML = config.equation
  } else if (config.type == "Code") {
    tabClon.getElementById('equtDisplayFunc').innerHTML = "Code";
  } else if (config.type == "Hybrid") {
    tabClon.getElementById('equtDisplayFunc').innerHTML = "Hybrid";
  }*/
  tabClon.getElementById('tabButton').dataset.tabmap = JSON.stringify(config);
  tabClon.getElementById('tabRemove').src = getSource('xIcon');

  let highlight = tabClon.getElementById('tabButton');
  tabClon.getElementById('tabButton').addEventListener("click", function (e) {
    console.log(e.target)
    if (!highlight.querySelector('#tabRemove').contains(e.target)) {
      if (window.innerWidth / window.innerHeight < 3 / 4) {
        sessionStorage.setItem('facing', 'custFunc');
        let code = () => {
          openElement(nameElem.innerHTML)
        };
        changeTabAs(false, code);
      } else {
        openElement(nameElem.innerHTML);
        sessionStorage.setItem("facing", "custFunc");
      }

    }
  });
  tabClon.getElementById('tabRemove').addEventListener('click', function (e) {
    let tabLink = getParent(e.target, document.getElementById('tabContainer'));
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
  console.log("openElement")
  let match = matchPage(name);
  console.log(match)
  let tabs = document.getElementsByClassName('tabcontent');
  if (name != "mainPage") {
    document.getElementById('customFuncDisplay').style.visibility = "hidden";
    keypad.setVisibility(false);
  } else {
    document.getElementById('customFuncDisplay').style.visibility = "";
    if (mainMode.style.visibility == "inherit") {
      keypad.setVisibility(true);
    }
    keypad.reset();
    /*keypadController(
      {
        "reset": true,
        "rePage": () => { },
      }
    );*/
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
  console.log(definedPages)
  console.log(name)
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
//Responsible for handing the changing of a cust func on the default tab page
/*function changeFunc(og, newString, def) {
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
}*/
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
function changeImplemented(name, newObject) {
  let target = funcListProxy.find((func) => {
    if (func.name == name) {
      return true
    }
  })
  funcListProxy.splice(funcListProxy.indexOf(target), 1, newObject);
}
//Responsible for taking the funclist and making it into a localStorage value (main backend)
//Responsible for removing a value for the funcList (main backend)
function removeFunc(funcName) {
  callCalc({ "callType": 'func', "method": 'remove', "name": funcName });
  for (let item of funcListProxy) {
    if (item.name == funcName) {
      //removeImplemented(item);
      funcListProxy.splice(funcListProxy.indexOf(item), 1);
    }
  }
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
    if (funcMatch(parsedEquation.substring(i), true) != "") {
      i += funcMatch(parsedEquation.substring(i), true).length;
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
  let varData = varListAssbely(element);
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
  console.log(method)
  inputSolver(method, "Couldn't Calculate").then((value) => {
    console.log(value)
    clon.querySelector('#equalsHeader').innerHTML = '=' + value;
  });
}
//Responsible for solving the parsedEquation with one open vairable graphically
function solveGraph(parsedEquation, def) {
  let vars = getGraphVars(def);
  //Number(def.tabPage.querySelector('#stepDomainGraph').value) * mutplier;
  /*let result = calculatePoints(parsedEquation, Number(vars.bottom), Number(vars.top), Number(vars.res));
  console.log(result.length)
  def.chart.data.datasets[0].data = result;
  def.chart.update();*/
  getPoints('graph', { 'text': parsedEquation, 'min': Number(vars.gMin), 'max': Number(vars.gMan), 'res': Number(vars.gR) }).then((value) => {
    def.chart.data.datasets[0].data = value;
    def.chart.update();
  })
}
//Responsible for solving the parsedEquation with one open variable table wise
function solveTable(parsedEquation, clon) {
  let table = clon.querySelector("#funcTable");
  table.innerHTML = "<tr><th>x</th><th>y</th></tr>";
  getPoints('table', parsedEquation).then((value) => {
    value.forEach((elem, index) => {
      let newRow = table.insertRow()
      let newXCell = newRow.insertCell()
      newXCell.innerHTML = elem.x
      let newYCell = newRow.insertCell()
      newYCell.innerHTML = elem.y
    });
  })
}
/*function getPoints() {
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
    inputSolver(parsedEquation.replaceAll('Æ', newPoint.x), "Error Making Graph").then((value) => {
      newPoint.y = value
      pointArray.push(newPoint)
    })
    //newPoint.y = inputSolver(parsedEquation.replaceAll('Æ', newPoint.x), "Error Making Graph");
    //pointArray.push(newPoint);
  }
  return pointArray;

  if (arguments[0] == 'graph') {
    arguments[1].type = 'points';
    arguments[1].target = 'graph'
    console.log(arguments[1])
    return callCalc(['calc', arguments[1]])
  } else {
    return callCalc(['calc', { 'type': 'points', 'target': 'table', 'text': arguments[1] }])
  }

}*/
//creates an array of all variables needed for calculatePoints

//Responsible for (IDFK work on this later)
function checkVar(name, def) {
  callCalc({ "callType": "get", 'method': 'vars', "existing": true, "funcName": name }).then(value => {
    let checkList = value;
    //let varGrid = clon.querySelector("#varGrid");
    //let funcTabs = [clon.querySelector('#functionDiv'), clon.querySelector('#graphDiv'), clon.querySelector('#tableDiv')]
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
      oldVar.element.remove();
    }
    //Var Creatation part
    for (let newVar of newVars) {
      def.generateVar(newVar);
    }

  })
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
  } else if (event.target.id == "primaryColorPicker") {
    document.getElementById("funcPreview").style.backgroundColor = event.target.value;
  } else if (event.target.id == "textColorPicker") {
    document.getElementById('showcaseTextColor').style.color = event.target.value;
  }
}
//Responsible for unlocking the custom theme on settings
function unlockCustomTheme() {
  document.getElementById('buyCustTheme').style = "visibility: hidden; position: absolute; top: 0; left: 0;";
  document.getElementById('custLabel').style = "margin-top: unset; margin-bottom: unset;";
  let colors = themeElem.getMth();
  settings.p = colors[0];
  settings.s = colors[2];
  settings.t = colors[3];
  document.getElementById('primaryColorPicker').value = settings.p
  document.getElementById('secondaryColorPicker').value = settings.s
  document.getElementById('accentColorPicker').value = settings.a
}
//Responsible for handling a click event on cust themes
function toggleCustTheme() {
  if (document.getElementById('ColorsDiv').style.visibility == 'inherit') {
    document.getElementById('ColorsDiv').style = "visibility: hidden; position: absolute;";
    document.getElementById('accentColorDiv').style = "visibility: inherit; position: relative;";
  } else {
    document.getElementById('ColorsDiv').style = "visibility: inherit; position: relative;";
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
    newSettings.acc = document.getElementById("accentColorPicker").value;
    newSettings.t = document.getElementById('textColorPicker').value;
  }
  newSettings.gR = document.getElementById('graphDStep').value;
  newSettings.gMin = document.getElementById('domainBottomG').value;
  newSettings.gMax = document.getElementById('domainTopG').value;
  newSettings.tMin = document.getElementById('rMinT').value;
  newSettings.tMax = document.getElementById('rMaxT').value;
  newSettings.tC = document.getElementById('tableCells').value;
  if (document.getElementById("degModeBut").className == "settingsButton active") {
    newSettings.degRad = true;
  } else {
    newSettings.degRad = false;
  }
  localStorage.setItem("settings", JSON.stringify(newSettings));
  settings = JSON.parse(localStorage.getItem("settings"));
  setSettings();

  //closePage('settingsPage')
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
      popup();
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
      closePage(document.getElementById('custCreatorPage'));
    },
  },
  {
    "elm": "moreFunctionsPage",
    "backElm": '',
    "prtCont": 'main',
    "mth": function () {
      closePage(document.getElementById('moreFunctionsPage'));
    }
  },
  {
    'elm': 'creatorMain',
    "backElm": '',
    'prtCont': 'main',
    "mth": function () {
      closePage(document.getElementById("custCreatorPage"))
    }
  },
  {
    'elm': 'creatorMorePage',
    "backElm": 'moreFunctionsPage',
    'prtCont': 'main',
    "mth": function () {
      closePage(document.getElementById("custCreatorPage"))
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
  TextColorGlobal = colorArray[3];
  document.getElementById('graphDStep').value = settings.gR;
  document.getElementById('domainBottomG').value = settings.gMin;
  document.getElementById('domainTopG').value = settings.gMax;
  document.getElementById('rMinT').value = settings.tMin;
  document.getElementById('rMaxT').value = settings.tMax;
  document.getElementById('tableCells').value = settings.tC;
  callCalc({ 'callType': 'set', 'method': 'init', 'settings': settings });
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
  //equation = solveInpr(equation, settings.degRad)
  try {
    equation = callCalc({ "callType": "calc", 'method': 'solve', 'text': equation })
    console.log(equation)
    return equation
  } catch (eve) {
    report(errorStatement, false)
  }
}
//Responsible for assebiling the code terminal throughout the program
function createCodeTerminal(element, name) {

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
function queryVars(equat) {
  return callCalc({ "callType": "get", 'method': 'vars', 'text': equat })
}
//Responsible for finding where variables are in a given equation
/*function varInEquat(equation) {
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
  let func = funcMatch(entry, true);
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
}*/
//Responsible for parsing a variable to its value in an equation 
function setVar(element, equation) {
  let varData = varListAssbely(element);
  console.log(`%c seVar ran`, "color: red;");
  console.log(varData)
  for (let data of varData) {
    for (let i = 0; i < equation.length; i++) {
      if (funcMatch(equation.substring(i), true) != "") {
        i += funcMatch(equation.substring(i), true).length;
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
  if (object.reset != undefined && object.reset == false) {
    let styling = document.createElement('style');
    let builtInStyling = `
    #arrowIcon{
      position: aboslute;
      top: calc(50% - 25px);
      left: calc(50% - 25px);
      height: 50px;
      width: 50px;
      visibility: visible;
    }
    #moreFunctionsButton{
      color: transparent;
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
function keypadVis(visible) {
  if (visible) {
    document.getElementById('keypad').style.visibility = 'visible';
  } else {
    document.getElementById('keypad').style.visibility = "hidden";
  }
}
function keypadEquationMapper() {
  let elem = arguments[0]
  let newStyling = arguments[1]
  elem.addEventListener("focus", function (e) {
    if (document.getElementById('keypad').style.visibility == "hidden") {
      setSelect(elem, elem.innerHTML.length);
      keypad.setVisibility(true);
      console.log(arguments)
      let defaultStyle = `
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
      }`;
      keypad.setAttribute("input", elem);
      keypad.setAttribute("history", elem);
      keypad.setStyle(newStyling == undefined ? defaultStyle : newStyling);
    }
  });
  elem.addEventListener('focusout', (e) => {
    setTimeout(() => {
      let sel = window.getSelection();
      console.log("focus Modified")
      console.log(keyTargets)
      console.log(sel)
      let keypad = document.getElementById('keypad')
      console.log(keypad)
      console.log(keypad.contains(sel.focusNode))
      if ((!elem.contains(sel.focusNode) || sel.anchorOffset == 0) && !keypad.contains(sel.focusNode)) {
        if (elem.innerHTML.length == 1) {
          elem.innerHTML = "";
        }
        keypad.setVisibility(false);
        keypad.reset();
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
      let evtTarget = undefined
      let mouseDown = (e) => {
        let event = e;
        evtTarget = event.currentTarget;
        repeater = setInterval((e) => {
          elem.function(event)
          console.log(event)
        }, 200)
      };
      let mouseMove = (e) => {
        if (evtTarget != e.currentTarget) {
          clearInterval(repeater)
        }
      };
      let mouseUp = (e) => {
        clearInterval(repeater)
      }
      elemDef.addEventListener("mousedown", (e) => { console.log(e); mouseDown(e) })
      elemDef.addEventListener("mousemove", (e) => { mouseMove(e) })
      elemDef.addEventListener('mouseup', (e) => { mouseUp(e) })
      elemDef.addEventListener('touchstart', (e) => { mouseDown(e) })
      elemDef.addEventListener('touchmove', (e) => { mouseMove(e) })
      elemDef.addEventListener('touchend', (e) => { mouseUp(e) })
      elemDef.addEventListener('touchcancel', (e) => { mouseUp(e) })
      elemDef.addEventListener('contextmenu', function (e) { e.preventDefault(); return false; });
    }
  }
}

function calculateGraph() {

}
function createElem(tag) {
  let ele = document.createElement(tag);
  return ele;
}
function codeFilter(code) {
  if (code.includes("Navigator") || code.includes("XMLHttpRequest")) {
    return "";
  } else {
    return code;
  }
}
function elemArray(colect) {
  let arry = [];
  for (let value of colect.values()) {
    arry.push(value);
  }
  return arry;
}
function getText(node) {
  if (node.nodeType != 3) {
    return getText(node.lastChild)
  } else {
    return node;
  }
}
function getParent(node, parent) {
  let childNodes = parent.childNodes;
  var nodes = [].slice.call(childNodes);
  if (nodes.includes(node)) {
    return node;
  } else {
    return getParent(node.parentNode, parent);
  }
}
Object.defineProperty(Node.prototype, 'insertAt', {
  writable: false,
  enumerable: false,
  configurable: false,

  value(child, index) {
    let childern = this.childNodes
    console.log(childern)
    var nodes = [].slice.call(childern);
    let nLength = nodes.length;
    if (index > nLength) {
      this.appendChild(child)
    } else {
      this.insertBefore(child, childern[index])
    }
  }
});
Object.defineProperty(Node.prototype, 'removeSection', {
  writable: false,
  enumerable: false,
  configurable: false,

  value(start, end, sIdx, eIdx) {
    console.log(start)
    console.log(end)
    let startTree = createTree(start)
    let endTree = createTree(end)
    let unfiParent = undefined
    let matchInx = undefined
    for (let i = 0; i < startTree.length; i++) {
      if (startTree[i] == endTree[i]) {
        matchInx = i;
        unfiParent = startTree[i]
      } else {
        break;
      }
    }
    let uniChilern = unfiParent.childNodes;
    var nodes = [].slice.call(uniChilern);
    let sNIdx = Number(nodes.indexOf(getParent(start, keyTargets.input)))
    console.log(sNIdx)
    let eNIdx = Number(nodes.indexOf(getParent(end, keyTargets.input)))
    /*matchInx == startTree.length -1 ? false : treeRemove(start, sIdx, unfiParent, true)
    matchInx == startTree.length -1 ? false : treeRemove(end, eIdx, unfiParent,false)*/

    treeRemove(start, sIdx, unfiParent, false) ? false : sNIdx--
    treeRemove(end, eIdx, unfiParent, true)

    console.log(sNIdx)
    for (let i = sNIdx + 1; i < eNIdx; i++) {
      console.log(i)
      console.log(nodes[i])
      unfiParent.removeChild(nodes[i]);
    }
  }
});
String.prototype.replaceAt = function () {
  let repment = arguments[0]
  let srt = arguments[1]
  switch (arguments.length) {
    case (2):
      return this.substring(0, srt) + repment + this.substring(srt + repment.length)
      break;
    case (3):
      let end = arguments[2]
      return this.substring(0, srt) + repment + this.substring(end)
      break;
  }
}
function treeRemove(elem, inx, topPar, dire) {
  console.log(elem)
  console.log(topPar)
  elem.textContent = dire ? elem.textContent.substring(inx) : elem.textContent.substring(0, inx)
  let parentElem = elem.parentNode
  console.log(parentElem)
  let targetElem = elem
  while (parentElem != topPar) {
    console.log(parentElem)
    let childern = parentElem.childNodes
    let arryChd = [].slice.call(childern);
    let indElem = arryChd.indexOf(targetElem)
    for (let i = dire ? indElem + 1 : indElem - 1; dire ? i < arryChd.length : i > -1; dire ? i++ : i--) {
      parentElem.removeChild(arryChd)
    }
    targetElem = parentElem
    parentElem = parentElem.parentNode
  }
  if (getParent(elem, keyTargets.input).childNodes.length > 0 || getText(getParent(elem, keyTargets.input)).textContent == '‎' && getParent(elem, keyTargets.input).nodeType != 3) {
    return false
  } else {
    return true
  }
}
function createTree(elem) {
  let tree = [elem.parentNode];
  console.log(tree)
  while (tree[0] != keyTargets.input) {
    console.log(tree[0])
    tree.unshift(tree[0].parentNode)
  }
  return tree;
}
function autoStitch(elem) {
  let childern = elem.childNodes
  let nodesAry = [].slice.call(childern)
  for (let i = nodesAry.length - 1; i > 0; i--) {
    if (nodesAry[i].nodeType == 3 && nodesAry[i - 1].nodeType == 3) {
      nodesAry[i - 1] += nodesAry[i].textContent.replaceAll('‎', '')
    } else if (nodesAry[i].nodeType == nodesAry[i - 1].nodeType) {
      let childern = nodesAry[i].childNodes
      let nods = [].slice.call(childern)
      nods.every((elem, idx) => {
        if (idx == 0 && elem.nodeType == 3) {
          elem.textContent.replaceAll('‎', '')
        }
        nodesAry[i - 1].nodeType.appendChild(elem)
      })
    }
  }
}
async function funcMatch(equation, way) {
  let funcList = await callCalc({ "callType": 'get', 'method': 'list' }).then()
  var returned = "";
  for (let func of funcList) {
    let check
    if (way) {
      check = equation.substring(0, (func.length));
    } else {
      check = equation.substring(equation.length - func.length);
    }
    if (check == func) {
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
function codeFilter(code) {
  let blackListArray = [];
  for (let block of blackListArray) {
    if (code.includes(block)) {
      return false
    }
  }
  return true
}

function animate(elem, animation) {
  return new Promise((resolve, reject) => {
    elem.addEventListener('animationend', (e) => {
      resolve();
    },{ once: true });

    elem.style.animation = animation;
  });
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
//generates a number of vars for simplifying stuff
function generateVars(length) {
  let newVars = [];
  for (let i = 0; i < length; i++) {
    newVars.push(String.fromCharCode(97 + i));
  }
  return newVars;
}
class FuncPage {
  constructor(config) {
    //this.def = {}
    this.srtConfig = config
    this.id = config.name
    console.log(config)
  }
}
class CustomPage extends FuncPage {
  constructor(config) {
    super(config)
    let temp = document.getElementById('customPageTab'), clon = temp.content.cloneNode(true);
    this.clone = clon;
    let iframe = clon.getElementById('iframeTab');
    clon.getElementById('iframeTab').src = 'packages/iframeHandler/frameBasic.html';
    clon.getElementById('iframeTab').id = config.name;
    document.getElementById("mainPage").appendChild(clon);
    let newFrame = document.querySelector('#' + config.name);
    newFrame.onload = function () {
      newFrame.contentWindow.postMessage("heelo", '*');
    }
    console.log('post')
    let frameCall = (obj) => new Promise((res, rej) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = ({ data }) => {
        channel.port1.close();
        if (data.error) {
          rej(data.error);
        } else {
          res(data.result);
        }
      };
      newFrame.contentWindow.postMessage(obj, [channel.port2]);
    });
    let feedObject = JSON.parse(JSON.stringify(this.srtConfig))
    feedObject.call = 'init';
    console.log(feedObject)
    newFrame.onload = function () {
      frameCall(feedObject)
    }
  }
}
class TemplatePage extends FuncPage {
  constructor(config) {
    super(config)
    let temp = document.getElementById('templateFuncTab'), clon = temp.content.cloneNode(true);
    let chart = clon.getElementById("funcChart");
    let funcTabs = [clon.getElementById('functionDiv'), clon.getElementById('graphDiv'), clon.getElementById('tableDiv')];
    let tabCopy = clon.getElementById('customFuncTab');
    let movable = clon.getElementById("selectorUnder");
    let thisElem = this
    movable.dataset.pos = 0;

    this.vars = [];
    this.name = config.name;
    this.clone = clon;
    this.varGrid = clon.getElementById("varGrid");
    this.tabPage = tabCopy;
    this.tab = newTabButton(config, tabCopy);
    this.chart = createGraph(chart)
    callCalc({ callType: 'get', method: 'func', "name": this.name }).then(value => {
      this.funcDef = value;
      this.vars = this.funcDef.vars;
      let varNames = []
      this.vars.forEach(val => { varNames.push(val.letter) })
      console.log(varNames)
      console.log(this.vars)
      callCalc({ callType: 'set', method: "env", envType: 'static', id: this.name, isFunc: true, vars: value.vars, equation: `${this.name}(${varNames.join(',')})` })
    });

    //Graph settings that need to be updated
    clon.getElementById("minGraph").value = settings.gMin;
    clon.getElementById("maxGraph").value = settings.gMax;
    clon.getElementById("resolutionGraph").value = settings.gR;
    clon.getElementById("minTable").value = settings.tMin;
    clon.getElementById("maxTable").value = settings.tMax;
    clon.getElementById('cellTable').value = settings.tC;
    clon.getElementById('customFuncTab').dataset.tab = JSON.stringify(config);
    clon.getElementById("nameFunc").value = this.name;
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
    this.chart.options.plugins.zoom.zoom.onZoomComplete = function () {
      let varArray = {
        "gMin": thisElem.chart.scales.x == undefined ? settings.gMin : Number(thisElem.chart.scales.x.min),
        "gMax": thisElem.chart.scales.x == undefined ? settings.gMax : Number(thisElem.chart.scales.x.max)
      }
      callCalc({ 'callType': 'set', 'method': 'envVar', "targetEnv": thisElem.id, "newVars": varArray });
    }
    this.chart.options.plugins.zoom.pan.onPanComplete = function () {
      let varArray = {
        "gMin": thisElem.chart.scales.x == undefined ? settings.gMin : Number(thisElem.chart.scales.x.min),
        "gMax": thisElem.chart.scales.x == undefined ? settings.gMax : Number(thisElem.chart.scales.x.max)
      }
      callCalc({ 'callType': 'set', 'method': 'envVar', "targetEnv": thisElem.id, "newVars": varArray });
    }
  }
  generateVar(name) {
    let tempvar = document.getElementsByClassName("variableTemplate")[0];
    let varClon = tempvar.content.cloneNode(true); 8
    let thisElem = this;
    varClon.getElementById('variableName').innerHTML = name;
    varClon.getElementById('variableEntry').addEventListener('input', function (e) {
      callCalc({ callType: "set", method: "var", targetEnv: thisElem.name, target: name, value: variableEntry.value });
    });
    this.varGrid.appendChild(varClon);
    this.vars.push({ "name": name, 'elem': varClon })
  }
  packageHandler(packet) {
    this.tabPage.querySelector("#EquationFunc").innerHTML = packet.result;
    this.tabPage.querySelector('#equalsHeader').innerHTML = '=' + packet.point;
    this.chart.data.datasets[0].data = packet.graph.points;
    this.chart.data.datasets[1].data = packet.graph.extrema;
    this.chart.update();
    let table = this.tabPage.querySelector("#funcTable");
    table.innerHTML = "<tr><th>x</th><th>y</th></tr>";
    packet.table.forEach((elem) => {
      let newRow = table.insertRow()
      let newXCell = newRow.insertCell()
      newXCell.innerHTML = elem.x
      let newYCell = newRow.insertCell()
      newYCell.innerHTML = elem.y
    });
  }
}
class HybridPage extends TemplatePage {

  constructor(config) {
    super(config)
    let clon = this.clone;
    let tabCopy = this.tabPage;
    let code = config.code

    clon.getElementById("editIcon").style = "";
    clon.getElementById("editIcon").src = getSource("EditIcon");
    clon.getElementById('editExit').src = getSource("xIcon");
    clon.getElementById('confirmEdit').src = getSource('checkmark')
    createCodeTerminal(clon.getElementById('textEditorEdit'), "custEdit")
    clon.getElementById('creatorEditor').style = "height: fit-content; max-height: calc(100% - 20px); top: 10px; overflow: scroll; ";
    let nameElem = clon.getElementById('nameFunc');
    let subElem = clon.getElementById("EquationFunc");
    subElem.innerHTML = "Hybrid";
    subElem.contentEditable = false;

    nameElem.addEventListener("input", function (e) {
      changed('name')
    });

    clon.getElementById('editIcon').addEventListener("click", function (e) {
      this.openEdit(this.code);
      recaculateNums(tabCopy.querySelector('#lineLabel'), this.code)
    });
    clon.getElementById('editExit').addEventListener('click', function () {
      this.closeEdit()
    });
    clon.getElementById('confirmEdit').addEventListener('click', function () {
      this.changed("method")
    })
    document.getElementById("mainPage").appendChild(clon);
    //checkVar("hybrid", tabCopy, this.srtConfig.code, this)
  }
  openEdit(definition) {
    hideElements([this.tabPage.querySelector('#varEquationContainer'), this.tabPage.querySelector('#resultPane'), this.tabPage.querySelector('#nameFunc')]);
    pullUpElements([this.tabPage.querySelector('#editDiv')])
    this.tabPage.querySelector('#custEdit').value = definition;
  }
  closeEdit() {
    hideElements([this.tabPage.querySelector('#editDiv')]);
    pullUpElements([this.tabPage.querySelector('#varEquationContainer'), this.tabPage.querySelector('#resultPane'), this.tabPage.querySelector('#nameFunc')]);
  }
  changed(type) {
    let name = this.tabPage.querySelector("#nameFunc").innerHTML
    var code;
    if (type == "method") {
      code = tabCopy.querySelector('#custEdit').value
    } else if (type == "name") {
      let tempCode = tabCopy.querySelector('#custEdit').value
      tempCode = tempCode.substring(tempCode.indexOf("("))
      code = `function ${name}${tempCode}`
      tabCopy.querySelector('#custEdit').value = code;
    }
    callCalc({ callType: "func", method: "change", name: this.id, changes: { "type": "method", "name": name, "code": code } }).then(value => {
      changeImplemented(this.id, { "type": "Hybrid", 'name': name, "code": code })
      this.id = value;
    })
  }
}
class EquatPage extends TemplatePage {
  constructor(config) {
    super(config)
    let thisElem = this;
    let clon = this.clone;
    let tabCopy = this.tabPage;
    let equation = config.equation;
    this.equationDIV = clon.getElementById("EquationFunc");
    this.type = "function";

    this.equationDIV.innerHTML = equation;
    this.equationDIV.dataset.baseE = equation;

    clon.getElementById('nameFunc').addEventListener("input", function (e) {
      thisElem.changed()
    });
    this.equationDIV.addEventListener("input", function (e) {
      thisElem.changed()
    });

    let styleVal = `
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
    }`;
    //keypadEquationMapper(this.equationDIV, styleVal)
    keypad.setTemp(this.equationDIV, styleVal);
    document.getElementById("mainPage").appendChild(clon);
    checkVar(this.id, this);
    //parseVariables(tabCopy.querySelector('#varGrid'), this);
  }
  changed() {
    let name = this.tabPage.querySelector("#nameFunc").value
    let equation = this.tabPage.querySelector("#EquationFunc").innerHTML
    this.equationDIV.dataset.baseE = equation;
    callCalc({ callType: "func", method: "change", name: this.id, changes: { "type": "function", "name": name, "equation": equation } }).then(value => {
      changeImplemented(this.id, { "type": "Function", 'name': name, "equation": equation })
      this.id = name;
      checkVar(this.id, this)
    })
  }
}
