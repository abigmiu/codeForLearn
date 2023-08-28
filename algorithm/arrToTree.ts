interface Item {
    id: number;
    name: string;
    parentId: number;
    children?: Item[];
}

const arr: Item[] = [
    {
        id: 2,
        name: '部门B',
        parentId: 0,
    },
    {
        id: 3,
        name: '部门C',
        parentId: 1,
    },
    {
        id: 1,
        name: '部门A',
        parentId: 2,
    },
    {
        id: 4,
        name: '部门D',
        parentId: 1,
    },
    {
        id: 5,
        name: '部门E',
        parentId: 2,
    },
    {
        id: 6,
        name: '部门F',
        parentId: 3,
    },
    {
        id: 7,
        name: '部门G',
        parentId: 2,
    },
    {
        id: 8,
        name: '部门H',
        parentId: 4,
    },
];

function genChild(parentObj: any, item: Item) {
    const children = parentObj[item.id];
    if (!children || !children.length) return [];
    children.forEach((child: Item) => {
        child.children = genChild(parentObj, child);
    });

    return children;
}

function transform(ary: Item[]) {
    const parentObj = ary.reduce((obj: Record<number, Item[]>, item) => {
        if (!obj[item.parentId]) {
            obj[item.parentId] = [];
        }
        obj[item.parentId].push(item);
        return obj;
    }, {});

    const res = parentObj[0].map((item) => {
        // console.log(item);
        return {
            ...item,
            children: genChild(parentObj, item),
        };
    });

    return res;
}
const res = transform(arr);
console.log(res);
