import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import BusinessIcon from "@mui/icons-material/Business";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHook";
import { fetchBookById } from "../../redux/reducer/bookReducer";
import { createRental } from "../../redux/reducer/rentalReducer";

const BookPage = () => {
  const { id } = useParams();
  const user = useAppSelector((state) => state.userReducer);
  const book = useAppSelector((state) => state.booksReducer.selected);
  const [copyId, setCopyId] = useState<number | "">("");
  const [coverFailed, setCoverFailed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      setCoverFailed(false);
      await dispatch(fetchBookById(parseInt(id as string)));
      setLoading(false);
    }
    fetchData();
  }, [dispatch, id]);

  const availableCopies = useMemo(
    () => (book?.copies ?? []).filter((c) => c.isAvailable),
    [book]
  );

  function newRental() {
    if (!user?.id || copyId === "") return;
    dispatch(createRental({ copyId: copyId, userId: user.id }));
    setTimeout(() => navigate("/rental"), 500);
  }

  if (loading) return <div>Loading...</div>;

  const coverSrc =
    book?.isbn && !coverFailed
      ? `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(
          book.isbn
        )}-L.jpg?default=false`
      : null;

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
          p: { xs: 2, md: 4 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "260px 1fr" },
          gap: { xs: 3, md: 4 },
          alignItems: "start",
        }}
      >
        {/* Cover */}
        <Box
          sx={{
            width: "100%",
            aspectRatio: "2 / 3",
            borderRadius: 3,
            overflow: "hidden",
            position: "relative",
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.5) 0%, rgba(59,130,246,0.45) 100%)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {coverSrc ? (
            <Box
              component="img"
              src={coverSrc}
              alt={`${book?.title ?? "Book"} cover`}
              onError={() => setCoverFailed(true)}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <Box
              sx={{
                p: 2,
                textAlign: "center",
                color: "rgba(255,255,255,0.92)",
              }}
            >
              <Typography
                variant="overline"
                sx={{ letterSpacing: ".2rem", opacity: 0.8 }}
              >
                Oido Library
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, mt: 1, lineHeight: 1.2 }}
              >
                {book?.title}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Details */}
        <Box>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, lineHeight: 1.1, mb: 1 }}
          >
            {book?.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            ISBN {book?.isbn}
          </Typography>

          {book?.description && (
            <Typography sx={{ mb: 3, color: "rgba(229,231,235,0.85)" }}>
              {book.description}
            </Typography>
          )}

          <Stack spacing={1.5} sx={{ mb: 2 }}>
            {book?.authors && book.authors.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                <Typography sx={{ minWidth: 110, fontWeight: 700 }}>
                  Authors
                </Typography>
                {book.authors.map((a) => (
                  <Chip
                    key={a.id}
                    icon={<PersonIcon />}
                    label={a.name}
                    onClick={() => navigate(`/author/${a.id}`)}
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Box>
            )}

            {book?.categories && book.categories.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                <Typography sx={{ minWidth: 110, fontWeight: 700 }}>
                  Categories
                </Typography>
                {book.categories.map((c) => (
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
              </Box>
            )}

            {book?.publishers && book.publishers.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                <Typography sx={{ minWidth: 110, fontWeight: 700 }}>
                  Publishers
                </Typography>
                {book.publishers.map((p) => (
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
              </Box>
            )}
          </Stack>

          <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

          {/* Loan section */}
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Borrow this book
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {availableCopies.length} {availableCopies.length === 1 ? "copy" : "copies"} available
          </Typography>

          {availableCopies.length === 0 ? (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid rgba(245,158,11,0.35)",
                background: "rgba(245,158,11,0.08)",
              }}
            >
              <Typography>Sorry, no copies are available for loan right now.</Typography>
            </Box>
          ) : (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <FormControl
                sx={{
                  minWidth: 280,
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255,255,255,0.08)",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.25)",
                  },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.45)",
                  },
                  "& .MuiInputLabel-root": { color: "rgba(229,231,235,0.85)" },
                  "& .MuiSelect-select": { color: "#fff" },
                  "& .MuiSelect-icon": { color: "rgba(229,231,235,0.85)" },
                }}
              >
                <InputLabel id="copy-select-label">Choose a copy</InputLabel>
                <Select
                  labelId="copy-select-label"
                  label="Choose a copy"
                  value={copyId}
                  onChange={(e) => setCopyId(e.target.value as number)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: "#11182b",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#fff",
                      },
                    },
                  }}
                >
                  {availableCopies.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      Copy #{c.id} — {c.publisher?.name ?? "Unknown publisher"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                size="large"
                disabled={copyId === "" || !user?.id}
                onClick={newRental}
              >
                Create rental
              </Button>
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default BookPage;
