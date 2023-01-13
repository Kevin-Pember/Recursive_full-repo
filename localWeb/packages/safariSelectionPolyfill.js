const SUPPORTS_SHADOW_SELECTION = typeof window.ShadowRoot.prototype.getSelection === 'function';
const SUPPORTS_BEFORE_INPUT = typeof window.InputEvent.prototype.getTargetRanges === 'function';
const IS_FIREFOX = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

class ShadowSelection {
    constructor() {
        this._ranges = [];
    }
    get(){
        let range = this.getRangeAt(0)
        return {
            "anchorNode": range.startContainer,
            "anchorOffset": range.startOffset,
            "focusNode": range.endContainer,
            "focusOffset": range.endOffset,
            "isCollapsed": range.collapsed,
        };
    }

    getRangeAt(index) {
        return this._ranges[index];
    }

    addRange(range) {
        this._ranges.push(range);
    }

    removeAllRanges() {
        this._ranges = [];
    }

    // todo: implement remaining `Selection` methods and properties.
}

function getActiveElement() {
    let active = document.activeElement;

    while (true) {
        if (active && active.shadowRoot && active.shadowRoot.activeElement) {
            active = active.shadowRoot.activeElement;
        } else {
            break;
        }
    }

    return active;
}

if (IS_FIREFOX && !SUPPORTS_SHADOW_SELECTION) {
    window.ShadowRoot.prototype.getSelection = function () {
        return document.getSelection();
    }
    window.ShadowRoot.prototype
}else if (SUPPORTS_SHADOW_SELECTION && !IS_FIREFOX){
    window.ShadowRoot.prototype.setSelection = (range) => {
        let sel = this.getSelection();
        sel.removeAllRanges();
        sel.addRange(range)
    }
}

if (!IS_FIREFOX && !SUPPORTS_SHADOW_SELECTION && SUPPORTS_BEFORE_INPUT) {
    let processing = false;
    let selection = new ShadowSelection();

    window.ShadowRoot.prototype.getSelection = function () {
        return selection.get();
    }
    window.ShadowRoot.prototype.setSelection = function (range) {
        selection.removeAllRanges();
        selection.addRange(range);
    }

    window.addEventListener('selectionchange', () => {
        if (!processing) {
            processing = true;

            const active = getActiveElement();

            if (active && (active.getAttribute('contenteditable') === 'true')) {
                document.execCommand('indent');
            } else {
                selection.removeAllRanges();
            }

            processing = false;
        }
    }, true);

    window.addEventListener('beforeinput', (event) => {
        if (processing) {
            const ranges = event.getTargetRanges();
            const range = ranges[0];

            const newRange = new Range();

            newRange.setStart(range.startContainer, range.startOffset);
            newRange.setEnd(range.endContainer, range.endOffset);

            selection.removeAllRanges();
            selection.addRange(newRange);

            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }, true);

    window.addEventListener('selectstart', (event) => {
        selection.removeAllRanges();
    }, true);
}