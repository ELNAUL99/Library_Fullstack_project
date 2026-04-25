export interface Publisher{
    id: number,
    name: string,
    phone: string
};

export type NewPublisher = {
    name: string,
    phone: string
}