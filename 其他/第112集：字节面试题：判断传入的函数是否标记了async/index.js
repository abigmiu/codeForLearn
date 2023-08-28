function isAsyncFunction(func) {
    console.log(func.toString())
    const res= func[Symbol.toStringTag] === 'AsyncFunction'
    console.log(res)
    return res
}

isAsyncFunction(() => { })
isAsyncFunction(() => {
    return new Promise()
})
isAsyncFunction(async () => { })