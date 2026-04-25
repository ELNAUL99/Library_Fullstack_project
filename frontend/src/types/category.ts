import { Book } from "./book"

export interface Category {
    name: string,
    id: number
    books: Book[]
}

export type NewCategory = {
    name: string,
    books: Book[]
}