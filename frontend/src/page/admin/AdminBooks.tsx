import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHook";
import {
  createNewBook,
  deleteBook,
  fetchAllBooks,
  updateBook,
} from "../../redux/reducer/bookReducer";
import { Book } from "../../types/book";

type BookDraft = {
  title: string;
  isbn: string;
  description: string;
};

const AdminBooks = () => {
  const dispatch = useAppDispatch();
  const books = useAppSelector((s) => s.booksReducer.items);
  const [query, setQuery] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);

  const [draft, setDraft] = useState<BookDraft>({
    title: "",
    isbn: "",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchAllBooks(null));
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) || b.isbn?.toLowerCase().includes(q)
    );
  }, [books, query]);

  const openCreate = () => {
    setDraft({ title: "", isbn: "", description: "" });
    setCreateOpen(true);
  };

  const openEdit = (book: Book) => {
    setEditing(book);
    setDraft({
      title: book.title ?? "",
      isbn: book.isbn ?? "",
      description: book.description ?? "",
    });
    setEditOpen(true);
  };

  const submitCreate = async () => {
    await dispatch(createNewBook(draft)).unwrap();
    setCreateOpen(false);
  };

  const submitEdit = async () => {
    if (!editing) return;
    await dispatch(
      updateBook({
        ...editing,
        title: draft.title,
        isbn: draft.isbn,
        description: draft.description,
      })
    ).unwrap();
    setEditOpen(false);
    setEditing(null);
  };

  const remove = async (id: number) => {
    await dispatch(deleteBook(id)).unwrap();
    dispatch(fetchAllBooks(null));
  };

  return (
    <Box className="page">
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Books
        </Typography>
        <Button variant="contained" onClick={openCreate}>
          New book
        </Button>
      </Box>

      <Card className="card" sx={{ mb: 2 }}>
        <CardContent sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <TextField
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title or ISBN"
            sx={{ flex: "1 1 240px" }}
          />
          <Button variant="outlined" onClick={() => dispatch(fetchAllBooks(null))}>
            Refresh
          </Button>
        </CardContent>
      </Card>

      <Card className="card">
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>ISBN</TableCell>
                <TableCell align="right" width={120}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id} hover>
                  <TableCell>{b.title}</TableCell>
                  <TableCell>{b.isbn}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openEdit(b)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => remove(b.id)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography color="text.secondary">No results.</Typography>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth>
        <DialogTitle>New book</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <TextField
            label="Title"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
          <TextField
            label="ISBN"
            value={draft.isbn}
            onChange={(e) => setDraft((d) => ({ ...d, isbn: e.target.value }))}
          />
          <TextField
            label="Description"
            value={draft.description}
            multiline
            minRows={3}
            onChange={(e) =>
              setDraft((d) => ({ ...d, description: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
        <DialogTitle>Edit book</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <TextField
            label="Title"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
          <TextField
            label="ISBN"
            value={draft.isbn}
            onChange={(e) => setDraft((d) => ({ ...d, isbn: e.target.value }))}
          />
          <TextField
            label="Description"
            value={draft.description}
            multiline
            minRows={3}
            onChange={(e) =>
              setDraft((d) => ({ ...d, description: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminBooks;

