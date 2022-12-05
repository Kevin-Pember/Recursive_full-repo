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
function setFocus(node, index) {
    let sel = window.getSelection();
    let range = document.createRange();
    range.setStart(node, index);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}
var repeater;
function buttonMapper(elemArray) {
    for (let elem of elemArray) {
        let elemDef = elem.def
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
/*class MenuPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        console.log(this.name)
        this.shadowRoot.innerHTML = `
            <style>
            body {
                border-radius: 10px;
            }
            .settingBackButtons{
                height: 50px;
                width: 50px;
                font-size: 15px;
                text-align: center;
                border-style: none;
                background-color: transparent;
                z-index: 2;
                background-color: transparent;
            }
            .svgText{
                fill: var(--textColor);
            }
            .backIcon{
                transform: rotate(180deg);
            }
            #pageContainer{
                background-color: var(--functionsColor);
            }
            </style>
            <div id="pageContainer">
            <button id="backButton" class="settingBackButtons menuBack">
                <svg class="backIcon imgDivClass" style="height: 50px;" style="isolation:isolate"
                    viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
                    <rect width="1080" height="1080" fill-opacity="0" />
                    <circle cx="540" cy="540" r="450" fill-opacity=".2" vector-effect="non-scaling-stroke" />
                    <path class="svgText"
                        d="m648.99 620.2-186.73 186.73-80.256-80.257 186.73-186.73-186.61-186.61 80.256-80.256 186.61 186.61 0.011-0.01 80.256 80.256-0.011 0.01 0.132 0.132-80.256 80.256-0.132-0.132z" />
                </svg>
            </button>
            </div>
        `;
    }
    static get observedAttributes() {
        return ['style', 'name', 'description', "icon"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.shadowRoot.querySelector("#pageContainer").setAttribute("style", this.hasAttribute("style") ? this.getAttribute("style") : "")
        this.name = this.getAttribute("name");
        this.des = this.getAttribute("description");
        this.icon = this.getAttribute("icon");
    }
    connectedCallback() {
        setTimeout(() => {
        })
    }
    toggleMobile() {
        if (this.shadowRoot.querySelector("#backButton").style.visibility == "inherit") {
            this.shadowRoot.querySelector("#backButton").style.visibility = "hidden";
        } else {
            this.shadowRoot.querySelector("#backButton").style.visibility = "inherit";
        }
    }
}
customElements.define('menu-page', MenuPage);
class MenuPane extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="stylesheets.css">
        <style id="styler">
        </style>
        <div id="menuContainer">
            <div id="navColumn" class="pane base">
                <button id="backButton">
                    <svg class="backIcon imgDivClass" style="height: 50px;" style="isolation:isolate"
                        viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
                        <rect width="1080" height="1080" fill-opacity="0" />
                        <circle cx="540" cy="540" r="450" fill-opacity=".2" vector-effect="non-scaling-stroke" />
                        <path class="svgText"
                            d="m648.99 620.2-186.73 186.73-80.256-80.257 186.73-186.73-186.61-186.61 80.256-80.256 186.61 186.61 0.011-0.01 80.256 80.256-0.011 0.01 0.132 0.132-80.256 80.256-0.132-0.132z" />
                    </svg>
                </button>
                <h1 id="menuTitle" class="settingsTitle">Help</h1>
                <div class="scrollable">

                </div>
            </div>
            <div id="menuPageContainer"></div>
        </div>`
        this.container = this.shadowRoot.querySelector("#menuContainer")
        this.container.setAttribute("style", "width: 100%; height: 100%;");
        this.styler = this.shadowRoot.querySelector("#styler")
        console.log(this.children.length)

    }
    defaultStyle = `
    #navColumn{
        height: calc(100% - 20px);
        margin-top: 10px;
        border-radius: 25px;
    }
    #menuPageContainer{
        visibility: hidden;
        position: absolute;
        top: 0;
        right: -100%;
        width: 100%;
        height: 100%;
    }
    `
    horizontal = ``
    vertical = `
    #navColumn {
        background-color: var(--functionsColor);
        width: calc(100% - 20px);
        margin-left: 10px;
      }
    `
    setStyle() {
        if (this.container.offsetWidth / this.container.offsetHeight > 3 / 4) {
            this.styler.innerHTML = this.defaultStyle + this.horizontal;
        } else {
            this.styler.innerHTML = this.defaultStyle + this.vertical;
        }
    }
    static get observedAttributes() {
        return ['style', 'dynamic', 'name'];
    }
    changePage(target) {
        var tabs = this.container.querySelectorAll("menu-page");
        for (let tab of tabs) {
            tab.style.visibility = "hidden";
        }

        let tElem = this.container.querySelector("#" + target)
        tElem.style.visibility = "inherit";
        if (this.container.offsetWidth / this.container.offsetHeight < 3 / 4) {
            this.container.style = "visibility: visible; width: calc(100% - 20px); margin-left: 10px;"
            this.container.animation = "0.15s ease-in 0s 1 normal forwards running toSlideLeft";
            let shadowDef = this.shadowRoot
            setTimeout(function () { shadowDef.querySelector("#menuContainer").style.visibility = "hidden"; }, 150);
            sessionStorage.setItem("facing", "themePageOut");
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.shadowRoot.querySelector("#menuContainer").setAttribute("style", this.hasAttribute("style") ? this.getAttribute("style") : "")
        if (this.hasAttribute("dynamic")) {
            let containerClone = this.container.cloneNode(true);
            this.container.parentNode.replaceChild(containerClone, this.container);
            this.container = containerClone;
            if (this.getAttribute("dynamic") == "true") {
                this.dynamic = true;
                this.container.addEventListener("resize", (e) => {
                    this.setStyle();
                })
                this.setStyle();
            } else {
                this.dynamic = false;
            }
        } else {
            this.dynamic = false;
        }
        if (this.hasAttribute("name")) {
            this.shadowRoot.querySelector("#menuTitle").innerHTML = this.getAttribute("name");
        }
    }
    connectedCallback() {
        setTimeout(() => {
            this.shadowRoot.querySelector("#menuPageContainer").append(...this.childNodes)
            this.pages = this.shadowRoot.querySelectorAll("menu-page")
            console.log(this.pages)
            for (let page of this.pages) {
                let newButton = document.createElement("button")
                newButton.classList.add("navButtons")
                console.log(page.icon)
                newButton.append(page.icon)
                newButton.innerHTML = `
                ${page.icon}
                <div class="helpTextContainer">
                    <h1 id"nameHeader" class="helpTitles">${page.name}</h1>
                    <p id="descriptionHeader">${page.des}</p>
                </div>`
                newButton.addEventListener("click", (e) => {
                    this.changePage(page.id)
                });
                this.shadowRoot.querySelector(".scrollable").append(newButton)
            }
        })
    }
}*/
//customElements.define("menu-pane", MenuPane);
class EquatInput extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
        #dynamicEquation{
            border-radius: 15px;
            padding-left: 10px;
            border: none;
            font-size: 60px;
            background-color: var(--numbersColor);
        }
        #dynamicEquation[placeholder]:empty:before {
            content: attr(placeholder);
            color: #555; 
        }
        
        #dynamicEquation[placeholder]:empty:focus:before {
            content: "";
        }
        </style>
        <div id="dynamicEquation" placeholder="Equation"
        contenteditable="true" value="" style=""></div>`;
    }
    static get observedAttributes() {
        return ['style', 'placeholder'];
    }
    get() {
        return this.shadowRoot.querySelector("#dynamicEquation").innerHTML;
    }
    set(val) {
        this.shadowRoot.querySelector("#dynamicEquation").innerHTML = val;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.getAttribute("style") != undefined) {
            this.shadowRoot.querySelector("#dynamicEquation").setAttribute("style", this.getAttribute("style"));
        }
        if (this.getAttribute("placeholder") != undefined) {
            this.shadowRoot.querySelector("#dynamicEquation").setAttribute("placeholder", this.getAttribute("placeholder"));
        }
    }
}
customElements.define("rich-input", EquatInput);
class FuncButton extends HTMLElement {
    constructor() {
        super();

        /**/
    }
    static get observedAttributes() {
        return ['name', 'equation'];
    }
    connectedCallback() {
        this.innerHTML = `
        <button class="customFuncLinks" id="customFuncButton">
            <h2 id="equationLabel"></h2>
            <h5 id="nameLabel" style="margin-bottom: -40px;"></h5>
            <svg id="removeFunc" style="height: 40px; isolation:isolate; aspect-ratio: 1 / 1; margin-right: -75%;" viewBox="0 0 1080 1080"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="m221.8 858.2c-175.62-175.62-175.62-460.78 0-636.4s460.78-175.62 636.4 0 175.62 460.78 0 636.4-460.78 175.62-636.4 0z"
                    fill-opacity=".2" />
                <path class="svgText"
                    d="m457.47 540-137.54 137.55 82.527 82.527 137.55-137.54 137.55 137.54 82.527-82.527-137.54-137.55 137.54-137.55-82.527-82.527-137.55 137.54-137.55-137.54-82.527 82.527 137.54 137.55z" />
            </svg>
        </button>
    `;
        let buttonNode = this.querySelector("#customFuncButton");
        let removeSVG = this.querySelector("#removeFunc");
        this.querySelector('#removeFunc').addEventListener('click', function (e) {
            openConfirm("Are you sure you want to delete this Function?", function () {
                funcRemove(buttonNode);
            });

        });
        this.querySelector('#customFuncButton').addEventListener('click', function (e) {
            if (!removeSVG.contains(e.target)) {
                let elem = buttonNode;
                console.log(elem.id)
                let funcName = elem.querySelector("#nameLabel").innerHTML;
                let funcParse = findFuncConfig(funcName);
                if (matchPage(funcName) == null) {
                    createTab(funcParse)
                } else {
                    openElement(funcName);
                }
            }
        });
        this.name = this.hasAttribute("name") ? this.getAttribute("name") : "New Function";
        this.querySelector("#nameLabel").innerHTML = this.name;
        this.equation = this.hasAttribute("equation") ? this.getAttribute("equation") : "x";
        this.querySelector("#equationLabel").innerHTML = this.equation;
    }
}
customElements.define("func-button", FuncButton);
class Keypad extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.firstTargets = {}
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./styling/stylesheets.css">
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
                animation: "0.25s linear 0s 1 normal forwards running toDown";
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
          display: inline-flex;
          overflow-x: auto;
        }
        #custFuncGridPopup func-button{
            margin-left: 3.3333%;
            position: relative;
            bottom: 5px;
            width: 45%;
            z-index: 2;
            flex-shrink: 0;
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
        </style>
        <style id="dynamicStyle"></style>
        <style id="styleInjector"></style>
        <div id="keypad" class="pane" style="visibility: visible;">
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
                    <svg id="minusIconPopup" class="minusIcon imgDivClass" style="isolation:isolate" viewBox="0 0 1080 1080"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="m221.8 858.2c-175.62-175.62-175.62-460.78 0-636.4s460.78-175.62 636.4 0 175.62 460.78 0 636.4-460.78 175.62-636.4 0z"
                            fill-opacity=".2" />
                        <rect class="svgText" transform="matrix(-1,0,0,-1,1080,1080)" x="287.12" y="481.64" width="505.75"
                            height="116.71" />
                    </svg>
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
        this.keyTargets = {}
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
                    openPage("moreFunctionsPage");
                },
                "repeatable": false,
            },
            {

                "def": this.shadowRoot.querySelector('#arrowIcon'),
                "id": 'arrowIcon',
                "name": "More Functions Menu",
                "function": () => {
                    this.popup();
                    setSelect(this.keyTargets.input, this.keyTargets.input.lastChild.length);
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
                    this.enterPressed(this.keyTargets.input.innerHTML);
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
                    if (this.keyTargets.input.innerHTML != "‎" && this.keyTargets.input.innerHTML != "") {
                        openPopup();
                    } else {
                        sessionStorage.setItem("facing", "creatorPage")
                        openPage("custCreatorPage")
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
                "function": function () {
                    let target = this.keyTargets.input;
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
                    this.keyTargets.scroll.scrollTop = this.keyTargets.scroll.scrollHeight;
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
            {

                "def": this.shadowRoot.querySelector('#sinPopup'),
                "id": 'sinPopup',
                "name": "sine",
                "function": (e) => {
                    this.trigPressed(e);
                },
                "repeatable": true,
            },

        ];
        buttonMapper(keypadButtons);
    }
    static get observedAttributes() {
        return ['style', 'mode', 'dynamic', "input", "history"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.shadowRoot.querySelector("#keypad").setAttribute("style", this.hasAttribute("style") ? this.getAttribute("style") : "")
        this.dynamic = this.getAttribute("dynamic") === "true";
        this.keyTargets.scroll = document.getElementById(this.getAttribute("history"));
        this.keyTargets.input = document.getElementById(this.getAttribute("input"));
        if (this.firstTargets.scroll == undefined) {
            this.firstTargets.scroll = document.getElementById(this.getAttribute("history"));
        }
        if (this.firstTargets.input == undefined) {
            this.firstTargets.input = document.getElementById(this.getAttribute("input"))
        }
        if (this.getAttribute("mode") == "limited") {
            //this mode is the keypads more limited mode removing the more functions tile and other func buttons

        } else if (this.getAttribute("mode") == "full") {
            //this mode has the full capabilities of the keypad

        }
    }
    frontButtonPressed(input) {
        let display = this.keyTargets.input;
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
        if (this.keyTargets.input.contains(sel.focusNode) && sel.focusNode != null) {
            let appendString = sel.focusNode.nodeValue.substring(0, lower) + input;
            sel.focusNode.nodeValue = appendString + sel.focusNode.nodeValue.substring(higher);
            range.setStart(sel.focusNode, appendString.length);
        } else {
            display.innerHTML = display.innerHTML + input;
            range.setStart(display.childNodes[0], input.length + 1)
        }
        range.collapse(true);
        sel.removeAllRanges()
        sel.addRange(range);
        this.keyTargets.scroll.scrollTop = this.keyTargets.scroll.scrollHeight;
    }
    enterPressed(input) {
        let display = this.keyTargets.input;
        let nonparse = input;
        this.clearMain();
        inputSolver(input, "Couldn't calculate").then((value) => {
            this.frontButtonPressed(value)
            setSelect(display, display.lastChild.length);
        })
        historyMethod(nonparse)
        this.keyTargets.scroll.scrollTop = this.keyTargets.scroll.scrollHeight;
    }
    //Responsible for handling the pars button on main calc buttons
    parsMethod() {
        let badIdea = this.keyTargets.input.selectionStart;
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
            frontButtonPressed(')');
        } else {
            frontButtonPressed('(');
        }
    }
    //Responsible (I Think) for handling all power of event for main calc buttons
    pow(type) {
        let display = this.keyTargets.input;
        let sel = window.getSelection();
        let range = document.createRange();
        let baseNode = sel.baseNode;
        let baseOffset = sel.baseOffset
        let extentNode = sel.extentNode;
        let extentOffset = sel.extentOffset
        let index = 0;
        /*for (let i = 0; i < display.childNodes.length; i++) {
          if (sel.focusNode == display.childNodes[i]) {
            index = i;
            break;
          }
        }*/

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
            console.log(targInd)
            baseNode.textContent = baseNode.textContent.substring(0, baseOffset);
            display.insertAt(superSr, targInd)
            targInd++
            display.insertAt(postNode, targInd)
            type == "2" ? setFocus(postNode, 1) : setFocus(superSr.lastChild, superSr.lastChild.textContent.length)
        }
    }
    //Responsible for handling trig button presses
    trigPressed(event) {
        let eventTarget = event.target;
        frontButtonPressed(eventTarget.innerHTML + "(");
    }
    //Responsible (I Think) to patch weird behavior with default HTML behavior SUP
    keepBlank(eve) {
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
        if (eve.keyCode == 8 && (sel.focusNode.nodeValue.substring(lower, higher).includes('‎') || sel.focusNode.nodeValue == '‎') && sel.focusNode.parentNode == this.keyTargets.input) {
            eve.preventDefault();
            let childNodes = this.keyTargets.input.childNodes;
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
    degRadSwitch(mode) {
        document.getElementById('degModeBut').className = "settingsButton";
        document.getElementById('radModeBut').className = "settingsButton";
        if (mode) {
            document.getElementById('degModeBut').className = "settingsButton active";
        } else {
            document.getElementById('radModeBut').className = "settingsButton active";
        }
    }
    //Responsible for inverse settings on main calc bittons (main input)
    setInverse() {
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
    setArc() {
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
    backPressed() {
        let uifCalculator = this.keyTargets.input;
        let sel = window.getSelection();
        console.log(sel)
        console.log(this.keyTargets.input.childNodes)
        let range = document.createRange();
        let baseNode = sel.baseNode
        let baseOffset = sel.baseOffset
        let extentNode = sel.extentNode
        let extentOffset = sel.extentOffset
        let baseString = baseNode.textContent;
        console.log(baseOffset)

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
                setFocus(baseNode, baseOffset - 1);
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
                        setFocus(target, target.textContent.length);
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
                setFocus(baseNode, lower)
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
                        setFocus(getText(startPar), getText(startPar).textContent.length)
                    } else {
                        setFocus(startPar, startPar.textContent.length)
                    }
                } else {
                    let pre = arryChd[startInd - 1]
                    if (pre.nodeType != 3) {
                        setFocus(getText(pre), getText(pre).textContent.length)
                    } else {
                        setFocus(pre, pre.textContent.length)
                    }
                }
                autoStitch(uifCalculator)
            }
        }
    }
    //Responsible for the ac button clearing all text from the enter header
    clearMain() {
        let enterHeader = this.keyTargets.input;
        let range = document.createRange();
        let sel = document.getSelection();
        console.log(sel)
        enterHeader.innerHTML = '‎';
        range.setStart(enterHeader.lastChild, enterHeader.firstChild.data.length);
        range.collapse(true);
        sel.removeAllRanges()
        sel.addRange(range);
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
        selfGrid.appendChild(card)
    }
    setStyle(styling) {
        this.shadowRoot.querySelector('#styleInjector').innerHTML = styling;
    }
    reset() {
        this.shadowRoot.querySelector('#styleInjector').innerHTML = "";
        this.keyTargets.input = this.firstTargets.input
        this.keyTargets.scroll = this.firstTargets.scroll;
    }
    setVisibility(vis) {
        console.log("running vis")
        if (vis) {
            this.style.visibility = "visible"
        } else {
            this.style.visibility = "hidden"
        }
    }
    setTemp(elem, newStyling) {
        let reference = this;
        elem.addEventListener("focus", function (e) {
            if (reference.style.visibility == "hidden") {
                setSelect(elem, elem.innerHTML.length);
                reference.setVisibility(true);
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
                reference.keyTargets.input = elem;
                reference.keyTargets.scroll = elem;
                reference.setStyle(newStyling == undefined ? defaultStyle : newStyling);
            }
        });
        elem.addEventListener('focusout', (e) => {
            setTimeout(() => {
                let sel = window.getSelection();
                let keypad = reference.shadowRoot.querySelector("#keypad");
                if ((!elem.contains(sel.focusNode) || sel.anchorOffset == 0) && !keypad.contains(sel.focusNode)) {
                    if (elem.innerHTML.length == 1) {
                        elem.innerHTML = "";
                    }
                    reference.setVisibility(false);
                    reference.reset();
                }
            })
        });
    }
}
customElements.define("func-keypad", Keypad);
class menuPane extends HTMLElement {
    generalRef = this;
    typeList = [{
        name: "mode",
        styling: `
        .modeButton{
            width: calc(100% - 10px); 
            overflow: hidden; 
            height: calc(100% - 10px); 
            margin-top:5px; 
            margin-left:5px; 
            border:none; 
            border-radius: 25px;
            align-content: space-evenly;
            align-items: center; 
            display: flex;
            text-indent: 5px;
            font-size: large;
        }
        #modeSwitcher{
            display: grid; 
            grid-auto-rows: 1fr;
        }
        #paneContainer{
            background-color: transparent;
        }
        #modeButton{
            animation: fadeEffect 0.50s ease-in 1 none;
            z-index: 2;
            height: fit-content;
            position: absolute;
            border: none;
            background-color: var(--displayColor);
            font-size: 20;
            padding: 10px;
            border-radius: 50px;
            right: 20px;
            top: 20px;
        }
        `,
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
                type: "remove",
                parentId: 'modeContainer',
                get def() {
                    let modeButton = document.createElement('button');
                    modeButton.id = 'modeButton';
                    modeButton.innerHTML = "mode";
                    modeButton.addEventListener('click', () => {
                        pageReturn();
                    });
                }
            }
        ]
    }]
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
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
        .backIcon{
            transform: rotate(180deg);
            background-color: transparent;
            height: 45px;
            z-index: 1;
        }
        .imgContainer{
            height: 100%; 
            max-height: 200px;
            width:unset; 
            aspect-ratio: 1/1;
        }
        .modeButton{
            background-color: var(--numbersColor); 
            width: calc(100% - 20px); 
            overflow: hidden; 
            height: 175px; 
            margin-top:10px; 
            margin-left:10px; 
            border:none; 
            border-radius: 25px;
            align-content: space-evenly;
            align-items: center; 
            display: flex;
            text-indent: 5px;
            font-size: large;
        }
        #paneContainer{
            background-color: var(--functionsColor);
            height: calc(100vh - 20px);
            width: calc(100vw - 20px);
            left: 10px;
            top: 10px;
            border-radius: 25px;
            position: absolute;
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
    }
    static get observedAttributes() {
        return ['style', 'type', "name"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.getAttribute("style") != undefined) {
            this.shadowRoot.querySelector("#paneContainer").setAttribute("style", this.getAttribute("style"))
        }
        if (this.getAttribute("type") != undefined) {
            this.typeList.forEach((type) => {
                if (type.name == this.getAttribute("type")) {
                    this.shadowRoot.querySelector("#typeStyle").innerHTML = type.styling;
                    for (let elem of type.elements) {
                        if (elem.type == "remove") {
                            this.shadowRoot.querySelector("#" + elem.id).remove();
                        } else {
                            this.shadowRoot.querySelector(elem.parentId).appendChild(elem.def);
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
    pageSelector(tPage) {
        this.container.style.zIndex = 1;
        this.switcher.style.visibility = "hidden";
        for (let page of this.pages) {
            if (page != tPage) {
                page.style.visibility = "hidden";
            }
        }
        tPage.style.visibility = "inherit";
    }
    pageReturn() {
        this.container.style.zIndex = -1;
        this.switcher.style.visibility = "inherit";
        for (let page of this.pages) {
            page.style.visibility = "hidden";
        }
    }
    connectedCallback() {
        setTimeout(() => {
            this.shadowRoot.querySelector("#modeContainer").append(...this.childNodes)
            this.pages = this.shadowRoot.querySelectorAll("menu-page")
            this.switcher = this.shadowRoot.querySelector("#modeSwitcher")
            this.container = this.shadowRoot.querySelector("#modeContainer")
            if (this.shadowRoot.querySelector("#modeContainer").createButton == undefined) {
                this.shadowRoot.querySelector("#modeContainer").createButton = (name, icon, page) => {
                    let button = document.createElement("button")
                    button.classList.add("modeButton");
                    button.innerHTML = `
                <div id="icon" class="imgContainer">
                </div>
                <h3 id="modeText" class="text"></h3>
                `
                    button.querySelector("#icon").append(icon)
                    button.querySelector("#modeText").innerHTML = name
                    button.addEventListener("click", () => {
                        this.pageSelector(page)
                    })
                    this.shadowRoot.querySelector("#modeSwitcher").append(button)
                }
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
            }
        });
    }
}
customElements.define("menu-pane", menuPane);
class modePane extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
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
            background-color: brown; 
            width: calc(100% - 10px); 
            overflow: hidden; 
            height: calc(100% - 10px); 
            margin-top:5px; 
            margin-left:5px; 
            border:none; 
            border-radius: 25px;
            align-content: space-evenly;
            align-items: center; 
            display: flex;
            text-indent: 5px;
            font-size: large;
        }
        #modeSwitcher{
            display: grid; 
            grid-auto-rows: 1fr; 
            height: 100%; 
            width:100%; 
            position: absolute; 
            left:0; 
            top:0;
        }
        </style>
        <div id="modeSwitcher">
        </div>
        <div id="modeContainer">
        </div>
        `;
    }
    pageSelector(tPage) {
        this.container.style.zIndex = 1;
        this.switcher.style.visibility = "hidden";
        for (let page of this.pages) {
            if (page != tPage) {
                page.style.visibility = "hidden";
            }
        }
        tPage.style.visibility = "inherit";
    }
    connectedCallback() {
        setTimeout(() => {
            this.shadowRoot.querySelector("#modeContainer").append(...this.childNodes)
            this.pages = this.shadowRoot.querySelectorAll("menu-page")
            this.switcher = this.shadowRoot.querySelector("#modeSwitcher")
            this.container = this.shadowRoot.querySelector("#modeContainer")
            this.shadowRoot.querySelector("#modeContainer").createButton = (name, icon, page) => {
                let button = document.createElement("button")
                button.classList.add("modeButton");
                button.innerHTML = `
                <div id="icon" class="imgContainer">
                </div>
                <h3 id="modeText"></h3>
                `
                button.querySelector("#icon").append(icon)
                button.querySelector("#modeText").innerHTML = name
                button.addEventListener("click", () => {
                    this.pageSelector(page)
                })
                this.shadowRoot.querySelector("#modeSwitcher").append(button)
            }
        });
    }
}
customElements.define("mode-pane", modePane);
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
        return ['style', 'name'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.getAttribute("style") != undefined) {
            this.shadowRoot.querySelector("#modePage").setAttribute("style", this.getAttribute("style"))
        } else if (this.getAttribute("name") != undefined) {
            this.name = this.getAttribute("name")
        }
    }
    connectedCallback() {
        setTimeout(() => {
            if (this.icon == undefined) {
                this.icon = this.querySelector("#icon")
                console.log(this.icon)
                this.removeChild(this.icon)
                this.parentElement.createButton(this.name, this.icon, this)
            }
            this.shadowRoot.querySelector("#modePage").append(...this.childNodes)
        });
    }
}
customElements.define("menu-page", menuPage);
class templateMode {

}