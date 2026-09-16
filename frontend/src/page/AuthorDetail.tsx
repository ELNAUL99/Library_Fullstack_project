import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PublicIcon from "@mui/icons-material/Public";
import CakeIcon from "@mui/icons-material/Cake";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CategoryIcon from "@mui/icons-material/Category";
import BusinessIcon from "@mui/icons-material/Business";
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

  const initials = useMemo(() => {
    if (!author?.name) return "?";
    return author.name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [author]);

  const relatedCategories = useMemo(() => {
    const map = new Map<number, { id: number; name: string }>();
    (books ?? []).forEach((b) =>
      b.categories?.forEach((c) => map.set(c.id, { id: c.id, name: c.name }))
    );
    return Array.from(map.values());
  }, [books]);

  const relatedPublishers = useMemo(() => {
    const map = new Map<number, { id: number; name: string }>();
    (books ?? []).forEach((b) =>
      b.publishers?.forEach((p) => map.set(p.id, { id: p.id, name: p.name }))
    );
    return Array.from(map.values());
  }, [books]);

  const birthYear = author?.birthDate
    ? new Date(author.birthDate).getFullYear()
    : null;

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
        <Avatar
          sx={{
            width: 96,
            height: 96,
            fontSize: "2rem",
            fontWeight: 800,
            background:
              "linear-gradient(135deg, #e0805f 0%, #d97c5f 100%)",
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="overline" color="text.secondary">
            Author
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
            {author?.name ?? "Author"}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
            {author?.nationality && (
              <Chip
                icon={<PublicIcon />}
                label={author.nationality}
                variant="outlined"
              />
            )}
            {birthYear && (
              <Chip
                icon={<CakeIcon />}
                label={`Born ${birthYear}`}
                variant="outlined"
              />
            )}
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

      {(relatedCategories.length > 0 || relatedPublishers.length > 0) && (
        <Paper elevation={0} className="card" sx={{ p: 2.5, mb: 3 }}>
          {relatedCategories.length > 0 && (
            <Box sx={{ mb: relatedPublishers.length > 0 ? 2 : 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Writes in these categories
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {relatedCategories.map((c) => (
                  <Chip
                    key={c.id}
                    icon={<CategoryIcon />}
                    label={c.name}
                    color="primary"
                    variant="outlined"
                    onClick={() => navigate(`/category/${c.id}`)}
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Stack>
            </Box>
          )}
          {relatedPublishers.length > 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Published by
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {relatedPublishers.map((p) => (
                  <Chip
                    key={p.id}
                    icon={<BusinessIcon />}
                    label={p.name}
                    color="secondary"
                    variant="outlined"
                    onClick={() => navigate(`/publisher/${p.id}`)}
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Paper>
      )}

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Books by {author?.name ?? "this author"}
      </Typography>

      {books && books.length > 0 ? (
        <Box className="grid-cards">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </Box>
      ) : (
        <Typography color="text.secondary">
          No books yet for this author.
        </Typography>
      )}
    </Box>
  );
};

export default AuthorDetail;
