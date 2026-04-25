import { Publisher } from "./publisher";

export interface Copy{
    id: number,
    isAvailable: boolean,
    title: string,
    publisher: Publisher
}

export type NewCopy = {
    bookId: number,
    publisherId: number
}