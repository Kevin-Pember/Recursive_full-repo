var settings;
let calcWorker = new Worker('evalWorker.js');
let envObject = {
  funcButtons: [],
  inputs: [],
  keypads: [],
}
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
    if (!settings.degRad) {
      setDegMode();
    }
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