import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NewPublisher, Publisher } from "../../types/publisher";
import { addNotification } from "../../components/NotificationHandle";
import { PaginatedResponse, Pagination } from "../../types/pagination";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../config/api";

type PublishersState = {
    items: Publisher[];
    selected: Publisher | null;
    totalItems: number;
    currentPage: number;
    pageSize: number;
};

const initialState: PublishersState = {
    items: [],
    selected: null,
    totalItems: 0,
    currentPage: 1,
    pageSize: 30,
};

export const fetchAllPublishers = createAsyncThunk(
    'fetchAllPublishers',
    async(pagination: Pagination | null) =>{
        try{
            const params = pagination
                ? { page: pagination.page, pageSize: pagination.pageSize }
                : undefined;
            return await apiClient.get<PaginatedResponse<Publisher>>(
                API_ENDPOINTS.PUBLISHERS.GET_ALL,
                { params }
            );
        }catch(e){
            console.log(e)
        }
    }
)

export const fetchPublisherById = createAsyncThunk(
    'fetchPublisherById',
    async(id:number) =>{
        try{
            return await apiClient.get<Publisher>(API_ENDPOINTS.PUBLISHERS.GET_BY_ID(id));
        }catch(e){
            console.log(e)
        }
    }
)

export const newPublisher = createAsyncThunk(
    'newPublisher',
    async(form: NewPublisher) => {
        try {
            return await apiClient.post<Publisher>(API_ENDPOINTS.PUBLISHERS.CREATE, form);
        }catch(e){
            console.log(e)
        } 
    }
)

export const updatePublisher = createAsyncThunk(
    "updatePublisher",
    async(form: Publisher) => {
        return await apiClient.put<Publisher>(API_ENDPOINTS.PUBLISHERS.UPDATE(form.id), form);
    }
)

export const deletePublisher = createAsyncThunk(
    "deletePublisher",
    async(id:number) => {
        const res = await apiClient.delete<any>(API_ENDPOINTS.PUBLISHERS.DELETE(id));
        if(res){
            addNotification({notification: "Publisher delete successfully", duration: 2, type: "successful"})
        }else{
            addNotification({notification: "Something wrong happens", duration: 2, type:"warning"})
        }
    }
)

const publisherSlice = createSlice({
    name: "publisherSlice",
    initialState,
    reducers:{},
    extraReducers: (build) => {
        build.addCase(fetchAllPublishers.fulfilled, (state, action) => {
            const payload = action.payload;
            if (!payload) return;
            state.items = payload.items ?? [];
            state.totalItems = payload.totalItems ?? state.items.length;
            state.currentPage = payload.currentPage ?? 1;
            state.pageSize = payload.pageSize ?? state.pageSize;
        });
        build.addCase(fetchPublisherById.fulfilled, (state, action) => {
            state.selected = action.payload ?? null;
        });
        build.addCase(newPublisher.fulfilled, (state, action) => {
            if (action.payload) state.items = [action.payload, ...state.items];
        });
        build.addCase(updatePublisher.fulfilled, (state, action) => {
            if (!action.payload) return;
            state.selected = action.payload;
            state.items = state.items.map((p) => (p.id === action.payload.id ? action.payload : p));
        })
    }
})

const publishersReducer = publisherSlice.reducer
export default publishersReducer