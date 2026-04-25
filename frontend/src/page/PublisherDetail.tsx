import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Publisher } from "../types/publisher";
import apiClient from "../services/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { fetchBooksByPublisher } from "../redux/reducer/bookReducer";
import BookCard from "../components/cards/BookCard";

const PublisherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const books = useAppSelector((s) => s.booksReducer.items);

  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient
      .get<Publisher>(API_ENDPOINTS.PUBLISHERS.GET_BY_ID(parseInt(id)))
      .then(setPublisher)
      .finally(() => setLoading(false));

    dispatch(fetchBooksByPublisher(parseInt(id)));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;

  return (
    <Box className="page" sx={{ py: 3 }}>
      <Button variant="text" onClick={() => navigate(-1)}>
        Back
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        {publisher?.name ?? "Publisher"}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {publisher?.phone}
      </Typography>

      <Box className="grid-cards">
        {books?.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </Box>
    </Box>
  );
};

export default PublisherDetail;

