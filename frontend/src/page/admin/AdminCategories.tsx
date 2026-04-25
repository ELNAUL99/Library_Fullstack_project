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
  deleteCategory,
  fetchAllCategories,
  newCategory,
  updateCategory,
} from "../../redux/reducer/categoryReducer";
import { Category } from "../../types/category";

const AdminCategories = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.categoriesReducer.items);
  const [query, setQuery] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchAllCategories(null));
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name?.toLowerCase().includes(q));
  }, [categories, query]);

  const openCreate = () => {
    setName("");
    setCreateOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setName(category.name ?? "");
    setEditOpen(true);
  };

  const submitCreate = async () => {
    await dispatch(newCategory({ name, books: [] })).unwrap();
    setCreateOpen(false);
    dispatch(fetchAllCategories(null));
  };

  const submitEdit = async () => {
    if (!editing) return;
    await dispatch(updateCategory({ ...editing, name })).unwrap();
    setEditOpen(false);
    setEditing(null);
    dispatch(fetchAllCategories(null));
  };

  const remove = async (id: number) => {
    await dispatch(deleteCategory(id)).unwrap();
    dispatch(fetchAllCategories(null));
  };

  return (
    <Box className="page">
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Categories
        </Typography>
        <Button variant="contained" onClick={openCreate}>
          New category
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
          <Button
            variant="outlined"
            onClick={() => dispatch(fetchAllCategories(null))}
          >
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
                <TableCell align="right" width={120}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>{c.name}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openEdit(c)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => remove(c.id)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography color="text.secondary">No results.</Typography>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth>
        <DialogTitle>New category</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
        <DialogTitle>Edit category</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
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

export default AdminCategories;

