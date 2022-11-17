class MenuPage extends HTMLElement {
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
        /*let template = document.getElementById('menuTemplate');
        this.shadowRoot.appendChild(template.content.cloneNode(true));*/
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
        for(let tab of tabs){
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
}
customElements.define("menu-pane", MenuPane);