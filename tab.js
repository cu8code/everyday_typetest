const target = document.getElementById("target")
const cursor = document.getElementById("cursor")
const layoutMap = navigator.keyboard.getLayoutMap()

const paragraph = `it's not only writers who can benefit from this free online tool. If you're a programmer who's working on a project where blocks of text are needed, this tool can be a great way to get that. It's a good way to test your programming and that the tool being created is working well.
Above are a few examples of how the random paragraph generator can be beneficial. The best way to see if this random paragraph picker will be useful for your intended purposes is to give it a try. Generate a number of paragraphs to see if they are beneficial to your current project.
If you do find this paragraph tool useful, please do us a favor and let us know how you're using it. It's greatly beneficial for us to know the different ways this tool is being used so we can improve it with updates. This is especially true since there are times when the generators we create get used in completely unanticipated ways from when we initially created them. If you have the time, please send us a quick note on what you'd like to see changed or added to make it better in the future`

const arr = []
let pos = 0
let date = null;

function createWordDiv(p) {
    const d = document.createElement("div")
    d.classList.add("word")
    p.append(d)
    return d
}

function createLetterDiv(p,text) {
    const d = document.createElement("div")
    d.innerText = text
    d.classList.add("letter")
    p.append(d)
    return d
}

class Program{
    pos = 0
    char_pos = 0
    arr = []
    children = []
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
    next_word(){
        this.pos++
        if(this.pos >= this.arr.length){
            return
        }
        this.children = this.get_word().children
        this.char_pos = 0
    }
    get_word(){
        return this.arr[this.pos]
    }
    next_char(){
        if(this.char_pos > this.children.length){
            return
        }
        if(this.pos==0){
            if(this.char_pos==0){
                document.dispatchEvent(new Event("test_start"))
            }
        }
        if(this.pos==this.arr.length-1){
            if(this.char_pos==this.get_word().children.length-1){
                document.dispatchEvent(new Event("test_end"))
            }
        }
        this.char_pos++
    }
    get_char(){
        return this.children[this.char_pos]
    }
}

document.addEventListener("test_start",() => {
    setInterval(()=>{
        document.dispatchEvent(new Event("test_end"))
    },60 * 1000)
})

const program = new Program(target)

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
        key = key.toUpperCase()
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

document.addEventListener(
    "test_end",
    () => {
        target.style.visibility = "hidden"
        cursor.style.visibility = "hidden"
        const sd = document.getElementById("score")
        const s = incorr+corr
        const c = corr/s * 100
        const delta = new Date().getSeconds() - date.getSeconds()
        sd.innerText = String(Math.floor(c)) + "%" + " " + `${word}WPM`
    }
)

document.addEventListener(
    "test_start",
    () => {
        date = new Date()
    }
)

updateCursorPos()