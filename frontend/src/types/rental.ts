import { Copy } from "./copy";
import { User } from "./user";

export interface Rental {
    user: User,
    copy: Copy,
    startDate: Date,
    dueDate: Date,
    returned: boolean
}

export type NewRental = { 
    userId: number,
    copyId: number
}

export type UpdateRental = {
    id: number,
    userId: number,
    returned: boolean,
    dueDate: Date
}