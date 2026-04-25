import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
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

  return (
    <Card className="card" sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: 2,
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            width: 80,
            minWidth: 80,
            aspectRatio: "2 / 3",
            borderRadius: 2,
            overflow: "hidden",
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.45) 0%, rgba(59,130,246,0.4) 100%)",
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
              alt={`${book.title} cover`}
              onError={() => setCoverFailed(true)}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                textAlign: "center",
                px: 0.5,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {book.title}
            </Typography>
          )}
        </Box>

        <CardContent sx={{ p: 0, flexGrow: 1, "&:last-child": { pb: 0 } }}>
          <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
            {book.authors?.map((a) => a.name).join(", ")}
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
          <Chip
            size="small"
            label={`${book.numberOfCopiesAvailable} available`}
            color={book.numberOfCopiesAvailable > 0 ? "success" : "default"}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </CardContent>
      </Box>
      <CardActions sx={{ pt: 0 }}>
        <Button onClick={() => navigate(`/books/${book.id}`)}>See more</Button>
      </CardActions>
    </Card>
  );
};

export default BookCard;
