import React, { useMemo, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 260;

const AdminShell = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { label: "Dashboard", to: "/admin" },
      { label: "Books", to: "/admin/books" },
      { label: "Authors", to: "/admin/authors" },
      { label: "Categories", to: "/admin/categories" },
      { label: "Publishers", to: "/admin/publishers" },
      { label: "Rentals", to: "/admin/rentals" },
    ],
    []
  );

  const drawer = (
    <Box sx={{ px: 1, py: 2 }}>
      <Box sx={{ px: 2, mb: 1 }}>
        <Typography sx={{ fontWeight: 900, letterSpacing: 0.2 }}>
          Admin
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage catalog & rentals
        </Typography>
      </Box>
      <Divider sx={{ my: 1.5 }} />
      <List>
        {navItems.map((item) => {
          const selected =
            location.pathname === item.to ||
            (item.to !== "/admin" && location.pathname.startsWith(item.to));
          return (
            <ListItemButton
              key={item.to}
              selected={selected}
              onClick={() => {
                navigate(item.to);
                setMobileOpen(false);
              }}
              sx={{ borderRadius: 2, mx: 1 }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box sx={{ flex: 1 }}>
        <Toolbar sx={{ px: 2 }}>
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography sx={{ fontWeight: 800, ml: 1 }}>Admin</Typography>
        </Toolbar>
        <Box className="app-content" sx={{ px: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminShell;

