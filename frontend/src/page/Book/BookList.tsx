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
  const totalItems = useAppSelector((state) => state.booksReducer.totalItems);
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
    setPage(1);
    if (!trimmed) return dispatch(fetchAllBooks({ page: 1, pageSize }));
    dispatch(fetchBooksByTitle(trimmed));
  };

  const doSearchIsbn = () => {
    setPage(1);
    if (!trimmed) return dispatch(fetchAllBooks({ page: 1, pageSize }));
    dispatch(fetchBooksByISBN(trimmed));
  };

  //Change Page
  const handleChange = (_: any, page: number) => {
    setPage(page);
  };

  const totalPages = Math.max(1, Math.ceil((totalItems || books.length) / pageSize));

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
            setPage(1);
            dispatch(fetchAllBooks({ page: 1, pageSize }));
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

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            variant="outlined"
            onChange={handleChange}
            shape="rounded"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default BookList;