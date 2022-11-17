console.log(document.getElementById('HelpMenu'))
var settings;
if (localStorage.getItem("settings") != undefined) {
    settings = JSON.parse(localStorage.getItem("settings"));
    console.log("settings got");
    console.log(settings);
} else {
    localStorage.setItem("settings", '{"version": 1,"oL":"auto","degRad": true,"notation": "simple","theme": "darkMode","acc":"blue","tC" : 5,"tMin" : -10,"tMax" : 10,"gR" : 100,"gMin" : -10,"gMax" : 10}');
    settings = JSON.parse(localStorage.getItem("settings"));
    console.log(settings);
}
setSettings();
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
    /*document.getElementById('graphDStep').value = settings.gR;
    document.getElementById('domainBottomG').value = settings.gMin;
    document.getElementById('domainTopG').value = settings.gMax;
    document.getElementById('rMinT').value = settings.tMin;
    document.getElementById('rMaxT').value = settings.tMax;
    document.getElementById('tableCells').value = settings.tC;
    callCalc({ 'callType': 'set', 'method': 'init', 'settings': settings });*/
    /*if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      colorMessager.postMessage(colorArray[0]);
    }*/
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
  
          return ["#1f1f1f", getColorAcc(settings.acc), "#383838", '#FFFFFF'];
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
