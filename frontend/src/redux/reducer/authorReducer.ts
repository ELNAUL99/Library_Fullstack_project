import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Author, CreateAuthor } from "../../types/author";
import { addNotification } from "../../components/NotificationHandle";
import { Pagination } from "../../types/pagination";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../config/api";

type AuthorsState = {
    items: Author[];
    selected: Author | null;
};

const initialState: AuthorsState = {
    items: [],
    selected: null,
};

export const fetchAllAuthors = createAsyncThunk(
    'fetchAllAuthors',
    async(pagination:Pagination | null) =>{
        try{
            return await apiClient.get<Author[]>(API_ENDPOINTS.AUTHORS.GET_ALL);
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
            state.items = action.payload ?? [];
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