import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Category, NewCategory } from "../../types/category";
import { addNotification } from "../../components/NotificationHandle";
import { Pagination } from "../../types/pagination";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../config/api";

type CategoriesState = {
    items: Category[];
    selected: Category | null;
};

const initialState: CategoriesState = {
    items: [],
    selected: null,
};

export const fetchAllCategories = createAsyncThunk(
    'fetchAllCategories',
    async(pagination:Pagination | null) =>{
        try{
            return await apiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES.GET_ALL);
        }catch(e){
            console.log(e)
        }
    }
)
export const fetchCategoryById = createAsyncThunk(
    'fetchCategoryById',
    async(id:number) =>{
        try{
            return await apiClient.get<Category>(API_ENDPOINTS.CATEGORIES.GET_BY_ID(id));
        }catch(e){
            console.log(e)
        }
    }
)

export const newCategory = createAsyncThunk(
    'newCategory',
    async(form: NewCategory) => {
        try {
            return await apiClient.post<Category>(API_ENDPOINTS.CATEGORIES.CREATE, form);
        }catch(e){
            console.log(e)
        } 
    }
)

export const updateCategory = createAsyncThunk(
    "updateCategory",
    async(form: Category) => {
        return await apiClient.put<Category>(API_ENDPOINTS.CATEGORIES.UPDATE(form.id), form);
    }
)

export const deleteCategory = createAsyncThunk(
    "deleteCategory",
    async(id:number) => {
        const res = await apiClient.delete<any>(API_ENDPOINTS.CATEGORIES.DELETE(id));
        if(res){
            addNotification({notification: "Category delete successfully", duration: 2, type: "successful"})
        }else{
            addNotification({notification: "Something wrong happens", duration: 2, type:"warning"})
        }
    }
)

const categorySlice = createSlice({
    name: "categorySlice",
    initialState,
    reducers:{},
    extraReducers: (build) => {
        build.addCase(fetchAllCategories.fulfilled, (state, action) => {
            state.items = action.payload ?? [];
        });
        build.addCase(fetchCategoryById.fulfilled, (state, action) => {
            state.selected = action.payload ?? null;
        });
        build.addCase(newCategory.fulfilled, (state, action) => {
            if (action.payload) state.items = [action.payload, ...state.items];
        });
        build.addCase(updateCategory.fulfilled, (state, action) => {
            if (!action.payload) return;
            state.selected = action.payload;
            state.items = state.items.map((c) => (c.id === action.payload.id ? action.payload : c));
        })
    }
})

const categoriesReducer = categorySlice.reducer
export default categoriesReducer