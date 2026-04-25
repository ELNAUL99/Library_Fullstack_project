import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { fetchAllRentalsForUser } from "../redux/reducer/rentalReducer";
import { Box, Container, Typography, Pagination } from "@mui/material";

const Rental = () => {
  const rentals = useAppSelector((state) => state.rentalsReducer.items);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(30);

  useEffect(() => {
    dispatch(fetchAllRentalsForUser({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  if (!Array.isArray(rentals)) {
    return <>Loading...</>;
  }

  return (
    <Container>
      <Box style={{ marginTop: 16, marginBottom: 16 }}>
        <Typography variant="h4">My Rentals</Typography>
      </Box>

      {rentals.length === 0 ? (
        <Typography>No active rentals.</Typography>
      ) : (
        rentals.map((rental, idx) => (
          <Box
            key={`${rental.copy?.id ?? "copy"}-${idx}`}
            style={{
              padding: 12,
              marginBottom: 12,
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 8,
            }}
          >
            <Typography variant="h6">{rental.copy?.title}</Typography>
            <Typography variant="body2">
              Copy #{rental.copy?.id} • Publisher: {rental.copy?.publisher?.name}
            </Typography>
            <Typography variant="body2">
              Start: {String(rental.startDate)} • Due: {String(rental.dueDate)}
            </Typography>
            <Typography variant="body2">
              Returned: {rental.returned ? "Yes" : "No"}
            </Typography>
          </Box>
        ))
      )}

      <Pagination
        count={Math.max(1, Math.ceil(rentals.length / 30))}
        page={page}
        variant="outlined"
        onChange={(_, p) => setPage(p)}
        shape="rounded"
        size="large"
      />
    </Container>
  );
};

export default Rental;
