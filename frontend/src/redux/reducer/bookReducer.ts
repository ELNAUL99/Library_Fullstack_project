import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Book, NewBook } from "../../types/book";
import axios from "axios";
import { Pagination } from "../../types/pagination";
import { API_BASE_URL } from "../../config/api";

type BooksState = {
    items: Book[];
    selected: Book | null;
};

const initialState: BooksState = {
    items: [],
    selected: null,
};

export const fetchAllBooks = createAsyncThunk(
    "fetchAllBooks",
    async(pagination:Pagination | null) => {
        const res = await axios.get(`${API_BASE_URL}/Books`,
        {
            headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}`}
        })
        return res.data;
    }
)

export const fetchBookById = createAsyncThunk(
    "fetchBookById",
    async(id: number) => {
        const res = await axios.get(`${API_BASE_URL}/Books/${id}`,
        {
            headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}`}
        })
        return res.data
    }
)

export const createNewBook = createAsyncThunk(
    "createNewBook",
    async (form: NewBook) => {
        const res = await axios.post(`${API_BASE_URL}/Books`, form, {
            headers: {Authorization : `Bearer ${localStorage.getItem('access_token')}`}
        })
        return res.data
    }
)

export const updateBook = createAsyncThunk(
    "updateBook",
    async(form: Book) => {
        const res = await axios.put(`${API_BASE_URL}/Books/${form.id}`, form, 
        {
            headers: {Authorization: `Bearer ${localStorage.getItem("access_token")}`}
        })
        return res.data
    }
)

export const deleteBook = createAsyncThunk(
    "deleteBook",
    async(id: number) =>{
        const res = await axios.delete(`${API_BASE_URL}/Books/${id}`,
        {
            headers: {Authorization: `Bearer ${localStorage.getItem("access_token")}`}
        })
        return res.data
    }
)

export const fetchBooksByAuthor = createAsyncThunk(
    "fetchBooksByAuthor",
    async(authorId: number) => {
        try{
            const res = await axios.get(`${API_BASE_URL}/Books/author/${authorId}`,
            {
                headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}`}
            })
            return res.data as Book[]
        }catch(e:any){
            console.log(e)
        }
    }
)

export const fetchBooksByPublisher = createAsyncThunk(
    "fetchBooksByPublisher",
    async(publisherId: number) => {
        try{
            const res = await axios.get(`${API_BASE_URL}/Books/publisher/${publisherId}`,
            {
                headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}`}
            })
            return res.data as Book[]
        }catch(e:any){
            console.log(e)
        }
    }
)

export const fetchBooksByCategory = createAsyncThunk(
    "fetchBooksByCategory",
    async(categoryId: number) => {
        try{
            const res = await axios.get(`${API_BASE_URL}/Books/category/${categoryId}`,
            {
                headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}`}
            })
            return res.data as Book[]
        }catch(e:any){
            console.log(e)
        }
    }
)

export const fetchBooksByTitle = createAsyncThunk(
    "fetchBooksByTitle",
    async(title: string) => {
        try{
            const res = await axios.get(`${API_BASE_URL}/Books/search/${title}`,
            {
                headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}`}
            })
            return res.data as Book[]
        }catch(e:any){
            console.log(e)
        }
    }
)

export const fetchBooksByISBN = createAsyncThunk(
    "fetchBooksByISBN",
    async(isbn: string) => {
        try{
            const res = await axios.get(`${API_BASE_URL}/Books/search/${isbn}`,
            {
                headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}`}
            })
            return res.data as Book[]
        }catch(e:any){
            console.log(e)
        }
    }
)

const bookSlice = createSlice({
    name: "bookReducer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllBooks.fulfilled, (state, action) => {
            state.items = action.payload;
        });
        builder.addCase(fetchBookById.fulfilled, (state, action) => {
            state.selected = action.payload;
        });
        builder.addCase(createNewBook.fulfilled, (state, action) => {
            state.items = Array.isArray(state.items) ? [action.payload, ...state.items] : [action.payload];
        });
        builder.addCase(updateBook.fulfilled, (state, action) => {
            state.selected = action.payload;
            state.items = state.items.map((b) => (b.id === action.payload.id ? action.payload : b));
        });
        builder.addCase(fetchBooksByCategory.fulfilled, (state, action) => {
            state.items = action.payload ?? [];
        });
        builder.addCase(fetchBooksByPublisher.fulfilled, (state, action) => {
            state.items = action.payload ?? [];
        });
        builder.addCase(fetchBooksByAuthor.fulfilled, (state, action) => {
            state.items = action.payload ?? [];
        });
        builder.addCase(fetchBooksByTitle.fulfilled, (state, action) => {
            state.items = action.payload ?? [];
        });
    }
})

const booksReducer = bookSlice.reducer
export default booksReducer