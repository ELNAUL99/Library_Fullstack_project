import React, { useState } from "react";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { logout } from "../redux/reducer/userReducer";
import logo from "../img/logo.png";

const pages = ["Category", "Author", "Publisher", "Rental"];
const userSettings = ["Profile", "Logout"];

const Header = () => {
  const user = useAppSelector((state) => state.userReducer);
  const isAdmin = Boolean(user?.roles?.some((r) => r.toLowerCase() === "admin"));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [anchorNav, setAnchorNav] = useState<null | HTMLElement>(null);
  const [anchorUser, setAnchorUser] = useState<null | HTMLElement>(null);

  const openNavMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorNav(e.currentTarget);
  const openUserMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorUser(e.currentTarget);

  const closeNavMenu = () => setAnchorNav(null);
  const closeUserMenu = () => setAnchorUser(null);

  const handlePageClick = (page: string) => {
    if (page === "Admin") {
      navigate("/admin");
      closeNavMenu();
      return;
    }

    navigate(`/${page.toLowerCase()}`);
    closeNavMenu();
  };

  const handleUserClick = (setting: string) => {
    if (setting === "Logout") {
      dispatch(logout());
    } else {
      navigate("/profile");
    }
    closeUserMenu();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", alignItems: "center" }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logo}
              alt="Library logo"
              style={{ width: 80, height: 70, marginRight: "1rem" }}
            />
            <Typography
              variant="h5"
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".2rem",
                color: "white",
                display: { xs: "none", md: "flex" },
              }}
            >
              Oido
            </Typography>
          </Link>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={openNavMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorNav}
              open={Boolean(anchorNav)}
              onClose={closeNavMenu}
            >
              {[...pages, ...(isAdmin ? ["Admin"] : [])].map((page) => (
                <MenuItem key={page} onClick={() => handlePageClick(page)}>
                  <Typography>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {[...pages, ...(isAdmin ? ["Admin"] : [])].map((page) => (
              <Button
                key={page}
                onClick={() => handlePageClick(page)}
                sx={{ color: "white", fontSize: "1rem" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* User Menu */}
          <Box>
            <Tooltip title="Your account">
              <IconButton onClick={openUserMenu}>
                <PersonIcon sx={{ fontSize: "2.5rem", color: "white" }} />
              </IconButton>
            </Tooltip>
            {user?.username ? (
              <Typography
                variant="body2"
                sx={{ color: "white", display: { xs: "none", md: "inline" } }}
              >
                {user.username}
              </Typography>
            ) : null}
            <Menu
              anchorEl={anchorUser}
              open={Boolean(anchorUser)}
              onClose={closeUserMenu}
            >
              {userSettings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleUserClick(setting)}
                >
                  <Typography>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
