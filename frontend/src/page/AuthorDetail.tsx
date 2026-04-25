import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Author } from "../types/author";
import apiClient from "../services/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { fetchBooksByAuthor } from "../redux/reducer/bookReducer";
import BookCard from "../components/cards/BookCard";

const AuthorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const books = useAppSelector((s) => s.booksReducer.items);

  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient
      .get<Author>(API_ENDPOINTS.AUTHORS.GET_BY_ID(parseInt(id)))
      .then(setAuthor)
      .finally(() => setLoading(false));

    dispatch(fetchBooksByAuthor(parseInt(id)));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;

  return (
    <Box className="page" sx={{ py: 3 }}>
      <Button variant="text" onClick={() => navigate(-1)}>
        Back
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        {author?.name ?? "Author"}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {author?.nationality}
      </Typography>

      <Box className="grid-cards">
        {books?.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </Box>
    </Box>
  );
};

export default AuthorDetail;

