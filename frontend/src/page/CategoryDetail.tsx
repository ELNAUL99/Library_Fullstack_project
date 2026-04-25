import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Category } from "../types/category";
import apiClient from "../services/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { fetchBooksByCategory } from "../redux/reducer/bookReducer";
import BookCard from "../components/cards/BookCard";

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const books = useAppSelector((s) => s.booksReducer.items);

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient
      .get<Category>(API_ENDPOINTS.CATEGORIES.GET_BY_ID(parseInt(id)))
      .then(setCategory)
      .finally(() => setLoading(false));

    dispatch(fetchBooksByCategory(parseInt(id)));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;

  return (
    <Box className="page" sx={{ py: 3 }}>
      <Button variant="text" onClick={() => navigate(-1)}>
        Back
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        {category?.name ?? "Category"}
      </Typography>

      <Box className="grid-cards">
        {books?.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryDetail;

