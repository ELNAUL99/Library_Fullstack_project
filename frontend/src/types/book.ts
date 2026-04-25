import { Author } from "./author";
import { Category } from "./category";
import { Copy } from "./copy";
import { Publisher } from "./publisher";

export interface Book{
    id: number,
    title: string,
    isbn: string,
    description: string,
    categories: Category[],
    authors: Author[],
    copies: Copy[],
    publishers: Publisher[],
    totalCopies?: number,
    totalCopiesAvailable?: number
}

export type NewBook = {
    title: string,
    isbn: string,
    description: string
}