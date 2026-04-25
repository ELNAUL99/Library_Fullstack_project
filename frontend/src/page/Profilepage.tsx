import React from "react";
import { useAppSelector } from "../hooks/reduxHook";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const Profilepage = () => {
  const user = useAppSelector((state) => state.userReducer);
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" className="profile-container">
      <Box className="profile-header">
        <Avatar className="profile-avatar">
          {user?.firstName?.[0]}
        </Avatar>

        <Typography variant="h4" className="profile-title">
          {user?.firstName} {user?.lastName}
        </Typography>

        <Typography variant="subtitle1" className="profile-subtitle">
          @{user?.username}
        </Typography>
      </Box>

      <Box className="profile-card">
        <Typography variant="h6">
          <b>Email:</b> {user?.email}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
          <Typography variant="h6" component="span">
            <b>Role:</b>
          </Typography>
          {user?.roles && user.roles.length > 0 ? (
            user.roles.map((role) => (
              <Chip
                key={role}
                label={role}
                color={role === "ADMIN" ? "error" : "primary"}
                size="small"
              />
            ))
          ) : (
            <Chip label="No role assigned" size="small" />
          )}
        </Stack>
      </Box>

      <Box className="profile-actions">
        <Button
          variant="contained"
          onClick={() => navigate("/rental")}
          className="profile-btn"
        >
          My Rentals
        </Button>

        <Tooltip title="Edit Profile">
          <IconButton
            className="edit-btn"
            onClick={() => navigate("/profile/edit")}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Container>
  );
};

export default Profilepage;
