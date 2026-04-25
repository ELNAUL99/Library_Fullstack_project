import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Author, CreateAuthor } from "../../types/author";
import { addNotification } from "../../components/NotificationHandle";
import { PaginatedResponse, Pagination } from "../../types/pagination";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../config/api";

type AuthorsState = {
    items: Author[];
    selected: Author | null;
    totalItems: number;
    currentPage: number;
    pageSize: number;
};

const initialState: AuthorsState = {
    items: [],
    selected: null,
    totalItems: 0,
    currentPage: 1,
    pageSize: 30,
};

export const fetchAllAuthors = createAsyncThunk(
    'fetchAllAuthors',
    async(pagination: Pagination | null) =>{
        try{
            const params = pagination
                ? { page: pagination.page, pageSize: pagination.pageSize }
                : undefined;
            return await apiClient.get<PaginatedResponse<Author>>(
                API_ENDPOINTS.AUTHORS.GET_ALL,
                { params }
            );
        }catch(e){
            console.log(e)
        }
    }
)

export const fetchAuthorById = createAsyncThunk(
    'fetchAuthorById',
    async(id:number) =>{
        try{
            return await apiClient.get<Author>(API_ENDPOINTS.AUTHORS.GET_BY_ID(id));
        }catch(e){
            console.log(e)
        }
    }
)

export const newAuthor = createAsyncThunk(
    'newAuthor',
    async(newAuthor: CreateAuthor) => {
        try {
            return await apiClient.post<Author>(API_ENDPOINTS.AUTHORS.CREATE, newAuthor);
        }catch(e){
            console.log(e)
        } 
    }
)

export const updateAuthor = createAsyncThunk(
    "updateAuthor",
    async(form: Author) => {
        return await apiClient.put<Author>(API_ENDPOINTS.AUTHORS.UPDATE(form.id), form);
    }
)

export const deleteAuthor = createAsyncThunk(
    "deleteAuthor",
    async(id:number) => {
        const res = await apiClient.delete<any>(API_ENDPOINTS.AUTHORS.DELETE(id));
        if(res){
            addNotification({notification: "Author delete successfully", duration: 2, type: "successful"})
        }else{
            addNotification({notification: "Something wrong happens", duration: 2, type:"warning"})
        }
    }
)

const authorSlice = createSlice({
    name: "authorSlice",
    initialState,
    reducers:{},
    extraReducers: (build) => {
        build.addCase(fetchAllAuthors.fulfilled, (state, action) => {
            const payload = action.payload;
            if (!payload) return;
            state.items = payload.items ?? [];
            state.totalItems = payload.totalItems ?? state.items.length;
            state.currentPage = payload.currentPage ?? 1;
            state.pageSize = payload.pageSize ?? state.pageSize;
        });
        build.addCase(fetchAuthorById.fulfilled, (state, action) => {
            state.selected = action.payload ?? null;
        });
        build.addCase(newAuthor.fulfilled, (state, action) => {
            if (action.payload) state.items = [action.payload, ...state.items];
        });
        build.addCase(updateAuthor.fulfilled, (state, action) => {
            if (!action.payload) return;
            state.selected = action.payload;
            state.items = state.items.map((a) => (a.id === action.payload.id ? action.payload : a));
        })
    }
})

const authorsReducer = authorSlice.reducer
export default authorsReducer