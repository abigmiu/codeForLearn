链接 

4.12 bAG:/ 从字段到函数的推导 # 前端开发工程师 # JavaScript # 编程 # 程序员 # web前端 # 前端 # 前端开发  https://v.douyin.com/ieL9Xgg/ 复制此链接，打开Dou音搜索，直接观看视频！



# 第一版

```typescript
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
```

缺陷：

Watcher.on 函数的 eventName 可以传入任意的字符串。 callback的参数的类型为 any。 应当是 传入对象的值的类型



# 第二版

```typescript
type Watcher<T> = {
    on<K extends string & keyof T>(
        eventName: `${K}Changed`,
        callback: (oldValue: T[K], newValue: T[K]) => void
    ): void
}

declare function watch<T>(obj: T): Watcher<T>


const personWatcher = watch({
    firstName: 'Scapires',
    lastName: 'Noir',
    age: 26,
})
personWatcher.on('ageChanged', (oldValue, newValue) => { })
```





利用泛型来处理传入的对象。 string & keyof T 确保键是字符串类型
