
function mode(values) {
    const appearances = {}
    let most_common = null;
    let count = 0;
    for (const val of values) {
        let new_count = (appearances[val] || 0) + 1;
        appearances[val] = new_count
        if (new_count > count) {
            most_common = val;
            count = new_count;
        }
    }
    return most_common
}
function average(values) {
    if (values.length === 0) return null;
    let sum = 0;
    for (const val of values) sum += val ?? 0;
    return sum / values.length;
}
export {mode, average};