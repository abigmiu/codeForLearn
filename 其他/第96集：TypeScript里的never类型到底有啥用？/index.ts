type IMethod = 'GET' | 'POST' | 'PUT'

function request(method: IMethod) {
    switch (method) {
        case 'GET':
            return '12';
        case 'POST':
            return 'dsadasd';
        default:
            // 类型收缩
            const n: never = method;
            return n;
    }
}

setInterval(() => document.documentElement.scrollTop++, 10)