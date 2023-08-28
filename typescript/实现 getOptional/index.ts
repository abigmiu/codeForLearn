interface IComplexObject {
    mandatory: string;
    optional1?: string;
    optional2?: string;
}

type GetOptional<T> = {
    [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P]
}

let a: GetOptional<IComplexObject>;
// a.optional1 = '1';