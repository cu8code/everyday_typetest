"use strict"

const events = {
    "test:start": new Event("test:start"),
    "test:end": new Event("test:end"),
    "read:letter": new Event("read:letter"),
    "read:word": new Event("read:word"),
    "write:letter": new Event("write:letter"),
    "write:word": new Event("write:word"),
}

class Config{

}

class Letter extends HTMLElement {
    letter=null
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
        this.letter = attachShadow.querySelector("letter")
    }
    static observedAttributes = ["data"]
    attributeChangedCallback(name, old, newVal) {
        if (name === "data") {
            if (newVal.length === 1) {
                this.innerText = newVal
            }
        }
    }
    toggle(){
        this.letter.setAttribute("sucess",null)
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
                    font-size: 1.2rem;
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
        this.style.position = "absolute"
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
    currentLetterElement=null
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
        this.currentLetterElement = this.letter_iterator.next().value  
        document.dispatchEvent(events["read:letter"])
        this.addEventListener("click",this.focus)
        this.target.onkeydown = (e) => this.onkeydown(e)
        this.focus()
        this.updateCursor()
    }
    focus(){
        this.target.focus()
    }
    async onkeydown(e){
        const key = await navigator.keyboard.getLayoutMap() // TODO:outside this line dose not work
        let keyVal = key.get(e.code)
        if(e.code === "Space"){
            if(this.currentLetterElement === null){
                this.next()
                return
            }
        }
        if(keyVal === undefined || this.currentLetterElement === null){
            return
        }
        this.testStart()
        keyVal = e.shiftKey ? keyVal.toUpperCase() : keyVal
        if(keyVal === this.currentLetterElement.innerText){
            this.currentLetterElement.toggle()
            this.updateCursor()
            this.next()
        }
    }
    updateCursor(){
        const {top,left} = this.currentLetterElement.getBoundingClientRect()
        this.cursor.setAttribute("top",top)
        this.cursor.setAttribute("left",left)
    }
    testStart(){
        if(this.hasTestStarted === true){
            return
        }
        this.hasTestStarted = true
        document.dispatchEvent(events["test:start"])
    }
    next(){
        if(this.currentLetterElement === null){
            const e = this.word_itarator.next()
            if(e.done){
                document.dispatchEvent(events["test:end"])
                return
            }
            document.dispatchEvent(events["read:word"])
            this.letter_iterator = e.value.children[Symbol.iterator]()
        }
        const l = this.letter_iterator.next()
        if(l.done === true){
            this.currentLetterElement = null
            return
        }
        document.dispatchEvent(events["read:letter"])
        this.currentLetterElement = l.value
    }
}

customElements.define("c-letter", Letter)
customElements.define("c-word", Word)
customElements.define("c-clock", Clock)
customElements.define("c-cursor", Cursor)
customElements.define("type-test", TypeTest)