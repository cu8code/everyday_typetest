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
                div{
                    background-color: red;
                    width: 10px;
                    height: ${fontSize};
                }
            </style>
            <div></div>
        `
        this.append(template.content.cloneNode(true))
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
    arr=[]
    clock=null
    cursor=null
    constructor() {
        super()
        const template = document.createElement("template")
        template.innerHTML = `
            <main>
                <slot name="clock"></slot>
                <slot></slot>
            </main>
        `
        const attachShadow = this.attachShadow({ mode: "open" })
        attachShadow.append(template.content.cloneNode(true))
        const para = "my name is khan"
        for (const w of para.split(" ")) {
            const word = document.createElement("c-word")
            word.setAttribute("data", w)
            this.append(word)
            this.arr.push(word)
        }
        this.clock=document.createElement("c-clock")
        this.clock.setAttribute("slot","clock")
        this.clock.setAttribute("data","data")
        this.append(this.clock)
        this.cursor=document.createElement("c-cursor")
        this.cursor.setAttribute("top",0)
        this.cursor.setAttribute("left",0)
        this.append(this.cursor)
    }
}

customElements.define("c-letter", Letter)
customElements.define("c-word", Word)
customElements.define("c-clock", Clock)
customElements.define("type-test", TypeTest)