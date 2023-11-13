"use strict"

const events = {
    "test:start": new Event("test:start"),
    "test:end": new Event("test:end"),
    "read:next:letter": new Event("read:next:letter"),
    "read:next:word": new Event("read:next:word"),
    "read:last:letter": new Event("read:last:letter"),
    "read:last:word": new Event("read:last:word")
}

const fontSize="1.2rem"

class Letter extends HTMLElement {
    constructor() {
        super()
        const template = document.createElement("template")
        template.innerHTML = `
            <style>
                letter[sucess] {
                    color: green;
                }
            </style>
            <letter>
                <slot></slot>
            </letter>
        `
        const attachShadow = this.attachShadow({ mode: "open" })
        attachShadow.append(template.content.cloneNode(true))
    }
    static observedAttributes = ["data"]
    attributeChangedCallback(name, old, newVal) {
        if (name === "data") {
            if (newVal.length === 1) {
                this.innerText = newVal
            }
        }
    }
}

class Word extends HTMLElement {
    constructor() {
        super()
        const template = document.createElement("template")
        template.innerHTML = `
            <div>
                <slot></slot>
            </div>
        `
        const attachShadow = this.attachShadow({ mode: "open" })
        attachShadow.append(template.content.cloneNode(true))
    }
    static observedAttributes = ["data"]
    attributeChangedCallback(name, old, newVal) {
        if (name === "data") {
            for (const letter of newVal) {
                const l = document.createElement("c-letter")
                l.setAttribute("data", letter)
                this.append(l)
            }
        }
    }
}

class Clock extends HTMLElement {
    constructor() {
        super()
        const template = document.createElement("template")
        template.innerHTML = `
            <style>
                h2{
                    font-size: ${fontSize};
                }
            </style>
            <h2>
                <slot></slot>
            </h2>
        `
        const attachShadow = this.attachShadow({ mode: "open" })
        attachShadow.append(template.content.cloneNode(true))
    }
    static observedAttributes = ["data"]
    attributeChangedCallback(name, old, newVal) {
        if (name === "data") {
            this.innerText = newVal
        }
    }
}

class Cursor extends HTMLElement {
    constructor(){
        super()
        const template = document.createElement("template")
        template.innerHTML = `
            <style>
                #cursor{
                    display: block;
                    width: 3px;
                    height: 1.2rem;
                    background: red;
                }
            </style>
            <div id="cursor"> </div>
        `
        const attachShadow = this.attachShadow({mode:"open"})
        attachShadow.append(template.content.cloneNode(true))
    }
    static observedAttributes = ["top","left"]
    attributeChangedCallback(name,old,newVal){
        if(name === "top"){
            this.style.top = `${newVal}px`
        }
        if(name === "left"){
            this.style.left= `${newVal}px`
        }
    }
}

class TypeTest extends HTMLElement {
    clock=null
    cursor=null
    target=null
    word_itarator=null
    letter_iterator=null
    currentLetter=null
    keyboard = navigator.keyboard.getLayoutMap()
    hasTestStarted = false
    constructor() {
        super()
        const template = document.createElement("template")
        template.innerHTML = `
            <style>
                main:focus{
                    background: gray;
                }
            </style>
            <div>
                <c-clock></c-clock>
                <c-cursor></c-cursor>
                <main>
                    <slot></slot>
                </main>
            </div>
        `
        const attachShadow = this.attachShadow({ mode: "open" })
        attachShadow.append(template.content.cloneNode(true))
        const para = "my name is khan"
        for (const w of para.split(" ")) {
            const word = document.createElement("c-word")
            word.setAttribute("data", w)
            this.append(word)
        }
        this.target = attachShadow.querySelector("main")
        this.target.setAttribute('tabindex', 0);
        this.clock=attachShadow.querySelector("c-clock")
        this.clock.setAttribute("data","data")
        this.cursor=attachShadow.querySelector("c-cursor")
        this.cursor.setAttribute("top",0)
        this.cursor.setAttribute("left",0)
    }
    connectedCallback(){
        this.word_itarator = this.children[Symbol.iterator]()
        this.letter_iterator = this.word_itarator.next().value.children[Symbol.iterator]()
        this.target.onkeydown = this.onkeydown
        this.focus()
    }
    focus(){
        this.target.focus()
    }
    async onkeydown(e){
        console.log("keydown");
        e.prevepreventDefault()
        const key = await this.keyboard
        let keyVal = key.get(e.code)
        if(e.code === "Space"){
            
        }
        if(keyVal === undefined){
            return
        }
        this.testStart()
        keyVal = e.shiftKey ? keyVal.toUpperCase() : keyVal
        if(keyVal === this.currentLetter){
            this.next()
        }
    }
    testStart(){
        if(this.hasTestStarted === true){
            return
        }
        this.hasTestStarted = true
        this.dispatchEvent(events["test:start"])
    }
    next(){
        if(this.currentLetter === "next_word"){
            this.letter_iterator =  this.word_itarator.next().children[Symbol.iterator]()
        }
        const l = this.letter_iterator.next()
        if(l.end === true){
            this.currentLetter = "next_word"
            return
        }
        l.value.setAttribute("sucess")
        this.currentLetter = l.value
    }
}

customElements.define("c-letter", Letter)
customElements.define("c-word", Word)
customElements.define("c-clock", Clock)
customElements.define("c-cursor", Cursor)
customElements.define("type-test", TypeTest)