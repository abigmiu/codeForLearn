/**
 * 防抖
 * @param {*} fn 
 * @param {*} delay 
 * @returns 
 */
export function debounce(fn, delay) {
    let timer;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, args)
        }, delay)
    }
}