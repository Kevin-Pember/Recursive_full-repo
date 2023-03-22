let defStyle = `
.svgText {
    fill: var(--textColor);
  }
  
  .settingCircle {
    fill: var(--textColor)
  }
  
  .primary {
    fill: var(--functionsColor);
  }
  
  .secondary {
    fill: var(--displayColor);
  }
  
  .accent {
    fill: var(--numbersColor);
  }
  
  .text {
    fill: var(--textColor);
    color: var(--textColor);
  }
`;
let colorArray = [];

function setFocus(node, index) {
    console.log("focus Modified")
    console.log(index)
    let sel = window.getSelection();
    let range = document.createRange();
    range.setStart(node, index);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    console.log(arguments)
    if (arguments[2] != undefined) {
        console.log("Changing Selection")
        console.log(arguments[2])
        arguments[2].setSelection(range)
        console.log(arguments[2].getSelection())
    }
}
var repeater;
function buttonMapper(elemArray) {
    for (let elem of elemArray) {
        let elemDef = elem.def
        if (elemDef == undefined) {
            console.log(elem)
        }
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
function getCSS(value) {
    return getComputedStyle(document.documentElement).getPropertyValue(value);
}
function setSetting(name) {
    switch (name) {
        case ("degRad"):
            settings.degRad = arguments[1];
            break;
        case ("accentColor"):
            settings.acc = arguments[1];
            break;
        case ("primaryColor"):
            settings.p = arguments[1];
            break;
        case ("secondaryColor"):
            settings.s = arguments[1];
            break;
        case ("textColor"):
            settings.t = arguments[1];
            break;
        case ("graphMin"):
            settings.gMin = arguments[1];
            break;
        case ("graphMax"):
            settings.gMax = arguments[1];
            break;
        case ("graphRes"):
            settings.gR = arguments[1];
            break;
        case ("tableMin"):
            settings.tMin = arguments[1];
            break;
        case ("tableMax"):
            settings.tMax = arguments[1];
            break;
        case ("tableCells"):
            settings.tC = arguments[1];
            break;
        case ("theme"):
            settings.theme = arguments[1];
            break;
    }
    localStorage.setItem("settings", JSON.stringify(settings));
}
function createGraph(chart) {
    let defChart = new Chart(chart, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    id: "base",
                    data: [],
                    label: "hidden",
                    fontColor: getCSS("--numbersColor"),
                    borderColor: getCSS("--numbersColor"),
                    backgroundColor: getCSS("--numbersColor"),
                    showLine: true,
                    pointRadius: 0,
                },
                {
                    id: "extrema",
                    data: [],
                    label: "hidden",
                    fontColor: getCSS("--numbersColor"),
                    borderColor: getCSS("--numbersColor"),
                    backgroundColor: getCSS("--numbersColor"),
                    showLine: false,
                    pointRadius: 5,
                }
            ]
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
                        min: settings.gMin,
                        max: settings.gMax,
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
            hover: {
                intersect: false,
                mode: 'nearest',
                axis: 'xy',
            },
            animation: {
                duration: 0
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                zoom: {
                    animation: {
                        duration: 0
                    },
                    limits: {
                    },
                    pan: {
                        speed: 100,
                        enabled: true,
                        mode: 'xy',
                    },
                    zoom: {
                        speed: 100,
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
    return defChart;
}
function recursiveTable(target, colArry) {
    let accents = [
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
    let elem = colArry[0]
    let equat = elem.equat;
    queryVars(equat).then((value) => {
        let vars = value;
        if (vars.length <= 1) {
            let parsedEquation = equat;
            let varPoses = vars[0].positions.reverse()
            for (let pos of varPoses) {
                parsedEquation = parsedEquation.replaceAt('Æ', pos, pos + 1)
            }
            getPoints('table', parsedEquation).then(value => {
                let table = target.childNodes[0];
                let titleRow = table.querySelector('#titleRow');
                let titleHeader = document.createElement("TH");
                titleHeader.innerHTML = elem.name
                titleHeader.style.color = accents[parseInt(Math.random() * 11)]
                titleRow.appendChild(titleHeader)
                let rows = table.querySelectorAll('.tableRow')
                let xDef = table.querySelectorAll('.xTDef')
                if (rows.length != value.length || compareTable(xDef, value)) {
                    xDef.forEach(value => { table.removeChild(value) })
                    if (rows.length != value.length) {
                        let greater = value.length > rows.length
                        if (greater) {
                            for (let i = rows.length > 0 ? rows.length - 1 : 0; i < value.length; i++) {
                                let tableRow = document.createElement('tr');
                                tableRow.className = "tableRow"
                                tableRow.id = `row${i + 1}`
                                table.appendChild(tableRow)
                            }
                        } else {
                            for (let i = rows.length; i > value.length - 1; i--) {
                                table.removeChild(table.querySelector(`#row${1}`))
                            }
                        }
                        rows = table.querySelectorAll('.tableRow');
                    }
                }
                value.forEach((sValue, idx) => {
                    let elem = document.createElement('td')
                    elem.innerHTML = sValue.y
                    console.log(rows)
                    rows[idx].appendChild(elem)
                })
                if (colArry.length != 1) {
                    colArry.shift();
                    recursiveTable(target, colArry)
                }
            })

        } else {
            report(`${equat} needs single variable`, false)
        }
    })
}
function getGraphVars(chart) {
    let varArray = {}
    varArray = {
        "gMin": chart.scales.x == undefined ? settings.gMin : Number(chart.scales.x.min),
        "gMax": chart.scales.x == undefined ? settings.gMax : Number(chart.scales.x.max),
        'gR': settings.gR
    }
    return varArray
}
function getRandomColor() {
    var letters = '23456789ABCD';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}
function createTab(name, buttonList) {
    let newTab = document.createElement('tab-page');
    newTab.setAttribute('name', name);
    newTab.setAttribute('type', 'template');
    let newTemplate = document.createElement('template-func');
    newTemplate.setAttribute('name', name);
    newTemplate.buttonList = buttonList;
    newTab.appendChild(newTemplate);
    envObject.mainTabMenu.appendChild(newTab);
}
function changeButtons(name, defObject) {
    let target = envObject.funcButtons.find(value => value.name == name);
    target.name = name
    for (let button of target.defs) {
        button.nameLabel.innerHTML = defObject.name;
        button.equationLabel.innerHTML = defObject.text;
    }
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
    console.log(elements)
    for (let element of elements) {
        console.log(element)
        element.style.visibility = "inherit";
        element.style.animation = "0.15s ease-in 0s 1 normal forwards running fadeEffect"
        setTimeout(() => {
            element.style.animation = undefined;
        }, 150);
    }
}
function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')
}
class EquatInput extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
        .svgText {
            fill: var(--textColor);
        }
        #containerDiv{
            height: inherit;
            width: 100%;
            overflow: inherit;
            margin: 0;
            display: grid;
            grid-template-columns: 100%;
            grid-template-areas: "content errIcon";
            position: relative;
            justify-content: space-evenly;
            justify-items: center;
            align-content: space-evenly;
            align-items: center;
        }
        #dynamicEquation{
            width: 100%;
            height: inherit;
            font-size: inherit;
            font-weight: inherit;
            text-indent: inherit;
            direction: inherit;
            display: grid;
            align-content: center;
            grid-area: content;
            overflow-y: hidden;
            overflow-x: auto;
        }
        #errorIcon{
            height: 50px; 
            aspect-ratio: 1/1;
            grid-area: errIcon;
            visibility: hidden;
        }
        [placeholder]:empty:before {
            content: attr(placeholder);
        }
        
        [placeholder]:empty:focus:before {
            content: "";
        }
        [contenteditable] {
            -webkit-user-select: text;
            user-select: text;
            border: none;
            outline:none;
        }
        </style>
        <div id="containerDiv">
            <div id="dynamicEquation" class="editDiv"
                contenteditable="true" value="" autofocus>‎</div>
            <svg id="errorIcon" style="isolation:isolate;" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">    
                <path d="m221.8 858.2c-175.62-175.62-175.62-460.78 0-636.4s460.78-175.62 636.4 0 175.62 460.78 0 636.4-460.78 175.62-636.4 0z" fill-opacity=".2"/>
                <rect x="477" y="172.3" width="126" height="548.83" class="svgText"/>
                <rect x="477" y="781.7" width="126" height="126" class="svgText"/>
            </svg>
        </div>`;
        this.container = this.shadowRoot.querySelector('#containerDiv');
        this.input = this.shadowRoot.querySelector("#dynamicEquation");
        this.errIcon = this.shadowRoot.querySelector("#errorIcon");
        this.styler = this.shadowRoot.querySelector("#styler");
    }
    get() {
        return this.shadowRoot.querySelector("#dynamicEquation").innerHTML;
    }
    set(val) {
        this.shadowRoot.querySelector("#dynamicEquation").innerHTML = val;
    }
    def() {
        return this.shadowRoot.querySelector("#dynamicEquation");
    }
    focus() {
        let lastChild = this.input.lastChild;
        setFocus(lastChild, lastChild.length, this.shadowRoot);
    }
    clear() {
        this.input.innerHTML = '‎';
        this.focus();
    }
    getSel() {
        const selection = this.shadowRoot.getSelection();
        return selection;
    }
    alert() {
        this.container.style = `
            grid-template-columns: calc(100% - 50px) 50px;
        `;
        this.errIcon.style = `
            visibility: inherit;
        `;
        this.input.addEventListener("input", () => {
            this.container.style = "";
            this.container.style = "";
        }, { once: true });
    }
    disable(type) {
        if (type) {
            this.input.setAttribute("contenteditable", "false");
        } else {
            this.input.setAttribute("contenteditable", "true");
        }
    }
    static get observedAttributes() {
        return ['innerStyle', 'placeholder', "id", "enabled", "mode"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute("innerStyle")) {
            this.shadowRoot.querySelector("#containerDiv").setAttribute("style", this.getAttribute("innerStyle"));
        }
        if (this.hasAttribute("placeholder")) {
            this.shadowRoot.querySelector("#dynamicEquation").setAttribute("placeholder", this.getAttribute("placeholder"));
        }
        if (this.hasAttribute('id')) {
            envObject.inputs.push(this);
        }
        if (this.hasAttribute('enabled')) {
            if (this.getAttribute('enabled') === "false") {
                this.shadowRoot.querySelector("#dynamicEquation").setAttribute("contenteditable", "false");
            } else {
                this.shadowRoot.querySelector("#dynamicEquation").setAttribute("contenteditable", "true");
            }
        }
        if (this.hasAttribute('mode')) {
            if (this.hasAttribute('mode') === "flex") {

            }
        }
    }
    connectedCallback() {
        setTimeout(() => {
            console.log(this.parentElement)
            if (typeof this.parentElement.defineClick !== "undefined" && this.mapped == undefined) {
                this.parentElement.defineClick(this.shadowRoot.querySelector("#dynamicEquation"));
                this.mapped = true;
            }
        });
    }
    get value() {
        return this.input.innerHTML.replaceAll('‎', '');
    }
}
customElements.define("rich-input", EquatInput);
class historyDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./styling/animations.css">
            <style>
              * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
                font-family: ubuntu;
                color: var(--textColor);
                -webkit-tap-highlight-color: transparent;
              }
              
              .imgDivClass {
                aspect-ratio: 1 / 1;
              }
              
              .svgText {
                fill: var(--textColor);
              }
              .secondary {
                fill: var(--displayColor);
              }
              
              .pane {
                border-radius: 25px;
                background-color: var(--functionsColor);
                filter: drop-shadow(-5px 5px 5px var(--translucent));
              }
              .historyDateHeader {
                border-radius: 25px;
                width: fit-content;
                margin-left: 5px;
                padding-left: 10px;
                padding-right: 10px;
                background-color: var(--numbersColor);
                color: var(--textColor);
              }
              
              #historyHeader {
                padding-top: 62.5px;
                margin-left: 5px;
                font-weight: lighter;
                font-size: 25px;
                color: var(--numbersColor);
                direction: ltr
              }
              
              #historyTimeSubHeader {
                padding-left: 10px;
                font-size: 20px;
                color: var(--textColor);
              }
              
              #previousEquation {
                padding-left: 10px;
                color: var(--numbersColor);
                font-size: 40px;
              }
              
              #uifCalculator::-webkit-scrollbar {
                width: 2vh;
              
              }
              
              #uifCalculator::-webkit-scrollbar-track {
                background: transparent;
                margin-bottom: 40px;
              }
              
              #uifCalculator::-webkit-scrollbar-thumb {
                width: 5;
                min-height: 30px;
                background: var(--translucent);
                border-radius: 10px;
              }
              
              #uifCalculator::-webkit-scrollbar-button:end:increment {
                height: 7px;
                display: block;
                background: transparent;
              }
              
              #uifCalculator::-webkit-scrollbar-button:start:increment {
                height: 7px;
                display: block;
                background: transparent;
              }
              
              [contenteditable] {
                outline: 0px solid transparent;
              }
              
              button:focus {
                outline: none;
              }
              
              .textOverlay {
                position: absolute;
                z-index: 1;
                background-color: transparent;
                color: var(--textColor);
                border: none;
                font-size: 15px;
              }
              
              .matchCircle {
                position: absolute;
                top: 3.33335px;
                left: 3.33335px;
                height: 33.3333px;
                width: 33.3333px;
                background-color: var(--translucent);
                text-align: center;
                justify-content: center;
                border-radius: 50%;
              }
              
              .memText {
                color: var(--textColor);
                position: absolute;
                text-align: center;
                width: 33px;
                height: 14px;
                top: 9.66665px;
                font-size: 12px;
              }
              
              #overlayContainer {
                width: calc(100% - 20px);
                height: fit-content;
                position: absolute;
                bottom: 10px;
                background-color: var(--displayColor);
                border-radius: 25px;
                padding: 5px;
                left: 10px;
              }
              
              #deleteHistory {
                top: 10px;
                left: 10px;
                z-index: 1;
                padding: 2.5px;
                border-radius: 50%;
                background-color: var(--displayColor);
                position: absolute;
              }
              
              #overlayDiv {
                height: 40px;
                width: 100%;
              }
              
              #MRCOverlay {
                height: 40px;
                width: 40px;
                left: 0px;
              }
              
              #MAddOverlay {
                height: 40px;
                width: 40px;
                left: 40px;
              }
              
              #memoryDiv {
                height: 40px;
                left: 80px;
                right: 80px;
                position: absolute;
              }
              
              #memoryTextBoarder {
                display: grid;
                text-align: center;
                left: 0;
                top: 3.33335px;
                background-color: var(--translucent);
                max-width: 100%;
                width: auto;
                position: absolute;
                overflow-x: hidden;
                border-radius: 25px;
                visibility: hidden;
                padding-left: 10px;
                padding-right: 10px;
                height: 33.3333px;
                text-align: center;
                align-content: center;
                font-size: 25px;
              }
              
              #leftOverlayNav {
                position: absolute;
                z-index: 1;
                right: 40px;
              }
              
              #rightOverlayNav {
                position: absolute;
                z-index: 1;
                right: 0px;
              }
              
              #displayClip {
                width: 100%;
                height: 100%;
                overflow: hidden;
                filter: drop-shadow(-5px 5px 5px var(--translucent));
              }
              
              .text-area {
                width: 100%;
                height: 100%;
                overflow-y: auto;
                overflow-x: hidden;
                padding-bottom: 70px;
                border: none;
                color: var(--textColor);
                background-color: transparent;
                position: absolute;
              }
              
              .text-area:focus {
                border: transparent;
              }
              
              #historyHeader {
                padding-top: 62.5px;
                margin-left: 5px;
                font-weight: lighter;
                font-size: 25px;
                color: var(--numbersColor);
                direction: ltr
              }
              
              #customFuncDisplay::-webkit-scrollbar-button:end:increment {
                height: 7px;
                display: block;
                background: transparent;
              }
              
              #customFuncDisplay::-webkit-scrollbar-button:start:increment {
                height: 7px;
                display: block;
                background: transparent;
              }
              
              ::-webkit-scrollbar {
                width: 10px;
              }
              
              ::-webkit-scrollbar-track {
                background: transparent;
              }
              
              ::-webkit-scrollbar-thumb {
                width: 5px;
                background: #00000080;
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
              
              #creatorEditor::-webkit-scrollbar-button:end:increment {
                height: 0px;
                background: transparent;
              }
              
              #creatorEditor::-webkit-scrollbar-button:start:increment {
                height: 0px;
                background: transparent;
              
              }
            </style>
            <div id="displayClip" class="pane">
                        <svg id="deleteHistory" class="imgDivClass" height='42.5px' style="isolation:isolate"
                        viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
                            <circle class="secondary" cx="540" cy="540" r="540" fill="#c3cfd9" vector-effect="non-scaling-stroke"/>
                            <path class="svgText" d="m220.71 323.67h-0.379c-0.025-0.738-0.037-1.476-0.037-2.217 0-79.517 143.26-144.08 319.7-144.08s319.7 64.558 319.7 144.08c0 0.741-0.012 1.479-0.037 2.217h-0.416c0.273 1.452 0.416 2.951 0.416 4.482v6.682c0 13.326-10.819 24.146-24.145 24.146h-591.08c-13.326 0-24.145-10.82-24.145-24.146v-6.682c0-1.531 0.142-3.03 0.416-4.482zm348.66 166.23c79.906 13.932 140.73 83.705 140.73 167.57 0 93.882-76.221 170.1-170.1 170.1s-170.1-76.221-170.1-170.1h44.259c0 69.445 56.381 125.82 125.82 125.82 69.445 0 125.82-56.38 125.82-125.82 0-59.326-41.147-109.12-96.436-122.37v30.921l-96.458-54.959 96.458-54.96v33.794zm230.7-93.91v435.66c0 39.169-27.662 70.97-61.734 70.97h-396.67c-34.072 0-61.734-31.801-61.734-70.97v-435.66h520.14z" fill="#fff" fill-rule="evenodd"/>
                        </svg>

                        <div id="uifCalculator" inputmode="none" class="text-area" name="uifCalculator" value="things"
                            autocorrect="off">
                            <h3 contenteditable="false" id="historyHeader">
                            </h3>
                            <template class="historyDateTemp">
                                <h3 class='historyDateHeader' id="header"></h3>
                                <br>
                            </template>
                            <template class="historyHeaders">
                                <h3 id='historyTimeSubHeader'></h3>
                                <h4 id='previousEquation'></h4>
                                <br>
                            </template>
                            <rich-input id="mainEntry" style="height: 47px; font-size: 40px; display: block; padding-left:10px;"></rich-input>
                        </div>
                        <div id="overlayContainer">
                            <div id="overlayDiv">
                                <button id="MRCOverlay" class="textOverlay" name="Memory recall / clear">
                                    <div class="matchCircle">
                                        <h3 class="memText">MRC</h3>
                                    </div>
                                </button>
                                <button id="MAddOverlay" class="textOverlay" name="Memory Add">
                                    <div class="matchCircle">
                                        <h3 class="memText">M+</h3>
                                    </div>
                                </button>
                                <div id="memoryDiv" name="Recorded Text">
                                    <div id="memoryTextBoarder">

                                    </div>
                                </div>
                                <button id="leftOverlayNav" class="arrows imgDivClass"
                                    style="height: 40px; background-color: transparent; border: none;">
                                    <svg name="backward" style="transform: rotate(180deg);isolation:isolate"
                                        viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="1080" height="1080" fill-opacity="0" />
                                        <circle cx="540" cy="540" r="450" fill-opacity=".2"
                                            vector-effect="non-scaling-stroke" />
                                        <path class="svgText"
                                            d="m648.99 620.2-186.73 186.73-80.256-80.257 186.73-186.73-186.61-186.61 80.256-80.256 186.61 186.61 0.011-0.01 80.256 80.256-0.011 0.01 0.132 0.132-80.256 80.256-0.132-0.132z" />
                                    </svg>
                                </button>
                                <button id="rightOverlayNav" class="arrows imgDivClass navLeft"
                                    style="height: 40px; background-color: transparent; border: none;">
                                    <svg name="forward" style="isolation:isolate" viewBox="0 0 1080 1080"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <rect width="1080" height="1080" fill-opacity="0" />
                                        <circle cx="540" cy="540" r="450" fill-opacity=".2"
                                            vector-effect="non-scaling-stroke" />
                                        <path class="svgText"
                                            d="m648.99 620.2-186.73 186.73-80.256-80.257 186.73-186.73-186.61-186.61 80.256-80.256 186.61 186.61 0.011-0.01 80.256 80.256-0.011 0.01 0.132 0.132-80.256 80.256-0.132-0.132z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
        `
        let calcBody = this.shadowRoot.querySelector('#uifCalculator');
        let enterContainer = this.shadowRoot.querySelector('#mainEntry');
        let enterHeader = enterContainer.input;
        let historyHeader = this.shadowRoot.querySelector('#historyHeader');
        let deleteHistoryButton = this.shadowRoot.querySelector('#deleteHistory');
        let MRCOverlay = this.shadowRoot.querySelector('#MRCOverlay');
        let MAddOverlay = this.shadowRoot.querySelector('#MAddOverlay');
        let leftNav = this.shadowRoot.querySelector('#leftOverlayNav');
        let rightNav = this.shadowRoot.querySelector('#rightOverlayNav');
        let memoryText = this.shadowRoot.querySelector('#memoryText');
        let memoryTextBoarder = this.shadowRoot.querySelector('#memoryTextBoarder');
        let isDown = false;
        let startX;
        let scrollLeft;

        historyHeader.innerHTML = localStorage.getItem("historyOut");
        calcBody.scrollTop = calcBody.scrollHeight;

        calcBody.addEventListener("click", (e) => {
            console.log(e.target.id)
            if (e.target.id != enterContainer.id) {
                console.log("ran")
                if (enterHeader.innerHTML.length == 0) {
                    let textNode = document.createTextNode("‎");
                    enterHeader.appendChild(textNode);
                }
                if (e.target.id == "previousEquation") {
                    console.log("pre caught")
                    let fullText = e.target.innerHTML;
                    let hisText = fullText.substring(fullText.indexOf("=") + 1);
                    this.addMemory(hisText);
                    this.scrollBottom();
                }
                this.scrollBottom();
            }
        });
        deleteHistoryButton.addEventListener("click", (e) => {
            this.deleteHistory();
        });
        MRCOverlay.addEventListener("click", () => {
            this.recallRemoveMemory(enterHeader.innerHTML);
        });
        MAddOverlay.addEventListener("click", () => {
            this.addMemory(enterHeader.innerHTML);
        });
        leftNav.addEventListener("click", (e) => {
            this.navigateButtons(false)
        });
        rightNav.addEventListener("click", (e) => {
            this.navigateButtons(true)
        });
        memoryTextBoarder.addEventListener('mousedown', (e) => {
            isDown = true;
            memoryTextBoarder.classList.add('active');
            startX = e.pageX - memoryTextBoarder.offsetLeft;
            scrollLeft = memoryTextBoarder.scrollLeft;
        });
        memoryTextBoarder.addEventListener('mouseleave', () => {
            isDown = false;
            memoryTextBoarder.classList.remove('active');
        });
        memoryTextBoarder.addEventListener('mouseup', () => {
            isDown = false;
            memoryTextBoarder.classList.remove('active');
        });
        memoryTextBoarder.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - memoryTextBoarder.offsetLeft;
            const walk = (x - startX) * 3;
            memoryTextBoarder.scrollLeft = scrollLeft - walk;
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
        enterHeader.addEventListener("input", (e) => {
            let text = enterHeader.innerHTML;
            for (let item of letToSybol) {
                for (let letItem of item.lets) {
                    if (text.includes(letItem)) {
                        text = text.replace(letItem, item.symbol);
                        enterHeader.innerHTML = text;
                        console.log("focus Modified")
                        let sel = window.getSelection();
                        let range = document.createRange();
                        enterHeader.childNodes
                        break;
                    }
                }
            }
        });
        calcBody.defineClick = (elem) => {
            elem.addEventListener("focus", () => {
                this.scrollBottom();
            })
        }
        envObject.inputs.push(this);
        this.calcBody = calcBody;
        this.historyHeader = historyHeader;
        this.enterContainer = enterContainer;
        this.enterHeader = enterHeader;
        this.memoryTextBoarder = memoryTextBoarder;
    }
    static get observedAttributes() {
        return ['style'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
    }
    connectedCallback() {
        setTimeout(() => {
            this.scrollBottom();
        });
    }
    addHistory(equation) {
        let dates = this.shadowRoot.querySelectorAll('.historyDateHeader');
        let clon = this.shadowRoot.querySelector(".historyHeaders").content.cloneNode(true);
        let preEquat = clon.getElementById('previousEquation');

        if (dates.length == 0 || dates[dates.length - 1].innerHTML != getDate()) {
            let clon = this.shadowRoot.querySelector(".historyDateTemp").content.cloneNode(true);
            clon.getElementById('header').innerHTML = getDate();
            this.historyHeader.appendChild(clon);
        }
        clon.getElementById('historyTimeSubHeader').innerHTML = getTime();
        inputSolver(equation, 'Issue calculating for history').then((value) => {
            console.log(value)
            preEquat.innerHTML = equation + "=" + value;
            localStorage.setItem("historyOut", this.historyHeader.innerHTML);
        })
        this.historyHeader.appendChild(clon);
    }
    deleteHistory() {
        this.historyHeader.innerHTML = "";
        localStorage.setItem("historyOut", this.historyHeader.innerHTML);
    }
    addMemory(equation) {
        console.log(equation)
        let memoryText = this.memoryTextBoarder
        let memoryTextBoarder = this.memoryTextBoarder
        //memoryTextBoarder.style.visibility = "inherit";
        pullUpElements([memoryTextBoarder]);
        if (equation != '') {
            inputSolver(equation, "error adding to memory").then((value) => { memoryText.innerHTML = value })
        } else {
            memoryText.innerHTML = "0";
        }

    }
    recallRemoveMemory(equation) {
        let memoryText = this.memoryTextBoarder;
        let enterHeader = this.enterHeader;
        let memoryTextBoarder = this.memoryTextBoarder;
        let mrmText = memoryText.innerHTML;
        if (mrmText == equation.substring(equation.length - mrmText.length)) {
            hideElements([memoryTextBoarder]);
            memoryText.innerHTML = "";
        } else {
            enterHeader.innerHTML = enterHeader.innerHTML + memoryText.innerHTML;
        }
    }
    scrollBottom() {
        this.calcBody.scrollTop = this.calcBody.scrollHeight;
    }
    navigateButtons(direction) {
        console.log("Nav button pressed")
        let sel = this.enterContainer.getSel();
        let baseNode = sel.baseNode;
        let baseOffset = sel.baseOffset;
        let extentNode = sel.extentNode;
        let extentOffset = sel.extentOffset;
        let childNodes = this.enterHeader.childNodes;
        var nodes = [].slice.call(childNodes);
        let inverse = nodes.indexOf(baseNode) > nodes.indexOf(extentNode) ? false : true;
        let elem = undefined;
        let index = undefined;
        if (direction) {
            elem = inverse ? baseNode : extentNode;
            index = inverse ? baseOffset : extentOffset;
        } else {
            elem = !inverse ? baseNode : extentNode;
            index = !inverse ? baseOffset : extentOffset;
        }
        let elemString = elem.textContent;
        if ((index == 1 && direction == false) || (index == elemString.length && direction == true)) {
            this.recursiveNode(direction, elem)
        } else {
            direction ? setFocus(elem, index + 1, this.enterContainer.shadowRoot) : setFocus(elem, index - 1, this.enterContainer.shadowRoot);
        }
    }
    recursiveNode(dire, elem) {
        let parent = elem.parentNode;
        let childNodes = parent.childNodes;
        var nodes = [].slice.call(childNodes);
        if (((nodes.indexOf(elem) == nodes.length - 1 && parent != this.enterHeader) && dire == true) || ((nodes.indexOf(elem) == 0 && parent != this.enterHeader) && dire == false)) {
            recursiveNode(dire, parent)
        } else if (parent == this.enterHeader && (nodes.indexOf(elem) == nodes.length - 1 || nodes.indexOf(elem) == 0)) {
            nodes.indexOf(elem) == nodes.length - 1 ? setFocus(elem, elem.textContent.length, this.enterContainer.shadowRoot) : setFocus(elem, 1, this.enterContainer.shadowRoot)
        } else {
            nextText(dire, parent, elem)
        }
    }
}
customElements.define("history-display", historyDisplay);
class FuncButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./styling/animations.css">
        <style>
          
          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
            font-family: ubuntu;
            color: var(--textColor);
            -webkit-tap-highlight-color: transparent;
          }
          #customFuncButton{
            height: 100%;
            width: 100%;
            border: none;
            background-color: transparent;
          }
          .svgText {
            fill: var(--textColor);
          }
          #nameLabel {
            transition:  0.5s;
            transition-property: bottom, font-size;
          }
            #removeFunc {
                height: 75px;
                width: 75px;
                position: absolute;
                top: 0;
                right: calc(50% - 37.5px);
                visibility: hidden;
            }
        </style>
        <button id="customFuncButton">
            <h2 id="equationLabel"></h2>
            <h5 id="nameLabel"></h5>
            <svg id="removeFunc" viewBox="0 0 1080 1080"
                xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="m221.8 858.2c-175.62-175.62-175.62-460.78 0-636.4s460.78-175.62 636.4 0 175.62 460.78 0 636.4-460.78 175.62-636.4 0z"
                        fill-opacity=".2" />
                    <path class="svgText"
                        d="m457.47 540-137.54 137.55 82.527 82.527 137.55-137.54 137.55 137.54 82.527-82.527-137.54-137.55 137.54-137.55-82.527-82.527-137.55 137.54-137.55-137.54-82.527 82.527 137.54 137.55z" />
            </svg>
        </button>
        `;
        this.buttonNode = this.shadowRoot.querySelector("#customFuncButton");
        this.removeSVG = this.shadowRoot.querySelector("#removeFunc");
        this.nameLabel = this.shadowRoot.querySelector("#nameLabel");
        this.equationLabel = this.shadowRoot.querySelector("#equationLabel");
        this.removeActive = false;

        this.buttonNode.addEventListener('click', (e) => {
            if (this.removeActive == false) {
                let funcName = this.nameLabel.innerHTML;
                if (!envObject.mainTabMenu.hasTab(funcName)) {
                    createTab(this.name, this.copies)
                } else {
                    envObject.mainTabMenu.openTabByName(this.name);
                }
            } else {
                envObject.confirmPopup.open("Are you sure you want to delete this Function?", () => {
                    funcRemove(buttonNode);
                });
            }
        });

    }
    setRemove() {
        if (!this.removeActive) {
            console.log('setting remove')
            pullUpElements([this.removeSVG])
            hideElements([this.equationLabel])
            this.nameLabel.style = "bottom: 0; position: absolute; font-size: 20px; width: 100%;";
            this.removeActive = true;
        } else {
            console.log('setting remove')
            pullUpElements([this.equationLabel])
            hideElements([this.removeSVG])
            this.nameLabel.style = "";
            this.removeActive = false;
        }
    }
    static get observedAttributes() {
        return ['name', 'equation'];
    }
    attributeChangedCallback() {
        this.name = this.hasAttribute("name") ? this.getAttribute("name") : "New Function";
        this.shadowRoot.querySelector("#nameLabel").innerHTML = this.name;
        this.equation = this.hasAttribute("equation") ? this.getAttribute("equation") : "x";
        this.shadowRoot.querySelector("#equationLabel").innerHTML = this.equation;
    }
}
customElements.define("func-button", FuncButton);
class advTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
            #table{
                border-spacing: 5px;
                width: 100%;
                height: 100%;
            }
            td {
                border-radius: 20px;
                text-indent: 10px;
                padding: 5px;
                background-color: var(--displayColor);
            }
            th {
                width: 100px;
                margin: 5px;
                background-color: var(--numbersColor);
                border-radius: 20px;
            }
            </style>
            <table id="table">
                <tBody id="tableBody">
                <tr id="headerRow">
                    <th class="filler">x</th>
                    <th class="filler">y</th>
                </tr>
                </tBody>
            </table>
        `
        this.table = this.shadowRoot.querySelector("#tableBody");
        this.headerRow = this.shadowRoot.querySelector("#headerRow");
    }
    addData(tableEntry) {
        console.log("data added")
        if (tableEntry != undefined) {
            if (this.shadowRoot.querySelectorAll(".filler")) {
                this.shadowRoot.querySelectorAll(".filler").forEach((elem) => {
                    elem.remove();
                });
            }
            let columnCount = this.shadowRoot.querySelectorAll(".tableHeader").length;
            let rowCount = this.shadowRoot.querySelectorAll(".tableRow").length;
            let entryHeader = document.createElement("th");
            entryHeader.classList.add("tableHeader");
            entryHeader.innerHTML = `y<sup>${columnCount}</sup>`;
            entryHeader.style.backgroundColor = arguments[1] ? arguments[1] : "";
            this.headerRow.appendChild(entryHeader);
            if (rowCount != tableEntry) {
                let removeElems = this.shadowRoot.querySelectorAll(".tableRow");
                for (let elem of removeElems) {
                    elem.remove();
                }
                if (!this.shadowRoot.querySelector("#xHeader")) {
                    let xHeader = document.createElement("th");
                    xHeader.id = "xHeader";
                    xHeader.innerHTML = "x";
                    this.headerRow.prepend(xHeader);

                }
                for (let i = 0; i < tableEntry.length; i++) {
                    let row = document.createElement("tr");
                    row.id = "row" + i;
                    row.classList.add("tableRow");
                    row.innerHTML = `<td>${tableEntry[i].x}</td>`
                    this.table.appendChild(row);
                }
            }
            tableEntry.forEach((entry, index) => {
                let targetRow = this.shadowRoot.querySelector("#row" + index);
                targetRow.innerHTML += `<td>${entry.y}</td>`;
            });
        }
    }
    clearTable() {
        this.table.innerHTML = `<tr id="headerRow">
            <th class="filler">x</th>
            <th class="filler">y</th>
        </tr>`;
        this.headerRow = this.shadowRoot.querySelector("#headerRow");
    }
}
customElements.define("adv-table", advTable);
class inputMethod extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.firstTargets = {};
        this.keyTargets = {}
        this.linkedElems = [];
        envObject.keypads.push(this);
    }
    frontButtonPressed(input) {
        let display = this.keyTargets.input.input;
        let inputShadow = this.keyTargets.input.shadowRoot;
        let sel = this.getInputSel();
        let index = 0;
        let targetChild = undefined;
        let higher = 0;
        let lower = 0;
        if (sel.anchorOffset > sel.focusOffset) {
            higher = sel.anchorOffset;
            lower = sel.focusOffset;
        } else {
            higher = sel.focusOffset;
            lower = sel.anchorOffset;
        }
        if (display.contains(sel.focusNode) && sel.focusNode != null) {
            let appendString = sel.focusNode.nodeValue.substring(0, lower) + input;
            sel.focusNode.nodeValue = appendString + sel.focusNode.nodeValue.substring(higher);
            targetChild = sel.focusNode;
            index = appendString.length;
        } else {
            display.innerHTML = display.innerHTML + input;
            targetChild = display.childNodes[0];
            index = input.length + 1;
        }
        setFocus(targetChild, index, inputShadow);
        this.keyTargets.scroll.scrollTop = this.keyTargets.scroll.scrollHeight;
    }
    attributesMethod() {
        this.keyTargets.scroll = envObject.inputs.find((elem) => elem.id === this.getAttribute("history"));
        this.keyTargets.input = envObject.inputs.find((elem) => elem.id === this.getAttribute("input"));
        if (this.firstTargets.scroll == undefined) {
            this.firstTargets.scroll = document.getElementById(this.getAttribute("history"));
        }
        if (this.firstTargets.input == undefined) {
            this.firstTargets.input = document.getElementById(this.getAttribute("input"))
        }
        if (this.hasAttribute('linked')) {
            let linkedString = this.getAttribute("linked");
            if (linkedString.includes(',')) {
                let linkedArry = linkedString.split(',');
                this.linkedElems = linkedArry;
            } else {
                this.linkedElems = [];
                this.linkedElems.push(linkedString);
            }
            this.linkedElems.forEach((elem) => {
                let target = envObject.keypads.find((element) => element.id == elem);
                target.setAttribute("input", this.getAttribute("input"));
                target.setAttribute("history", this.getAttribute("history"));
            });
        }
    }
    clearMain() {
        this.keyTargets.input.clear();
        console.log(this.keyTargets.input)
    }
    //Responsible for handling trig button presses
    trigPressed(event) {
        let eventTarget = event.target;
        this.frontButtonPressed(eventTarget.innerHTML + "(");
    }
    //Responsible for inverse settings on main calc bittons (main input)
    setInverse() {
        let trig = [{ "base": "sin", "inverse": "csc" }, { "base": "cos", "inverse": "sec" }, { "base": "tan", "inverse": "cot" }];
        let trigElements = [
            {
                type: "keypad",
                trigButtons: ['sinPopup', 'cosPopup', 'tanPopup'],
                trigSwitches: ['invPopup']
            },
            {
                type: "exKeypad",
                trigButtons: ['sinEx', 'cosEx', 'tanEx'],
                trigSwitches: ['invEx']
            }
        ];
        let target = this.shadowRoot.querySelector('#keypad') ? trigElements[0] : trigElements[1];
        let arc = false;
        let text = "";
        let searchElems = [];
        if (this.linkedElems.length > 0) {
            this.linkedElems.forEach((elem) => {
                searchElems.push(document.getElementById(elem));
            });
        }
        searchElems.push(this);

        if (this.shadowRoot.querySelector("#" + target.trigButtons[0]).innerHTML.substring(0, 1) == "a") {
            arc = true;
        }
        //sets the text of inv buttons 
        if (this.shadowRoot.querySelector("#" + target.trigSwitches[0]).innerHTML == "inv") {
            text = "reg"
        } else {
            text = "inv"
        }
        for (let elem of searchElems) {
            let tempTarget = elem.shadowRoot.querySelector('#keypad') ? trigElements[0] : trigElements[1];
            elem.shadowRoot.querySelector("#" + tempTarget.trigSwitches[0]).innerHTML = text;
            console.log(tempTarget)
            //sets the text of trig buttons based on values
            for (let id of tempTarget.trigButtons) {
                console.log(id)
                let elemText = elem.shadowRoot.querySelector("#" + id).innerHTML;
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
                elem.shadowRoot.querySelector("#" + id).innerHTML = outText;
            }
        }
    }
    //Responsible for arc settings on main calc buttons (main input)
    setArc() {
        let trigElements = [
            {
                type: "keypad",
                trigButtons: ['sinPopup', 'cosPopup', 'tanPopup'],
                trigSwitches: ['arcPopup']
            },
            {
                type: "exKeypad",
                trigButtons: ['sinEx', 'cosEx', 'tanEx'],
                trigSwitches: ['arcEx']
            }
        ];
        let target = this.shadowRoot.querySelector('#keypad') ? trigElements[0] : trigElements[1];
        let arc = false;
        let shadowRef = this.shadowRoot;
        let searchElems = [];
        if (this.linkedElems.length > 0) {
            this.linkedElems.forEach((elem) => {
                searchElems.push(document.getElementById(elem));
            });
        }
        searchElems.push(this);
        if (this.shadowRoot.querySelector("#" + target.trigButtons[0]).innerHTML.substring(0, 1) == "a") {
            arc = true;
        }
        for (let elem of searchElems) {
            let tempTarget = elem.shadowRoot.querySelector('#keypad') ? trigElements[0] : trigElements[1];
            console.log(tempTarget);
            elem.shadowRoot.querySelector("#" + tempTarget.trigSwitches[0]).innerHTML = arc ? "arc" : "deg";
            for (let id of tempTarget.trigButtons) {
                if (elem.shadowRoot.querySelector("#" + id) != undefined) {
                    let text = shadowRef.querySelector("#" + id).innerHTML;
                    if (!arc) {
                        elem.shadowRoot.querySelector("#" + id).innerHTML = "a" + text;
                    } else {
                        elem.shadowRoot.querySelector("#" + id).innerHTML = text.substring(1);
                    }
                }
            }
        }

    }
    setDegMode() {
        let degRad = settings.degRad;
        let trigElements = [
            {
                type: "keypad",
                trigSwitches: ['degPopup']
            },
            {
                type: "exKeypad",
                trigSwitches: ['degEx']
            }
        ];
        let searchElems = [];
        if (this.linkedElems.length > 0) {
            this.linkedElems.forEach((elem) => {
                searchElems.push(document.getElementById(elem));
            });
        }
        searchElems.push(this);
        console.log(searchElems[0].shadowRoot)
        let text = degRad ? "rad" : "deg";
        settings.degRad = !degRad;
        for (let elem of searchElems) {
            let tempTarget = elem.shadowRoot.querySelector('#keypad') ? trigElements[0] : trigElements[1];
            tempTarget.shadowRoot.querySelector("#" + trigSwitches[0]) = text;
        }

    }
    getInputSel() {
        console.log(this.keyTargets.input)
        return this.keyTargets.input.getSel();
    }
}
class Keypad extends inputMethod { //Keypad class

