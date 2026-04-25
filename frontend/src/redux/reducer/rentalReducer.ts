import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NewRental, Rental, UpdateRental } from "../../types/rental";
import { PaginatedResponse, Pagination } from "../../types/pagination";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../config/api";

type RentalsState = {
    items: Rental[];
    selected: Rental | null;
    totalItems: number;
    currentPage: number;
    pageSize: number;
};

const initialState: RentalsState = {
    items: [],
    selected: null,
    totalItems: 0,
    currentPage: 1,
    pageSize: 30,
};

export const fetchAllRentalsForAdmin = createAsyncThunk(
    "fetchAllRentalsForAdmin",
    async(pagination: Pagination | null) => {
        const params = pagination
            ? { page: pagination.page, pageSize: pagination.pageSize }
            : undefined;
        return await apiClient.get<PaginatedResponse<Rental>>(
            API_ENDPOINTS.RENTALS.GET_ALL,
            { params }
        );
    }
)

export const fetchAllRentalsForUser = createAsyncThunk(
    "fetchAllRentalsForUser",
    async(pagination:Pagination | null) => {
        return await apiClient.get<Rental[]>(`${API_ENDPOINTS.RENTALS.GET_ALL}/user/all`);
    }
)

export const fetchAllRentalsForSpecificUserById = createAsyncThunk(
    "fetchAllRentalsForSpecificUserById",
    async(id: number) => {
        return await apiClient.get<Rental[]>(`${API_ENDPOINTS.RENTALS.GET_ALL}/user/${id}/all`);
    }
)

export const fetchRentalById = createAsyncThunk(
    "fetchRentalById",
    async(id:number) => {
        return await apiClient.get<Rental>(API_ENDPOINTS.RENTALS.GET_BY_ID(id));
    }
)

export const createRental = createAsyncThunk(
    "createRental",
    async(form: NewRental) => {
        return await apiClient.post<Rental[]>(API_ENDPOINTS.RENTALS.CREATE, form);
    }
)

export const updateRental = createAsyncThunk(
    "updateRental",
    async(form: UpdateRental) => {
        return await apiClient.put<Rental>(API_ENDPOINTS.RENTALS.UPDATE(form.id), form);
    }
)

const rentalSlice = createSlice({
    name: "rentalReducer",
    initialState,
    reducers: {},
    extraReducers: (build) => {
        build.addCase(fetchAllRentalsForAdmin.fulfilled, (state, action) => {
            const payload = action.payload;
            if (!payload) return;
            state.items = payload.items ?? [];
            state.totalItems = payload.totalItems ?? state.items.length;
            state.currentPage = payload.currentPage ?? 1;
            state.pageSize = payload.pageSize ?? state.pageSize;
        })
        build.addCase(fetchAllRentalsForUser.fulfilled, (state, action) => {
            const list = action.payload ?? [];
            state.items = list;
            state.totalItems = list.length;
            state.currentPage = 1;
        })
        build.addCase(fetchAllRentalsForSpecificUserById.fulfilled, (state, action) => {
            const list = action.payload ?? [];
            state.items = list;
            state.totalItems = list.length;
            state.currentPage = 1;
        })
        build.addCase(fetchRentalById.fulfilled, (state, action) => {
            state.selected = action.payload ?? null;
        })
    }
})

const rentalsReducer = rentalSlice.reducer
export default rentalsReducer