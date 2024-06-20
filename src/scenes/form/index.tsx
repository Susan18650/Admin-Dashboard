import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ToastContainer, toast } from 'react-toastify';

import Header from "../../components/Header";
import { tokens } from "../../theme";

const CreateAccount = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const gBASE_URL = process.env.REACT_APP_API_URL;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleCreateAccount = async () => {
    if (!newUsername || !newEmail || !newPassword || !confirmPassword) {
      toast.warning('Please enter your information.', { autoClose: 3000, theme: "dark" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warning("Password and Confirm Password must match", { autoClose: 3000, theme: "dark" });
      return;
    }
    const data = {
      username: newUsername,
      email: newEmail,
      password: newPassword,
    };
    try {
      const response = await fetch(`${gBASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.status === 200 || response.status === 201) {
        toast.success("Create new user successfully", { autoClose: 3000, theme: "dark" });
        setTimeout(function () {
          window.location.reload();
      }, 2000);
      } else if (response.status === 400 && responseData.message === "Username existed") {
        toast.warning("Username already exists! Please choose another username.", { autoClose: 3000, theme: "dark" });
      } else if (response.status === 409 && responseData.message === "Email already registered") {
        toast.warning("Email is registered with another account.", { autoClose: 3000, theme: "dark" });
      } else {
        toast.error("Create account failed!! Please try again.", { autoClose: 3000, theme: "dark" });
      }
    } catch (error) {
      // console.error("Error during signup:", error);
      toast.error("Create account failed!! Please try again.", { autoClose: 3000, theme: "dark" });
    }
  }

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />
      <Box
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          '& label.Mui-focused': {
            color: colors.grey[100],
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: colors.grey[100],
          }
        }}
      >
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Username"
          name="username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Email"
          name="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="password"
          label="Password"
          name="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ gridColumn: "span 2" }}
        />
      </Box>
      <Box display="flex" justifyContent="end" mt="20px">
        <Button type="button" color="secondary" variant="contained" onClick={handleCreateAccount} >
          Create New User
        </Button>
      </Box>
      <ToastContainer/>
    </Box>
  );
};

export default CreateAccount;
