interface Article {
    title: string;
    content: string;
    author: string;
    date: Date;
    readCount: number;
}

// type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Partial<Pick<T, K>>>
type Optional<T, K extends keyof T> = {
    [P in keyof T as P extends K ? never : P]: T[P];
} & {
        [P in keyof T as P extends K ? P : never]?: T[P]
    }
type CreateArticle = Optional<Article, 'date' | 'readCount'>

let variable: CreateArticle
