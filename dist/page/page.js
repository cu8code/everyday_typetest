"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    chrome.runtime.sendMessage("load_config");
});
test();
class Letter extends HTMLElement {
    constructor() {
        super();
        this.letter = null;
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                letter[sucess] {
                    color: green;
                }
                letter{
                    font-fmaily: monospace;
                }
            </style>
            <letter>
                <slot></slot>
            </letter>
        `;
        const attachShadow = this.attachShadow({ mode: "open" });
        attachShadow.append(template.content.cloneNode(true));
        this.letter = attachShadow.querySelector("letter");
    }
    attributeChangedCallback(name, old, newVal) {
        if (name === "data") {
            if (newVal.length === 1) {
                this.innerText = newVal;
            }
        }
    }
    toggle() {
        if (this.letter != null) {
            this.letter.setAttribute("sucess", "true");
        }
    }
}
Letter.observedAttributes = ["data"];
class Word extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
            <div>
                <slot></slot>
            </div>
        `;
        const attachShadow = this.attachShadow({ mode: "open" });
        attachShadow.append(template.content.cloneNode(true));
    }
    attributeChangedCallback(name, old, newVal) {
        if (name === "data") {
            for (const letter of newVal) {
                const l = document.createElement("c-letter");
                l.setAttribute("data", letter);
                this.append(l);
            }
        }
    }
}
Word.observedAttributes = ["data"];
class Clock extends HTMLElement {
    constructor() {
        super();
        this.time = 60;
        this.endCallBack = () => { };
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                h2{
                    font-size: 1.2rem;
                }
            </style>
            <h2>
                <slot></slot>
            </h2>
        `;
        const attachShadow = this.attachShadow({ mode: "open" });
        attachShadow.append(template.content.cloneNode(true));
    }
    attributeChangedCallback(name, old, newVal) {
        if (name === "time") {
            this.time = newVal;
            this.innerText = newVal;
        }
    }
    start() {
        let p = this.time;
        const i = setInterval(() => {
            if (p <= 0) {
                this.end();
                clearInterval(i);
            }
            --p;
            if (p > this.time) {
                return;
            }
            this.setAttribute("time", String(p));
            this.end();
        }, 1000);
    }
    end() {
        console.log("end");
        this.endCallBack();
    }
}
Clock.observedAttributes = ["time"];
class Cursor extends HTMLElement {
    constructor() {
        super();
        this.target = null;
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                #cursor{
                    display: block;
                    width: 3px;
                    height: 1.2rem;
                    background: red;
                    transition: top 0.2s ease-in-out,left 0.2s ease-in-out;
                    position: absolute;
                }
            </style>
            <div id="cursor"> </div>
        `;
        const attachShadow = this.attachShadow({ mode: "open" });
        attachShadow.append(template.content.cloneNode(true));
        this.target = attachShadow.querySelector("div");
    }
    attributeChangedCallback(name, old, newVal) {
        if (this.target == null) {
            return;
        }
        if (name === "top") {
            this.target.style.top = `${newVal}px`;
        }
        if (name === "left") {
            this.target.style.left = `${newVal}px`;
        }
    }
}
Cursor.observedAttributes = ["top", "left"];
class TypeTest extends HTMLElement {
    constructor() {
        super();
        this.clock = null;
        this.cursor = null;
        this.target = null;
        this.word_itarator = null;
        this.letter_iterator = null;
        this.currentLetterElement = null;
        this.hasTestStarted = false;
        this.corrctKey = 0;
        this.incorrentKey = 0;
        this.focus = () => {
            if (this.target === null) {
                throw new Error("target not found");
            }
            this.target.focus();
        };
        this.onresize = () => {
            this.updateCursor();
        };
        this.onkeydown = (e) => __awaiter(this, void 0, void 0, function* () {
            const key = yield navigator.keyboard.getLayoutMap(); // TODO:outside this line dose not work
            let keyVal = key.get(e.code);
            if (e.code === "Space") {
                if (this.currentLetterElement === null) {
                    this.next();
                    if (this.currentLetterElement != null) {
                        this.updateCursor();
                    }
                    return;
                }
            }
            if (keyVal === undefined || this.currentLetterElement === null) {
                return;
            }
            this.testStart();
            keyVal = e.shiftKey ? keyVal.toUpperCase() : keyVal;
            if (keyVal === this.currentLetterElement.innerHTML) {
                this.currentLetterElement.toggle();
                this.updateCursor();
                this.next();
                this.corrctKey++;
            }
            this.incorrentKey++;
        });
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                main:focus{
                    background: lightgray;
                }
                main{
                    padding:1rem;
                    display:flex;
                    flex-direction: row;
                    gap:0.5rem;
                    width:100%;
                    overflow:hidden;
                    flex-wrap: wrap;
                }
                div{
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;
                    min-height:100vh;
                    max-width:800px;
                    margin:auto;
                }
            </style>
            <div>
                <c-clock></c-clock>
                <c-cursor></c-cursor>
                <main>
                    <slot></slot>
                </main>
            </div>
        `;
        const attachShadow = this.attachShadow({ mode: "open" });
        attachShadow.append(template.content.cloneNode(true));
        const para = `Generating random paragraphs can be an excellent way for writers to get their creative flow going at the beginning of the day. The writer has no idea what topic the random paragraph will be about when it appears. This forces the writer to use creativity to complete one of three common writing challenges. The writer can use the paragraph as the first one of a short story and build upon it. A second option is to use the random paragraph somewhere in a short story they create. The third option is to have the random paragraph be the ending paragraph in a short story. No matter which of these challenges is undertaken, the writer is forced to use creativity to incorporate the paragraph into their writing.`;
        for (const w of para.split(" ")) {
            const word = document.createElement("c-word");
            word.setAttribute("data", w);
            this.append(word);
        }
        this.target = attachShadow.querySelector("main");
        if (this.target === null) {
            throw new Error("no target found");
        }
        this.target.setAttribute('tabindex', "0");
        this.clock = attachShadow.querySelector("c-clock");
        if (this.clock === null) {
            throw new Error("no clock found");
        }
        this.clock.setAttribute("time", "5");
        this.cursor = attachShadow.querySelector("c-cursor");
        if (this.cursor === null) {
            throw new Error("cursor not found");
        }
        this.cursor.setAttribute("top", "0");
        this.cursor.setAttribute("left", "0");
    }
    connectedCallback() {
        this.word_itarator = this.children[Symbol.iterator]();
        this.letter_iterator = this.word_itarator.next().value.children[Symbol.iterator]();
        if (this.word_itarator == null) {
            throw new Error("could not setup iterator");
        }
        if (this.letter_iterator === null) {
            throw new Error("could not setup iterator");
        }
        this.currentLetterElement = this.letter_iterator.next().value;
        if (this.target === null) {
            throw new Error("target not found");
        }
        this.target.addEventListener("click", () => this.focus());
        this.target.addEventListener("keydown", (e) => this.onkeydown(e));
        window.addEventListener("resize", (e) => { this.onresize(); });
        this.focus();
        if (this.clock === null) {
            throw new Error("clock not setup");
        }
        this.clock.endCallBack = () => {
            if (this.clock === null) {
                throw new Error("clock not setup");
            }
            this.clock.setAttribute("data", String(this.corrctKey / (this.incorrentKey + this.corrctKey)));
        };
    }
    updateCursor() {
        if (this.cursor === null) {
            throw new Error("no cursor");
        }
        if (this.currentLetterElement === null) {
            return;
        }
        const { top, left } = this.currentLetterElement.getBoundingClientRect();
        this.cursor.setAttribute("top", String(top));
        this.cursor.setAttribute("left", String(left + 11));
    }
    testStart() {
        if (this.clock === null) {
            throw new Error("no clock found");
        }
        this.clock.start();
        if (this.hasTestStarted === true) {
            return;
        }
        this.hasTestStarted = true;
    }
    next() {
        if (this.word_itarator === null) {
            throw new Error("word_iternot can not be null");
        }
        if (this.letter_iterator === null) {
            throw new Error("letter_iternot can not be null");
        }
        if (this.clock === null) {
            throw new Error("clock can not be null");
        }
        if (this.currentLetterElement === null) {
            const e = this.word_itarator.next();
            if (e.done) {
                this.clock.end();
                return;
            }
            this.letter_iterator = e.value.children[Symbol.iterator]();
        }
        const l = this.letter_iterator.next();
        if (l.done === true) {
            this.currentLetterElement = null;
            return;
        }
        this.currentLetterElement = l.value;
    }
}
customElements.define("c-letter", Letter);
customElements.define("c-word", Word);
customElements.define("c-clock", Clock);
customElements.define("c-cursor", Cursor);
customElements.define("type-test", TypeTest);
