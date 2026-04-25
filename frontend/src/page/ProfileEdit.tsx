import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { updateUserProfile } from "../redux/reducer/userReducer";

const ProfileEdit = () => {
  const user = useAppSelector((s) => s.userReducer);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initial = useMemo(
    () => ({
      username: user?.username ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      password: "",
      newPassword: "",
    }),
    [user]
  );

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const onSave = async () => {
    setSaving(true);
    try {
      await dispatch(
        updateUserProfile({
          id: user.id,
          token: user.token,
          changes: {
            username: form.username,
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            newPassword: form.newPassword ? form.newPassword : null,
          },
        })
      ).unwrap();

      navigate("/profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="page" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Edit profile
        </Typography>
        <Button variant="text" onClick={() => navigate("/profile")}>
          Cancel
        </Button>
      </Box>

      <Card className="card">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Basic information
          </Typography>

          <Box className="form-grid">
            <TextField
              label="Username"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <TextField
              label="First name"
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
            />
            <TextField
              label="Last name"
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Password
          </Typography>

          <Box className="form-grid">
            <TextField
              label="Current password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              helperText="Required by backend to update profile"
            />
            <TextField
              label="New password (optional)"
              type="password"
              value={form.newPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, newPassword: e.target.value }))
              }
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button variant="contained" disabled={saving} onClick={onSave}>
              Save changes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileEdit;

