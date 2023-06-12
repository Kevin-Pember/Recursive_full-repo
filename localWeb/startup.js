class FuncDef {
  constructor(){
    if(arguments.length == 1){
      if(typeof arguments[0] == "string"){
        let func = arguments[0]
        switch (func.substring(0, 1)) {
          case "F":
            this.typeDef = "Function";
            break;
          case "H":
            this.typeDef = "Hybrid";
            break;
          case "C":
            this.typeDef = "Code";
            break;
          default:
            report("Non-parsable Func found", false);
            break;
        }
        func = func.substring(func.indexOf('»') + 1);
        this.nameDef = func.substring(0, func.indexOf('»'));
        func = func.substring(func.indexOf('»') + 1);
        this.textDef = func.substring(0, func.indexOf('»'));
      }else if (typeof arguments[0] == "object"){
        this.typeDef = arguments[0].type;
        this.nameDef = arguments[0].name;
        if(this.typeDef == "Function"){
          this.textDef = arguments[0].equation;
        }else{
          this.textDef = arguments[0].code;
        }
      }
    }else{
      this.typeDef = arguments[0];
      this.nameDef = arguments[1];
      this.textDef = arguments[2];
    }
  }
  /**
   * @param {string} type
   */
  set type(type){
    this.typeDef = type;
    setFuncList(funcList);
  }
  get type(){
    return this.typeDef;
  }
  /**
   * @param {string} name
   */
  set name(name){
    this.nameDef = name;
    setFuncList(funcList);
  }
  get name(){
    return this.nameDef;
  }
  /**
   * @param {any} text
   */
  set text(text){
    this.textDef = text;
    setFuncList(funcList);
  }
  get text(){
    return this.textDef;
  }
  get object(){
    if(this.typeDef == "Function"){
      return {
        "type": this.typeDef,
        "name": this.nameDef,
        "equation": this.textDef
      }
    }else{
      return {
        "type": this.typeDef,
        "name": this.nameDef,
        "code": this.textDef
      }
    }
  }
  get compressed(){
    let parsedString = "";
    switch (this.type) {
      case "Function":
        parsedString = "F"
        break;
      case "Hybrid":
        parsedString = "H"
        break;
      case "Code":
        parsedString = "C"
        break;
    }
    parsedString += "»" + this.name + "»" + this.text + "»";
    return parsedString;
  }
}
class MediaType {
  #matchMedia;
  #methodArray = [];
  constructor(name, mediaString){
    console.log(name);
    console.log(mediaString);
    this.name = name;
    this.#matchMedia = window.matchMedia(mediaString);
    this.changeMethod = (e) => {
      if(e.matches){
        this.#methodArray.forEach((element) => {
          element.func();
        });
      }
    };
    
    this.#matchMedia.onchange = this.changeMethod;
    
  }
  getMedia(){
    return this.#matchMedia;
  }
  addMethod(method){
    this.#methodArray.push(method);
    if(this.#matchMedia.matches){
      method.func();
    }
    //this.changeMethod(this.#matchMedia);
  }
  hasMethod(name){
    let has = this.#methodArray.find((element) => {
      if(element.name == name){
        return true;
      }
    });
    return !!has;
  }
  removeMethod(methodName){
    this.#methodArray.find((element, idx) => {
      if(element.name == methodName){
        this.#methodArray.splice(idx, 1);
        return true;
      };
    })
  }

}
var settings;
let calcWorker = new Worker('evalWorker.js',{type: 'module'});
let envObject = {
  funcButtons: [],
  inputs: [],
  keypads: [],
  cardContainers: [],
  stylers: [],
  universalStyle: `
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: ubuntu;
    color: var(--text);
    -webkit-tap-highlight-color: transparent;
  }
  .primary {
    fill: var(--primary);
  }
  
  .secondary {
    fill: var(--secondary);
  }
  
  .accent {
    fill: var(--accent);
  }
  
  .text {
    fill: var(--text)
  }
  .iconType{
    border: none;
    border-radius: 50%;
    aspect-ratio: 1/1;
    background-color: var(--primary);
    display: grid;
    place-items: center;
    align-content: center;
  }
  .entryType{
    border: none;
    border-radius: 15px;
  }
  .titleType{
    border: none;
    border-radius: 20px;
    filter: drop-shadow(5px 5px 5px var(--translucent));
  }
  .paneType{
    border: none;
    border-radius: 25px;
    background-color: var(--primary);
    filter: drop-shadow(5px 5px 5px var(--translucent));
  }
  ::-webkit-scrollbar {
    width: 2vh;
  
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
    margin-bottom: 40px;
  }
  
  ::-webkit-scrollbar-thumb {
    width: 5;
    min-height: 30px;
    background: var(--translucent);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-button:end:increment {
    height: 7px;
    display: block;
    background: transparent;
  }
  
  ::-webkit-scrollbar-button:start:increment {
    height: 7px;
    display: block;
    background: transparent;
  }
    `
}
let funcList = getFuncList();
const funcListProxy = new Proxy(funcList, {
  set: (target, property, value) => {
    if(property === "length"){
      target[property] = value;
    }else{
      if(value instanceof FuncDef){
        target[property] = value;
      }else{
        target[property] = new FuncDef(value);
      }
    }
    setFuncList(target);
    return true;
  },
  get: (target, property) => {
    if (property === 'push') {
      return (value) => {
        target[property].apply(target, [new FuncDef(value)]);
        setFuncList(target);
        return true;
      };
    } else {
      return target[property];
    }
  },
  getPrototypeOf(target) {
    return target.map((item) => {
      let retObj = item.object;
      retObj.def = item;
      return retObj;
    });
  },
  
});
let mediaTypeArray = {
  "queries": [],
  push : function (value){
    if(value instanceof MediaType){
      this.queries.push(value);
    }
  },
  remove: function (name){
    console.log(name)
    this.queries.forEach((element, idx) => {
      element.removeMethod(name);
      console.log(element)
    });
  },
  addMethodTo(queryName, method){
    this.queries.find((element) => {
      if(element.name == queryName){
        element.addMethod(method);
        return true;
      }
    })
  },
  newQuery: function (name, mediaString){
    this.queries.push(new MediaType(name, mediaString));
  },
  queryHasMethod(queryName, methodName){
    let query = this.queries.find((element) => {
      if(element.name == queryName){
        return true;
      }
    });
    if(query != undefined){
      return query.hasMethod(methodName);
    }
  }
  
};
const callCalc = (arry) => new Promise((res, rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
        channel.port1.close();
        if (data.error) {
            rej(data.error);
        } else {
            res(data.result);
        }
    };

    calcWorker.postMessage(arry, [channel.port2]);
});
if (localStorage.getItem("settings") != undefined) {
    settings = JSON.parse(localStorage.getItem("settings"));
} else {
    localStorage.setItem("settings", '{"version": 1,"degRad": true,"notation": "simple","theme": "darkMode","acc":"blue","tC" : 5,"tMin" : -10,"tMax" : 10,"gR" : 100,"gMin" : -10,"gMax" : 10}');
    settings = JSON.parse(localStorage.getItem("settings"));
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
        return accent.val;
      }
    }
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
          return [settings.p, settings.acc, settings.s, settings.t]
        }
      }
    ];
}
function generateUniqueKey() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    key += characters[randomIndex];
  }
  return key;
}
function setSettings() {
    let themes = getThemes();
  
    for (let theme of themes) {
      if (theme.name == settings.theme) {
        colorArray = theme.getMth();
        themeElem = theme;
      }
    }
    let rootCss = document.querySelector(':root');
    rootCss.style.setProperty('--secondary', colorArray[2]);
    rootCss.style.setProperty('--accent', colorArray[1]);
    rootCss.style.setProperty('--primary', colorArray[0]);
    rootCss.style.setProperty('--text', colorArray[3]);
    TextColorGlobal = colorArray[3];
    if (!settings.degRad) {
      setDegMode();
    }
    document.getElementById('graphDStep').value = settings.gR;
    document.getElementById('domainBottomG').value = settings.gMin;
    document.getElementById('domainTopG').value = settings.gMax;
    document.getElementById('rMinT').value = settings.tMin;
    document.getElementById('rMaxT').value = settings.tMax;
    document.getElementById('tableCells').value = settings.tC;
    callCalc({ 'set': 'settings', 'settings': settings });
    /*if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      colorMessager.postMessage(colorArray[0]);
    }*/
}
function funcCompressor(){}
function funcDecompressor(func){
  let funcObject = {};
  if(func[0] == 'f'){
    funcObject.type = "Function";
  }else if (func[0] == 'c'){
    funcObject.type = "Code";
  }else{
    funcObject.type = "Hybrid";
  }
  func = func.substring(func.indexOf('»') + 1);
  funcObject.name = func.substring(0, func.indexOf('»'));
  func = func.substring(func.indexOf('»') + 1);
  funcObject.text = func.substring(0, func.indexOf('»'));
  return funcObject;
}
//Responsible for getting the func list from local Storage
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
    finalArray.push(new FuncDef(func));
  }
  return finalArray;
}
function setFuncList(array) {
  let parseString = "";
  for (let item of array) {
    parseString += item.compressed + "⥾";
  }
  localStorage.setItem("funcList", parseString);
}
