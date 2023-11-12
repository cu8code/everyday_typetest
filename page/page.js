"use strict"

const target = document.getElementById("target")
const cursor = document.getElementById("cursor")
const clock = document.getElementById("clock")
clock.innerText = "60"
const layoutMap = navigator.keyboard.getLayoutMap()
const test_end  = new Event("test_end")
const test_start = new Event("test_start")

const paragraph = `it's not only writers who can benefit from this free online tool. If you're a programmer who's working on a project where blocks of text are needed, this tool can be a great way to get that. It's a good way to test your programming and that the tool being created is working well.
Above are a few examples of how the random paragraph generator can be beneficial. The best way to see if this random paragraph picker will be useful for your intended purposes is to give it a try. Generate a number of paragraphs to see if they are beneficial to your current project.
If you do find this paragraph tool useful, please do us a favor and let us know how you're using it. It's greatly beneficial for us to know the different ways this tool is being used so we can improve it with updates. This is especially true since there are times when the generators we create get used in completely unanticipated ways from when we initially created them. If you have the time, please send us a quick note on what you'd like to see changed or added to make it better in the future`

/**
 * create the div for word
 * @date 11/12/2023 - 7:16:46 PM
 *
 * @param {HTMLElement} p
 * @returns {HTMLElement}
 * */
const createWordDiv = (p) => {
    const d = document.createElement("div")
    d.classList.add("word")
    p.append(d)
    return d
}

/**
 * Description placeholder
 * @date 11/12/2023 - 7:18:23 PM
 * @param {HTMLElement} p
 * @param {string} text
 * @returns {HTMLElement}
 */
const createLetterDiv = (p,text) => {
    const d = document.createElement("div")
    d.innerText = text[0]
    d.classList.add("letter")
    p.append(d)
    return d
}

class Program{
    pos = 0
    char_pos = 0
    /**
     * arr to HTMLElements representing each of the paragraph
     * @date 11/12/2023 - 7:29:14 PM
     *
     * @type {HTMLElement[]}
     */
    arr = []
    /**
     * arr of HTMLElements, children of the current word_div
     * @date 11/12/2023 - 7:30:10 PM
     *
     * @type {HTMLCollection}
     */
    children = []
    /**
     * This class is responsible for
     * - creating the html elements for paragraph
     * - has a cursor allowing us to read div in sequence
     * - also gives us the single char from the **current** word
     * @date 11/12/2023 - 7:18:57 PM
     *
     * @constructor
     * @param {HTMLElement} target
     */
    constructor(target){
        for (const word of paragraph.split(" ")){
            const wordDiv = createWordDiv(target)
            this.arr.push(wordDiv)
            for(const char of word){
                createLetterDiv(wordDiv,char)
            }
        }
        this.children = this.arr[0].children
    }
    /**
     * move the cursor to the next word
     * @date 11/12/2023 - 7:22:32 PM
     */
    next_word(){
        this.pos++
        if(this.pos >= this.arr.length){
            return
        }
        this.children = this.get_word().children
        this.char_pos = 0
    }
    /**
     * gives the current word
     * @date 11/12/2023 - 7:22:56 PM
     *
     * @returns {HTMLElement|undefined}
     */
    get_word(){
        return this.arr[this.pos]
    }
    /**
     * move to the next char
     * @date 11/12/2023 - 7:23:12 PM
     */
    next_char(){
        if(this.char_pos > this.children.length){
            return
        }
        if(this.pos==0){
            if(this.char_pos==0){
                document.dispatchEvent(test_start)
            }
        }
        if(this.pos==this.arr.length-1){
            if(this.char_pos==this.get_word().children.length-1){
                document.dispatchEvent(test_end)
            }
        }
        this.char_pos++
    }
    /**
     * gets the current next char
     * @date 11/12/2023 - 7:23:35 PM
     *
     * @returns {HTMLElement|undefined}
     */
    get_char(){
        return this.children[this.char_pos]
    }
}


const program = new Program(target)

/**
 * updates the cursor pos
 * @date 11/12/2023 - 7:25:35 PM
 *
 * @async
 * */
const updateCursorPos =  async () => {
    if(!program.get_char()){
        const t_b = program.get_word().getBoundingClientRect()
        cursor.style.top = `${t_b.top}px`
        cursor.style.left = `${t_b.left + t_b.width}px`
        return
    }
    const t_b = program.get_char().getBoundingClientRect()
    cursor.style.top = `${t_b.top}px`
    cursor.style.left = `${t_b.left}px`
}

document.body.onresize = async () => {
    updateCursorPos()
}

let corr = 0
let incorr = 0
let word = 0

document.body.onkeydown = async (e) => {
    const l = await layoutMap
    let key = l.get(e.code)
    if(e.shiftKey === true && key){
        key = key[0].toUpperCase()
    }
    e.preventDefault();
    if(e.code === "Space"){
        if(!program.get_char()){
            program.next_word()
            word++
            updateCursorPos()
        }
        return
    }
    if(!key || !program.get_char()){
        return
    }
    if(program.get_char().innerText[0] === key[0]) {
        program.get_char().style.opacity = "0.5"
        program.next_char()
        updateCursorPos()
        corr++
        return
    }
    incorr++
}


const _clock = () => {
    let c = 60
    const t = () => {
        c--
        clock.innerText = String(c)
        if(c<=0){
            document.dispatchEvent(test_end)
        }
    }
    t()
    const i = setInterval(t,1000)
    if(c<=0){
        clearInterval(i)
    }
}

document.addEventListener("test_start",() => {
    _clock()
})

document.addEventListener(
    "test_end",
    async () => {
        target.style.display = "none"
        cursor.style.display = "none"
        clock.style.display = "none"
        const sd = document.getElementById("score")
        const s = incorr+corr
        const c = corr/s * 100
        sd.innerText = String(Math.floor(c)) + "%" + " " + `${word}WPM`
    }
)

updateCursorPos()
