export function todayDateProgramStyle(){
    const d = new Date()
    const date = d.getDate()
    const month = d.getMonth()
    const yer = d.getFullYear()
    return `${date}${month}${yer}`
}