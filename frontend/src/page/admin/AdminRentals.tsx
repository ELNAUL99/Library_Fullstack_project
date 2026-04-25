import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHook";
import { fetchAllRentalsForAdmin } from "../../redux/reducer/rentalReducer";

const AdminRentals = () => {
  const dispatch = useAppDispatch();
  const rentals = useAppSelector((s) => s.rentalsReducer.items);

  useEffect(() => {
    dispatch(fetchAllRentalsForAdmin(null));
  }, [dispatch]);

  return (
    <Box className="page">
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Rentals
        </Typography>
        <Button
          variant="outlined"
          onClick={() => dispatch(fetchAllRentalsForAdmin(null))}
        >
          Refresh
        </Button>
      </Box>

      <Card className="card">
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Copy</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Returned</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rentals.map((r, idx) => (
                <TableRow key={`${r.copy?.id ?? "copy"}-${idx}`} hover>
                  <TableCell>{r.user?.username}</TableCell>
                  <TableCell>
                    #{r.copy?.id} {r.copy?.title}
                  </TableCell>
                  <TableCell>{String(r.startDate)}</TableCell>
                  <TableCell>{String(r.dueDate)}</TableCell>
                  <TableCell>{r.returned ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
              {rentals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary">No rentals.</Typography>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminRentals;