    constructor() {
        super();

        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./styling/animations.css">
        <style>
        #extraFuncPopUp {
            height: 100%;
            width: 100%;
            top: 100%;
            display: block;
            position: absolute;
            z-index: 1;
            visibility: inherit;
        }
        #keypad {
            height: 100%;
            width: 100%;
            overflow: hidden;
            filter: drop-shadow(-5px 5px 5px var(--translucent));
        }
        #mainCacGrid {
            position: absolute;
            width: 100%;
            height: 100%;
            display: grid;
            grid-gap: 0px 0px;
            margin: 0px;
            grid-template-columns: 25% 25% 25% 25%;
            grid-template-rows: 16.6666% 16.6666% 16.6666% 16.6666% 16.6666% 16.6666%;
            background-color: #00000000;
            grid-template-areas:
                "num1 num2 num3 moreFuncBut"
                "num4 num5 num6 backspace"
                "num7 num8 num9 plus"
                "pi num0 point minus"
                "percent pars pow mutiplication"
                "enter pow2 sqrt division";
        }
    
        #num1 {
            border-radius: 15px 0 0 0;
        }
    
        #num3 {
            border-radius: 0 15px 0 0;
        }
    
        #piButton {
            border-radius: 0 0 0 15px;
        }
    
        #pointButton {
            border-radius: 0 0 15px 0;
        }
    
        #moreFunctionsButton {
            height: 100%;
            width: 100%;
            font-size: 15px;
            color: var(--textColor);
            background-color: var(--functionsColor);
            text-align: center;
            text-indent: -30px;
            border-style: none;
            position: relative;
            grid-area: moreFuncBut;
        }
    
        #arrowIcon {
            transform: rotate(270deg);
            visibility: inherit;
            top: 5px;
            right: 5px;
            font-size: 15px;
            text-align: center;
            stroke: transparent;
            stroke-width: 0px;
            background-color: #00000000;
            position: absolute;
            z-index: 2;
            height: 40px;
            pointer-events: all;
        }
    
        #backspace {
            flex-shrink: 0;
            grid-area: backspace;
        }
    
        #backspaceDiv {
            display: flex;
        }
        #customFuncDisplayPopup {
      height: 33.3333%;
      width: 100%;
      top: 0;
      background-color: var(--numbersColor);
      border-radius: 15px;
      position: absolute;
      z-index: 1;
      overflow-x: auto;
      flex-wrap: nowrap;
      display: flex;
      flex-shrink: 0;
    }
    #custFuncGridPopup {
      position: absolute;
      left: 0;
      width: 100%;
      top: 40px;
      bottom: 10px;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 50%;
      overflow-x: auto;
      overflow-y: hidden;
    }
    .customButton {
        margin-left: 5px;
        position: relative;
        background-color: var(--displayColor);
        color: var(--textColor);
        width: calc(100% - 10px);
        z-index: 2;
        flex-shrink: 0;
        border: none;
        border-radius: 25px;
        top: 2.5%;
        height: 95%
      }
    #extraFuncPopUpGrid {
      position: absolute;
      height: 66.6666%;
      width: 100%;
      top: 33.3333%;
      display: grid;
      grid-gap: 0px 0px;
      margin: 0px;
      grid-template-columns: 25% 25% 25% 25%;
      grid-template-rows: 25% 25% 25% 25%;
      background-color: #00000000;
      grid-template-areas: 
      "help dToF vars ac"
      "log ln e fact"
      "deg arc inv abs"
      "sin cos tan mod"
      ;
    }
    .button-item {
        padding: 0px;
        height: 100%;
        width: 100%;
        font-size: 100%;
        position: absolute;
        background-color: var(--displayColor);
        text-align: center;
      }
      .keypadButton {
        overflow: hidden;
        text-align: center;
      }
      
      .keypadButton:after {
        content: "";
        background: transparent;
        position: absolute;
        display: block;
        top: 2.5px;
        left: 2.5px;
        border-radius: 25px;
        width: calc(100% - 5px);
        height: calc(100% - 5px);
        opacity: 0;
        z-index: 1;
        transition: all 0.5s ease
      }
      
      .keypadButton:active:after {
        transform: scale(0.5);
        background: var(--textColor);
        border-radius: 50%;
        margin-left: 25%;
        width: unset;
        aspect-ratio: 1/1;
        opacity: 0.2;
        transition: 0s
      }
      @font-face {
        font-family: ubuntu;
        src: url(../fontAssets/Roboto-Regular.ttf);
      }
      
      @font-face {
        font-family: ubuntu;
        src: url(../fontAssets/Roboto-Bold.ttf);
        font-weight: bold;
      }
      
      :root {
        --displayColor: #3d3d3d;
        --numbersColor: #15ad6e;
        --functionsColor: #1b1b1b;
        --textColor: #48fea6;
        --translucent: #00000033;
        --semi-transparent: #000000c5;
        --neutralColor: #80808080;
      }
      
      * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-family: ubuntu;
        color: var(--textColor);
        -webkit-tap-highlight-color: transparent;
      }
      
      body {
        background: var(--displayColor);
        overflow: hidden;
        position: absolute;
        left: 0;
        right: 0;
      }
      
      .imgDivClass {
        aspect-ratio: 1 / 1;
      }
      
      .svgText {
        fill: var(--textColor);
      }
      
      .pane {
        border-radius: 25px;
        background-color: var(--functionsColor);
        filter: drop-shadow(-5px 5px 5px var(--translucent));
      }
      
      /*********************************Injected css from mode***********************************/
      
      /*end*/
      
      #uifCalculator::-webkit-scrollbar-button:end:increment {
        height: 7px;
        display: block;
        background: transparent;
      }
      
      #uifCalculator::-webkit-scrollbar-button:start:increment {
        height: 7px;
        display: block;
        background: transparent;
      }
      
      button:focus {
        outline: none;
      }
      
      .fI {
        background-color: var(--displayColor);
      }
      
      .numsbutton {
        height: 100%;
        width: 100%;
        font-size: 20px;
        color: var(--textColor);
        background-color: var(--numbersColor);
        text-align: center;
        border-style: none;
      }
      
      .numsbutton:focus {
        outline: none;
        box-shadow: none;
      }
      
      .button-item {
        padding: 0px;
        height: 100%;
        width: 100%;
        font-size: 100%;
        position: absolute;
        background-color: var(--displayColor);
        text-align: center;
      }
      
      .funcbutton {
        height: 100%;
        width: 100%;
        font-size: 20px;
        color: var(--textColor);
        background-color: var(--functionsColor);
        text-align: center;
        border-style: none;
      }
      
      .specialElements {
        background-color: var(--functionsColor);
      }
      
      .funcbutton:focus {
        outline: none;
        box-shadow: none;
      }
      
      .keypadButton {
        overflow: hidden;
        text-align: center;
      }
      
      .keypadButton:after {
        content: "";
        background: transparent;
        position: absolute;
        display: block;
        top: 2.5px;
        left: 2.5px;
        border-radius: 25px;
        width: calc(100% - 5px);
        height: calc(100% - 5px);
        opacity: 0;
        z-index: 1;
        transition: all 0.5s ease
      }
      
      .keypadButton:active:after {
        transform: scale(0.5);
        background: var(--textColor);
        border-radius: 50%;
        margin-left: 25%;
        width: unset;
        aspect-ratio: 1/1;
        opacity: 0.2;
        transition: 0s
      }
      
      .trigButton {
        height: 100%;
        width: 100%;
        font-size: 20px;
        color: var(--textColor);
        background-color: var(--functionsColor);
        text-align: center;
        border-style: none;
      }
      
      .addIcon {
        top: 5px;
        left: 5px;
        width: 40px;
        height: 40px;
        background-color: transparent;
        border: none;
        position: absolute;
      }
      
      .minusIcon {
        left: 45px;
        top: 5px;
        width: 40px;
        height: 40px;
        background-color: transparent;
        border: none;
        position: absolute;
      }
      
      .customFuncDisplayBackgroundPopup {
        height: 44.4444%;
        left: 0;
        top: 11.1111%;
        background-color: var(--functionsColor);
        position: relative;
        z-index: -1;
      }
      
      #extraFuncPopUpGrid {
        position: absolute;
        height: 66.6666%;
        width: 100%;
        top: 33.3333%;
        display: grid;
        grid-gap: 0px 0px;
        margin: 0px;
        grid-template-columns: 25% 25% 25% 25%;
        grid-template-rows: 25% 25% 25% 25%;
        background-color: #00000000;
        grid-template-areas:
          "help dToF vars ac"
          "log ln e fact"
          "deg arc inv abs"
          "sin cos tan mod"
        ;
      }
      
      #customFuncDisplay::-webkit-scrollbar-button:end:increment {
        height: 7px;
        display: block;
        background: transparent;
      }
      
      #customFuncDisplay::-webkit-scrollbar-button:start:increment {
        height: 7px;
        display: block;
        background: transparent;
      }
      
      ::-webkit-scrollbar {
        width: 10px;
      }
      
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      
      ::-webkit-scrollbar-thumb {
        width: 5px;
        background: #00000080;
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-button:end:increment {
        height: 7px;
        display: block;
        background: transparent;
      }
        </style>
        <style id="modeStyle"></style>
        <style id="dynamicStyle"></style>
        <style id="styleInjector"></style>
        <div id="keypad" class="pane" style="visibility: inherit;">
            <div id="mainCacGrid">
                <div id="specialElements button-item" name="1" class="button-item" style="grid-area: num1;">
                    <button class="numsbutton keypadButton" name="1" id="num1" focusable="false">1</button>
                </div>
                <div class="button-item" name="2" style="grid-area: num2;">
                    <button class="numsbutton keypadButton" id="num2">2</button>
                </div>
                <div class="specialElements button-item" style="grid-area: num3;">
                    <button class="numsbutton keypadButton" id="num3">3</button>
                </div>
                <div class="button-item fI" style="grid-area: moreFuncBut;">
                    <button id="moreFunctionsButton" class="keypadButton" tabindex="-1">More<br>Functions</button>
                    <svg id="arrowIcon" class="arrows imgDivClass" style="isolation:isolate" viewBox="0 0 1080 1080"
                        xmlns="http://www.w3.org/2000/svg">
                        <rect width="1080" height="1080" fill-opacity="0" />
                        <circle cx="540" cy="540" r="450" fill-opacity=".2" vector-effect="non-scaling-stroke" />
                        <path class="svgText"
                            d="m648.99 620.2-186.73 186.73-80.256-80.257 186.73-186.73-186.61-186.61 80.256-80.256 186.61 186.61 0.011-0.01 80.256 80.256-0.011 0.01 0.132 0.132-80.256 80.256-0.132-0.132z" />
                    </svg>
                </div>
                <div class="button-item" style="grid-area: num4;">
                    <button class="numsbutton keypadButton" id="num4">4</button>
                </div>
                <div class="button-item" style="grid-area: num5;">
                    <button class="numsbutton keypadButton" id="num5">5</button>
                </div>
                <div class="button-item" style="grid-area: num6;">
                    <button class="numsbutton keypadButton" id="num6">6</button>
                </div>
                <div class="button-item fI" id="backspaceDiv" style="grid-area: backspace;">
                    <button class="funcbutton keypadButton" id="backspace"
                        style="display: grid;justify-content: center;align-content: center;">
                        <svg id="backspcaeIcon" style="height: 20px; width: 40px;isolation:isolate" viewBox="0 0 1080 540"
                            xmlns="http://www.w3.org/2000/svg">
                            <rect width="1080" height="540" fill-opacity="0" />
                            <path class="svgText"
                                d="m657.21 270-147.56 147.13 37.394 37.284 147.56-147.13 147.56 147.13 37.395-37.284-147.56-147.13 147.56-147.13-37.395-37.284-147.56 147.13-147.56-147.13-37.394 37.284 147.56 147.13zm-231.69-247.29v-1.106l-403.92 248.4 403.92 248.4v-1.106c14.803 14.068 34.815 22.706 56.829 22.706h515.12c45.548 0 82.527-36.979 82.527-82.527v-374.95c0-45.548-36.979-82.527-82.527-82.527h-515.12c-22.014 0-42.026 8.638-56.829 22.706z"
                                fill-rule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div class="button-item" style="grid-area: num7;">
                    <button class="numsbutton keypadButton" id="num7">7</button>
                </div>
                <div class="button-item" style="grid-area: num8;">
                    <button class="numsbutton keypadButton" id="num8">8</button>
                </div>
                <div class="button-item" style="grid-area: num9;">
                    <button class="numsbutton keypadButton" id="num9">9</button>
                </div>
                <div class="button-item fI" style="grid-area: plus;">
                    <button class="funcbutton keypadButton" id="plus">+</button>
                </div>
                <div class="button-item specialElements" style="grid-area: pi;">
                    <button class="numsbutton keypadButton" id="piButton">π</button>
                </div>
                <div class="button-item" style="grid-area: num0;">
                    <button class="numsbutton keypadButton" id="num0">0</button>
                </div>
                <div class="specialElements button-item" style="grid-area: point;">
                    <button class="numsbutton keypadButton" id="pointButton">.</button>
                </div>
                <div class="button-item fI" style="grid-area: minus;">
                    <button class="funcbutton keypadButton" id="minus">-</button>
                </div>
                <div class="button-item fI" style="grid-area: percent;">
                    <button class="funcbutton keypadButton" id="percent">%</button>
                </div>
                <div class="button-item fI" style="grid-area: pars;">
                    <button class="funcbutton keypadButton" id="pars">( )</button>
                </div>
                <div class="button-item fI" style="grid-area: pow;">
                    <button class="funcbutton keypadButton" id="pow">^</button>
                </div>
                <div class="button-item fI" style="grid-area: mutiplication;">
                    <button class="funcbutton keypadButton" id="mutiplication">×</button>
                </div>
                <div class="button-item fI" style="grid-area: enter;">
                    <button class="funcbutton keypadButton" id="enter">enter</button>
                </div>
                <div class="button-item fI" style="grid-area: pow2;">
                    <button class="funcbutton keypadButton" id="pow2">x²</button>
                </div>
                <div class="button-item fI" style="grid-area: sqrt;">
                    <button class="funcbutton keypadButton" id="sqrt">√x</button>
                </div>
                <div class="button-item fI" style="grid-area: division;">
                    <button class="funcbutton keypadButton" id="divison">÷</button>
                </div>
            </div>
            <div id="extraFuncPopUp">
                <div id="customFuncDisplayPopup" data-element="popup">
                    <svg id="addIconPopup" class="addIcon imgDivClass" style="isolation:isolate" viewBox="0 0 1080 1080"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="m221.8 858.2c-175.62-175.62-175.62-460.78 0-636.4s460.78-175.62 636.4 0 175.62 460.78 0 636.4-460.78 175.62-636.4 0z"
                            fill-opacity=".2" />
                        <path class="svgText"
                            d="m481.64 598.36v194.52h116.71v-194.52h194.52v-116.71h-194.52v-194.52h-116.71v194.52h-194.52v116.71h194.52z" />
                    </svg>
                    <remove-icon id="minusIconPopup" class="minusIcon imgDivClass"></remove-icon>
                    <div id="custFuncGridPopup">
        
                    </div>
                </div>
                <div class="customFuncDisplayBackgroundPopup" width="100%">
                </div>
                <div id="extraFuncPopUpGrid">
                    <div class="button-item fI" style="grid-area: help;"><button class="funcbutton keypadButton" id="helpPopup"
                            style="display: grid;justify-content: center;align-content: center;">
                            <svg class="helpIcon imgDivClass" style="height: 30px;isolation:isolate" viewBox="0 0 45 45"
                                xmlns="http://www.w3.org/2000/svg">
                                <path class="svgText"
                                    d="m4 22.5c0-10.21 8.29-18.5 18.5-18.5s18.5 8.29 18.5 18.5-8.29 18.5-18.5 18.5-18.5-8.29-18.5-18.5zm20.474 6.395h-4.095q-0.016-0.883-0.016-1.076 0-1.991 0.659-3.276 0.658-1.284 2.633-2.89 1.976-1.606 2.361-2.104 0.594-0.787 0.594-1.734 0-1.317-1.052-2.257-1.052-0.939-2.834-0.939-1.718 0-2.875 0.979-1.156 0.98-1.59 2.987l-4.143-0.513q0.177-2.875 2.449-4.882 2.273-2.008 5.966-2.008 3.886 0 6.183 2.032 2.296 2.031 2.296 4.729 0 1.494-0.843 2.826-0.843 1.333-3.605 3.63-1.429 1.188-1.775 1.911-0.345 0.722-0.313 2.585zm0.418 6.071h-4.513v-4.513h4.513v4.513z"
                                    fill-rule="evenodd" />
                            </svg>
                        </button></div>
                    <div class="button-item" style="grid-area: dToF;"><button class="funcbutton keypadButton"
                            id="deciToFracPopup">d→f</button></div>
                    <div class="button-item" style="grid-area: vars;"><button class="funcbutton keypadButton"
                            id="keyboardPopup">xyz</button></div>
                    <div class="button-item" style="grid-area: ac;">
                        <button class="funcbutton keypadButton" id="acPopup">ac</button>
                    </div>
                    <div class="button-item" style="grid-area: log;"><button class="funcbutton keypadButton"
                            id="log10Popup">log<sub>10</sub></button></div>
                    <div class="button-item" style="grid-area: ln;">
                        <button class="funcbutton keypadButton" id="lnPopup">ln</button>
                    </div>
                    <div class="button-item" style="grid-area: e;">
                        <button class="funcbutton keypadButton" id="ePopup">e</button>
                    </div>
                    <div class="button-item fI" style="grid-area: fact;">
                        <button class="funcbutton keypadButton" id="factorialPopup">n!</button>
                    </div>
                    <div class="button-item fI" style="grid-area: deg;">
                        <button class="funcbutton keypadButton" id="degPopup">deg</button>
                    </div>
                    <div class="button-item fI" style="grid-area: arc;">
                        <button class="funcbutton keypadButton" id="arcPopup">arc</button>
                    </div>
                    <div class="button-item fI" style="grid-area: inv;">
                        <button class="funcbutton keypadButton" id="invPopup">inv</button>
                    </div>
                    <div class="button-item fI" style="grid-area: abs;">
                        <button class="funcbutton keypadButton" id="absPopup">|
                            |</button>
                    </div>
                    <div class="button-item fI" style="grid-area: sin;">
                        <button class="trigButton keypadButton" id="sinPopup">sin</button>
                    </div>
                    <div class="button-item fI" style="grid-area: cos;">
                        <button class="trigButton keypadButton" id="cosPopup">cos</button>
                    </div>
                    <div class="button-item fI" style="grid-area: tan;">
                        <button class="trigButton keypadButton" id="tanPopup">tan</button>
                    </div>
                    <div class="button-item fI" style="grid-area: mod;"><button class="funcbutton keypadButton"
                            id="modPopup">mod</button></div>
                </div>
            </div>
        
        </div>
        `;
        let keypadButtons = [
            {
                "def": this.shadowRoot.querySelector('#num1'),
                "name": "one",
                "function": () => {
                    this.frontButtonPressed('1');
                },
                "repeatable": true,
            },
            {
                "def": this.shadowRoot.querySelector('#num2'),
                "name": "two",
                "function": () => {
                    this.frontButtonPressed('2');
                },
                "repeatable": true,
            },
            {
                "def": this.shadowRoot.querySelector('#num3'),
                "id": 'num3',
                "name": "three",
                "function": () => {
                    this.frontButtonPressed('3');
                },
                "repeatable": true,
            },
            {
                "def": this.shadowRoot.querySelector('#moreFunctionsButton'),
                "id": 'moreFunctionsButton',
                "name": "Functions Page",
                "function": () => {
                    sessionStorage.setItem("facing", "moreFunctionsPage");
                    openPage(document.getElementById("moreFunctionsPage"));
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#arrowIcon'),
                "id": 'arrowIcon',
                "name": "More Functions Menu",
                "function": () => {
                    this.popup();
                    let display = this.keyTargets.input.input;
                    setSelect(display, display.lastChild.length);
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#num4'),
                "id": 'num4',
                "name": "four",
                "function": () => {
                    this.frontButtonPressed('4');
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#num5'),
                "id": 'num5',
                "name": "five",
                "function": () => {
                    this.frontButtonPressed('5');
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#num6'),
                "id": 'num6',
                "name": "six",
                "function": () => {
                    this.frontButtonPressed('6');
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#backspace'),
                "id": 'backspace',
                "name": "back space",
                "function": () => {
                    this.backPressed();
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#num7'),
                "id": 'num7',
                "name": "seven",
                "function": () => {
                    this.frontButtonPressed('7');
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#num8'),
                "id": 'num8',
                "name": "eight",
                "function": () => {
                    this.frontButtonPressed('8');
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#num9'),
                "id": 'num9',
                "name": "nine",
                "function": () => {
                    this.frontButtonPressed('9');
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#plus'),
                "id": 'plus',
                "name": "plus",
                "function": () => {
                    this.frontButtonPressed('+');
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#piButton'),
                "id": 'piButton',
                "name": "pie",
                "function": () => {
                    this.frontButtonPressed('π');
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#num0'),
                "id": 'num0',
                "name": "zero",
                "function": () => {
                    this.frontButtonPressed('0');
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#pointButton'),
                "id": 'pointButton',
                "name": "point",
                "function": () => {
                    this.frontButtonPressed('.');
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#minus'),
                "id": 'minus',
                "name": "minus",
                "function": () => {
                    this.frontButtonPressed('-');
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#percent'),
                "id": 'percent',
                "name": "percent",
                "function": () => {
                    this.frontButtonPressed('%');
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#pars'),
                "id": 'pars',
                "name": "Parenthesis",
                "function": () => {
                    this.parsMethod();
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#pow'),
                "id": 'pow',
                "name": "Parenthesis",
                "function": () => {
                    this.pow('1');
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#mutiplication'),
                "id": 'mutiplication',
                "name": "mutiplication",
                "function": () => {
                    this.frontButtonPressed('×');
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#enter'),
                "id": 'enter',
                "name": "enter",
                "function": () => {
                    let display = this.keyTargets.input.input;
                    this.enterPressed(display.innerHTML);
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#pow2'),
                "id": 'pow2',
                "name": "power of 2",
                "function": () => {
                    this.pow('2');
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#sqrt'),
                "id": 'sqrt',
                "name": "square root",
                "function": () => {
                    this.frontButtonPressed('√');
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#divison'),
                "id": 'divison',
                "name": "divison",
                "function": () => {
                    this.frontButtonPressed('÷');
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#addIconPopup'),
                "id": 'addIconPopup',
                "name": "add Custom Function",
                "function": () => {
                    let display = this.keyTargets.input.input;
                    if (display.innerHTML != "‎" && display.innerHTML != "") {
                        openPopup();
                    } else {
                        sessionStorage.setItem("facing", "creatorPage")
                        openPage(document.getElementById("custCreatorPage"))
                    }
                },
                "repeatable": false,
            },

            {

                "def": this.shadowRoot.querySelector('#minusIconPopup'),
                "id": 'minusIconPopup',
                "name": "remove Custom Function",
                "function": () => {
                    //method needs to be added
                },
                "repeatable": false,
            },

            {

                "def": this.shadowRoot.querySelector('#keyboardPopup'),
                "id": 'keyboardPopup',
                "name": "Open Keyboard",
                "function": () => {
                    let display = this.keyTargets.input.input;
                    let target = display;
                    target.setAttribute("inputmode", "text")
                    target.focus();
                    target.addEventListener("focusout", () => {
                        target.setAttribute("inputmode", "none")
                        target.removeEventListener(this)
                    })
                },
                "repeatable": false,
            },

            {

                "def": this.shadowRoot.querySelector('#acPopup'),
                "id": 'acPopup',
                "name": "Clear all",
                "function": () => {
                    this.clearMain();
                    this.keyTargets.scroll.scrollBottom();
                },
                "repeatable": false,
            },

            {

                "def": this.shadowRoot.querySelector('#deciToFracPopup'),
                "id": 'deciToFracPopup',
                "name": "decimal to fraction",
                "function": () => {
                    this.frontButtonPressed('d→f(');
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#helpPopup'),
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

                "def": this.shadowRoot.querySelector('#log10Popup'),
                "id": 'log10Popup',
                "name": "log ten",
                "function": () => {
                    this.frontButtonPressed('log₁₀(')
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#lnPopup'),
                "id": 'lnPopup',
                "name": "natural log",
                "function": () => {
                    this.frontButtonPressed('ln(');
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#ePopup'),
                "id": 'ePopup',
                "name": "Euler's number",
                "function": () => {
                    this.frontButtonPressed('e');
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#factorialPopup'),
                "id": 'factorialPopup',
                "name": "factorial",
                "function": () => {
                    this.frontButtonPressed('!');
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#degPopup'),
                "id": 'degPopup',
                "name": "Angle Mode :" + this.shadowRoot.querySelector('#degPopup').innerHTML,
                "function": () => {
                    this.setDegMode();
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#arcPopup'),
                "id": 'arcPopup',
                "name": "arc is :" + this.shadowRoot.querySelector('#arcPopup').innerHTML,
                "function": () => {
                    this.setArc();
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#invPopup'),
                "id": 'invPopup',
                "name": "Inverse is :" + this.shadowRoot.querySelector('#invPopup').innerHTML,
                "function": () => {
                    this.setInverse();
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#sinPopup'),
                "id": 'sinPopup',
                "name": "sine",
                "function": (e) => {
                    this.trigPressed(e);
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#cosPopup'),
                "id": 'cosPopup',
                "name": "cosine",
                "function": (e) => {
                    this.trigPressed(e);
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#tanPopup'),
                "id": 'tanPopup',
                "name": "tangent",
                "function": (e) => {
                    this.trigPressed(e);
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#absPopup'),
                "id": 'absPopup',
                "name": "absolute Value",
                "function": (e) => {
                    this.frontButtonPressed('|');
                },
                "repeatable": true,
            },
            {

                "def": this.shadowRoot.querySelector('#modPopup'),
                "id": 'modPopup',
                "name": "Modulo",
                "function": (e) => {
                    this.frontButtonPressed('mod(');
                },
                "repeatable": true,
            },
        ];
        this.shadowRoot.querySelector('#minusIconPopup').addEventListener('click', () => {
            this.shadowRoot.querySelectorAll('func-button').forEach((button) => {
                button.setRemove(true);
            });
        });
        buttonMapper(keypadButtons);

    }
    static get observedAttributes() {
        return ['style', 'mode', 'dynamic', "input", "history"];
    }
    connectedCallback() {
        setTimeout(() => {
        })
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.attributesMethod();
        this.dynamic = this.getAttribute("dynamic") === "true";
        if (this.getAttribute("mode") == "limited") {
            //this mode is the keypads more limited mode removing the more functions tile and other func buttons
            this.shadowRoot.querySelector("#modeStyle").innerHTML = `
            #arrowIcon{
              position: aboslute;
              top: calc(50% - 25px);
              left: calc(50% - 25px);
              height: 50px;
              width: 50px;
              visibility: inherit;
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
        } else if (this.getAttribute("mode") == "full") {
            //this mode has the full capabilities of the keypad
            this.shadowRoot.querySelector("#modeStyle").innerHTML = "";
        } else if (this.getAttribute("mode") == "half") {
            this.shadowRoot.querySelector("#modeStyle").innerHTML = `
             #arrowIcon{
                visibility: hidden;
                z-index: -1;
             }
            `;
        }
        if (this.ogMode == undefined && this.hasAttribute('mode')) {
            this.ogMode = this.getAttribute('mode');
        }
    }
    enterPressed(input) {
        let display = this.keyTargets.input.input;
        this.clearMain();
        inputSolver(input, "Couldn't calculate").then((value) => {
            this.frontButtonPressed(value)
            setSelect(display, display.lastChild.length);
        })
        if (display != this.keyTargets.scroll) {
            this.keyTargets.scroll.addHistory(input);
        }
        this.keyTargets.scroll.scrollBottom();
    }
    //Responsible for handling the pars button on main calc buttons
    parsMethod() {
        let badIdea = this.getInputSel.selectionStart;
        let lazyAfterthought = 0;
        for (let i = 0; i < this.keyTargets.input.innerHTML.length; i++) {
            if (this.keyTargets.input.innerHTML.charAt(i) == '(') {
                lazyAfterthought = lazyAfterthought + 1;
            }
            if (this.keyTargets.input.innerHTML.charAt(i) == ')') {
                lazyAfterthought = lazyAfterthought - 1;
            }
        }
        if (lazyAfterthought >= 1 && this.keyTargets.input.innerHTML.charAt(badIdea - 1) != '(') {
            this.frontButtonPressed(')');
        } else {
            this.frontButtonPressed('(');
        }
    }
    //Responsible (I Think) for handling all power of event for main calc buttons
    pow(type) {
        let display = this.keyTargets.input.input;
        let sel = this.getInputSel();
        let inputShadow = this.keyTargets.input.shadowRoot;
        let baseNode = sel.anchorNode;
        let baseOffset = sel.anchorOffset
        let extentNode = sel.focusNode;
        let childNodes = display.childNodes;
        var nodes = [].slice.call(childNodes);
        let inverse = nodes.indexOf(baseNode) > nodes.indexOf(extentNode);
        let superSr = document.createElement("sup");

        superSr.appendChild(type == "2" ? document.createTextNode('‎2') : document.createTextNode('‎'));
        if (display.contains(baseNode) && display.contains(extentNode)) {
            if (!sel.isCollapsed) {
                backPressed();
            }
            let postNode = document.createTextNode('‎' + baseNode.textContent.substring(baseOffset));
            let targInd = nodes.indexOf(baseNode) + 1;

            baseNode.textContent = baseNode.textContent.substring(0, baseOffset);
            display.insertAt(superSr, targInd)
            targInd++;
            display.insertAt(postNode, targInd)
            type == "2" ? setFocus(postNode, 1, inputShadow) : setFocus(superSr.lastChild, superSr.lastChild.textContent.length, inputShadow)
        }
    }
    //Responsible for the backspace button on the main calc buttons
    backPressed() {
        let uifCalculator = this.keyTargets.input;
        let sel = this.getInputSel();
        let inputShadow = this.keyTargets.input.shadowRoot;
        let baseNode = sel.anchorNode
        let baseOffset = sel.anchorOffset
        let extentNode = sel.focusNode
        let extentOffset = sel.focusOffset
        let baseString = baseNode.textContent;

        //Conditions 
        let front = baseString.charAt(baseOffset - 1) != '‎' && baseString.length != 1
        let same = baseNode == extentNode;
        let back = extentOffset > 0

        //sel.isCollapsed is true if there is no selection
        if (sel.isCollapsed) {
            console.log(baseOffset - 1)
            if (front) {
                let replacement = baseString.substring(0, baseOffset - 1) + baseString.substring(baseOffset)
                console.log(replacement)
                baseNode.nodeValue = replacement;
                setFocus(baseNode, baseOffset - 1, inputShadow);
            } else {
                let sd = this.keyTargets.input.childNodes;
                var nodesArray = [].slice.call(sd);
                let childIndex = 0;
                let childern = this.keyTargets.input.childNodes;

                for (let value of childern.values()) {
                    if (value.contains(baseNode)) {
                        if (nodesArray.indexOf(baseNode) == -1) {
                            if (this.keyTargets.input.childNodes[childIndex - 1].nodeType == 3 && this.keyTargets.input.childNodes[childIndex + 1].nodeType == 3) {
                                this.keyTargets.input.childNodes[childIndex - 1].nodeValue += this.keyTargets.input.childNodes[childIndex + 1].nodeValue.substring(1);
                                this.keyTargets.input.removeChild(this.keyTargets.input.childNodes[childIndex + 1]);
                            }
                            this.keyTargets.input.removeChild(value);
                        }
                        let target = getText(this.keyTargets.input.childNodes[childIndex - 1]);
                        console.log(target)
                        setFocus(target, target.textContent.length, inputShadow);
                    }
                    childIndex++;
                }
            }
        } else {
            let elems = elemArray(this.keyTargets.input.childNodes)
            elems.find(elem => elem == baseNode)
            if (same) {
                let lower = baseOffset > extentOffset ? extentOffset : baseOffset;
                let higher = baseOffset > extentOffset ? baseOffset : extentOffset;
                let removed = baseString.substring(lower, higher)
                if (removed.includes('‎')) {
                    baseNode.nodeValue = "‎" + baseString.substring(0, lower) + baseString.substring(higher)
                } else {
                    baseNode.nodeValue = baseString.substring(0, lower) + baseString.substring(higher)
                }
                setFocus(baseNode, lower, inputShadow)
            } else {
                let childern = uifCalculator.childNodes
                let arryChd = [].slice.call(childern);
                let inverse = arryChd.indexOf(getParent(baseNode, this.keyTargets.input)) > arryChd.indexOf(getParent(extentNode, this.keyTargets.input))
                let startPar = getParent(inverse ? extentNode : baseNode, this.keyTargets.input);
                let startInd = arryChd.indexOf(startPar)
                let endPar = getParent(inverse ? baseNode : extentNode, this.keyTargets.input);
                this.keyTargets.input.removeSection(inverse ? extentNode : baseNode, inverse ? baseNode : extentNode, inverse ? extentOffset : baseOffset, inverse ? baseOffset : extentOffset)
                if (uifCalculator.contains(startPar)) {
                    if (startPar.nodeType != 3) {
                        setFocus(getText(startPar), getText(startPar).textContent.length, inputShadow)
                    } else {
                        setFocus(startPar, startPar.textContent.length, inputShadow)
                    }
                } else {
                    let pre = arryChd[startInd - 1]
                    if (pre.nodeType != 3) {
                        setFocus(getText(pre), getText(pre).textContent.length, inputShadow)
                    } else {
                        setFocus(pre, pre.textContent.length, inputShadow)
                    }
                }
                autoStitch(uifCalculator)
            }
        }
    }
    popup() {
        if (this.shadowRoot.querySelector('#arrowIcon').style.animation == "0.125s ease-in 0s 1 normal forwards running toUp") {
            this.shadowRoot.querySelector('#arrowIcon').style.animation = "0.125s ease-in 0s 1 normal forwards running toDown";
            this.shadowRoot.querySelector('#extraFuncPopUp').style.animation = "0.125s ease-in 0s 1 reverse forwards running extendFuncAnim";
            animate(this.shadowRoot.querySelector('#extraFuncPopUp'), "0.125s ease-in 0s 1 reverse none running extendFuncAnim").then(() => {
                this.shadowRoot.querySelector('#extraFuncPopUp').style.animation = undefined;
                this.shadowRoot.querySelector('#extraFuncPopUp').style.top = "100%";
            });
            sessionStorage.setItem("facing", "");
            this.shadowRoot.querySelector('#arrowIcon').style.transform = 'rotate(90deg);';
        } else {
            this.shadowRoot.querySelector('#arrowIcon').style.animation = "0.125s ease-in 0s 1 normal forwards running toUp";
            this.shadowRoot.querySelector('#extraFuncPopUp').style.animation = "0.125s ease-in 0s 1 normal forwards running extendFuncAnim";
            animate(this.shadowRoot.querySelector('#extraFuncPopUp'), "0.125s ease-in 0s 1 normal none running extendFuncAnim").then(() => {
                this.shadowRoot.querySelector('#extraFuncPopUp').style.animation = undefined;
                this.shadowRoot.querySelector('#extraFuncPopUp').style.top = "0%";
            });
            sessionStorage.setItem("facing", "mainPopup");
            this.shadowRoot.querySelector('#arrowIcon').style.transform = 'rotate(270deg);';
        }

    }
    addCard(name, content) {
        let selfGrid = this.shadowRoot.querySelector('#custFuncGridPopup')
        let card = document.createElement('func-button')
        card.setAttribute('name', name)
        card.setAttribute('equation', content)
        card.classList.add('customButton')
        let linkedButtons = [card];
        for (let elem of this.linkedElems) {
            let target = envObject.keypads.find(keypad => keypad.id == elem)
            let cardClone = card.cloneNode()
            target.funcGrid.appendChild(cardClone)
            linkedButtons.push(cardClone)
        }
        envObject.funcButtons.push({ "name": name, "defs": linkedButtons })
        selfGrid.appendChild(card);
    }
    setStyle(styling) {
        this.shadowRoot.querySelector('#styleInjector').innerHTML = styling;
    }
    reset() {
        this.shadowRoot.querySelector('#styleInjector').innerHTML = "";
        this.style = "";
        this.setAttribute('mode', this.ogMode);
        this.keyTargets.input = this.firstTargets.input
        this.keyTargets.scroll = this.firstTargets.scroll;
    }
    setVisibility(vis) {
        console.log("running vis")
        if (vis) {
            //this.style.visibility = "visible"
            pullUpElements([this])
        } else {
            //this.style.visibility = "hidden"
            hideElements([this])
        }
    }

}
customElements.define("func-keypad", Keypad);
class removeIcon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                #minusIcon{
                    width: 100%;
                    height: 100%;
                }
                .svgText{
                    fill: var(--textColor);
                }
                .minusBoxes{
                    transition: transform 0.5s;
                }
            </style>
            <svg id="minusIcon" class="imgDivClass" style="isolation:isolate" viewBox="0 0 1080 1080"
                xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="m221.8 858.2c-175.62-175.62-175.62-460.78 0-636.4s460.78-175.62 636.4 0 175.62 460.78 0 636.4-460.78 175.62-636.4 0z"
                        fill-opacity=".2" />
                    <rect id="firstTile" transform="" class="svgText minusBoxes"  x="287.12" y="481.64" width="505.75"
                        height="116.71" />
                    <rect id="secondaryTile" transform="" class="svgText minusBoxes" x="287.12" y="481.64" width="505.75"
                        height="116.71" />
            </svg>
        `;
        this.toggle = false;
        this.addEventListener('click', () => {
            if (!this.toggle) {
                this.shadowRoot.querySelector('#firstTile').setAttribute('transform', "rotate(135 540 540)")
                this.shadowRoot.querySelector('#secondaryTile').setAttribute('transform', "rotate(45 540 540)")
                this.toggle = true;
            } else {
                this.shadowRoot.querySelector('#firstTile').setAttribute('transform', "")
                this.shadowRoot.querySelector('#secondaryTile').setAttribute('transform', "")
                this.toggle = false;
            }
        });
    }
}
customElements.define("remove-icon", removeIcon);
class extendedKeypad extends inputMethod {
    constructor() {
        super();
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./styling/animations.css">
        <style>
    * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-family: ubuntu;
        color: var(--textColor);
        -webkit-tap-highlight-color: transparent;
    }

    .imgDivClass {
        aspect-ratio: 1 / 1;
    }

    .svgText {
        fill: var(--textColor);
    }

    .pane {
        border-radius: 25px;
        background-color: var(--functionsColor);
        filter: drop-shadow(-5px 5px 5px var(--translucent));
    }

    button:focus {
        outline: none;
    }

    #extendedKeypad {
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    #extendedFuncGrid {
        height: 100%;
        top: 33.3333%;
        width: 100%;
        left: 400px;
        right: 0;
        display: grid;
        grid-gap: 0px 0px;
        grid-template-columns: 50% 50%;
        grid-template-rows: 11.1111% 11.1111% 11.1111% 11.1111% 11.1111% 11.1111%;
        background-color: #00000000;
        z-index: 1;
        grid-template-areas:
            "help func"
            "vars ac"
            "mod abs"
            "sin deg"
            "cos arc"
            "tan inv"
            "d-f fact"
            "ln log"
            "log10 e";
    }

    .fI {
        background-color: var(--displayColor);
    }

    .funcbutton {
        height: 100%;
        width: 100%;
        font-size: 20px;
        color: var(--textColor);
        background-color: var(--functionsColor);
        text-align: center;
        border-style: none;
    }

    .funcbutton:focus {
        outline: none;
        box-shadow: none;
    }

    .trigButton {
        height: 100%;
        width: 100%;
        font-size: 20px;
        color: var(--textColor);
        background-color: var(--functionsColor);
        text-align: center;
        border-style: none;
    }
    #funcDisplay{
        height: 100%;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }
    #funcGrid{
        visibility: hidden;
        width: 100%;
        height: calc(100% - 50px);
        display: grid;
        grid-gap: 0px 0px;
        grid-template-columns: 100%;
        grid-auto-rows: 100px;
    }
    #backIcon{
        height: 50px;
        transform: rotate(180deg);
    }
    #addIcon{
        height: 50px;
    }
    #minusIcon{
        height: 50px;
    }
    .customButton {
        margin-left: 5px;
        position: relative;
        background-color: var(--numbersColor);
        color: var(--textColor);
        width: calc(100% - 10px);
        z-index: 2;
        border: none;
        border-radius: 25px;
        top: 2.5%;
        height: 95%
      }
    
</style>
<style id="modeStyle"></style>
<div id="extendedKeypad" class="pane">
    <div id="extendedFuncGrid">
        <div class="button-item fI" style="grid-area: help;"><button class="funcbutton" id="helpEx">
                <svg class="helpIcon imgDivClass" style="height: 40px;isolation:isolate" viewBox="0 0 45 45"
                    xmlns="http://www.w3.org/2000/svg">\
                    <path class="svgText"
                        d="m4 22.5c0-10.21 8.29-18.5 18.5-18.5s18.5 8.29 18.5 18.5-8.29 18.5-18.5 18.5-18.5-8.29-18.5-18.5zm20.474 6.395h-4.095q-0.016-0.883-0.016-1.076 0-1.991 0.659-3.276 0.658-1.284 2.633-2.89 1.976-1.606 2.361-2.104 0.594-0.787 0.594-1.734 0-1.317-1.052-2.257-1.052-0.939-2.834-0.939-1.718 0-2.875 0.979-1.156 0.98-1.59 2.987l-4.143-0.513q0.177-2.875 2.449-4.882 2.273-2.008 5.966-2.008 3.886 0 6.183 2.032 2.296 2.031 2.296 4.729 0 1.494-0.843 2.826-0.843 1.333-3.605 3.63-1.429 1.188-1.775 1.911-0.345 0.722-0.313 2.585zm0.418 6.071h-4.513v-4.513h4.513v4.513z"
                        fill-rule="evenodd" />
                </svg>
            </button></div>
        <div class="button-item fI" style="grid-area: func;"><button class="funcbutton" id="functionEx">Func</button>
        </div>
        <div class="button-item fI" style="grid-area: ac;"><button class="funcbutton" id="acEx">ac</button>
        </div>
        <div class="button-item fI" style="grid-area: vars;"><button class="funcbutton" id="varEx">xyz</button>
        </div>
        <div class="button-item fI" style="grid-area: arc;"><button class="funcbutton" id="arcEx">arc</button>
        </div>
        <div class="button-item fI" style="grid-area: inv;"><button class="funcbutton" id="invEx">inv</button>
        </div>
        <div class="button-item fI" style="grid-area: sin;"><button class="trigButton" id="sinEx">sin</button>
        </div>
        <div class="button-itemfI" style="grid-area: deg;"><button class="funcbutton" id="degEx">deg</button>
        </div>
        <div class="button-item fI" style="grid-area: cos;"><button class="trigButton" id="cosEx">cos</button>
        </div>
        <div class="button-item fI" style="grid-area: mod;"><button class="funcbutton" id="modEx">mod</button>
        </div>
        <div class="button-item fI" style="grid-area: tan;"><button class="trigButton" id="tanEx">tan</button>
        </div>
        <div class="button-item fI" style="grid-area: abs;"><button class="funcbutton" id="absEx">|
                |</button>
        </div>
        <div class="button-item fI" style="grid-area: d-f;"><button class="funcbutton" id="deciToFracEx">d→f</button>
        </div>
        <div class="button-item fI" style="grid-area: fact;"><button class="funcbutton" id="factorialEx">n!</button>
        </div>
        <div class="button-item fI" style="grid-area: ln;"><button class="funcbutton" id="lnEx">ln</button>
        </div>
        <div class="button-item fI" style="grid-area: log;"><button class="funcbutton" id="log10Ex">log</button>
        </div>
        <div class="button-item fI" style="grid-area: log10;"><button class="funcbutton">log<sub>10</sub></button>
        </div>
        <div class="button-item fI" style="grid-area: e;"><button class="funcbutton" id="eEx">e</button>
        </div>
    </div>
    <div id="funcDisplay">
    <svg id="backIcon" style="height: 50px;isolation:isolate" viewBox="0 0 1080 1080"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect width="1080" height="1080" fill-opacity="0" />
                    <circle cx="540" cy="540" r="450" fill-opacity=".2" vector-effect="non-scaling-stroke" />
                    <path class="svgText"
                        d="m648.99 620.2-186.73 186.73-80.256-80.257 186.73-186.73-186.61-186.61 80.256-80.256 186.61 186.61 0.011-0.01 80.256 80.256-0.011 0.01 0.132 0.132-80.256 80.256-0.132-0.132z" />
                </svg>
    <svg id="addIcon" class="imgDivClass" style="isolation:isolate" viewBox="0 0 1080 1080"
        xmlns="http://www.w3.org/2000/svg">
            <path
                d="m221.8 858.2c-175.62-175.62-175.62-460.78 0-636.4s460.78-175.62 636.4 0 175.62 460.78 0 636.4-460.78 175.62-636.4 0z"
                fill-opacity=".2" />
            <path class="svgText"
                d="m481.64 598.36v194.52h116.71v-194.52h194.52v-116.71h-194.52v-194.52h-116.71v194.52h-194.52v116.71h194.52z" />
    </svg>
    <remove-icon id="minusIcon"></remove-icon>
    <div id="funcGrid">

    </div>
    </div>
</div>
        `
        let keypadButtons = [
            {
                "def": this.shadowRoot.querySelector('#functionEx'),
                "id": 'functionEx',
                "name": "Open Function Menu",
                "function": () => {
                    this.openFuncMenu();
                },
            },
            {
                "def": this.shadowRoot.querySelector('#acEx'),
                "id": 'acEx',
                "name": "all Clear",
                "function": () => {
                    this.clearMain();
                },
                "repeatable": false,
            },
            {
                "def": this.shadowRoot.querySelector('#varEx'),
                "id": 'varEx',
                "name": "Open Keyboard",
                "function": () => {
                    let display = this.keyTargets.input.input;
                    let target = display;
                    target.setAttribute("inputmode", "text")
                    target.focus();
                    target.addEventListener("focusout", () => {
                        target.setAttribute("inputmode", "none")
                    }, { once: true })
                },
                "repeatable": false,
            },
            {
                "def": this.shadowRoot.querySelector('#arcEx'),
                "id": "arcEx",
                "name": "arc",
                "function": () => {
                    this.setArc();
                },
                "repeatable": false,
            },
            {
                "def": this.shadowRoot.querySelector('#invEx'),
                "id": "invEx",
                "name": "Inverse",
                "function": () => {
                    this.setInverse();
                },
                "repeatable": false,
            },
            {
                "def": this.shadowRoot.querySelector('#sinEx'),
                "id": "sinEx",
                "name": "Sine",
                "function": (e) => {
                    this.trigPressed(e);
                },
                "repeatable": false,
            },
            {
                "def": this.shadowRoot.querySelector('#degEx'),
                "id": "degEx",
                "name": `Angle Mode ${this.shadowRoot.querySelector('#degEx').innerHTML}`,
                "function": () => {
                    this.setDegMode();
                },
                "repeatable": false,
            },
            {
                "def": this.shadowRoot.querySelector('#cosEx'),
                "id": "cosEx",
                "name": "Cosine",
                "function": (e) => {
                    this.trigPressed(e);
                },
                "repeatable": false,
            },
            {
                "def": this.shadowRoot.querySelector('#modEx'),
                "id": "modEx",
                "name": "Modulus",
                "function": (e) => {
                    this.frontButtonPressed('mod(');
                },
                "repeatable": false,
            },
            {
                "def": this.shadowRoot.querySelector('#tanEx'),
                "id": "tanEx",
                "name": "Tangent",
                "function": (e) => {
                    this.trigPressed(e);
                },
                "repeatable": false,
            },
            {
                "def": this.shadowRoot.querySelector('#absEx'),
                "id": "absEx",
                "name": "absolute value",
                "function": () => {
                    this.frontButtonPressed('|');
                },
                "repeatable": false,
            },
            {
                "def": this.shadowRoot.querySelector('#deciToFracEx'),
                "id": "deciToFracEx",
                "name": "decimal to fraction",
                "function": () => {
                    this.frontButtonPressed('d→f(');
                },
                "repeatable": false,
            },
            {
                "def": this.shadowRoot.querySelector('#factorialEx'),
                "id": "factorialEx",
                "name": "factorial",
                "function": () => {
                    this.frontButtonPressed('!');
                },
                "repeatable": false,
            },
            {
                "def": this.shadowRoot.querySelector('#lnEx'),
                "id": "lnEx",
                "name": "natural log",
                "function": () => {
                    this.frontButtonPressed('ln(');
                },
                "repeatable": false,
            },
            {
                "def": this.shadowRoot.querySelector('#log10Ex'),
                "id": "log10Ex",
                "name": "log base 10",
                "function": () => {
                    this.frontButtonPressed('log₁₀(');
                },
                "repeatable": false,
            },
            {
                "def": this.shadowRoot.querySelector('#eEx'),
                "id": "eEx",
                "name": "e",
                "function": () => {
                    this.frontButtonPressed('e');
                },
                "repeatable": false,
            },
        ];
        buttonMapper(keypadButtons)
        this.shadowRoot.querySelector('#backIcon').addEventListener('click', () => {
            this.closeFuncMenu();
        });
        this.shadowRoot.querySelector('#minusIcon').addEventListener('click', () => {
            this.shadowRoot.querySelectorAll('func-button').forEach((button) => {

                button.setRemove(true);
            });
        });
        this.buttonGrid = this.shadowRoot.querySelector('#extendedFuncGrid')
        this.funcGrid = this.shadowRoot.querySelector('#funcGrid')
    }

    static get observedAttributes() {
        return ['mode', "input", "history"];
    }
    addCard(name, content) {
        let selfGrid = this.shadowRoot.querySelector('#funcGrid')
        let card = document.createElement('func-button')
        card.setAttribute('name', name)
        card.setAttribute('equation', content)
        card.classList.add('customButton')
        selfGrid.appendChild(card)
    }
    openFuncMenu() {
        pullUpElements([this.funcGrid])
        hideElements([this.buttonGrid])
    }
    closeFuncMenu() {
        hideElements([this.funcGrid])
        pullUpElements([this.buttonGrid])
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.attributesMethod();
        this.dynamic = this.getAttribute("dynamic") === "true";
        if (this.getAttribute("mode") == "triple") {
            //this mode is the keypads more limited mode removing the more functions tile and other func buttons
            this.shadowRoot.querySelector("#modeStyle").innerHTML = `
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
              #funcGrid{
                grid-template-columns: 50% 50%;
            }
              `;
        } else if (this.getAttribute("mode") == "double") {
            //this mode has the full capabilities of the keypad
            this.shadowRoot.querySelector("#modeStyle").innerHTML = "";
        }
    }
}
customElements.define('keypad-ex', extendedKeypad);
class menuPane extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./styling/animations.css">
        <style>
        ${defStyle}
        #modeContainer{
            height: 100%;
            width: 100%;
            position: absolute;
            z-index: -1;
            left: 0;
            top: 0;
        }
        .imgContainer{
            height: 100%; 
            max-height: 200px;
            width:unset; 
            aspect-ratio: 1/1;
        }
        .modeButton{
            background-color: var(--numbersColor);
            overflow: hidden;
            border:none; 
            border-radius: 25px;
            align-content: space-evenly;
            align-items: center; 
            display: flex;
            font-size: large;
        }
        #paneContainer{
            background-color: var(--functionsColor);
            height: 100%;
            width: 100%;
            border-radius: 25px;
            position: absolute;
            overflow: hidden;
        }
        #modeSwitcher{
            height: 100%; 
            width:100%; 
            position: absolute; 
            left:0; 
            top:0;
            overflow-x: hidden;
            overflow-y: auto;
        }
        .menuTitle {
            margin-left: 10px;
            padding-left: 10px;
            padding-right: 10px;
            padding-top: 5px;
            padding-bottom: 5px;
            width: calc(100% - 20px);
            text-align: center;
        }
        #pageBack{
            position: absolute;
            top: 0px;
            left: 0px;
            z-index: 5;
        }
        </style>
        <style id="typeStyle">
        </style>
        <div id="paneContainer">
            <div id="modeSwitcher">
                <svg class="backIcon imgDivClass" id="mainBack" style="height: 50px;isolation:isolate"
                    viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
                    <rect width="1080" height="1080" fill-opacity="0" />
                    <circle cx="540" cy="540" r="450" fill-opacity=".2" vector-effect="non-scaling-stroke" />
                    <path class="svgText"
                      d="m648.99 620.2-186.73 186.73-80.256-80.257 186.73-186.73-186.61-186.61 80.256-80.256 186.61 186.61 0.011-0.01 80.256 80.256-0.011 0.01 0.132 0.132-80.256 80.256-0.132-0.132z" />
                </svg>
                <h1 class="menuTitle" id="title"></h1>
            </div>
            <div id="modeContainer">
                <svg class="backIcon imgDivClass" id="pageBack" style="height: 50px;isolation:isolate"
                    viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
                    <rect width="1080" height="1080" fill-opacity="0" />
                    <circle cx="540" cy="540" r="450" fill-opacity=".2" vector-effect="non-scaling-stroke" />
                    <path class="svgText"
                      d="m648.99 620.2-186.73 186.73-80.256-80.257 186.73-186.73-186.61-186.61 80.256-80.256 186.61 186.61 0.011-0.01 80.256 80.256-0.011 0.01 0.132 0.132-80.256 80.256-0.132-0.132z" />
                </svg>
            </div>
        </div>
        `;
        this.shadowRoot.getElementById('pageBack').addEventListener('click', () => {
            this.pageReturn();
        });
        this.container = this.shadowRoot.querySelector("#paneContainer");
        appendMethod('mobileLandscape', () => {
            this.setStyling();
        })
        appendMethod('mobilePortrait', () => {
            this.setStyling();
        });
        this.container.addEventListener("change", () => {
            this.setStyling();
        })
    }
    static get observedAttributes() {
        return ['style', 'type', "name"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.getAttribute("style") != undefined) {
            this.shadowRoot.querySelector("#paneContainer").setAttribute("style", this.getAttribute("style"))
        }
        if (this.getAttribute("type") != undefined) {
            let genRef = this;
            this.type = this.getAttribute("type");
            let typeList = [{
                name: "mode",
                code: () => {

                },
                elements: [
                    {
                        type: "remove",
                        id: "mainBack"
                    },
                    {
                        type: "remove",
                        id: "title"
                    },
                    {
                        type: "remove",
                        id: "pageBack"
                    },
                    {
                        type: "add",
                        parentId: 'modeContainer',
                        get def() {
                            let modeButton = document.createElement('button');
                            modeButton.id = 'modeButton';
                            modeButton.innerHTML = "mode";
                            modeButton.addEventListener('click', () => {
                                genRef.pageReturn();
                            });
                            return modeButton;
                        }
                    }
                ]
            }]
            typeList.forEach((type) => {
                if (type.name == this.getAttribute("type")) {
                    this.setStyling();
                    for (let elem of type.elements) {
                        if (elem.type == "remove") {
                            this.shadowRoot.querySelector("#" + elem.id).remove();
                        } else {
                            this.shadowRoot.querySelector("#" + elem.parentId).appendChild(elem.def);
                        }
                    }
                    type.code();
                }
            })

        }
        if (this.getAttribute("name") != undefined) {
            this.name = this.getAttribute("name")
            this.shadowRoot.querySelector("#title").innerHTML = this.name;
        }
    }
    connectedCallback() {
        setTimeout(() => {
            this.setStyling();
            console.log(this.childNodes)
            //this.shadowRoot.querySelector("#modeContainer").append(...this.childNodes)

            this.switcher = this.shadowRoot.querySelector("#modeSwitcher")
            this.container = this.shadowRoot.querySelector("#modeContainer")
            if (this.shadowRoot.querySelector("#modeContainer").createButton == undefined) {
                this.pages = []
                this.shadowRoot.querySelector("#modeContainer").createButton = (name, icon, page) => {
                    let button = document.createElement("button")
                    button.classList.add("modeButton");
                    this.pages.push(page)
                    button.innerHTML = `
                <h3 id="modeText" class="text"></h3>
                `
                    button.insertBefore(icon, button.firstChild);
                    button.querySelector("#modeText").innerHTML = name
                    button.addEventListener("click", () => {
                        console.log("hello you clicked")
                        this.pageSelector(page)
                    })
                    console.dir(page)
                    if (page.getAttribute('isFirst') != undefined && page.getAttribute('isFirst') == "true") {
                        this.pageSelector(page)
                    }
                    this.shadowRoot.querySelector("#modeSwitcher").append(button)
                    this.shadowRoot.querySelector("#modeContainer").append(page)
                }
                this.createButton = this.shadowRoot.querySelector("#modeContainer").createButton
                this.shadowRoot.querySelector("#modeContainer").addElem = (parent) => {
                    let backIcon = document.createElement("svg");
                    backIcon.classList.add("backIcon");
                    backIcon.classList.add("imgDivClass");
                    backIcon.innerHTML = `
                <rect width="1080" height="1080" fill-opacity="0" />
                    <circle cx="540" cy="540" r="450" fill-opacity=".2" vector-effect="non-scaling-stroke" />
                    <path class="svgText"
                      d="m648.99 620.2-186.73 186.73-80.256-80.257 186.73-186.73-186.61-186.61 80.256-80.256 186.61 186.61 0.011-0.01 80.256 80.256-0.011 0.01 0.132 0.132-80.256 80.256-0.132-0.132z" />
                `;
                    backIcon.addEventListener("click", () => { this.pageReturn() });
                    parent.append(backIcon);
                }
                this.shadowRoot.querySelector("#modeContainer").createFront = (page) => {

                };
            }
        });
    }
    pageSelector(tPage) {
        let selectorType = "";
        if (this.container.offsetWidth / this.container.offsetHeight > 3 / 4) {
            if (this.type != "mode" && this.type == "simpleMenu") {
                selectorType = "full";
            } else {
                selectorType = "full";
            }
        } else {
            selectorType = "full";
        }
        console.log(selectorType)
        if (selectorType == "full") {
            this.container.style.zIndex = 1;
            hideElements([this.switcher])
            //this.switcher.style.visibility = "hidden";
        }
        let hiddenPages = [...this.pages].filter(page => page != tPage)
        if (tPage.hasKeypad) {
            console.log("has keypad")
            if (typeof keypad !== 'undefined') {
                console.log(keypad)
                keypad.setVisibility(true);
            }
        }
        hideElements(hiddenPages);
        pullUpElements([tPage, this.shadowRoot.querySelector("#modeButton")]);
    }
    pageReturn() {
        this.container.style.zIndex = -1;

        hideElements([...this.pages, this.shadowRoot.querySelector("#modeButton")]);
        if (keypad != undefined) {
            keypad.setVisibility(false);
        }
        pullUpElements([this.switcher]);
    }
    setStyling() {
        let type = this.type
        let orientation = "";
        let styling = "";
        if (this.container.offsetWidth / this.container.offsetHeight > 3 / 4) {
            orientation = "horizontal";
        } else {
            orientation = "vertical";
        }
        if (type == "mode") {
            styling += `
            button{
                color: unset;
            }
            .modeButton{
                overflow: hidden;
                padding: 0px;
                border:none; 
                border-radius: 25px;
                align-content: space-evenly;
                align-items: center; 
                text-indent: 5px;
                font-size: large;
            }
            #modeButton{
                animation: fadeEffect 0.50s ease-in 1 none;
                z-index: 2;
                height: fit-content;
                position: absolute;
                border: none;
                background-color: var(--displayColor);
                font-size: 20px;
                padding: 10px;
                border-radius: 50px;
            }
            #paneContainer{
                background-color: transparent;
            }
            `
            if (orientation == "vertical") {
                styling += `
                #modeSwitcher{
                    display: grid; 
                    grid-auto-rows: 1fr;
                    grid-auto-flow: row;
                }
                .modeButton{
                    display: flex;
                    height: calc(100% - 20px);
                    margin-top: 10px;
                    margin-left: 10px;
                    width: calc(100% - 20px);
                }
                #modeButton{
                    right: 20px;
                    top: 20px;
                }
                `
            } else if (orientation == "horizontal") {
                styling += `
                #modeSwitcher{
                    display: grid; 
                    grid-auto-columns: 1fr;
                    grid-auto-flow: column;
                }
                .modeButton{
                    display: grid;
                    width: calc(100% - 20px);
                    margin-left: 10px;
                    margin-top: 10px;
                    height: calc(100% - 20px);
                    align-content: center;
                    align-items: center;
                    justify-content: center;
                }
                .imgDivClass{
                    width: 100%;
                }
                .text{
                    width: 100%;
                }
                #modeButton{
                    left: 20px;
                    top: 20px;
                }
                `;

            }
        } else {
            styling += `
            .modeButton{
                width: calc(100% - 20px); 
                height: 175px; 
                margin-top:10px; 
                margin-left:10px;
            }
            .backIcon{
                transform: rotate(180deg);
                background-color: transparent;
                height: 45px;
                z-index: 1;
            }
            
            `
            if (orientation == "vertical") {
                styling += `
                
                `
            } else if (orientation == "horizontal") {
                styling += `
                    #paneContainer{
                        background-color: transparent;
                        width: 100%;
                        height: 100%;
                        left: 0;
                        top: 0;
                        display: grid;
                        grid-template-columns: 1fr 3fr;
                        border-radius: 0px;
                        grid-template-areas:
                        "switcher container";
                    }
                    #title{
                        margin: 0px;
                    }
                    #modeSwitcher{
                        width: calc(100% - 10px);
                        height: calc(100% - 20px);
                        border-radius: 25px;
                        margin-left: 10px;
                        margin-top: 10px;
                        position: initial;
                        background-color: var(--functionsColor);
                        grid-area: switcher;
                    }
                    #modeContainer{
                        width: calc(100% - 20px);
                        height: calc(100% - 20px);
                        border-radius: 25px;
                        margin-left: 10px;
                        margin-top: 10px;
                        background-color: var(--functionsColor);
                        grid-area: container;
                    }
                    #pageBack{
                        visibility: hidden;
                    }
                    .modeButton{
                        height: 50px;
                    }

                `;

            }
        }
        this.shadowRoot.querySelector("#typeStyle").innerHTML = styling;
    }
}
customElements.define("menu-pane", menuPane);
class menuPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
        <style>
        #modePage{
            height: 100%;
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
            visibility: hidden;
        }
        </style>
        <div id="modePage">
        </div>
        `
    }
    static get observedAttributes() {
        return ['style', 'name', "isFirst", "hasKeypad"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.getAttribute("style") != undefined) {
            this.shadowRoot.querySelector("#modePage").setAttribute("style", this.getAttribute("style"))
        } else if (this.getAttribute("name") != undefined) {
            this.name = this.getAttribute("name")
        } else if (this.getAttribute("isFirst") != undefined) {
            this.isFirst = true;
        }
        if (this.getAttribute("hasKeypad") != undefined) {
            this.hasKeypad = true;
        }
        if (this.name != undefined && this.isFirst != undefined) {
            this.parent.createButton(this.name, this.icon, this)
        }
    }
    connectedCallback() {
        setTimeout(() => {
            if (this.icon == undefined) {
                this.icon = this.querySelector("#icon")
                console.log(this.icon)
                this.removeChild(this.icon)
                console.log(this.parentElement)
                this.parentElement.createButton(this.name, this.icon, this)
            }
            this.shadowRoot.querySelector("#modePage").append(...this.childNodes)
        });
    }
}
customElements.define("menu-page", menuPage);
class colorTextInput extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
        <style>
        .primary {
            fill: var(--functionsColor);
        }
        #colorInput{
            height: 100%;
            width: 100%;
            display: flex;
            left: 0;
            top: 0;
        }
        #colorIndicator{
            height: calc(100% - 10px);
            margin: 5px;
            aspect-ratio: 1;
            border-radius: 50%;
            font-size: inherit;
        }
        #dynamicEquation {
            width: 100%;
            height: 100%;
            border-radius: 15px;
            border: none;
            outline: none;
            font-size: inherit;
        }
        </style>
        <div id="colorInput">
            <svg id="colorIndicator" style="isolation:isolate" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
            <circle class="primary" cx="540" cy="540" r="540" vector-effect="non-scaling-stroke"/>
            <path id="lineIndicator" d="m652.2 486.59 297.83-297.83c-18.065-21.064-37.724-40.723-58.788-58.788l-297.83 297.83c-16.184-7.725-34.296-12.051-53.411-12.051-68.575 0-124.25 55.675-124.25 124.25 0 19.115 4.326 37.227 12.051 53.411l-297.83 297.83c18.065 21.064 37.724 40.723 58.788 58.788l297.83-297.83c16.184 7.725 34.296 12.051 53.411 12.051 68.575 0 124.25-55.675 124.25-124.25 0-19.115-4.326-37.227-12.051-53.411z" fill="#fff"/>
            </svg>
            <rich-input id="dynamicEquation"></rich-input>
        </div>
        `
        this.style.backgroundColor = "var(--numbersColor)"
        this.style.borderRadius = "15px"
        this.colorInd = this.shadowRoot.querySelector("#lineIndicator")
        this.richInput = this.shadowRoot.querySelector("#dynamicEquation")
        this.input = this.richInput.input
        console.log(this.input)
        this.alert = this.richInput.alert
        this.color = getRandomColor();
        this.colorInd.style.fill = this.color;
    }
    setColor(color) {
        this.colorInd.style.fill = color
        this.color = color
    }
    static get observedAttributes() {
        return ['placeholder'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.getAttribute("placeholder") != undefined) {
            this.richInput.setAttribute("placeholder", this.getAttribute("placeholder"));
        }
    }
    connectedCallback() {
        setTimeout(() => {
        })
    }

}
customElements.define("color-text", colorTextInput);
class templateMode extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
        <style id="styler">
        * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-family: ubuntu;
        color: var(--textColor);
        -webkit-tap-highlight-color: transparent;
      }
      
      .imgDivClass {
        aspect-ratio: 1 / 1;
      }
      
      .svgText {
        fill: var(--textColor);
      }
      
      .dynamicContent {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
      
      .modeContainerClass {
        width: 100%;
        height: 100%;
        display: grid;
        position: absolute;
        filter: drop-shadow(-5px 5px 5px var(--translucent));
        transition: 0.5s;
      }
      .modeContainerClass.fullScreen {
        grid-template-areas: "content";
        transition: 0.5s;
      }
      #fullContent{
        position: absolute;
        right: 5px;
        bottom: 5px;
      }
      #contentPane {
        position: absolute;
        width: calc(100% - 20px);
        height: calc(100% - 10px);
        margin-top: 10px;
        margin-left: 10px;
        top: 0;
        left: 0;
        bottom: calc(40% + 10px);
        border-radius: 25px;
        background-color: var(--functionsColor);
      }
      
      
      #contentControls {
        position: absolute;
        width: calc(100% - 20px);
        height: calc(100% - 20px);
        margin-top: 10px;
        margin-left: 10px;
        border-radius: 25px;
        background-color: var(--functionsColor);
        overflow: hidden;
      }
      
      #modeFuncGrid {
        padding-top: 10px;
        width: calc(100% - 20px);
        height: 100%;
        overflow-y: auto;
        margin-left: 10px;
        display: grid;
        overflow-x: hidden;
        grid-auto-rows: 80px;
        filter: drop-shadow(-5px 5px 5px var(--translucent));
      }
      
      #addEquation {
        width: 60px;
        height: 60px;
        margin-left: calc(50% - 30px);
        border-radius: 30px;
        border: none;
        background-color: var(--displayColor);
        font-size: 30px;
        font-weight: bold;
      }
      
      #settingsCog{
        position: absolute;
        margin-top: -60px;
        left: 5px;
        bottom: 5px;
      }
      
      /*end*/
      
      button:focus {
        outline: none;
      }
      
      ::-webkit-scrollbar {
        width: 10px;
      }
      
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      
      ::-webkit-scrollbar-thumb {
        width: 5px;
        background: #00000080;
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
        </style>
        <style id="orientationStyle"></style>
        <style id="keypadStyling"></style>
        <div id="modeContainer" class="modeContainerClass">
                    <div id="contentPane" style="grid-area: content;">
                        <div id="contentContainer" class="dynamicContent">

                        </div>
                        <svg id="fullContent" class="imgDivClass" style="height: 50px;isolation:isolate"
                            viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="m221.8 858.2c-175.62-175.62-175.62-460.78 0-636.4s460.78-175.62 636.4 0 175.62 460.78 0 636.4-460.78 175.62-636.4 0z"
                                fill-opacity=".2" />
                            <path class="svgText"
                                d="m352.08 274.47h-84.084v237h84.084v-152.92h152.92v-84.084h-152.92zm453.44 446.97v-152.92h-84.084v152.92h-152.92v84.084h152.92 84.084v-84.084z"
                                fill-rule="evenodd" />
                        </svg>
                    </div>
                    <div id="contentControls" style="grid-area: controls;">
                        <div id="modeFuncGrid">
                            <color-text id="initEquation" class="dynamicEquation" placeholder="Equation" style="width: 100%; height: calc(100% - 10px); font-size: 60px;"></color-text>
                            <button id="addEquation">+</button>
                        </div>
                        <svg id="settingsCog" class="imgDivClass" style="height: 50px;isolation:isolate"
                            viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="540" cy="540" r="500" fill-opacity=".2" vector-effect="non-scaling-stroke" />
                            <path class="svgText"
                                d="m244.67 697.55c-11.852-22.099-21.29-45.683-27.96-70.398h-32.694c-26.815 0-48.585-21.77-48.585-48.585v-74.282c0-26.815 21.77-48.585 48.585-48.585h31.938c8.86-34.024 22.953-65.946 41.369-94.851l-21.66-23.5c-18.173-19.717-16.919-50.479 2.798-68.652l54.621-50.343c19.717-18.173 50.479-16.919 68.652 2.798l21.569 23.401c22.071-11.686 45.606-20.971 70.255-27.506v-32.313c0-26.815 21.77-48.585 48.585-48.585h74.282c26.815 0 48.585 21.77 48.585 48.585v32.313c33.72 8.94 65.355 23.027 94.011 41.367l24.634-22.704c19.717-18.173 50.479-16.919 68.652 2.798l50.343 54.621c18.173 19.717 16.92 50.479-2.798 68.652l-24.795 22.854c11.534 21.894 20.708 45.22 27.182 69.641h33.737c26.815 0 48.585 21.77 48.585 48.585v74.282c0 26.815-21.77 48.585-48.585 48.585h-33.737c-8.913 33.62-22.943 65.167-41.203 93.755l22.246 24.137c18.173 19.717 16.919 50.479-2.798 68.652l-54.621 50.343c-19.718 18.173-50.48 16.92-68.653-2.798l-22.29-24.184c-21.971 11.601-45.389 20.823-69.91 27.324v32.313c0 26.815-21.77 48.585-48.585 48.585h-74.282c-26.815 0-48.585-21.77-48.585-48.585v-32.313c-32.904-8.723-63.822-22.348-91.924-40.042l-24.332 22.426c-19.717 18.173-50.479 16.919-68.652-2.798l-50.343-54.621c-18.173-19.717-16.919-50.479 2.798-68.652l23.565-21.72zm153.29-26.633c-71.988-78.105-67.021-199.96 11.084-271.95 78.105-71.987 199.96-67.021 271.95 11.084 71.987 78.105 67.021 199.96-11.084 271.95s-199.96 67.021-271.95-11.084z"
                                fill-rule="evenodd" />
                        </svg>
                    </div>
                </div>
        `
        this.modeContainer = this.shadowRoot.getElementById("modeContainer")
        this.contentPane = this.shadowRoot.getElementById("contentPane")
        this.contentControls = this.shadowRoot.getElementById("contentControls")
        this.settingsButton = this.shadowRoot.getElementById("settingsCog")
        this.shadowRoot.querySelector('#addEquation').addEventListener('click', () => {
            let gEContainer = this.shadowRoot.querySelector('#modeFuncGrid')
            let element = document.createElement('color-text')
            element.setAttribute('placeholder', 'Equation')
            element.setAttribute('style', 'width: 100%; height: calc(100% - 10px);font-size: 60px;')
            element.classList.add('dynamicEquation');
            this.equationFocusHandler(element)
            gEContainer.insertBefore(element, this.shadowRoot.querySelector('#addEquation'))
        })
        this.shadowRoot.querySelector('#fullContent').addEventListener('click', () => {
            if (this.modeContainer.classList.contains('fullScreen')) {
                this.modeContainer.classList.remove('fullScreen')
                //this.contentControls.style.visibility = 'visible'
                pullUpElements([this.contentControls])
                this.contentPane.style.height = ''
                this.contentPane.style.width = ''
                this.contentMethod()
            } else {
                this.modeContainer.classList.add('fullScreen')
                //this.contentControls.style.visibility = 'hidden'
                hideElements([this.contentControls])
                this.contentPane.style.height = 'calc(100% - 20px)'
                this.contentPane.style.width = 'calc(100% - 20px)'
                this.contentMethod()
            }

        })
    }
    setStyling() {
        let styling = "";
        if (this.modeContainer.offsetWidth / this.modeContainer.offsetHeight > 3 / 4) {
            this.orientation = "horizontal";
            styling = `
             .modeContainerClass{
                grid-template-areas:
                    "content controls";
                grid-template-columns: 66.6666% 33.3333%;
                grid-template-rows: 100%;
             }
             #contentPane{
                height: calc(100% - 20px);
                width: calc(100% - 10px);
                
             }
             .modeContainerClass.fullScreen {
                grid-template-columns: 100%;
              }
             .
            `
            if (this.inputOpen) {
                keypad.style = "width: calc(33.3333% - 10px); height: calc(100% - 60px) top: 60px; margin-left: 0px; left: 66.6666%;";
                this.shadowRoot.querySelector('#keypadStyling').innerHTML = `
                    .modeContainerClass {
                        grid-template-columns: 33.3333% 33.3333% 33.3333%;
                        grid-template-rows: 100%;
                    }
                    `
            }

        } else {
            this.orientation = "vertical";
            styling = `
            .modeContainerClass {
                grid-template-areas:
                  "content"
                  "controls";
                grid-template-rows: 66.6666% 33.3333%;
                grid-template-columns: 100%;
              }
              .modeContainerClass.fullScreen {
                grid-template-rows: 100%;
              }
            `
            if (this.inputOpen) {
                keypad.style = "height: calc(33.3333% - 26.6666px); top: calc(66.6666% + 16.6666px); left: 10px;";
                this.shadowRoot.querySelector('#keypadStyling').innerHTML = `
                .modeContainerClass {
                    grid-template-rows: 33.3333% 33.3333% 33.3333%;
                    grid-template-columns: 100%;
                }
                `
            }
        }
        this.shadowRoot.querySelector("#orientationStyle").innerHTML = styling;
    }
    equationFocusHandler(elem) {
        elem.addEventListener('focusin', (e) => {
            console.log("fucking work")
            this.inputOpen = true;
            let styling = "";
            if (this.orientation == "vertical") {
                styling = `
                    .modeContainerClass {
                        grid-template-rows: 33.3333% 33.3333% 33.3333%;
                    }
                `
                keypad.style = 'height: calc(33.3333% - 26.6666px); top: calc(66.6666% + 16.6666px); left: 10px;';
            } else if (this.orientation == "horizontal") {
                styling = `
                    .modeContainerClass {
                        grid-template-columns: 33.3333% 33.3333% 33.3333%;
                    }
                `
                keypad.style = 'width: calc(33.3333% - 10px); height: calc(100% - 60px) top: 60px; margin-left: 0px; left: 66.6666%;';
            }
            console.log(this.shadowRoot.querySelector('#keypadStyling'))
            console.log(this.orientation)
            this.shadowRoot.querySelector('#keypadStyling').innerHTML = styling;
        });
        elem.addEventListener('focusout', (e) => {
            console.log("focus lost")
            this.inputOpen = false;
            this.shadowRoot.querySelector('#keypadStyling').innerHTML = "";
            keypad.reset();
            hideElements([keypad]);
        });
        elem.addEventListener('input', (e) => {
            this.inputMethod();
        });
    }
    connectedInit() {
        if (!this.connectedOnce) {
            this.connectedOnce = true
            this.setStyling();
            appendMethod('mobileLandscape', () => {
                this.setStyling();
            })
            appendMethod('mobilePortrait', () => {
                this.setStyling();
            });
            this.equationFocusHandler(this.shadowRoot.querySelector('#initEquation'));
        }
    }
    contentMethod() {
        console.log("contentMethod")
    }
    getEquations() {
        let equations = []
        let equationElements = this.shadowRoot.querySelectorAll('.dynamicEquation')
        equationElements.forEach((element) => {
            equations.push(element.input.innerHTML)
        })
        return equations
    }

}
class graphMode extends templateMode {
    constructor() {
        super();
        this.shadowRoot.querySelector('#styler').innerHTML += `
        #contentContainer{
            width: calc(100% - 20px);
            height: calc(100% - 20px);
            margin-left: 10px;
            margin-top: 10px;
        }
        #graphCanvas{
            width: 100%;
            height: 100%;
        }
        #graphContainer{
            width: calc(100% - 20px);
            height: calc(100% - 20px);
            margin-left: 10px;
            margin-top: 10px;
            position: relative;
            display: block;
        }
        #graph
        `
        this.graphContainer = this.shadowRoot.querySelector('#contentContainer')
        this.graphContainer.innerHTML += `
            <div id="graphContainer">
                <canvas id="graphCanvas"></canvas>
            </div>
        `;
        let graphCanvas = this.shadowRoot.querySelector('#graphCanvas')
        this.ctx = graphCanvas.getContext('2d')

        this.settingsButton.addEventListener("click", () => {
            envObject.quickSettingsPane.open("Graph", [
                {
                    "title": "Range",
                    "type": "dRange",
                    "setMethod": (value1, value2) => {
                        setSetting('graphMin', value1);
                        setSetting('graphMax', value2);
                        this.graph.options.x.min = value1;
                        this.graph.options.x.max = value2;
                        this.graphInMode()
                    },
                    "range": [settings.gMin, settings.gMax],
                    "initMethod": () => {

                    }
                },
                {
                    "title": "Resolution",
                    "type": "range",
                    "setMethod": (value) => {
                        setSetting('graphRes', value);
                        this.graphInMode()
                    },
                    "value": settings.gR,
                    "initMethod": () => {
                    }
                },
            ], () => { this.graphInMode() });
        })
        this.inputMethod = () => {
            this.graphInMode()
        }

    }
    connectedCallback() {
        setTimeout(() => {
            this.connectedInit()
            if (this.key == undefined) {
                this.key = this.id;
                callCalc({ callType: "set", id: this.key, method: "env", envType: "dynamic", target: "graph" });
            }
            if (this.graph == undefined) {
                this.graph = createGraph(this.ctx);
                this.graph.options.plugins.zoom.zoom.onZoomComplete = () => {
                    this.graphInMode()
                }
                this.graph.options.plugins.zoom.pan.onPanComplete = () => {
                    setTimeout(() => {
                        let vars = getGraphVars(this.graph)
                        console.log("garph vars")
                        console.log(vars)
                        callCalc({ "callType": "env", "targetEnv": this.key, "method": "setGraphVar", "newVars": vars }).then(() => {
                            this.graphInMode()
                        });

                    })

                }
            }
        })
    }
    contentMethod() {
        this.graph.resize();
        this.graph.update();
    }
    graphInMode() {
        let equations = this.getEquations();
        let equationElements = this.shadowRoot.querySelectorAll('.dynamicEquation')
        callCalc({ "callType": "env", "targetEnv": this.key, "method": "setGraphVar", "newVars": getGraphVars(this.graph) }).then(() => {
            callCalc({ "callType": "env", "method": "solve", "targetEnv": this.key, "array": equations }).then((values) => {
                console.log(values)
                for (let i = 0; i < values.length; i++) {
                    let points = values[i].points
                    let extrema = values[i].extrema
                    if (values[i] == undefined) {
                        equationElements[i].alert();
                    } else {
                        let dataColor = equationElements[i].color
                        this.graph.data.datasets = [];
                        this.graph.data.datasets.push({
                            data: points,
                            label: "hidden",
                            fontColor: '#FFFFFF',
                            borderColor: dataColor,
                            backgroundColor: dataColor,
                            showLine: true,
                            pointRadius: 0,
                        });
                        this.graph.data.datasets.push({
                            data: extrema,
                            label: "hidden",
                            fontColor: '#FFFFFF',
                            borderColor: dataColor,
                            backgroundColor: dataColor,
                            showLine: false,
                            pointRadius: 5,
                        });
                    }
                }
                this.graph.update('none');
            })
        })
    }
    inputMethod() {
        this.graphInMode()
    }
}
customElements.define("graph-mode", graphMode);
class tableMode extends templateMode {
    constructor() {
        super();
        this.shadowRoot.querySelector('#styler').innerHTML += `
        #modeTable {
            width: 100%;
            height: 100%;
            border-spacing: 5px;
        }
          
        #modeTable td {
            background-color: var(--displayColor);
        }
        td {
            border-radius: 20px;
            text-indent: 10px;
            padding: 5px;
            background-color: var(--functionsColor);
        }
          
        th {
            width: 100px;
            margin: 5px;
            background-color: var(--numbersColor);
            border-radius: 20px;
        }
        `
        let tableContainer = this.shadowRoot.querySelector('#contentContainer')
        let table = document.createElement('adv-table')
        table.id = "modeTable"
        this.table = table
        tableContainer.appendChild(table)
        this.settingsButton.addEventListener("click", () => {
            envObject.quickSettingsPane.open("Table", [
                {
                    "title": "Range",
                    "type": "dRange",
                    "setMethod": (value1, value2) => {
                        setSetting('tableMin', value1);
                        setSetting('tableMax', value2);
                        this.tableInMode()
                    },
                    "range": [settings.tMin, settings.tMax],
                    "initMethod": () => {

                    }
                },
                {
                    "title": "Cells",
                    "type": "range",
                    "setMethod": (value) => {
                        setSetting('tableCells', value);
                        this.tableInMode()
                    },
                    "value": settings.tC,
                    "initMethod": () => {
                    }
                },
            ], () => { this.tableInMode() });
        })
        this.inputMethod = () => {
            this.tableInMode()
        }
    }
    connectedCallback() {
        setTimeout(() => {
            this.connectedInit()
            if (this.key == undefined) {
                this.key = this.id
                callCalc({ callType: "set", id: this.key, method: "env", envType: "dynamic", target: "table" });
                callCalc({ "callType": "env", "method": "log", "targetEnv": this.key });
            }
        })
    }
    tableInMode() {
        let equations = this.getEquations();
        this.table.clearTable();
        let equationElements = this.shadowRoot.querySelectorAll('.dynamicEquation')
        callCalc({ "callType": "env", "method": "solve", "targetEnv": this.key, "array": equations }).then((values) => {
            console.log(values)
            values.forEach((value, idx) => {
                this.table.addData(value, equationElements[idx].color)
            })
        })
    }
}
customElements.define("table-mode", tableMode);
class settingsSec extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
            * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
                font-family: ubuntu;
                color: var(--textColor);
                -webkit-tap-highlight-color: transparent;
            }
            input:focus, textarea:focus, select:focus{
                outline: none;
            }
            #settingsSection{
                min-width: 300px;
            }
            .svgText {
                fill: var(--textColor);
            }
            .calculationsLabels {
                display: flex;
                position: relative;
                align-self: center;
                align-content: center;
                width: calc(100% - 15px);
                color: var(--textColor);
                height: 35px;
            }
            .settingsTextInput {
                background-color: var(--numbersColor);
                border: none;
                border-width: 1.5px;
                height: 35px;
                width: 60px;
                text-align: center;
                color: var(--textColor);
                text-indent: 5px;
                font-size: 15px;
                border-radius: 8px;
                margin-right: 10px;
                right: 0;
                position: absolute;
            }
          
          .settingsButton {
            color: var(--textColor);
            background-color: var(--functionsColor);
            width: fit-content;
            padding-left: 10px;
            padding-right: 10px;
            font-size: 20px;
            height: 35px;
            right: 0px;
            margin-right: 10px;
            border-radius: 20px;
            border: none;
            position: absolute;
          }
          
          .settingsButton.active {
            background-color: var(--numbersColor);
          }
          .settingTitle {
            padding: 8.75px 0 8.75px;
            color: var(--textColor);
            text-align: left;
            text-overflow: ellipsis;
            position: inherit;
            align-self: center;
            margin-right: 15px;
            margin-left: 5px;
            font-size: 17.5px;
            height: 100%;
            line-height: 100%;
          }
          .colorPicker {
            align-self: center;
            height: 25px;
            position: relative;
            border-style: solid;
            border-color: var(--textColor);
            border-radius: 15px;
            outline: none;
            right: 15px;
            background-color: transparent;
            position: absolute;
          }
          
          .colorPicker::-webkit-color-swatch-wrapper {
            padding: 0;
          }
          
          .colorPicker::-webkit-color-swatch {
            border: none;
            border-radius: 15px;
          }
          .settingsContainer{
            display: grid;
            grid-auto-rows: 35px;
            grid-template-columns: 100%;
            grid-gap: 5px;
            justify-items: center;
            align-items: center;
          }
          .sectionTitle {
            color: var(--textColor);
            text-align: center;
            position: relative;
            width: fit-content;
            left: 5px;
            font-size: 30px;
            top: 5px;
            margin-bottom: 15px;
            background-color: var(--numbersColor);
            padding: 5px 10px;
            border-radius: 25px;
          }
          .settingsDiv {
            background-color: var(--displayColor);
            border-radius: 25px;
            align-self: center;
            position: relative;
            top: 5px;
            margin-bottom: 15px;
            left: 2.5%;
            width: 95%;
            filter: drop-shadow(-5px 5px 5px var(--translucent));
          }
            </style>
            <div id="settingsSection">
            </div>
        `
        this.settingsSection = this.shadowRoot.querySelector('#settingsSection')
    }
    static get observedAttributes() {
        return ['mode'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('mode')) {
            if (this.getAttribute('mode') == 'panes') {
                this.mode = 'panes'
            } else {
                this.mode = 'default'
            }
        }
    }
    populateSettings(settingArry) {
        let targetSection = this.settingsSection
        for (let setting of settingArry) {
            if (setting.type == "title") {
                if (this.mode == 'panes') {
                    let container = document.createElement('div')
                    container.classList.add('settingsDiv');
                    targetSection.appendChild(container)
                    targetSection = container
                }
                let sectTitle = document.createElement('h2');
                sectTitle.innerHTML = setting.value;
                sectTitle.classList.add("sectionTitle");
                targetSection.appendChild(sectTitle);
            } else {
                console.log(this.settingsSection.lastChild)
                if (this.settingsSection.lastChild.classList == undefined || !this.settingsSection.lastChild.classList.contains('settingsContainer')) {
                    this.currentContainer = document.createElement('div');
                    this.currentContainer.classList.add('settingsContainer');
                    targetSection.appendChild(this.currentContainer);
                }
                if (this.settingsSection.lastChild.classList != undefined && this.settingsSection.lastChild.classList.contains('settingsContainer')) {
                    this.currentContainer.style.marginLeft = "10px";
                }

                let settingContainer = document.createElement('label')
                settingContainer.id = setting.title + `Container`
                settingContainer.classList.add('calculationsLabels');
                settingContainer.innerHTML = `
                    <h5 class="settingTitle">${setting.title}</h5>
                `
                switch (setting.type) {
                    case "toggle":
                        let button1 = document.createElement('button')
                        let button2 = document.createElement('button')
                        button1.innerHTML = setting.options[0]
                        button1.style.right = "55px";
                        button1.classList.add("settingsButton")
                        button2.innerHTML = setting.options[1]
                        button2.classList.add("settingsButton")
                        let switchMethod = () => {
                            if (button1.classList.contains("active")) {
                                button1.classList.remove("active")
                                button2.classList.add("active")
                            }
                            else {
                                button2.classList.remove("active")
                                button1.classList.add("active")
                            }
                        }
                        button1.addEventListener("click", () => {
                            switchMethod()
                            setting.setMethod(button1.innerHTML)
                        });
                        button2.addEventListener("click", () => {
                            switchMethod()
                            setting.setMethod(button2.innerHTML)
                        });
                        if (setting.default) {
                            button1.classList.add("active")
                        } else {
                            button2.classList.add("active")
                        }
                        settingContainer.appendChild(button1)
                        settingContainer.appendChild(button2)
                        setting.initMethod(button1, button2);
                        break;
                    case "range":
                        let textInput = document.createElement('input');
                        textInput.type = "text";
                        textInput.id = setting.title + `Input`;
                        textInput.value = setting.value;
                        textInput.classList.add("settingsTextInput");
                        textInput.addEventListener("input", () => {
                            setting.setMethod(textInput.value)
                        });
                        settingContainer.appendChild(textInput);

                        setting.initMethod(textInput);
                        break;
                    case "dRange":
                        let textInput1 = document.createElement('input');
                        textInput1.type = "text";
                        textInput1.id = setting.title + `Input1`;
                        textInput1.value = setting.range[0];
                        textInput1.classList.add("settingsTextInput");
                        textInput1.style.right = "70px";
                        textInput1.addEventListener("input", () => {
                            setting.setMethod(textInput1.value, textInput2.value)
                        });
                        settingContainer.appendChild(textInput1);

                        let textInput2 = document.createElement('input');
                        textInput2.type = "text";
                        textInput2.id = setting.title + `Input2`;
                        textInput2.value = setting.range[1];
                        textInput2.classList.add("settingsTextInput");
                        textInput2.addEventListener("input", () => {
                            setting.setMethod(textInput1.value, textInput2.value)
                        });
                        settingContainer.appendChild(textInput2);
                        setting.initMethod(textInput1, textInput2);
                        break;
                    case "color":
                        let colorInput = document.createElement('input');
                        colorInput.type = "color";
                        colorInput.id = setting.title + `Input`;
                        colorInput.value = setting.value;
                        colorInput.classList.add("colorPicker");
                        colorInput.addEventListener("input", () => {
                            setting.setMethod(colorInput.value)
                        });
                        settingContainer.appendChild(colorInput);
                        setting.initMethod(colorInput);
                        break;
                }

                this.currentContainer.appendChild(settingContainer)

            }
        }
    }
    clearSettings() {
        this.settingsSection.innerHTML = '';
        this.currentContainer = undefined;
    }

}
customElements.define('settings-section', settingsSec);
class tabPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                #pageContainer {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                }
            </style>
            <div id="pageContainer">
            </div>
        `;
        this.pageContainer = this.shadowRoot.querySelector("#pageContainer")
    }
    static get observedAttributes() {
        return ['type'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('type')) {
            if (this.getAttribute('type') == 'main') {
                this.type = 'main'
            } else if (this.getAttribute('type') == 'template') {
                this.type = 'template'
            } else {
                this.type = 'template'
            }
        }
        if (this.hasAttribute('name')) {
            this.name = this.getAttribute('name')
        } else {
            this.name = this.id
        }
    }
    connectedCallback() {
        setTimeout(() => {
            if (this.tabInd == undefined) {
                this.pageContainer.append(...this.childNodes)
                this.parentElement.addMethod(this)
            }
        });
    }
    setTabName(name) {
        this.name = name
        this.definedInd.querySelector('#newTabName').innerHTML = name
    }
}
customElements.define('tab-page', tabPage);
class tabMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./styling/animations.css">
        <style>
        @font-face {
            font-family: ubuntu;
            src: url(../fontAssets/Roboto-Regular.ttf);
          }
          
          @font-face {
            font-family: ubuntu;
            src: url(../fontAssets/Roboto-Bold.ttf);
            font-weight: bold;
          }
          
          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
            font-family: ubuntu;
            color: var(--textColor);
            -webkit-tap-highlight-color: transparent;
          }
          
          .imgDivClass {
            aspect-ratio: 1 / 1;
          }
          
          .svgText {
            fill: var(--textColor);
          }
          
          .primary {
            fill: var(--functionsColor);
          }
          
          .secondary {
            fill: var(--displayColor);
          }
          
          .accent {
            fill: var(--numbersColor);
          }
          
          /*********************************Injected css from mode***********************************/
          
          /*end*/
          #mainPage{
            width: 100%;
            height: 100%;
          }
          
          #mobileTabs {
            visibility: inherit;
            z-index: 3;
            left: 0px;
            aspect-ratio: 1 / 1;
            height: 50px;
            position: absolute;
            background-color: transparent;
            border: none;
            display: grid;
            place-items: center;
          }
          
          #mobileTabs h3 {
            margin: 0;
          }
          
          #tabNum {
            margin: 0px;
          }

          #tabPageContainer{
            position: absolute;
            width: 100%;
            left: 0;
            top: 50px;
            bottom: 0;
            border-radius: 20px 20px 0 0;
            overflow: hidden;
            background-color: var(--displayColor);
          }
          
          #tabContainer {
            visibility: hidden;
            left: 0;
            top: 50px;
            height: calc(100% - 50px);
            width: 100%;
            display: grid; 
            grid-template-columns: repeat(auto-fill, 175px);
            grid-auto-rows: 290px;
            padding-top: 20px; 
            position: absolute;
            background-color: var(--semi-transparent); 
            border-radius: 20px 20px 0 0; 
            justify-content: space-evenly;
            justify-items: center; 
            overflow-y: auto;
          }
          
          .tablinks {
            visibility: inherit;
            position: relative;
            background-color: var(--displayColor);
            color: var(--textColor);
            border: none;
            padding: 0px 15px 0 15px;
            font-size: 17px;
            display: inline-flex;
            -webkit-tap-highlight-color: transparent;
            width: 175px; 
            height: 280px; 
            top: unset; 
            border-radius: 20px; 
            text-align: center;
          }
          
          button:focus {
            outline: none;
          }
          
          #tabContainer button h3 {
            font-size: 17px;
            font-weight: normal;
            margin-top: 6.5px;
          }
          
          .tablinks.active{
            background-color: var(--numbersColor);
          }
          
          #settingsCogIcon {
            top: 0;
            right: 0;
            width: 50px;
            height: 50px;
            position: absolute;
            aspect-ratio: 1 / 1;
          }
          
          ::-webkit-scrollbar {
            width: 10px;
          }
          
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          
          ::-webkit-scrollbar-thumb {
            width: 5px;
            background: #00000080;
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
          
          .tabcontent {
            
          }
          
          #mainPage {
            background-color: var(--functionsColor);
          }
          
          #tabNum {
            position: absolute;
          }
          
          .tabIcons {
            aspect-ratio: 1 / 1.45;
            bottom: 5px;
            left: 5px;
            height: 240.1575px;
            border: none;
            width: unset;
            filter: drop-shadow(-5px 5px 5px var(--translucent));
            position: absolute;
          }
          #tabRemove {
            right: 0;
          }
          #newTabName {
            width: calc(100% - 31.5px);
            text-align: start;
          }
          .svgText {
            fill: var(--textColor);
          }
          
          .settingCircle {
            fill: var(--textColor)
          }
          
          .primary {
            fill: var(--functionsColor);
          }
          
          .secondary {
            fill: var(--displayColor);
          }
          
          .accent {
            fill: var(--numbersColor);
          }
          
          .text {
            fill: var(--textColor)
          }
          .tabPage {
            position: absolute;
            width: 100%;
            height: 100%;
          }

        </style>
        <style id="typeStyle"></style>
        <div class="page" id="mainPage">
            <button id="mobileTabs">
                <svg id="mobileTabIcon" class="imgDivClass" width="50px" style="isolation:isolate"
                    viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="540" cy="540" r="500" fill-opacity=".2" vector-effect="non-scaling-stroke" />
                    <path class="svgText"
                        d="m171.54 540c0-203.36 165.1-368.46 368.46-368.46s368.46 165.1 368.46 368.46-165.1 368.46-368.46 368.46-368.46-165.1-368.46-368.46zm185.6 168.54c-93.017-100.92-86.6-258.38 14.322-351.39 100.92-93.017 258.38-86.6 351.39 14.322 93.017 100.92 86.6 258.38-14.322 351.39-100.92 93.017-258.38 86.6-351.39-14.322z"
                        fill-rule="evenodd" />
                </svg>
                <h3 id="tabNum">1</h3>
            </button>
            <div id="tabContainer">
                
            </div>
            <svg id="settingsCogIcon" name="Open Settings" style="isolation:isolate" viewBox="0 0 1080 1080"
                width="100%" height="100%">
                <circle vector-effect="non-scaling-stroke" cx="540" cy="540" r="500" fill="rgb(0,0,0)"
                    fill-opacity="0.2" />
                <path class="svgText"
                    d=" M 244.674 697.548 C 232.822 675.449 223.384 651.865 216.714 627.15 L 184.02 627.15 C 157.205 627.15 135.435 605.38 135.435 578.565 L 135.435 504.283 C 135.435 477.468 157.205 455.698 184.02 455.698 L 215.958 455.698 L 215.958 455.698 C 224.818 421.674 238.911 389.752 257.327 360.847 L 235.667 337.347 C 217.494 317.63 218.748 286.868 238.465 268.695 L 293.086 218.352 C 312.803 200.179 343.565 201.433 361.738 221.15 L 383.307 244.551 L 383.307 244.551 C 405.378 232.865 428.913 223.58 453.562 217.045 L 453.562 184.732 C 453.562 157.917 475.332 136.147 502.147 136.147 L 576.429 136.147 C 603.244 136.147 625.014 157.917 625.014 184.732 L 625.014 217.045 C 658.734 225.985 690.369 240.072 719.025 258.412 L 719.025 258.412 L 743.659 235.708 C 763.376 217.535 794.138 218.789 812.311 238.506 L 862.654 293.127 C 880.827 312.844 879.574 343.606 859.856 361.779 L 835.061 384.633 C 846.595 406.527 855.769 429.853 862.243 454.274 L 862.243 454.274 L 895.98 454.274 C 922.795 454.274 944.565 476.044 944.565 502.859 L 944.565 577.141 C 944.565 603.956 922.795 625.726 895.98 625.726 L 862.243 625.726 C 853.33 659.346 839.3 690.893 821.04 719.481 L 821.04 719.481 L 843.286 743.618 C 861.459 763.335 860.205 794.097 840.488 812.27 L 785.867 862.613 C 766.149 880.786 735.387 879.533 717.214 859.815 L 694.924 835.631 C 672.953 847.232 649.535 856.454 625.014 862.955 L 625.014 895.268 C 625.014 922.083 603.244 943.853 576.429 943.853 L 502.147 943.853 C 475.332 943.853 453.562 922.083 453.562 895.268 L 453.562 862.955 C 420.658 854.232 389.74 840.607 361.638 822.913 L 337.306 845.339 C 317.589 863.512 286.827 862.258 268.654 842.541 L 218.311 787.92 C 200.138 768.203 201.392 737.441 221.109 719.268 L 244.674 697.548 Z  M 397.96 670.915 C 325.972 592.81 330.939 470.954 409.044 398.966 C 487.149 326.979 609.005 331.945 680.993 410.05 C 752.98 488.155 748.014 610.011 669.909 681.999 C 591.804 753.987 469.948 749.02 397.96 670.915 L 397.96 670.915 L 397.96 670.915 L 397.96 670.915 L 397.96 670.915 L 397.96 670.915 Z "
                    fill-rule="evenodd" fill="rgb(255,255,255)" />
            </svg>

        <div id="tabPageContainer" class="tabcontent" style="display:flex" data-tab="mainTab">
            
        </div>
        
    </div>
        `;
        this.container = this.shadowRoot.querySelector('#mainPage');
        this.tabsContainer = this.shadowRoot.querySelector('#tabPageContainer');
        this.tabIndicatorContainer = this.shadowRoot.querySelector('#tabContainer');
        this.tabCount = this.shadowRoot.querySelector('#tabNum');
        this.tabList = [];
        this.tabLinks = [];
        this.mobileTabButton = this.shadowRoot.querySelector('#mobileTabs');
        this.addMethod = (page) => { this.addTab(page) };
        this.tabsContainer.addMethod = this.addMethod;

        this.tabIndicatorContainer.addEventListener('click', (e) => {
            this.tabIndController();
        });

        appendMethod('mobileLandscape', () => {
            this.setStyling();
        })
        appendMethod('mobilePortrait', () => {
            this.setStyling();
        });
        this.shadowRoot.querySelector('#settingsCogIcon').addEventListener('click', () => { });
        this.mobileTabButton.addEventListener('click', () => {
            if (!isHidden(this.tabIndicatorContainer)) {
                this.tabIndController(true)
            } else {
                this.tabIndController(false)
            }
        });
    }

    setStyling() {
        let type = this.type
        let orientation = "";
        let styling = "";
        if (this.container.offsetWidth / this.container.offsetHeight > 3 / 4) {
            orientation = "horizontal";
        } else {
            orientation = "vertical";
        }
        if (orientation == "horizontal") {
            styling = `
                #mobileTabs {
                    visibility: hidden;
                    z-index: -1;
                }
  
                #tabContainer {
                    position: absolute;
                    left: 0;
                    height: 40px;
                    right: 40px;
                    display: inline-flex;
                    top: 0;
                    padding: 0px;
                    overflow-y: hidden;
                    border-radius: 0;
                    justify-content: unset;
                    width: calc(100% - 40px);
                    background-color: unset;
                    visibility: inherit;
                }
  
                .tablinks {
                    position: relative;
                    background-color: var(--functionsColor);
                    color: var(--textColor);
                    height: 90%;
                    top: 10%;
                    width: fit-content;
                    visibility: inherit;
                    padding: 0px 15px 0 15px;
                    font-size: 17px;
                    border-radius: 15px 15px 0 0;
                    display: inline-flex;
                    -webkit-tap-highlight-color: transparent;
                }
  
                #tabContainer button h3 {
                    font-size: 17px;
                    font-weight: normal;
                    margin-top: 6.5px;
                }
  
                #settingsCogIcon {
                    top: 0;
                    right: 0;
                    position: absolute;
                    height : 40px;
                    width: 40px;
                    aspect-ratio: 1 / 1;
                }
  
                #tabPageContainer {
                    top: 40px;
                    border-radius: 0;
                }
                .tabIcons{
                    visibility: hidden;
                }
                .tablinks.active{
                    background-color: var(--displayColor);
                  }
            `;
            if (this.indVisible == undefined) {
                this.indVisible = false;
            }
        }
        this.shadowRoot.querySelector('#typeStyle').innerHTML = styling;
        this.orientation = orientation
    }
    setTabCount() {
        let elems = this.shadowRoot.querySelectorAll('tab-page')
        this.tabCount.innerHTML = elems.length;
    }
    createTabIndicator(name, page, type) {
        let tabButton = document.createElement('button');
        tabButton.classList.add('tablinks');
        tabButton.name = name;
        tabButton.innerHTML = `
        <h3 id="newTabName"></h3>
        <svg div id="tabRemove" class="imgDivClass" height="31.5px" style="isolation:isolate"
            viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
            <path
                d="m221.8 858.2c-175.62-175.62-175.62-460.78 0-636.4s460.78-175.62 636.4 0 175.62 460.78 0 636.4-460.78 175.62-636.4 0z"
                fill-opacity=".2" />
            <path class="svgText"
                d="m457.47 540-137.54 137.55 82.527 82.527 137.55-137.54 137.55 137.54 82.527-82.527-137.54-137.55 137.54-137.55-82.527-82.527-137.55 137.54-137.55-137.54-82.527 82.527 137.54 137.55z" />
        </svg>

        <svg class="displayBase tabIcons" id="displayFunc" preserveAspectRatio="none"
            style="isolation:isolate" viewBox="0 0 1080 1572" xmlns="http://www.w3.org/2000/svg">
            
        </svg>
        `;
        tabButton.querySelector('#newTabName').innerHTML = name;
        if (type == 'template') {
            tabButton.querySelector('#displayFunc').innerHTML = `
            <path class="secondary"
            d="m115.13-1.93h849.75c63.54 0 115.13 51.587 115.13 115.13v1342.7c0 63.54-51.587 115.13-115.13 115.13h-849.75c-63.54 0-115.13-51.587-115.13-115.13v-1342.7c0-63.54 51.587-115.13 115.13-115.13z"
            fill="#fff" />
            <path class="primary"
                d="m122.69 353.18h834.62c46.058 0 83.451 37.393 83.451 83.45v233.92c0 46.057-37.393 83.45-83.451 83.45h-834.62c-46.058 0-83.451-37.393-83.451-83.45v-233.92c0-46.057 37.393-83.45 83.451-83.45z"
                fill="#C1C1C1" />
            <path class="primary"
                d="m125.74 784.52h828.52c47.741 0 86.5 38.759 86.5 86.499v579.74c0 47.74-38.759 86.499-86.5 86.499h-828.52c-47.741 0-86.5-38.759-86.5-86.499v-579.74c0-47.74 38.759-86.499 86.5-86.499z"
                fill="#C1C1C1" />
            <path class="secondary"
                d="m130.26 822h70.486c26.634 0 48.257 21.508 48.257 48s-21.623 48-48.257 48h-70.486c-26.634 0-48.257-21.508-48.257-48s21.623-48 48.257-48z"
                fill="#fff" />
            <path class="accent"
                d="m115.11 948.3h88.776c18.275 0 33.112 14.837 33.112 33.113v69.474c0 18.276-14.837 33.113-33.112 33.113h-88.776c-18.275 0-33.112-14.837-33.112-33.113v-69.474c0-18.276 14.837-33.113 33.112-33.113z"
                fill="#D9D9D9" />
            <path class="accent"
                d="m123.37 386.3h833.26c30.974 0 56.122 25.148 56.122 56.123v23.454c0 30.975-25.148 56.123-56.122 56.123h-833.26c-30.974 0-56.122-25.148-56.122-56.123v-23.454c0-30.975 25.148-56.123 56.122-56.123z"
                fill="#D9D9D9" />
            <path class="secondary"
                d="m116.31 545h138.28c23.5 0 42.579 18.147 42.579 40.5s-19.079 40.5-42.579 40.5h-138.28c-23.5 0-42.579-18.147-42.579-40.5s19.079-40.5 42.579-40.5z"
                fill="#fff" />
            <circle class="accent" cx="113.37" cy="585.5" r="40.5" fill="#d9d9d9"
                vector-effect="non-scaling-stroke" />
            <circle class="text" cx="888.75" cy="176" r="124" vector-effect="non-scaling-stroke" />
            `;
        } else if (type == "main") {
            tabButton.querySelector('#displayFunc').innerHTML = `
            <path class="secondary"
                            d="m115.13-1.93h849.75c63.54 0 115.13 51.587 115.13 115.13v1342.7c0 63.54-51.587 115.13-115.13 115.13h-849.75c-63.54 0-115.13-51.587-115.13-115.13v-1342.7c0-63.54 51.587-115.13 115.13-115.13z"
                            fill="#fff" />
                        <path class="primary"
                            d="m115.74 36.9h848.51c42.224 0 76.504 34.28 76.504 76.504v435.82c0 42.224-34.28 76.504-76.504 76.504h-848.51c-42.224 0-76.504-34.28-76.504-76.504v-435.82c0-42.224 34.28-76.504 76.504-76.504z"
                            fill="#C1C1C1" />
                        <path class="primary"
                            d="m131.94 672.69h816.11c51.164 0 92.703 41.538 92.703 92.702v679.17c0 51.164-41.539 92.702-92.703 92.702h-816.11c-51.164 0-92.703-41.538-92.703-92.702v-679.17c0-51.164 41.539-92.702 92.703-92.702z"
                            fill="#C1C1C1" />
                        <path class="accent"
                            d="m137.07 672.69h603.72c53.996 0 97.833 43.837 97.833 97.833v382.32c0 53.996-43.837 97.833-97.833 97.833h-603.72c-53.996 0-97.833-43.837-97.833-97.833v-382.32c0-53.996 43.837-97.833 97.833-97.833z"
                            fill="#D9D9D9" />
                        <path class="secondary"
                            d="m128.68 458.82h822.64c40.147 0 72.741 32.269 72.741 72.015s-32.594 72.015-72.741 72.015h-822.64c-40.147 0-72.741-32.269-72.741-72.015s32.594-72.015 72.741-72.015z"
                            fill="#fff" />
                        <path class="secondary"
                            d="m119.76 65.8c29.906 0 54.185 24.279 54.185 54.185s-24.279 54.185-54.185 54.185-54.185-24.279-54.185-54.185 24.279-54.185 54.185-54.185z"
                            fill="#fff" />
                        <path class="secondary"
                            d="m892.82 65.8h67.43c29.906 0 54.185 24.279 54.185 54.185s-24.279 54.185-54.185 54.185h-67.43c-29.906 0-54.185-24.279-54.185-54.185s24.279-54.185 54.185-54.185z"
                            fill="#fff" />
                        <path class="accent"
                            d="m123.37 198.26h288.99c22.595 0 40.94 18.343 40.94 40.937v4.816c0 22.594-18.345 40.937-40.94 40.937h-288.99c-22.595 0-40.94-18.343-40.94-40.937v-4.816c0-22.594 18.345-40.937 40.94-40.937z"
                            fill="#D9D9D9" />
            `
            tabButton.classList.add('active');
            tabButton.querySelector('#tabRemove').remove();
            this.mainPage = page;
        }
        if (type != "main") {
            tabButton.querySelector('#tabRemove').addEventListener('click', () => {
                tabButton.remove();
                if (!isHidden(page)) {
                    this.openTab(this.mainPage);
                }
                page.remove();
                this.setTabCount();
            });
            page.style.visibility = 'hidden';
        }
        tabButton.addEventListener('click', (e) => {
            if (tabButton.querySelector('#tabRemove') == undefined || e.target != tabButton.querySelector('#tabRemove') && !tabButton.querySelector('#tabRemove').contains(e.target)) {
                //this.tabIndController(false);
                this.indVisible = false;
                this.openTab(page);
            }

        });
        this.tabIndicatorContainer.append(tabButton);
        this.tabLinks.push(tabButton)
        return tabButton;
    }
    addTab(page) {
        page.classList.add('tabPage');
        this.tabsContainer.append(page);
        this.tabList.push(page);
        page.tabInd = this.createTabIndicator(page.name, page, page.type);
        this.setTabCount();
        this.openTab(page);
    }
    openTabByName(name) {
        console.log(this.tabList)
        let page = this.tabList.find((tab) => {
            console.log(tab.name + " vs. " + name)
            return tab.name == name;
        })
        console.log(name)
        console.log(page)

        this.openTab(page);
    }
    openTab(page) {
        let tabPages = this.tabList.filter((tab) => {
            return tab != page;
        });
        this.tabLinks.forEach((elem) => {
            if (elem.classList.contains('active')) {
                elem.classList.remove('active');
            }
        })
        page.tabInd.classList.add('active');
        for (let tabPage of tabPages) {
            if (!isHidden(tabPage) && tabPage.hasAttribute('hasKeypad') && !isHidden(keypad)) {
                tabPage.returnKepad = true;
                hideElements([keypad]);
            }
        }
        if (page.returnKepad != undefined && page.returnKepad) {
            pullUpElements([keypad]);
        }
        hideElements(tabPages);
        pullUpElements([page]);
    }
    hasTab(name) {
        return this.tabList.find((tab) => {
            return tab.name == name;
        }) != undefined;
    }
    tabIndController(visibility) {
        if (arguments[0] == undefined) {
            if (isHidden(this.tabIndicatorContainer)) {
                visibility = true;
            } else {
                visibility = false;
            }
        }
        if (this.orientation == 'vertical') {
            if (visibility) {
                this.tabIndicatorContainer.style.zIndex = '5';
                pullUpElements([this.tabIndicatorContainer]);
                console.log('pulling up')
            } else {
                this.tabIndicatorContainer.style.zIndex = '-1';
                hideElements([this.tabIndicatorContainer]);
                console.log('hiding')
            }
        }
    }
    connectedCallback() {
        setTimeout(() => {

            this.tabsContainer.append(...this.childNodes)
            this.setTabCount();
        });
    }
}
customElements.define('tab-menu', tabMenu);
class equationMap extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.innerHTML = `
        <style>
        @font-face {
            font-family: ubuntu;
            src: url(../fontAssets/Roboto-Regular.ttf);
          }
          
          @font-face {
            font-family: ubuntu;
            src: url(../fontAssets/Roboto-Bold.ttf);
            font-weight: bold;
          }
          
          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
            font-family: ubuntu;
            color: var(--textColor);
            -webkit-tap-highlight-color: transparent;
          }
          
          .imgDivClass {
            aspect-ratio: 1 / 1;
          }
          
          .svgText {
            fill: var(--textColor);
          }
          #varEquationContainer {
            background-color: var(--functionsColor);
            display: block;
            flex-wrap: wrap;
            border-radius: 25px;
            top: 15%;
            height: inherit;
            max-height: inherit;
            overflow-y: auto;
            overflow-x: hidden;
            width: 100%;
            padding: 10px;
            filter: drop-shadow(-5px 5px 5px var(--translucent));
          }
          
          #varGrid {
            width: 100%;
            height: auto;
            position: relative;
            display: grid;
            grid-template-columns: 33.3333% 33.3333% 33.3333%;
            grid-auto-rows: 35px;
            justify-items: center;
            align-items: center;
          }
          
          .variableContainer {
            background-color: var(--displayColor);
            height: 25px;
            width: 95%;
            border-radius: 25px;
            display: inline-block;
            flex-wrap: nowrap;
          }
          
          #varLabel {
            display: inline-flex;
            width: 100%;
          }
          
          #variableName {
            border-radius: 25px;
            height: 25px;
            min-width: 25px;
            padding-left: 7.5px;
            padding-right: 7.5px;
            flex-shrink: 0;
            text-align: center;
            background-color: var(--numbersColor);
          }
          
          #variableEntry {
            border: none;
            background-color: transparent;
            left: 25px;
            width: 100%;
            bottom: 0;
            margin-right: 2.5px;
            height: 25px;
            text-align: center;
          }
          
          #EquationFunc {
            border-radius: 20px;
            height: 75px;
            width: 100%;
            display: block;
            overflow-x: hidden;
            color: var(--textColor);
            background-color: var(--numbersColor);
            z-index: 0;
            font-size: 60px;
            position: relative;
          }
        </style>
        <div id="varEquationContainer" value="">
            <rich-input id="EquationFunc" placeholder="Equation" style="padding-left: 10px;"></rich-input>
            <div id="varGrid"></div>
        </div>
        `;
        this.vars = [];
        this.richInput = this.shadowRoot.querySelector('#EquationFunc');
        this.input = this.richInput.input;
        this.varGrid = this.shadowRoot.querySelector('#varGrid');
        this.ogEquation = '';
    }
    static get observedAttributes() {
        return ['type', 'name'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('type')) {
            if (this.getAttribute('type') == 'func') {
                this.type = 'func'
            } else {
                this.type = 'equation'
            }
        } else {
            this.type = 'equation'
        }
        if (this.hasAttribute('name')) {
            this.name = this.getAttribute('name');

        }
    }
    connectedCallback() {
        setTimeout(() => {
            if (this.input == undefined) {
                this.input = this.richInput.input;
                this.input.addEventListener('input', () => {
                    this.ogEquation = this.input.innerHTML;
                    this.checkVar();
                });
                this.input.addEventListener('focus', (e) => {
                    this.input.innerHTML = this.ogEquation
                });
            }
        });
    }
    checkVar() {
        let callMethod;
        console.log(this.vars)
        if (this.type == 'func') {
            callMethod = callCalc({ "callType": "get", 'method': 'vars', "existing": true, "funcName": this.name })
        } else {
            callMethod = callCalc({ "callType": "get", 'method': 'vars', "existing": false, "text": this.input.innerHTML })
        }
        console.log(callMethod)
        callMethod.then(value => {
            let checkList = value;
            console.log(checkList)
            let varExisting = [...this.vars];
            let newVars = [];
            for (let eVar of checkList) {
                let matching = false;
                for (let cVar of varExisting) {
                    console.log(`${eVar.letter} == ${cVar.letter}}`)
                    if (eVar.letter == cVar.letter) {
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
                oldVar.element.remove();
            }
            for (let newVar of newVars) {
                this.createVar(newVar);
            }
            console.log(JSON.stringify(this.vars));
        })
    }
    createVar(name) {
        let varContainer = document.createElement('div');
        varContainer.classList.add('variableContainer');
        varContainer.innerHTML = `
            <label id="varLabel">
                <h3 id="variableName"></h3>
                <rich-input id="variableEntry" placeholder="value"></rich-input>
            </label>
        `;
        let variableEntry = varContainer.querySelector('#variableEntry');
        varContainer.querySelector('#variableName').innerHTML = name;
        variableEntry.input.addEventListener('input', (e) => {
            console.log("input")
            if (this.type == 'func') {
                callCalc({ callType: "set", method: "var", targetEnv: this.name, target: name, value: variableEntry.value }).then((value) => {
                    this.parentVarCallBack(value);
                });

            }
            this.parseEquation();
        });
        this.varGrid.appendChild(varContainer);
        this.vars.push({
            'letter': name,
            get value() {
                console.log("querying value")
                return varContainer.querySelector('#variableEntry').input.innerHTML
            },
            "element": varContainer
        });
        return varContainer;
    }
    setEquation(equation) {
        this.input.innerHTML = equation;
        this.ogEquation = equation;
        this.checkVar();
    }
    parseEquation() {
        let promiseEquation;
        if (this.type == "func") {
            promiseEquation = callCalc({ callType: "get", method: "parseEquation", existing: true, funcName: this.name })
        } else {
            let parsedVars = JSON.parse(JSON.stringify(this.vars));
            promiseEquation = callCalc({ callType: "get", method: "parseEquation", text: this.ogEquation, vars: parsedVars })
        }
        promiseEquation.then(value => {
            this.input.innerHTML = value;
        });
    }
    /**
     * @param {string} equation
     */
    set equat(equation) {
        this.ogEquation = equation;
        this.input.innerHTML = equation;
        this.checkVar();
    }
}
customElements.define('equation-map', equationMap);
class slideSwitcher extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            #modeSwitcher {
                height: 40px;
                display: block;
                width: fit-content;
            }
            #modeSwitcher button{
                height: 100%;
                width: 70px;
                background-color: transparent;
                color: var(--textColor);
                border: none;
                border-radius: 25px;
                z-index: 2;
            }
            #selectorSlider {
                height: 40px;
                width: 70px;
                position: absolute;
                background-color: var(--displayColor);
                border-radius: 25px;
                transition: all 0.2s;
            }
            #buttonContainer{
                display: grid;
                grid-auto-columns: 70px;
                grid-auto-flow: column;
                height: 100%;
            }
        </style>
        <div id=modeSwitcher>
            <div id="selectorSlider"></div>
            <div id="buttonContainer">
            </div>
        </div>
        `
        this.buttonCount = 0;
        this.buttonContainer = this.shadowRoot.querySelector('#buttonContainer');
        this.selectorSlider = this.shadowRoot.querySelector('#selectorSlider');
    }
    addButton() {
        let button;
        if (arguments[0] != undefined && arguments[0].nodeName === 'BUTTON') {
            button = arguments[0];
            button.style = "unset";
        } else if (arguments != undefined && typeof arguments[0] === typeof "") {
            button = document.createElement('button');
            button.innerHTML = arguments[0];
        } else {
            button = document.createElement('button');
        }
        let buttonIndex = this.buttonCount;
        //button.containerIndex = buttonIndex;
        console.log(button)
        button.addEventListener('click', (e) => {
            this.moveSlider(buttonIndex);
            this.dispatchEvent(new CustomEvent('switch', { detail: buttonIndex }));
        });
        this.buttonContainer.appendChild(button);
        this.buttonCount++;
        return button;
    }
    moveSlider(index) {
        this.selectorSlider.style.marginLeft = `${index * 70}px`;
    }
    static get observedAttributes() {
        return ['selectColor'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('selectColor')) {
            let selectColor = this.getAttribute('selectColor');
            if(selectColor == "primary"){
                this.selectorSlider.style.backgroundColor = "var(--functionsColor)";
            }else if(selectColor == "secondary"){
                this.selectorSlider.style.backgroundColor = "var(--displayColor)";
            }else if(selectColor == "accent"){
                this.selectorSlider.style.backgroundColor = "var(--numbersColor)";
            }else{
                this.selectorSlider.style.backgroundColor = selectColor;
            }
        }
    }
}
customElements.define('slide-switcher', slideSwitcher);
class dataViewer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./styling/animations.css">
        <style>
        @font-face {
            font-family: ubuntu;
            src: url(../fontAssets/Roboto-Regular.ttf);
          }
          
          @font-face {
            font-family: ubuntu;
            src: url(../fontAssets/Roboto-Bold.ttf);
            font-weight: bold;
          }
          
          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
            font-family: ubuntu;
            color: var(--textColor);
            -webkit-tap-highlight-color: transparent;
          }
          
          #resultPane {
            background-color: var(--functionsColor);
            width: 100%;
            height: 100%;
            border-radius: 25px;
            filter: drop-shadow(-5px 5px 5px var(--translucent));
            display: grid;
            grid-template-areas: "switcher" "data";
            grid-template-rows: 50px calc(100% - 50px);
            padding: 10px;
          }
          
          .funcModes {
            overflow-y: scroll;
          }
          
          #modeSwitcher {
            top: 10px;
            left: 10px;
            display: inline-block;
            width: fit-content;
            grid-area: switcher;
          }
          
          .modeButton {
            height: 100%;
            width: 70px;
            background-color: transparent;
            border: none;
            border-radius: 25px;
            z-index: 2;
          }
          #modeContainer{
            width: 100%;
            height: 100%;
            position: absolute;
            grid-area: data;
          }
        </style>
        <div id="resultPane">
            <slide-switcher id=modeSwitcher></slide-switcher>
            <div id="modeContainer">

            </div>
        </div>
        `;
        this.modeContainer = this.shadowRoot.querySelector('#modeContainer');
        this.modeSwitcher = this.shadowRoot.querySelector('#modeSwitcher');
        this.selector = this.shadowRoot.querySelector('#selectorSlider');
        this.inputData = {};
        this.nameList = [];
        this.pages = [];
        this.addDataPage = (name, page) => {
            console.log("triggers")
            if (!this.nameList.includes(name)) {
                let button = document.createElement('button');
                button.innerHTML = name;
                button.addEventListener('click', () => {
                    this.pageSelector(page)
                });
                this.modeSwitcher.addButton(button);
                this.inputData[page.pageName] = (entry) => page.parseMethod(entry);
                page.onUpdate = (value) => { this.upstreamRequest(value) }
                page.key = this.name;
                if (this.nameList.length > 0) {
                    page.style.visibility = "hidden";
                }
                this.nameList.push(name);
                this.pages.push(page);
                this.modeContainer.appendChild(page);
                return button;
            }
        }
        this.modeContainer.addDataPage = this.addDataPage;
    }
    pageSelector(tPage) {
        let hiddenPages = [...this.pages].filter(page => page != tPage)
        hideElements(hiddenPages);
        pullUpElements([tPage]);
    }
    connectedCallback() {
        setTimeout(() => {
        });
    }
    static get observedAttributes() {
        return ['name'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('name')) {
            this.name = this.getAttribute('name');
        }
    }
}
customElements.define('data-viewer', dataViewer);
class dataPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
                font-family: ubuntu;
                color: var(--textColor);
                 -webkit-tap-highlight-color: transparent;
            }
            #dataContainer{
                height: 100%;
                width: 100%;
                max-height: 100%;
                display: block;
            }
            .svgText {
                fill: var(--textColor);
              }
        </style>
        <div id="dataContainer">
            
        </div>
        `;
        this.container = this.shadowRoot.querySelector('#dataContainer');

    }
    static get observedAttributes() {
        return ['name'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('name')) {
            this.name = this.getAttribute('name');

        }
    }
    dataQuery() {
        //can either be a single data point or a range of data points
    }
    parseMethod(data) {
        //parses the data for display on the page
    }
    connectedCallback() {
        if (this.once == undefined) {
            this.parent = this.parentElement;
            this.parent.addDataPage(this.pageName, this);
            this.once = true;
        }
    }
}
class singleData extends dataPage {
    constructor() {
        super();
        this.container.innerHTML = `
        <style>
        @font-face {
            font-family: ubuntu;
            src: url(../fontAssets/Roboto-Regular.ttf);
          }
          
          @font-face {
            font-family: ubuntu;
            src: url(../fontAssets/Roboto-Bold.ttf);
            font-weight: bold;
          }
          
          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
            font-family: ubuntu;
            color: var(--textColor);
            -webkit-tap-highlight-color: transparent;
          }
          
          button:focus {
            outline: none;
          }
          
          #funcModify {
            align-content: center;
            display: inline-block;
            left: 1.5px;
            padding-top: 10px;
          }
          
          #funcModify:hover .drop-cont {
            display: block;
          }
          
          .drop-cont {
            display: none;
            background-color: var(--numbersColor);
            min-width: 50px;
            z-index: 1;
            border-radius: 0px 0 15px 15px;
          }
          
          .drop-cont a {
            color: var(--textColor);
            padding: 5px 5px;
            text-align: center;
            text-decoration: none;
            display: block;
          }
          
          #funcModify:hover #modBtn {
            border-radius: 15px 15px 0px 0px;
          }
          
          #modBtn {
            background-color: var(--numbersColor);
            color: var(--textColor);
            border-radius: 25px;
            width: 50px;
            font-size: 15px;
            border: none;
            cursor: pointer;
            align-self: center;
            height: 35px;
            -webkit-tap-highlight-color: transparent;
          }
          
          #equalsHeader {
            margin-top: 10px;
            padding: 5px;
            padding-left: 10px;
            padding-right: 10px;
            border-radius: 25px;
            background-color: var(--numbersColor);
            width: fit-content;
            max-width: 100%;
            font-size: 45px;
            overflow: auto;
          }
          
        </style>
        <div id="funcModify">
            <button id="modBtn">deg</button>
            <div class="drop-cont">
                <a id="selectorRad">rad</a>
                <a id="selectorDeg">deg</a>
            </div>
        </div>
        <h2 id="equalsHeader">=</h2>
        `;
        this.target = "singleData";
        this.pageName = "Function";
        this.modBtn = this.shadowRoot.querySelector('#modBtn');
        this.selectorRad = this.shadowRoot.querySelector('#selectorRad');
        this.selectorDeg = this.shadowRoot.querySelector('#selectorDeg');
        this.equalsHeader = this.shadowRoot.querySelector('#equalsHeader');
        this.selectorDeg.addEventListener("click", () => {
            this.modBtn.innerHTML = "deg";
            setSetting("degRad", true)
        })
        this.selectorRad.addEventListener('click', () => {
            this.modBtn.innerHTML = "rad";
            setSetting("degRad", false)
        })
    }
    get dataQuery() {
        return {
            type: "single",
            name: "singleData"
        }
    }
    parseMethod(data) {
        if (data != undefined) {
            this.equalsHeader.innerHTML = "=" + data;
        }
    }
}
customElements.define('single-data', singleData);
class graphData extends dataPage {
    constructor() {
        super();
        this.container.innerHTML = `
            <style>
              * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
                font-family: ubuntu;
                color: var(--textColor);
                -webkit-tap-highlight-color: transparent;
              }
              
              input:focus {
                outline: none;
              }
              
              #graphContainer {
                height: 100%;
                padding: 5px;
                position: absolute;
                display: block;
                width: 100%;
                background-color: var(--displayColor);
                border-radius: 20px;
              }
              
              #funcChart {
                height: 100%;
                width: 100%;
              }
              
              .selectorDiv {
                background-color: var(--numbersColor);
                padding: 5px;
                border-radius: 0 0 25px 25px;
                width: 140px;
              }
              
              .secondaryFuncHeaders {
                color: var(--textColor);
                text-align: left;
                position: relative;
                font-weight: bold;
                font-size: 25px;
                background-color: var(--numbersColor);
                padding: 5px 10px;
                border-radius: 25px 25px 25px 25px;
                margin-top: 10px;
                width: 140px;
              }
              
              .funcHeaders {
                margin: 5px;
                padding-left: 10px;
                padding-right: 5px;
                padding-bottom: 5px;
                padding-top: 5px;
                border-radius: 25px;
                width: fit-content;
                background-color: var(--functionsColor);
              }
              
              .funcInputs {
                margin-left: 5px;
                height: 25px;
                width: 60px;
                padding-left: 14px;
                border-radius: 25px;
                border: none;
                background-color: var(--displayColor);
                text-align: center;
              }
              #settingsCog {
                aspect-ratio: 1/1;
                height: 50px;
                width: 50px;
                position: absolute;
                bottom: 0;
                right: 0;
              }
            </style>
            <div id="graphContainer"><canvas id="funcChart"></canvas></div>
            <svg id="settingsCog" class="imgDivClass" style="height: 50px;isolation:isolate"
                viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="540" cy="540" r="500" fill-opacity=".2" vector-effect="non-scaling-stroke" />
                    <path class="svgText"
                        d="m244.67 697.55c-11.852-22.099-21.29-45.683-27.96-70.398h-32.694c-26.815 0-48.585-21.77-48.585-48.585v-74.282c0-26.815 21.77-48.585 48.585-48.585h31.938c8.86-34.024 22.953-65.946 41.369-94.851l-21.66-23.5c-18.173-19.717-16.919-50.479 2.798-68.652l54.621-50.343c19.717-18.173 50.479-16.919 68.652 2.798l21.569 23.401c22.071-11.686 45.606-20.971 70.255-27.506v-32.313c0-26.815 21.77-48.585 48.585-48.585h74.282c26.815 0 48.585 21.77 48.585 48.585v32.313c33.72 8.94 65.355 23.027 94.011 41.367l24.634-22.704c19.717-18.173 50.479-16.919 68.652 2.798l50.343 54.621c18.173 19.717 16.92 50.479-2.798 68.652l-24.795 22.854c11.534 21.894 20.708 45.22 27.182 69.641h33.737c26.815 0 48.585 21.77 48.585 48.585v74.282c0 26.815-21.77 48.585-48.585 48.585h-33.737c-8.913 33.62-22.943 65.167-41.203 93.755l22.246 24.137c18.173 19.717 16.919 50.479-2.798 68.652l-54.621 50.343c-19.718 18.173-50.48 16.92-68.653-2.798l-22.29-24.184c-21.971 11.601-45.389 20.823-69.91 27.324v32.313c0 26.815-21.77 48.585-48.585 48.585h-74.282c-26.815 0-48.585-21.77-48.585-48.585v-32.313c-32.904-8.723-63.822-22.348-91.924-40.042l-24.332 22.426c-19.717 18.173-50.479 16.919-68.652-2.798l-50.343-54.621c-18.173-19.717-16.919-50.479 2.798-68.652l23.565-21.72zm153.29-26.633c-71.988-78.105-67.021-199.96 11.084-271.95 78.105-71.987 199.96-67.021 271.95 11.084 71.987 78.105 67.021 199.96-11.084 271.95s-199.96 67.021-271.95-11.084z"
                        fill-rule="evenodd" />
            </svg>
        `;
        let graphCanvas = this.shadowRoot.querySelector('#funcChart')
        this.ctx = graphCanvas.getContext('2d')
        this.target = "graphData"
        this.pageName = "Graph"
        this.settingsButton = this.shadowRoot.querySelector('#settingsCog')
        this.settingsButton.addEventListener("click", () => {
            envObject.quickSettingsPane.open("Graph", [
                {
                    "title": "Range",
                    "type": "dRange",
                    "setMethod": (value1, value2) => {
                        setSetting('graphMin', value1);
                        setSetting('graphMax', value2);
                        this.graph.options.x.min = value1;
                        this.graph.options.x.max = value2;
                        this.graphInMode()
                    },
                    "range": [settings.gMin, settings.gMax],
                    "initMethod": () => {

                    }
                },
                {
                    "title": "Resolution",
                    "type": "range",
                    "setMethod": (value) => {
                        setSetting('graphRes', value);
                        this.graphInMode()
                    },
                    "value": settings.gR,
                    "initMethod": () => {
                    }
                },
            ], () => { this.graphInMode() });
        })
    }
    parseMethod(packet) {
        console.log(this.graph.data)
        if (packet != undefined) {
            this.graph.data.datasets[0].data = packet.points;
            this.graph.data.datasets[1].data = packet.extrema;
            this.graph.update();
        }
    }
    get graphVars() {
        return {
            "gMin": this.graph.scales.x == undefined ? settings.gMin : Number(this.graph.scales.x.min),
            "gMax": this.graph.scales.x == undefined ? settings.gMax : Number(this.graph.scales.x.max)
        }
    }
    graphChangeMethod() {
        let changeFunc = () => {
            console.log(this.key)
            callCalc({ 'callType': 'set', 'method': 'envVar', "targetEnv": this.key, "newVars": this.graphVars }).then((value) => {
                console.log(value)
                this.parseMethod(value)
            });
        }
        this.graph.options.plugins.zoom.zoom.onZoomComplete = changeFunc;
        this.graph.options.plugins.zoom.pan.onPanComplete = changeFunc;
    }
    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            if (this.graph == undefined) {
                this.graph = createGraph(this.ctx)
                this.graphChangeMethod();
            }
        });
    }

}
customElements.define('graph-data', graphData);
class tableData extends dataPage {
    constructor() {
        super()
        this.container.innerHTML = `
            <style>
            #dataTable {
                width: 100%;
                height: 100%;
                border-spacing: 5px;
            }
              
            #dataTable td {
                background-color: var(--displayColor);
            }
            td {
                border-radius: 20px;
                text-indent: 10px;
                padding: 5px;
                background-color: var(--functionsColor);
            }
              
            th {
                width: 100px;
                margin: 5px;
                background-color: var(--numbersColor);
                border-radius: 20px;
            }
            #settingsCog {
                aspect-ratio: 1/1;
                height: 50px;
                width: 50px;
                position: absolute;
                bottom: 0;
                right: 0;
              }
            </style>
            <adv-table id="dataTable"></adv-table>
            <svg id="settingsCog" class="imgDivClass" style="height: 50px;isolation:isolate"
                viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="540" cy="540" r="500" fill-opacity=".2" vector-effect="non-scaling-stroke" />
                    <path class="svgText"
                        d="m244.67 697.55c-11.852-22.099-21.29-45.683-27.96-70.398h-32.694c-26.815 0-48.585-21.77-48.585-48.585v-74.282c0-26.815 21.77-48.585 48.585-48.585h31.938c8.86-34.024 22.953-65.946 41.369-94.851l-21.66-23.5c-18.173-19.717-16.919-50.479 2.798-68.652l54.621-50.343c19.717-18.173 50.479-16.919 68.652 2.798l21.569 23.401c22.071-11.686 45.606-20.971 70.255-27.506v-32.313c0-26.815 21.77-48.585 48.585-48.585h74.282c26.815 0 48.585 21.77 48.585 48.585v32.313c33.72 8.94 65.355 23.027 94.011 41.367l24.634-22.704c19.717-18.173 50.479-16.919 68.652 2.798l50.343 54.621c18.173 19.717 16.92 50.479-2.798 68.652l-24.795 22.854c11.534 21.894 20.708 45.22 27.182 69.641h33.737c26.815 0 48.585 21.77 48.585 48.585v74.282c0 26.815-21.77 48.585-48.585 48.585h-33.737c-8.913 33.62-22.943 65.167-41.203 93.755l22.246 24.137c18.173 19.717 16.919 50.479-2.798 68.652l-54.621 50.343c-19.718 18.173-50.48 16.92-68.653-2.798l-22.29-24.184c-21.971 11.601-45.389 20.823-69.91 27.324v32.313c0 26.815-21.77 48.585-48.585 48.585h-74.282c-26.815 0-48.585-21.77-48.585-48.585v-32.313c-32.904-8.723-63.822-22.348-91.924-40.042l-24.332 22.426c-19.717 18.173-50.479 16.919-68.652-2.798l-50.343-54.621c-18.173-19.717-16.919-50.479 2.798-68.652l23.565-21.72zm153.29-26.633c-71.988-78.105-67.021-199.96 11.084-271.95 78.105-71.987 199.96-67.021 271.95 11.084 71.987 78.105 67.021 199.96-11.084 271.95s-199.96 67.021-271.95-11.084z"
                        fill-rule="evenodd" />
            </svg>
        `
        this.target = "tableData"
        this.pageName = "Table"
        this.table = this.shadowRoot.querySelector('#dataTable')
        this.settingsButton = this.shadowRoot.querySelector('#settingsCog')
        this.settingsButton.addEventListener("click", () => {
            envObject.quickSettingsPane.open("Table", [
                {
                    "title": "Range",
                    "type": "dRange",
                    "setMethod": (value1, value2) => {
                        setSetting('tableMin', value1);
                        setSetting('tableMax', value2);
                        this.tableInMode()
                    },
                    "range": [settings.tMin, settings.tMax],
                    "initMethod": () => {

                    }
                },
                {
                    "title": "Cells",
                    "type": "range",
                    "setMethod": (value) => {
                        setSetting('tableCells', value);
                        this.tableInMode()
                    },
                    "value": settings.tC,
                    "initMethod": () => {
                    }
                },
            ], () => { this.tableInMode() });
        })
        this.container.appendChild(this.table)
    }
    parseMethod(packet) {
        this.table.clearTable();
        this.table.addData(packet)
    }
}
customElements.define('table-data', tableData);
class funcPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    static get observedAttributes() {
        return ['name'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('name')) {
            this.name = this.getAttribute('name');
            this.initMethod();
        }
    }
}
class customFuncPage extends funcPage {
    constructor() {
        super();
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./styling/animations.css">
        <style>
            #pageContainer {
                width: 100%;
                height: 100%;
                position: absolute;
            }
        </style>
        <iframe
        `;
    }
    initMethod() {
        funcList
    }
}
class templateFuncPage extends funcPage {
    constructor() {
        super();
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./styling/animations.css">
            <style>
                #pageContainer {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    display: flex;
                    flex-flow: column;
                }
                #nameInput {
                    font-size: 100px; 
                    height: 100px; 
                    direction: rtl; 
                    padding: 0 10px 0 10px;
                }
                #equationMap{
                    width: calc(100% - 20px);
                    height: fit-content;
                    max-height: 230px;
                    margin-left: 10px;
                }
                #dataViewer{
                    width: calc(100% - 20px); 
                    margin: 10px; 
                    flex-grow: 1; 
                }
                .imgDivClass {
                    position: absolute;
                    visibility: inherit;
                    margin-left: 5px;
                    margin-top: 5px;
                }
                .svgText {
                    fill: var(--textColor);
                }
                .primary {
                    fill: var(--functionsColor);
                }
            </style>
            <div id="pageContainer">
                <rich-input id="nameInput"></rich-input>
                <equation-map id="equationMap"></equation-map>
                <svg id="editIcon" class="imgDivClass" height="42.5px"
                style="isolation:isolate;" viewBox="0 0 1080 1080"
                xmlns="http://www.w3.org/2000/svg">
                    <circle class="primary" cx="540" cy="540" r="540" vector-effect="non-scaling-stroke"/>
                    <path class="svgText" d="m253.93 811.84c-1.505 0.419-3.119-2e-3 -4.227-1.102-1.107-1.098-1.541-2.711-1.133-4.219 5.403-19.997 20.293-75.131 25.649-94.957 0.405-1.495 1.574-2.66 3.067-3.064 1.497-0.401 3.092 0.022 4.192 1.114 14.493 14.387 54.625 54.223 69.118 68.61 1.098 1.09 1.534 2.685 1.146 4.183-0.391 1.5-1.55 2.674-3.042 3.09-19.788 5.501-74.811 20.801-94.768 26.346l-2e-3 -1e-3zm449.5-531.86 79.095 78.514 40.135-40.432c15.001-15.113 10.654-43.794-9.708-64.006l-2.656-2.636c-21.826-21.667-52.606-26.103-68.689-9.9l-38.177 38.46zm-405.91 407.24 384.64-387.5c3.829-3.857 10.07-3.881 13.928-0.051l65.247 64.767c3.857 3.829 3.88 10.07 0.051 13.927l-384.64 387.5c-3.829 3.858-10.07 3.881-13.928 0.051l-65.247-64.767c-3.857-3.829-3.88-10.07-0.051-13.927z" fill-rule="evenodd"/>
                </svg>
                <svg id="shareIcon" class="imgDivClass" style="left:47.5px;" height="42.5px"
                style="isolation:isolate;" viewBox="0 0 1080 1080"
                xmlns="http://www.w3.org/2000/svg">
                    <circle class="primary" cx="540" cy="540" r="540" vector-effect="non-scaling-stroke"/>
                    <path class="svgText"  d="m343 829.4c0-52.025 42.238-94.263 94.263-94.263 52.026 0 94.263 42.238 94.263 94.263s-42.237 94.263-94.263 94.263c-52.025 0-94.263-42.238-94.263-94.263zm288.47-288.42c0-52.025 42.237-94.263 94.263-94.263 52.025 0 94.263 42.238 94.263 94.263s-42.238 94.263-94.263 94.263c-52.026 0-94.263-42.238-94.263-94.263zm-288.47-290.39c0-52.025 42.238-94.263 94.263-94.263 52.026 0 94.263 42.238 94.263 94.263s-42.237 94.263-94.263 94.263c-52.025 0-94.263-42.238-94.263-94.263zm145.82 102.92 135.93 135.93c10.857-21.215 28.204-38.568 49.414-49.433l-135.92-135.92c-10.862 21.213-28.212 38.563-49.424 49.424zm135.93 239-135.91 135.91c21.21 10.865 38.557 28.218 49.414 49.433l135.91-135.91c-21.21-10.865-38.557-28.218-49.414-49.433z" fill-rule="evenodd"/>
                </svg>

                <data-viewer id="dataViewer">
                    <single-data style="position: absolute; height: 100%; width: 100%;"></single-data>
                    <graph-data style="position: absolute; height: 100%; width: 100%;"></graph-data>
                    <table-data style="position: absolute; height: 100%; width: 100%;"></table-data>
                </data-viewer>
            </div>
            `;
        this.nameInput = this.shadowRoot.querySelector('#nameInput');
        this.equationMap = this.shadowRoot.querySelector('#equationMap');
        this.dataViewer = this.shadowRoot.querySelector('#dataViewer');
        this.editButton = this.shadowRoot.querySelector('#editIcon');
        this.shareButton = this.shadowRoot.querySelector('#shareIcon');
    }
    initMethod() {
        this.nameInput.input.innerHTML = this.name;
        this.funcListDef = findFuncConfig(this.name).def;
        this.dataViewer.upstreamRequest = (type) => {
            callCalc({ callType: 'get', method: 'envData', targetEnv: this.name, target: type }).then(value => {
                if (type == "equation") {
                    parseObject.Function(value);
                } else if (type == "graph") {
                    parseObject.Graph(value);
                } else if (type == "table") {
                    parseObject.Table(value);
                }
            });
        }
        this.dataViewer.setAttribute("name", this.name)
        this.equationMap.setAttribute("type", "func")
        this.equationMap.setAttribute("name", this.name)
        this.equationMap.parentVarCallBack = (value) => this.parseMethod(value);
        this.equationMap.input.addEventListener("input", () => {
            this.changeMethod(this.funcDef.func, this.equationMap.input.innerHTML)
        });
        this.nameInput.input.addEventListener("input", () => {
            this.changeMethod(this.nameInput.input.innerHTML, this.funcDef.ogFunc)
        });

        callCalc({ callType: 'get', method: 'func', "name": this.name }).then(value => {
            this.funcDef = value;
            this.vars = this.funcDef.vars;
            let varNames = []
            this.vars.forEach(val => { varNames.push(val.letter) })
            if (this.funcDef.type == "function") {
                this.type = "function";
                this.equationMap.equat = this.funcDef.ogFunc;
                this.editButton.addEventListener("click", () => {
                    let editorObject = {
                        type: "function",
                        confirmMethod: () => {
                            this.changeMethod(envObject.editPopup.nameEditor.input.innerHTML, envObject.editPopup.equationEditor.input.innerHTML)
                        },
                        name: this.funcDef.func,
                        equation: this.funcDef.ogFunc,
                    }
                    envObject.editPopup.open(editorObject);
                })
                this.shareButton.addEventListener("click", () => {
                    envObject.sharePopup.open(this.funcListDef.compressed);
                });
            } else {
                this.editButton.addEventListener("click", () => {
                    let editorObject = {
                        type: "method",
                        confirmMethod: () => {
                            this.changeMethod("", envObject.editPopup.textEditorEdit.textEditor.innerHTML)
                        },
                        code: this.funcDef.full,
                    }
                    envObject.editPopup.open(editorObject);
                })
                this.type = "method";
                this.equationMap.equat = `${this.name}(${varNames.join(',')})`
            }
            callCalc({ callType: 'set', method: "env", envType: 'static', id: this.name, isFunc: true, vars: value.vars, equation: `${this.name}(${varNames.join(',')})` }).then(() => {
                callCalc({ callType: 'get', method: 'envPacket', targetEnv: this.name }).then(value => {
                    this.parseMethod(value)
                })
            })

        });
    }
    parseMethod(packet) {
        console.log(this.dataViewer)
        let parseObject = this.dataViewer.inputData
        parseObject.Function(packet.point)
        parseObject.Graph(packet.graph)
        parseObject.Table(packet.table)
    }
    changeMethod(name, value) {
        let testQuery = findFuncConfig(name);
        if (testQuery === false || testQuery.def == this.funcListDef) {
            let parseObject = { callType: "func", method: "change", name: this.funcDef.func, changes: {} };
            if (this.funcDef.type == "function") {
                parseObject.changes = { "type": "Function", "name": name, "equation": value };
            } else {
                parseObject.changes = { "type": "Hybrid", "code": value };
            }
            callCalc(parseObject).then(value => {
                console.log(value)
                let equationValue;
                if (value.type == "method") {
                    equationValue = `${value.func}(${value.vars.join(',')})`
                    changeButtons(this.funcDef.func, { name: value.func, text: "Hybrid" });
                    //changeImplemented(this.funcDef.func, { "type": "Hybrid", "name": value.func, "code": value.full });
                    this.funcListDef.name = value.func;
                    this.funcListDef.text = value.full;
                    console.log(Object.getPrototypeOf(funcListProxy));
                    this.funcDef = value;
                } else {
                    equationValue = value.ogFunc;
                    changeButtons(this.funcDef.func, { name: value.func, text: value.ogFunc });
                    //changeImplemented(this.funcDef.func, parseObject.changes);
                    this.funcListDef.name = value.func;
                    this.funcListDef.text = value.ogFunc;
                    console.log(Object.getPrototypeOf(funcListProxy));
                    this.funcDef = value;
                }
                if (arguments[2] != undefined) {
                    let array = arguments[2];
                    if (array.includes("name")) {
                        this.nameInput.input.innerHTML = value.func;
                    }
                    if (array.includes("equation")) {
                        this.equationMap.equat = equationValue;
                    }
                }
            });
        } else {
            report(`Can't have function with same name`, false)
        }
    }
}
customElements.define('template-func', templateFuncPage);
class codeTerminal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
              * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
                font-family: ubuntu;
                color: var(--textColor);
                -webkit-tap-highlight-color: transparent;
              }
              
              textarea {
                border: none;
                overflow: auto;
                outline: none;
              
                -webkit-box-shadow: none;
                -moz-box-shadow: none;
                box-shadow: none;
              
                resize: none;
              }
              
              #lineLabel {
                width: fit-content;
                overflow: visible;
              }
              
              #creatorEditor {
                display: grid;
                display: flex;
                overflow: auto;
                background-color: transparent;
              }
              
              #creatorEditor::-webkit-scrollbar {
                width: 10px;
              }
              
              #creatorEditor::-webkit-scrollbar-track {
                background: transparent;
              }
              
              #creatorEditor::-webkit-scrollbar-thumb {
                width: 5px;
                background: #00000080;
                border-radius: 10px;
              }
              
              #creatorEditor::-webkit-scrollbar-button:end:increment {
                height: 0px;
                background: transparent;
              }
              
              #creatorEditor::-webkit-scrollbar-button:start:increment {
                height: 0px;
                background: transparent;
              
              }
              .numberedHeader {
                font-size: 25px;
              }
              
              #creatorEditor::-webkit-scrollbar-corner {
                background-color: transparent;
              }
              
              .codeEditor {
                font-size: 25px;
                background-color: transparent;
                border: none;
                overflow-wrap: none;
                padding-left: 5px;
              }
            </style>
            <div id="creatorEditor">
                <div id="lineLabel"></div>
                <textarea class="codeEditor" id="codeEditor" spellcheck="false"></textarea>
            </div>

        `;
        this.container = this.shadowRoot.querySelector('#creatorEditor');
        this.codeEditor = this.shadowRoot.querySelector('#codeEditor');
        this.numberIndex = this.shadowRoot.querySelector('#lineLabel');

        this.codeEditor.addEventListener("input", (e) => {
            this.codeEditor.height = "";
            this.codeEditor.height = this.scrollHeight + "px"
            this.recaculateNums()
        })

        this.createNumHeader(1);
    }
    //Responsible for handling the numbering on the terminal 
    recaculateNums() {
        let parentElem = this.numberIndex;
        let text = this.codeEditor.value;

        let numOfO = (text.match(/\n/g) || []).length;

        numOfO++;
        let childern = parentElem.querySelectorAll('.numberedHeader');
        if (childern.length > numOfO) {
            for (let i = childern.length - 1; i > numOfO - 1; i--) {
                childern[i].remove();
            }
        } else {
            for (let i = 0; i < numOfO - childern.length; i++) {
                this.createNumHeader(numOfO)
            }
        }
    }
    //Responsible for the individual numbering headers in the code terminal
    createNumHeader(num) {
        let parentElem = this.numberIndex;
        let initial = document.createElement('h3');
        initial.className = "numberedHeader";
        initial.innerHTML = num;
        parentElem.appendChild(initial)
    }
    get text() {
        return this.codeEditor.value;
    }
    set text(value) {
        this.codeEditor.value = value;
        this.recaculateNums();
    }
}
customElements.define('code-terminal', codeTerminal);
class createPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
          
          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
            font-family: ubuntu;
            color: var(--textColor);
            -webkit-tap-highlight-color: transparent;
          }
          
          .imgDivClass {
            aspect-ratio: 1 / 1;
          }
          
          .svgText {
            fill: var(--textColor);
          }
          
          input:focus {
            outline: none;
          }
          
          [contenteditable] {
            outline: 0px solid transparent;
          }
          
          button:focus {
            outline: none;
          }
          
          ::-webkit-scrollbar {
            width: 10px;
          }
          
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          
          ::-webkit-scrollbar-thumb {
            width: 5px;
            background: #00000080;
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
          
          #custCreatorPage {
            background-color: var(--displayColor);
            width: 100%;
            height: 100%;
          }
          
          #nameCreator {
            background-color: var(--numbersColor);
            border: none;
            font-size: 50px;
            width: calc(100% - 20px);
            left: 10px;
            padding: 5px;
            border-radius: 15px;
            top: 50px;
            position: absolute;
          }
          
          #mainCreator {
            background-color: var(--functionsColor);
            top: 135px;
            bottom: 10px;
            width: calc(100% - 20px);
            left: 10px;
            position: absolute;
            border-radius: 20px;
          }
          
          #saveCreator {
            height: 40px;
            top: 10px;
            right: 10px;
            width: 60px;
            border: none;
            background-color: var(--numbersColor);
            position: absolute;
            border-radius: 50px;
          }
          
          .creatorPage {
            width: 100%;
            top: 60px;
            bottom: 0px;
            position: absolute;
          }
          
          .creatorDiv {
            width: calc(100% - 20px);
            left: 10px;
            height: calc(100% - 10px);
            background-color: var(--displayColor);
            padding: 10px;
            font-size: 35px;
            border-radius: 25px;
            position: absolute;
          }
          
          #creatorEditor {
            display: grid;
            display: flex;
            overflow: auto;
          }
          
          #creatorEditor::-webkit-scrollbar {
            width: 10px;
          }
          
          #creatorEditor::-webkit-scrollbar-track {
            background: transparent;
          }
          
          #creatorEditor::-webkit-scrollbar-thumb {
            width: 5px;
            background: #00000080;
            border-radius: 10px;
          }
          
          #creatorEditor::-webkit-scrollbar-button:end:increment {
            height: 0px;
            background: transparent;
          }
          
          #creatorEditor::-webkit-scrollbar-button:start:increment {
            height: 0px;
            background: transparent;
          
          }
          
          #creatorEditor::-webkit-scrollbar-corner {
            background-color: transparent;
          }
          
          #modeSwitcher {
            top: 10px;
            left: 10px;
            height: 40px;
            display: inline-block;
            position: absolute;
            width: 300px;
          }
          
          .modeButton {
            height: 100%;
            width: 70px;
            background-color: transparent;
            border: none;
            border-radius: 25px;
            z-index: 2;
            position: absolute;
          }
          
          .selectorSlider {
            top: 0px;
            height: 40px;
            width: 70px;
            z-index: 1;
            position: absolute;
            background-color: var(--displayColor);
            border-radius: 25px;
          }
        </style>
        <div id="custCreatorPage">
        <svg id="backCreator" class="imgDivClass" style="height: 45px; transform: rotate(180deg);isolation:isolate"
            viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
            <rect width="1080" height="1080" fill-opacity="0" />
            <circle cx="540" cy="540" r="450" fill-opacity=".2" vector-effect="non-scaling-stroke" />
            <path class="svgText"
                d="m648.99 620.2-186.73 186.73-80.256-80.257 186.73-186.73-186.61-186.61 80.256-80.256 186.61 186.61 0.011-0.01 80.256 80.256-0.011 0.01 0.132 0.132-80.256 80.256-0.132-0.132z" />
        </svg>
        <input type="text" id="nameCreator" placeholder="Name">
        <div id="mainCreator">
            <div id=modeSwitcher>
                <button class="modeButton" id="funcCreatorButton">Function</button>
                <button class="modeButton" id="hybdCreatorButton" style="left: 75px">Hybrid</button>
                <button class="modeButton" id="codeCreatorButton" style="left: 150px">Code</button>
                <div id="custCreatorUnder" class="selectorSlider"></div>
            </div>
            <button id="saveCreator">Save</button>
            <div class="creatorPage" id="funcTypePage">
                <div class="creatorDiv" id="creatorEquationFunc" placeholder="Equation" contenteditable="true" value="">
                </div>
            </div>
            <div class="creatorPage" id="hybridCodeTypePage" style="visibility: hidden;">
                <div id="creatorEditor">

                </div>
            </div>
        </div>

    </div>
        `;
    }
}
customElements.define('create-page', createPage);
//Popup Section
class popupBackground extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        //this.backgroundDiv = this.shadowRoot.getElementById('backgroundDiv');

    }
    open(closeMethod) {
        console.log("open popup background")
        this.style.zIndex = 0;
        this.style.visibility = 'visible';
        this.style.opacity = '1';
        this.addEventListener('click', () => {
            console.log('close popup');
            closeMethod();
            this.close()
        }, { once: true });
    }
    close() {
        this.style.zIndex = -1;
        this.style.opacity = '0';
        this.style.visibility = 'hidden';

    }
    connectedCallback() {
        this.style = `background:var(--semi-transparent); width: 100%;
        height: 100%; transition: opacity 0.5s ease; opacity: 0; z-index: -1; left: 0px; top: 0px; position: absolute; visibility: hidden;`;
    }
}
customElements.define('popup-background', popupBackground);
class popup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            .svgText {
                fill: var(--textColor);
            }
            #popupDiv {
                background-color: var(--functionsColor);
                border-radius: 25px;
                transition: all 0.5s ease-in-out;
                filter: drop-shadow(-5px 5px 5px var(--translucent));
                display: flex;
                flex-direction: column;
            }
            #backIcon {
                height: 50px; 
                width:50px; 
                aspect-ratio: 1/1; 
                isolation:isolate; 
                transform: rotate(180deg);
                flex-shrink: 0;
            }
            #contentDiv {
                width: 100%;
                height: 100%;
            }
            #popupContainer {
                background-color: var(--semi-transparent);
                width: 100%;
                height: 100%;
                transition: opacity 0.5s ease; 
                opacity: 0; 
                z-index: -1; 
                left: 0px; 
                top: 0px; 
                position: absolute;
            }
            .uiButton{
                border: none;
                border-radius: 25px;
                padding: 0px 20px 0px 20px;
                height: fit-content;
                position: absolute;
              }
              #confirmButton {
                left: 10px;
                bottom: 10px;
              }
              
              #exitConfirmPage {
                right: 10px;
                bottom: 10px;
              }
        </style>
        <style id="styler">
        </style>
        <div id="popupContainer" >
            <div id="popupDiv" >
                <svg id="backIcon" viewBox="0 0 1080 1080"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect width="1080" height="1080" fill-opacity="0" />
                    <circle cx="540" cy="540" r="450" fill-opacity=".2" vector-effect="non-scaling-stroke" />
                    <path class="svgText"
                        d="m648.99 620.2-186.73 186.73-80.256-80.257 186.73-186.73-186.61-186.61 80.256-80.256 186.61 186.61 0.011-0.01 80.256 80.256-0.011 0.01 0.132 0.132-80.256 80.256-0.132-0.132z" />
                </svg>
                <div id="contentDiv"></div>
            </div>
        </div>
        `;
        this.popupDiv = this.shadowRoot.getElementById('popupDiv');
        this.contentDiv = this.shadowRoot.getElementById('contentDiv');
        this.backIcon = this.shadowRoot.getElementById('backIcon');
        this.styler = this.shadowRoot.getElementById('styler');
        this.popupContainer = this.shadowRoot.getElementById('popupContainer');
        this.popupContainer.addEventListener('click', (e) => {
            if(e.target == this.popupContainer){
                this.close();
            }
        });
        this.backIcon.addEventListener('click', () => { this.close(); });
    }
    open() {
        this.isOpen = true;
        this.backMethod = this.close;
        this.setStyle();
    }
    close() {
        this.isOpen = false;
        this.setStyle();
    }
    setStyle() {
        this.popupDiv.style = "";
        this.popupContainer.style = "";
        let style = (arguments[0] == undefined || typeof arguments[0] != typeof {}) ? {} : arguments[0]; ;

        style.popupDiv = {
            "position": "absolute"
        };
        style.popupDiv[this.mode == "portrait" ? "height": "width"] = "fit-content";
        style.popupDiv[this.mode == "portrait" ? "width": "height"] = "calc(100% - 20px)";
        style.popupDiv[this.mode == "portrait" ? "left": "top"] = "10px";
        if(this.isOpen){
            style.popupDiv[this.mode == "portrait" ? "bottom": "right"] = "10px";
        }else{
            style.popupDiv[this.mode == "portrait" ? "bottom": "right"] = "-100%";
        }
        style.popupContainer = {};
        style.popupContainer["zIndex"] = this.isOpen ? "10": "-1";
        style.popupContainer["opacity"] = this.isOpen ? "1": "0";
        if(this.popupPos == "centered"){
            style.popupContainer["display"] = "flex";
            style.popupContainer["justify-content"] = "center";
            style.popupContainer["align-items"] = "center";
            style.popupDiv["position"] = "static";
            style.popupDiv[this.mode == "portrait" ? "height": "width"] = this.mode == "portrait" ? "50": "width";
            if(this.isOpen){
                style.popupDiv[this.mode == "portrait" ? "marginTop": "marginLeft"] = "0px";
            }else{
                style.popupDiv[this.mode == "portrait" ? "marginTop": "marginLeft"] = "100%";
            }
        }
        console.log(this.popupType);
        Object.keys(style).forEach(key => {
            let target = this[key];
            let objectRef = style[key];
            Object.keys(objectRef).forEach(key => {
                target.style[key] = objectRef[key];
            });
        })
        /*if (this.mode == "portrait") {
            this.popupDiv.style = 'height: fit-content; width: calc(100% - 20px); transition: all 0.5s ease-in-out; left: 10px;'  
            if (this.isOpen) {
                this.popupDiv.style.bottom = "10px";
            } else {
                this.popupDiv.style.bottom = '-100%';
            }
        } else if (this.mode == "landscape") {
            this.popupDiv.style = 'width: fit-content; height: calc(100% - 20px); transition: all 0.5s ease-in-out; top: 10px;'
            if (this.isOpen) {
                this.popupDiv.style.right = "10px";
            } else {
                this.popupDiv.style.right = '-100%';
            }
        }
        if (this.isOpen) {
            this.popupContainer.style.zIndex = "1";
            this.popupContainer.style.opacity = "1";
        } else {
            this.popupContainer.style.zIndex = "-1";
            this.popupContainer.style.opacity = "0";
        }*/
    }
    set popupType (value) {
        if(value == "boolean" && this.exitButton == undefined){
            this._popupType = "boolean"
            this.backIcon.remove();
            this.popupDiv.innerHTML += `
            <button id="confirmButton" class="uiButton" style="background-color: var(--numbersColor)">
            <svg class="imgDivClass" style="height: 40px;isolation:isolate" viewBox="0 0 1080 1080"
            xmlns="http://www.w3.org/2000/svg">
            <path class="svgText"
                d="m407.03 677.37-0.178 0.178 82.528 82.527 0.178-0.177 0.177 0.177 82.528-82.527-0.178-0.178 274.91-274.91-82.528-82.527-274.91 274.91-136.1-136.1-82.527 82.528 136.1 136.1z" />
            </svg>
            </button>   
            <button id="exitConfirmPage" class="uiButton" style="background-color: var(--displayColor)">
            <svg class="imgDivClass" style="height: 40px;isolation:isolate" viewBox="0 0 1080 1080"
                xmlns="http://www.w3.org/2000/svg">
                <path class="svgText"
                    d="m457.47 540-137.54 137.55 82.527 82.527 137.55-137.54 137.55 137.54 82.527-82.527-137.54-137.55 137.54-137.55-82.527-82.527-137.55 137.54-137.55-137.54-82.527 82.527 137.54 137.55z" />
            </svg>
            </button>
            `;
            this.exitButton = this.shadowRoot.getElementById('exitConfirmPage');
            this.confirmButton = this.shadowRoot.getElementById('confirmButton');
            this.exitButton.addEventListener('click', () => {
                this.close();
            });
            this.confirmButton.addEventListener('click', () => {
                this.confirmMethod();
                this.close();
            });
        }
    }
    static get observedAttributes() {
        return ['mode'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('mode')) {
            this.mode = this.getAttribute('mode');
            this.setStyle(true);
        }
    }
}
class qrCode extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <canvas id="qrCanvas" width="100%" height="100%">
        `;
        this.qrCanvas = this.shadowRoot.getElementById('qrCanvas');

    }
    render(text) {
        QrCreator.render({
            text: text,
            radius: "0.5",
            ecLevel: "H",
            fill: getCSS("--textColor"),
            size: "200",
        }, this.qrCanvas);
    }
    static get observedAttributes() {
        return ['text'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('text')) {
            this.text = this.getAttribute('text');
            this.render(this.text);
        }
    }
}
customElements.define('qr-code', qrCode);
class QrCodeReader extends HTMLElement {
    constructor() {
        super();
        this.qrCodeReader = null;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
          .svgText {
            fill: var(--textColor);
          }
          .primary {
            fill: var(--functionsColor);
          }
          #swtichIcon{
            bottom: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            position: absolute;
          }
          #reader{
            width: 100%;
            height: 100%;
            aspect-ratio: 1;
            overflow: hidden;
            }
        </style>
        <div id="reader">
        
        </div>
        <svg id="swtichIcon" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
            <circle class="primary" cx="540" cy="540" r="540" fill="#c3cfd9" vector-effect="non-scaling-stroke"/>
            <path class="svgText" d="m677.38 225.1c-46.86-25.01-100.36-39.19-157.14-39.19-184.6 0-334.47 149.87-334.47 334.47 0 56.783 14.18 110.28 39.19 157.14l66.733-66.733c-11.093-27.988-17.19-58.491-17.19-90.407 0-135.63 110.11-245.74 245.74-245.74 31.916 0 62.419 6.097 90.407 17.19l66.733-66.733zm-285.35 552.38c0.804 2.927-0.025 6.063-2.171 8.209-2.143 2.143-5.281 2.974-8.209 2.171-38.829-10.645-145.89-39.983-184.39-50.536-2.903-0.797-5.159-3.079-5.934-5.984-0.769-2.912 0.066-6.01 2.196-8.14 28.068-28.068 105.79-105.79 133.86-133.85 2.127-2.127 5.231-2.962 8.139-2.197 2.912 0.769 5.187 3.032 5.985 5.934 10.55 38.502 39.894 145.56 50.529 184.39l-3e-3 3e-3zm10.583 77.414c46.86 25.01 100.36 39.19 157.14 39.19 184.6 0 334.47-149.87 334.47-334.47 0-56.783-14.18-110.28-39.19-157.14l-66.733 66.733c11.093 27.988 17.19 58.491 17.19 90.407 0 135.63-110.11 245.74-245.74 245.74-31.916 0-62.419-6.097-90.407-17.19l-66.733 66.733zm285.35-552.38c-0.804-2.927 0.025-6.063 2.171-8.209 2.143-2.143 5.281-2.974 8.209-2.171 38.829 10.645 145.89 39.983 184.39 50.536 2.903 0.798 5.159 3.079 5.934 5.984 0.769 2.912-0.066 6.01-2.196 8.14-28.068 28.068-105.79 105.79-133.86 133.85-2.127 2.127-5.231 2.962-8.139 2.197-2.912-0.769-5.187-3.032-5.985-5.934-10.55-38.502-39.894-145.56-50.529-184.39l3e-3 -3e-3z" fill="#ebebeb" fill-rule="evenodd"/>
        </svg>

      `;
        this.reader = this.shadowRoot.querySelector('#reader');
        this.qrCodeReader = new Html5Qrcode(this.reader);
        this.switchIcon = this.shadowRoot.querySelector('#swtichIcon');
        this.facing = 'environment';
        this.switchIcon.addEventListener('click', () => {
            this.facing = this.facing === 'environment' ? 'user' : 'environment';
            this.qrCodeReader.stop().then(() => {
                this.start();
            });
        });
    }
    stop() {
        this.qrCodeReader.stop();
        if (this.onQRStop != undefined) {
            this.onQRStop();
        }
    }
    start() {
        let thing = (thing) => {
            this.qrCodeMessageHandler(thing)
        };
        this.qrCodeReader.start(
            { facingMode: this.facing },
            { fps: 10, aspectRatio: 1, qrbox: { width: 250, height: 250 } },
            thing,
            this.errorHandler,
        )
        console.log(this.qrCodeReader)
    }

    qrCodeMessageHandler(qrCodeMessage) {
        console.log(`QR code detected: ${qrCodeMessage}`);
        if (this.onMessage != undefined) {
            this.onMessage(qrCodeMessage);
        }
        this.qrCodeReader.stop();
    }
    errorHandler(errorMessage) {
        if (errorMessage != "QR code parse error, error = No barcode or QR code detected." && errorMessage != "QR code parse error, error = D: No MultiFormat Readers were able to detect the code.") {
            console.log(`Error: ${errorMessage}`);
        }
    }
}
customElements.define('qr-reader', QrCodeReader);
class sharePage extends popup {
    constructor() {
        super();
        this.contentDiv.innerHTML = `
            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                    font-family: ubuntu;
                    color: var(--textColor);
                    -webkit-tap-highlight-color: transparent;
                }
                .svgText {
                    fill: var(--textColor)
                }
                .accent {
                    fill: var(--numbersColor);
                }
                #qrCenter{
                    display: grid;
                    justify-content: space-evenly;
                    justify-items: center;
                    align-content: space-evenly;
                    align-items: center;
                }
                #qrCode{
                    margin: 0 20px 0 20px;
                }
                #shareActions{
                    display: grid;
                    height: calc(100% - 20px);
                    border-radius: 15px;
                    margin: 10px;
                    width: calc(100% - 20px);
                    background-color: var(--displayColor);
                    grid-flow: row;
                }
                .shareGroup{
                    grid-template-areas: 
                    "icon"
                    "title";
                    width: fit-content;
                    justify-content: space-evenly;
                    justify-items: center;
                    align-content: space-evenly;
                    align-items: center;
                    text-align: center;
                    margin: 10px;
                }
            </style>
                
                <div id="qrCenter">
                    <qr-code id="qrCode" text="nothing to see here"></qr-code>
                </div>
                <div id="shareActions">

                </div>
        `;
        this.contentDiv.style.display = "flex";
        this.contentDiv.style.flexFlow = "column";
        this.shareGrid = this.shadowRoot.getElementById('shareActions');
        this.backIcon = this.shadowRoot.getElementById('backIcon');
        this.qrCode = this.shadowRoot.getElementById('qrCode');
        this.text = "null";
        this.qrCode.setAttribute('text', this.text);
        this.isOpen = false;

        let copyIcon = new DOMParser().parseFromString(`
            <svg width="50px" height="50px" style="isolation:isolate" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
            <defs>
            <clipPath id="a">
            <rect width="1080" height="1080"/>
            </clipPath>
            </defs>
            <g clip-path="url(#a)">
            <circle class="accent" cx="540" cy="540" r="540" fill="#c3cfd9" vector-effect="non-scaling-stroke"/>
            <path d="m700.11 286v-10.116c0-29.392-23.863-53.255-53.255-53.255h-299.31c-29.392 0-53.255 23.863-53.255 53.255v443.08c0 29.392 23.863 53.255 53.255 53.255h16.269v-57.521c-9.499-5.544-15.887-15.846-15.887-27.628v-379.3c0-17.643 14.324-31.967 31.967-31.967h234.61c9.232 0 17.555 3.922 23.393 10.189h62.211zm29.841 482.85m-264.45-407.89h234.61c17.643 0 31.967 14.324 31.967 31.967v379.3c0 17.643-14.324 31.967-31.967 31.967h-234.61c-17.643 0-31.967-14.324-31.967-31.967v-379.3c0-17.643 14.324-31.967 31.967-31.967zm-32.349-53.182h299.31c29.392 0 53.255 23.863 53.255 53.255v443.08c0 29.392-23.863 53.255-53.255 53.255h-299.31c-29.392 0-53.255-23.863-53.255-53.255v-443.08c0-29.392 23.863-53.255 53.255-53.255z" class="svgText" fill-rule="evenodd"/>
            </g>
            </svg>
            
            `, "text/xml").firstChild;;
        console.log(copyIcon.firstChild);
        this.createShareGroup('Copy', copyIcon, () => {
            navigator.clipboard.writeText(this.text);
        });

    }
    open(text) {
        this.text = text;
        super.open();
    }
    close() {
        super.close();
        this.removeAttribute('text');
    }
    createShareGroup(name, icon, action) {
        let shareGroup = document.createElement('div');
        shareGroup.addEventListener('click', () => { action() });
        shareGroup.classList.add('shareGroup');
        icon.style.gridArea = 'icon';
        shareGroup.appendChild(icon);
        let title = document.createElement('h5');
        title.innerHTML = name;
        title.style.gridArea = 'title';
        shareGroup.appendChild(title);

        this.shareGrid.appendChild(shareGroup);
    }
    
    /**
     * @param {string} text
     */
    set text(text) {
        this.qrCode.setAttribute('text', text);
    }
}
customElements.define('share-page', sharePage);
class qrScanPage extends popup {
    constructor() {
        super();
        this.contentDiv.innerHTML = `
        <style>
            .svgText {
                fill: var(--textColor)
            }
            #qrScanPage{
                width: 100%;
                height: inherit;
                background-color: var(--functionsColor);
                border-radius: 25px;
                filter: drop-shadow(-5px 5px 5px var(--translucent));
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                flex-grow: 1;
            }
            #qrReader{
                position: relative;
                aspect-ratio: 1;
                background-color: var(--displayColor);
                display: block;
                border-radius: 25px;
                overflow: hidden;
            }
            #backIcon{
                height: 50px; 
                width:50px; 
                aspect-ratio: 1/1; 
                isolation:isolate; 
                transform: rotate(180deg);
                flex-shrink: 0;
            }
            #title{
                text-align: center;
                margin: 0;
            }
        </style>
        <style id="modeStyle"></style>
        <div id="qrScanPage">
            <h2 id="title">Scan QR Code</h2>
            <qr-reader id="qrReader"></qr-reader>
        </div>
        `
        this.popupDiv.style.position = "static";
        this.popupPos = "centered";
        this.qrReader = this.shadowRoot.querySelector('#qrReader');
        this.backIcon = this.shadowRoot.querySelector('#backIcon');
        this.addEventListener('transitionend', () => {
            if(this.style.top == "100%" || this.style.right == "-102%"){
                this.style.visibility = "hidden";
            }
        });
    }
    open() {
        this.qrReader.start();
        super.open();
    }
    close() {
        this.qrReader.stop();
        super.close();
    }
    setStyle(){
        super.setStyle();

        if(this.mode == "portrait"){
            this.shadowRoot.querySelector('#modeStyle').innerHTML = `
            #qrScanPage{
                width: 100%;
                height: inherit;
            }
            #qrReader{
                width: calc(100% - 20px);
                margin-bottom: 10px;
            }
            `;
        }else if(this.mode == "landscape"){
            this.shadowRoot.querySelector('#modeStyle').innerHTML = `
            #qrScanPage{
                width: inherit;
                height: 100%;
            }
            #qrReader{
                height: calc(100% - 80px);
            }
            `;
        }
    }
}
customElements.define('qr-scan-page', qrScanPage);
class editPage extends popup {
    constructor() {
        super();
        this.contentDiv.innerHTML = `
            <style>
              * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
                font-family: ubuntu;
                color: var(--textColor);
                -webkit-tap-highlight-color: transparent;
              }
              
              .imgDivClass {
                aspect-ratio: 1 / 1;
              }
              
              .svgText {
                fill: var(--textColor);
              }
              
              #editDiv {
                width: 100%;
                height: fit-content;
              }
              
              #custFuncEditHeader {
                padding: 6.5px 15px 6.5px 15px;
                width: fit-content;
                left: calc(50% - 62.22px);
                top: 10px;
                font-size: 50px;
              }
              
              #textEditor {
                top: 80px;
                background-color: var(--displayColor);
                bottom: 10px;
                left: 10px;
                width: calc(100% - 20px);
                border-radius: 25px;
                padding: 10px;
                margin: 0 0 10px 10px;
                overflow: hidden;
                filter: drop-shadow(-5px 5px 5px var(--translucent));
              }
              #funcEditor{
                width: calc(100% - 20px);
                margin-left: 10px;
                border-radius: 25px;
                margin-bottom: 10px;
                display:flex;
                flex-direction: column;
                visibility: hidden;
                position: absolute;
              }
              #nameEditor{
                margin-bottom: 10px;
                height: 80px;
                overflow: hidden;
              }
              #equationEditor{
                background-color: var(--displayColor);
                min-height: 80px;
                overflow: visible;
                height: fit-content;
                max-height: 100%;
              }
              .funcEditors{
                width: 100%;
                display:grid;
                background: var(--numbersColor);
                border-radius: 20px;
                padding: 0 10px 0 10px;
                font-size: 65px;
              }
                #confirm{
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    border-radius: 25px;
                    height: 40px;
                    aspect-ratio: 1/1;
                    border: none;
                }
            </style>
            <div id="editDiv">
                <h1 id="custFuncEditHeader">Edit</h1>
                    <div id="textEditor">
                        <code-terminal style="width: 100%; height: 100%;"></code-terminal>
                    </div>
                  <div id="funcEditor">
                        <rich-input id="nameEditor" class="funcEditors"></rich-input>
                        <rich-input id="equationEditor" class="funcEditors"></rich-input>
                  </div>
                  <button id="confirm" style="background-color: var(--numbersColor)">
                            <svg class="imgDivClass" style="height: 40px;isolation:isolate" viewBox="0 0 1080 1080"
                                xmlns="http://www.w3.org/2000/svg">
                                <path class="svgText"
                                    d="m407.03 677.37-0.178 0.178 82.528 82.527 0.178-0.177 0.177 0.177 82.528-82.527-0.178-0.178 274.91-274.91-82.528-82.527-274.91 274.91-136.1-136.1-82.527 82.528 136.1 136.1z" />
                            </svg>
                    </button>   
              </div>
        `;
        this.popupPos = "centered"
        this.editDiv = this.shadowRoot.getElementById('editDiv');
        this.funcEditor = this.shadowRoot.getElementById('funcEditor');
        this.nameEditor = this.shadowRoot.getElementById('nameEditor');
        this.equationEditor = this.shadowRoot.getElementById('equationEditor');
        this.textEditorEdit = this.shadowRoot.getElementById('textEditor');
        this.confirmEdit = this.shadowRoot.getElementById('confirm');
    }
    open(editObject) {
        super.open();
        this.confirmEdit.addEventListener('click', () => {
            this.close();
            editObject.confirmMethod();
        }, { once: true });

        if (editObject.mode == "function") {
            this.nameEditor.input.innerHTML = editObject.name;
            this.equationEditor.input.innerHTML = editObject.text;
            this.funcType = "function";
        } else {
            this.textEditorEdit.textEditor.innerHTML = editObject.text;
            this.funcType = "method";
        }
    }
    /**
     * @param {string} type
     */
    set funcType(type) {
        if (type == "function") {
            this.textEditorEdit.style.visibility = 'hidden';
            this.textEditorEdit.style.position = 'absolute';
            this.funcEditor.style.visibility = 'inherit';
            this.funcEditor.style.position = 'relative';
        } else {
            this.textEditorEdit.style.visibility = 'inherit';
            this.textEditorEdit.style.position = 'relative';
            this.funcEditor.style.visibility = 'hidden';
            this.funcEditor.style.position = 'absolute';
        }
    }
    static get observedAttributes() {
        return ['mode'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('mode')) {
            this.mode = this.getAttribute('mode');
            this.setStyle(true);
        }
    }
}
customElements.define('edit-page', editPage);
class confirmPage extends popup{
    constructor(){
        super();
        this.contentDiv.innerHTML = `
        <style>
          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
            font-family: ubuntu;
            color: var(--textColor);
            -webkit-tap-highlight-color: transparent;
          }
          #confirmDiv {
            width: 100%;
            border-radius: 25px;
            position: relative;
            margin-bottom: 65.3px;
          }
          
          #confirmHeader {
            margin: 10px;
            padding: 5px 10px 5px 10px;
            width: fit-content;
            border-radius: 25px;
            background-color: var(--numbersColor);
            margin-bottom: 10px;
          }
          
          #confirmMessage {
            height: 82px;
            width: calc(100% - 20px);
            margin-left: 10px;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 20px;
            background-color: var(--displayColor);
          }
          
        </style>
        <div id="confirmDiv">
            <h2 id="confirmHeader">Confirm</h2>
            <h3 id="confirmMessage"></h3>
            
        </div>
        `;
        this.popupPos = "centered"
        this.popupType = "boolean"
    }
    open(description, confirmMethod){
        super.open();
        this.shadowRoot.getElementById('confirmMessage').innerHTML = description;
        this.confirmMethod = confirmMethod;
    }
    close(){
        super.close();
        this.confirmMethod = undefined;
        this.shadowRoot.getElementById('confirmMessage').innerHTML = "";
    }
    setStyle(){
        super.setStyle();
        if(this.mode == "landscape"){
            this.popupDiv.style.height = "fit-content";
            this.popupDiv.style.width = "350px";
        }
    }
    static get observedAttributes() {
        return ['mode'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('mode')) {
            this.mode = this.getAttribute('mode');
            this.setStyle(true);
        }
    }
}
customElements.define('confirm-page', confirmPage);
class quickSettings extends popup {
    constructor() {
        super();
        this.contentDiv.innerHTML = `
        <style>
            * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
                font-family: ubuntu;
                color: var(--textColor);
                -webkit-tap-highlight-color: transparent;
            }
            input:focus, textarea:focus, select:focus{
                outline: none;
            }
            .svgText {
                fill: var(--textColor);
              }
            #settingsPane{
                width: 100%;
                height: auto;
                border-radius: 25px;
                padding-bottom: 10px;
                background-color: var(--functionsColor);
            }
            #settingsTitle{
                margin: 10px;
                padding: 10px;
                font-size: 50px;
                padding-top: 5px;
                padding-bottom: 5px;
                border-radius: 25px;
                color: var(--textColor);
                background-color: var(--numbersColor);
            }
            #settingsContainer{
                display: grid;
                grid-auto-rows: 35px;
                grid-template-columns: 100%;
                grid-gap: 5px;
                justify-items: center;
                align-items: center;
            }
            .calculationsLabels {
                display: flex;
                position: relative;
                align-self: center;
                align-content: center;
                width: calc(100% - 15px);
                color: var(--textColor);
                height: 35px;
            }
            .settingsTextInput {
                background-color: var(--numbersColor);
                border: none;
                border-width: 1.5px;
                height: 35px;
                width: 60px;
                text-align: center;
                color: var(--textColor);
                text-indent: 5px;
                font-size: 15px;
                border-radius: 8px;
                margin-right: 10px;
                right: 0;
                position: absolute;
              }
              
              .settingsButton {
                color: var(--textColor);
                background-color: var(--functionsColor);
                width: fit-content;
                padding-left: 10px;
                padding-right: 10px;
                font-size: 20px;
                height: 35px;
                right: 0px;
                margin-right: 10px;
                border-radius: 20px;
                border: none;
                position: absolute;
              }
              
              .settingsButton.active {
                background-color: var(--numbersColor);
              }
              .settingTitle {
                padding: 7.5px 0 7.5px;
                color: var(--textColor);
                text-align: left;
                text-overflow: ellipsis;
                position: inherit;
                align-self: center;
                margin-right: 15px;
                margin-left: 5px;
                font-size: 20px;
                height: 100%;
                line-height: 100%;
              }
              .colorPicker {
                align-self: center;
                height: 25px;
                position: relative;
                border-style: solid;
                border-color: var(--textColor);
                border-radius: 15px;
                outline: none;
                right: 15px;
                background-color: transparent;
                position: absolute;
              }
              
              .colorPicker::-webkit-color-swatch-wrapper {
                padding: 0;
              }
              
              .colorPicker::-webkit-color-swatch {
                border: none;
                border-radius: 15px;
              }
        </style>
            <div id="settingsPane">
                <h1 id="settingsTitle"><h1>
                <settings-section id="settingsDef"></settings-section>
            </div>
        `;
        this.settingsTitle = this.shadowRoot.querySelector("#settingsTitle")
        this.settingsDef = this.shadowRoot.querySelector("#settingsDef")
        this.exitButton = this.shadowRoot.querySelector("#exitButton")
        this.popupPos = "centered"
        this.exitButton = this.addEventListener("click", () => {
            this.close();
        });
    }
    populateSettings(setArry) {
        this.settingsDef.populateSettings(setArry)
    }
    clearSettings() {
        this.settingsTitle.innerHTML = ""
        this.settingsDef.clearSettings()
    }
    close() {
        super.close();
        this.exitMethod();
        this.clearSettings();
    }
    open(title, setArry, exitMethod) {
        super.open();
        this.settingsTitle.innerHTML = title;
        this.populateSettings(setArry);
        this.exitMethod = exitMethod;
    }
}
customElements.define('quick-settings', quickSettings);