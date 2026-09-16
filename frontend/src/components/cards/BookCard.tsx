import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Book } from "../../types/book";
import { useNavigate } from "react-router-dom";

const BookCard = (props: { book: Book }) => {
  const navigate = useNavigate();
  const [coverFailed, setCoverFailed] = useState(false);
  const { book } = props;

  const coverSrc =
    book.isbn && !coverFailed
      ? `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(
          book.isbn
        )}-M.jpg?default=false`
      : null;

  const available = book.totalCopiesAvailable ?? book.copies?.filter((c) => c.isAvailable).length ?? 0;
  const categories = book.categories ?? [];

  return (
    <Card className="card" sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", gap: 2, p: 2, alignItems: "stretch" }}>
        <Box
          sx={{
            width: 90,
            minWidth: 90,
            aspectRatio: "2 / 3",
            borderRadius: 2,
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #e0805f 0%, #f0b39a 100%)",
            border: "1px solid #efe9df",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {coverSrc ? (
            <Box
              component="img"
              src={coverSrc}
              alt={`${book.title} cover`}
              onError={() => setCoverFailed(true)}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Box
              sx={{
                p: 1,
                textAlign: "center",
                color: "rgba(255,255,255,0.92)",
              }}
            >
              <MenuBookIcon sx={{ fontSize: 28, mb: 0.5, opacity: 0.85 }} />
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  lineHeight: 1.15,
                }}
              >
                {book.title}
              </Typography>
            </Box>
          )}
        </Box>

        <CardContent sx={{ p: 0, flexGrow: 1, "&:last-child": { pb: 0 } }}>
          <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
            {book.authors?.map((a) => a.name).join(", ") || "Unknown author"}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, lineHeight: 1.2 }}
          >
            {book.title}
          </Typography>
          <Typography sx={{ fontSize: 11, mt: 0.5 }} color="text.secondary">
            ISBN {book.isbn}
          </Typography>

          {categories.length > 0 && (
            <Stack
              direction="row"
              spacing={0.5}
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 1 }}
            >
              {categories.slice(0, 3).map((c) => (
                <Chip
                  key={c.id}
                  size="small"
                  label={c.name}
                  color="primary"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/category/${c.id}`);
                  }}
                  sx={{ cursor: "pointer" }}
                />
              ))}
              {categories.length > 3 && (
                <Chip
                  size="small"
                  label={`+${categories.length - 3}`}
                  variant="outlined"
                />
              )}
            </Stack>
          )}
        </CardContent>
      </Box>

      <CardActions
        sx={{
          pt: 0,
          px: 2,
          pb: 1.5,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Chip
          size="small"
          label={`${available} available`}
          color={available > 0 ? "success" : "default"}
          variant="outlined"
        />
        <Button onClick={() => navigate(`/books/${book.id}`)}>See more</Button>
      </CardActions>
    </Card>
  );
};

export default BookCard;
