// 紧张某一个类型

type BanType<T, E> = T extends E ? never : T
function log<T>(x: BanType<T, string>) {
    console.log(x)
}
log(1);
log('123') // ERROR