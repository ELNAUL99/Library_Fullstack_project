import React from "react";
import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import NotificationsContainer from "../components/NotificationsContainer";

const AppShell = () => {
  return (
    <Box className="app-root">
      <Header />
      <NotificationsContainer />
      <Container maxWidth="lg" className="app-content">
        <Outlet />
      </Container>
    </Box>
  );
};

export default AppShell;

