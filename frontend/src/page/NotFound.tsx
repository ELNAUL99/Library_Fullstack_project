import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const NotFound = () => {
  return (
    <Box className="page" sx={{ py: 6, textAlign: "center" }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button variant="contained" component={RouterLink} to="/">
        Back to Home
      </Button>
    </Box>
  );
};

export default NotFound;

