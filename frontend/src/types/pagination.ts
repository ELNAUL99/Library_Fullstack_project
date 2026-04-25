export type Pagination = {
    page: number,
    pageSize: number,
}

export type PaginatedResponse<T> = {
    items: T[],
    currentPage: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
}
