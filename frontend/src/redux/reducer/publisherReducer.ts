import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NewPublisher, Publisher } from "../../types/publisher";
import { addNotification } from "../../components/NotificationHandle";
import { Pagination } from "../../types/pagination";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../config/api";

type PublishersState = {
    items: Publisher[];
    selected: Publisher | null;
};

const initialState: PublishersState = {
    items: [],
    selected: null,
};

export const fetchAllPublishers = createAsyncThunk(
    'fetchAllPublishers',
    async(pagination:Pagination | null) =>{
        try{
            return await apiClient.get<Publisher[]>(API_ENDPOINTS.PUBLISHERS.GET_ALL);
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
            state.items = action.payload ?? [];
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