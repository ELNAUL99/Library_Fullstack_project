import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CategoryIcon from "@mui/icons-material/Category";
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

  const featuredCategories = useMemo(() => {
    const map = new Map<number, { id: number; name: string }>();
    (books ?? []).forEach((b) =>
      b.categories?.forEach((c) => map.set(c.id, { id: c.id, name: c.name }))
    );
    return Array.from(map.values()).slice(0, 8);
  }, [books]);

  if (loading) return <div>Loading...</div>;

  return (
    <Box className="page" sx={{ py: 3 }}>
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Paper
        elevation={0}
        className="card"
        sx={{
          p: { xs: 2.5, md: 4 },
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
          alignItems: { xs: "flex-start", sm: "center" },
        }}
      >
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: "20px",
            background:
              "linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BusinessIcon sx={{ color: "white", fontSize: "3rem" }} />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="overline" color="text.secondary">
            Publisher
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
            {publisher?.name ?? "Publisher"}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
            {publisher?.phone && (
              <Chip
                icon={<PhoneIcon />}
                label={publisher.phone}
                variant="outlined"
              />
            )}
            <Chip
              icon={<MenuBookIcon />}
              label={`${books?.length ?? 0} ${
                (books?.length ?? 0) === 1 ? "book" : "books"
              }`}
              color="secondary"
            />
          </Stack>
        </Box>
      </Paper>

      {featuredCategories.length > 0 && (
        <Paper elevation={0} className="card" sx={{ p: 2.5, mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
            Categories published
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {featuredCategories.map((c) => (
              <Chip
                key={c.id}
                icon={<CategoryIcon />}
                label={c.name}
                onClick={() => navigate(`/category/${c.id}`)}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Stack>
        </Paper>
      )}

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Books from {publisher?.name ?? "this publisher"}
      </Typography>

      {books && books.length > 0 ? (
        <Box className="grid-cards">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </Box>
      ) : (
        <Typography color="text.secondary">
          No books from this publisher yet.
        </Typography>
      )}
    </Box>
  );
};

export default PublisherDetail;
