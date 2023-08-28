function asyncFn(func) {
    // typeof 不会报未定义错误  
    if (typeof Promise !== 'undefined') {
        Promise.resolve().then(func())
    } else if (typeof MutationObserver !== 'undefined') {
        const ob = new MutationObserver(func)
        const textNode = document.createTextNode('0')
        ob.observe(textNode, {
            characterData: true,
        })
        textNode.data = '1'
    } else {
        setTimeout(func)
    }
}