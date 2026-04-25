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
  deletePublisher,
  fetchAllPublishers,
  newPublisher,
  updatePublisher,
} from "../../redux/reducer/publisherReducer";
import { Publisher } from "../../types/publisher";

const AdminPublishers = () => {
  const dispatch = useAppDispatch();
  const publishers = useAppSelector((s) => s.publishersReducer.items);
  const [query, setQuery] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Publisher | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    dispatch(fetchAllPublishers(null));
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return publishers;
    return publishers.filter((p) => p.name?.toLowerCase().includes(q));
  }, [publishers, query]);

  const openCreate = () => {
    setName("");
    setPhone("");
    setCreateOpen(true);
  };

  const openEdit = (publisher: Publisher) => {
    setEditing(publisher);
    setName(publisher.name ?? "");
    setPhone(publisher.phone ?? "");
    setEditOpen(true);
  };

  const submitCreate = async () => {
    await dispatch(newPublisher({ name, phone })).unwrap();
    setCreateOpen(false);
    dispatch(fetchAllPublishers(null));
  };

  const submitEdit = async () => {
    if (!editing) return;
    await dispatch(updatePublisher({ ...editing, name, phone })).unwrap();
    setEditOpen(false);
    setEditing(null);
    dispatch(fetchAllPublishers(null));
  };

  const remove = async (id: number) => {
    await dispatch(deletePublisher(id)).unwrap();
    dispatch(fetchAllPublishers(null));
  };

  return (
    <Box className="page">
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Publishers
        </Typography>
        <Button variant="contained" onClick={openCreate}>
          New publisher
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
            onClick={() => dispatch(fetchAllPublishers(null))}
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
                <TableCell>Phone</TableCell>
                <TableCell align="right" width={120}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openEdit(p)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => remove(p.id)} size="small">
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
        <DialogTitle>New publisher</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
        <DialogTitle>Edit publisher</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
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

export default AdminPublishers;

