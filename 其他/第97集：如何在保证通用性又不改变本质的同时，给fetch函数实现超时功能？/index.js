function createFetch(timeout) {
    return (resource, options) => {
        let controller = new AbortController()
        options.signal = controller.signal;
        setTimeout(() => {
            controller.abort()
        }, timeout)
        return fetch(resource, options);
    }
}