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
  deleteAuthor,
  fetchAllAuthors,
  newAuthor,
  updateAuthor,
} from "../../redux/reducer/authorReducer";
import { Author, CreateAuthor } from "../../types/author";

const isoDate = (d: any) => {
  try {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

const AdminAuthors = () => {
  const dispatch = useAppDispatch();
  const authors = useAppSelector((s) => s.authorsReducer.items);
  const [query, setQuery] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Author | null>(null);

  const [draft, setDraft] = useState<CreateAuthor>({
    name: "",
    birthDate: new Date(),
    nationality: "",
  });
  const [birthDateStr, setBirthDateStr] = useState("");

  useEffect(() => {
    dispatch(fetchAllAuthors(null));
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return authors;
    return authors.filter((a) => a.name?.toLowerCase().includes(q));
  }, [authors, query]);

  const openCreate = () => {
    setDraft({ name: "", birthDate: new Date(), nationality: "" });
    setBirthDateStr("");
    setCreateOpen(true);
  };

  const openEdit = (author: Author) => {
    setEditing(author);
    setDraft({
      name: author.name ?? "",
      nationality: author.nationality ?? "",
      birthDate: new Date(author.birthDate),
    });
    setBirthDateStr(isoDate(author.birthDate));
    setEditOpen(true);
  };

  const submitCreate = async () => {
    await dispatch(
      newAuthor({
        ...draft,
        birthDate: birthDateStr ? new Date(birthDateStr) : new Date(),
      })
    ).unwrap();
    setCreateOpen(false);
    dispatch(fetchAllAuthors(null));
  };

  const submitEdit = async () => {
    if (!editing) return;
    await dispatch(
      updateAuthor({
        ...editing,
        name: draft.name,
        nationality: draft.nationality,
        birthDate: birthDateStr ? new Date(birthDateStr) : editing.birthDate,
      })
    ).unwrap();
    setEditOpen(false);
    setEditing(null);
    dispatch(fetchAllAuthors(null));
  };

  const remove = async (id: number) => {
    await dispatch(deleteAuthor(id)).unwrap();
    dispatch(fetchAllAuthors(null));
  };

  return (
    <Box className="page">
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Authors
        </Typography>
        <Button variant="contained" onClick={openCreate}>
          New author
        </Button>
      </Box>

      <Card className="card" sx={{ mb: 2 }}>
        <CardContent sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <TextField
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name"
            sx={{ flex: "1 1 240px" }}
          />
          <Button variant="outlined" onClick={() => dispatch(fetchAllAuthors(null))}>
            Refresh
          </Button>
        </CardContent>
      </Card>

      <Card className="card">
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Nationality</TableCell>
                <TableCell>Birth date</TableCell>
                <TableCell align="right" width={120}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id} hover>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.nationality}</TableCell>
                  <TableCell>{isoDate(a.birthDate)}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openEdit(a)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => remove(a.id)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary">No results.</Typography>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth>
        <DialogTitle>New author</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <TextField
            label="Name"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          />
          <TextField
            label="Nationality"
            value={draft.nationality}
            onChange={(e) =>
              setDraft((d) => ({ ...d, nationality: e.target.value }))
            }
          />
          <TextField
            label="Birth date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={birthDateStr}
            onChange={(e) => setBirthDateStr(e.target.value)}
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
        <DialogTitle>Edit author</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <TextField
            label="Name"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          />
          <TextField
            label="Nationality"
            value={draft.nationality}
            onChange={(e) =>
              setDraft((d) => ({ ...d, nationality: e.target.value }))
            }
          />
          <TextField
            label="Birth date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={birthDateStr}
            onChange={(e) => setBirthDateStr(e.target.value)}
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

export default AdminAuthors;

