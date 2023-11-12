/**
 * function to return current in a specific format
 * @date 11/12/2023 - 7:14:18 PM
 *
 * @export
 * @returns {string}
 */
export function todayDateProgramStyle(){
    const d = new Date()
    const date = d.getDate()
    const month = d.getMonth()
    const yer = d.getFullYear()
    return `${date}${month}${yer}`
}