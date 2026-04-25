import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NewRental, Rental, UpdateRental } from "../../types/rental";
import { Pagination } from "../../types/pagination";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../config/api";

type RentalsState = {
    items: Rental[];
    selected: Rental | null;
};

const initialState: RentalsState = {
    items: [],
    selected: null,
};

export const fetchAllRentalsForAdmin = createAsyncThunk(
    "fetchAllRentalsForAdmin",
    async(pagination:Pagination | null) => {
        return await apiClient.get<Rental[]>(API_ENDPOINTS.RENTALS.GET_ALL);
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
            state.items = action.payload ?? [];
        })
        build.addCase(fetchAllRentalsForUser.fulfilled, (state, action) => {
            state.items = action.payload ?? [];
        })
        build.addCase(fetchAllRentalsForSpecificUserById.fulfilled, (state, action) => {
            state.items = action.payload ?? [];
        })
        build.addCase(fetchRentalById.fulfilled, (state, action) => {
            state.selected = action.payload ?? null;
        })
    }
})

const rentalsReducer = rentalSlice.reducer
export default rentalsReducer