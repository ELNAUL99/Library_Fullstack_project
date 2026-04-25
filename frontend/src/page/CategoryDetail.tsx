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
import CategoryIcon from "@mui/icons-material/Category";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
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

  const featuredAuthors = useMemo(() => {
    const map = new Map<number, { id: number; name: string }>();
    (books ?? []).forEach((b) =>
      b.authors?.forEach((a) => map.set(a.id, { id: a.id, name: a.name }))
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
              "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CategoryIcon sx={{ color: "white", fontSize: "3rem" }} />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="overline" color="text.secondary">
            Category
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
            {category?.name ?? "Category"}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
            <Chip
              icon={<MenuBookIcon />}
              label={`${books?.length ?? 0} ${
                (books?.length ?? 0) === 1 ? "book" : "books"
              }`}
              color="primary"
            />
          </Stack>
        </Box>
      </Paper>

      {featuredAuthors.length > 0 && (
        <Paper elevation={0} className="card" sx={{ p: 2.5, mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
            Authors in this category
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {featuredAuthors.map((a) => (
              <Chip
                key={a.id}
                icon={<PersonIcon />}
                label={a.name}
                onClick={() => navigate(`/author/${a.id}`)}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Stack>
        </Paper>
      )}

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Books in {category?.name ?? "this category"}
      </Typography>

      {books && books.length > 0 ? (
        <Box className="grid-cards">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </Box>
      ) : (
        <Typography color="text.secondary">
          No books in this category yet.
        </Typography>
      )}
    </Box>
  );
};

export default CategoryDetail;
