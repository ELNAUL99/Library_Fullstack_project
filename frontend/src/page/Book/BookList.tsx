import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHook";
import {
  fetchAllBooks,
  fetchBooksByISBN,
  fetchBooksByTitle,
} from "../../redux/reducer/bookReducer";
import BookCard from "../../components/cards/BookCard";
import { Pagination } from "@mui/material";

const BookList = () => {
  const books = useAppSelector((state) => state.booksReducer.items);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(30);
  const [query, setQuery] = useState("");

  const trimmed = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    dispatch(fetchAllBooks({ page: page, pageSize: pageSize }));
  }, [dispatch, page, pageSize]);

  if (!Array.isArray(books)) {
    return <>Loading...</>;
  }

  const doSearchTitle = () => {
    if (!trimmed) return dispatch(fetchAllBooks({ page, pageSize }));
    dispatch(fetchBooksByTitle(trimmed));
  };

  const doSearchIsbn = () => {
    if (!trimmed) return dispatch(fetchAllBooks({ page, pageSize }));
    dispatch(fetchBooksByISBN(trimmed));
  };

  //Change Page
  const handleChange = (_: any, page: number) => {
    setPage(page);
  };

  return (
    <Box className="page" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Books
        </Typography>
        <Button
          variant="text"
          onClick={() => {
            setQuery("");
            dispatch(fetchAllBooks({ page, pageSize }));
          }}
        >
          Reset
        </Button>
      </Box>

      <Box
        className="card"
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or ISBN"
          size="small"
          sx={{ flex: "1 1 260px" }}
        />
        <Button variant="contained" onClick={doSearchTitle}>
          Search title
        </Button>
        <Button variant="outlined" onClick={doSearchIsbn}>
          Search ISBN
        </Button>
      </Box>

      <Box className="grid-cards">
        {books.length === 0 ? (
          <Typography color="text.secondary">No books found.</Typography>
        ) : (
          books.map((book) => <BookCard key={book.id} book={book} />)
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={Math.max(1, Math.ceil(books.length / 30))}
          page={page}
          variant="outlined"
          onChange={handleChange}
          shape="rounded"
          size="large"
        />
      </Box>
    </Box>
  );
};

export default BookList;