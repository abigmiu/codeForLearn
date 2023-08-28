type Watcher = {
    on(
        eventName: string,
        callback: (oldValue: any, newValue: any) => void
    ): void
}

declare function watch(obj: object): Watcher


const personWatcher = watch({
    firstName: 'Scapires',
    lastName: 'Noir',
    age: 26,
})
personWatcher.on('change', (oldValue, newValue) => { })