import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Slide, InputLabel, useTheme, Box, Grid, FormControl, Select, MenuItem, IconButton, Tooltip, DialogTitle, DialogActions, Dialog, TextField, Button, DialogContent } from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

import { tokens } from '../../../theme';
import { getLocaltion } from '../../../actions/location.action';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditUserModal({ open, onClose, selectedUser, fetchUsers }) {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const dispatch = useDispatch();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const cities = useSelector(state => state?.locationReducer?.cities);

  const gBASE_URL = process.env.REACT_APP_API_URL;
  // state lấy dữ liệu
  const [user, setUser] = useState({
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    district: "",
    ward: "",
    zipCode: "",
    role: "",
    avatarUrl: [""],
    selectedAvatarIndex: 0
  });

  const [initialUser, setInitialUser] = useState(user);

  const accessToken = Cookies.get('accessToken');

  const [editedRole, setEditedRole] = useState("");

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState('');

  useEffect(() => {
    dispatch(getLocaltion());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser) {
      const newUser = {
        id: selectedUser._id || "",
        username: selectedUser.username || "",
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        email: selectedUser.email || "",
        city: selectedUser.city || "",
        district: selectedUser.district || "",
        ward: selectedUser.ward || "",
        zipCode: selectedUser.zipCode || "",
        role: selectedUser.roles[0]?.name || "",
        avatarUrl: selectedUser.avatarUrl || [""],
        selectedAvatarIndex: 0
      };
      setUser(newUser);
      setInitialUser(newUser);
      const avatarUrl = selectedUser.avatarUrl[0];
      if (avatarUrl?.startsWith('http') || avatarUrl?.startsWith('https')) {
        setCurrentAvatarUrl(avatarUrl);
      } else {
        setCurrentAvatarUrl(`${gBASE_URL}/image/${avatarUrl}`);
      }
    } else {
      const newUser = {
        id: "",
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        district: "",
        ward: "",
        zipCode: "",
        role: "",
        avatarUrl: [""],
        selectedAvatarIndex: 0
      };
      setUser(newUser);
      setInitialUser(newUser);
      setCurrentAvatarUrl('');
    }
  }, [selectedUser]);


  const handleAvatarChange = (e) => {
    const selectedIndex = parseInt(e.target.value);
    setUser({
      ...user,
      selectedAvatarIndex: selectedIndex
    });
    const avatarUrl = user.avatarUrl[selectedIndex];
    if (avatarUrl?.startsWith('http') || avatarUrl?.startsWith('https')) {
      setCurrentAvatarUrl(avatarUrl);
    } else {
      setCurrentAvatarUrl(`${gBASE_URL}/image/${avatarUrl}`);
    }
  };

  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    setEditedRole(newRole);
    setUser({
      ...user,
      role: newRole
    });
  };
  const handleSave = async () => {
    try {
      const updatedFields = Object.keys(user).reduce((acc, key) => {
        if (user[key] !== initialUser[key]) {
          acc[key] = user[key];
        }
        return acc;
      }, {});
  
      if (Object.keys(updatedFields).length > 0) {
        const response = await fetch(`${gBASE_URL}/user/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken
          },
          body: JSON.stringify(updatedFields)
        });
  
        const data = await response.json();
  
        if (response.ok) {
          toast.success('User updated successfully', { autoClose: 3000, theme: "dark" });
          fetchUsers();
        } else {
          toast.error(data.message, { autoClose: 3000, theme: "dark" });
        }
      }
    } catch (error) {
      toast.error('Failed to update user', { autoClose: 3000, theme: "dark" });
    }
  
    onClose();
  };
  return (
    <Dialog TransitionComponent={Transition} keepMounted open={open} onClose={onClose} sx={{ minWidth: '500px' }}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent
        sx={{
          width: '500px',
          '& label.Mui-focused': {
            color: colors.grey[100],
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: colors.grey[100],
          }
        }}>
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
            required
            margin="dense"
            id="username"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={user.username}
            disabled
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="firstname"
            name="firstname"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="lastname"
            name="lastname"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            required
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="text"
            fullWidth
            variant="standard"
            value={user.email}
            disabled
            sx={{ gridColumn: "span 4" }}
          />
          <Grid container spacing={1} alignItems="flex-end" sx={{ gridColumn: "span 4" }}>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <Select
                  id="user-avatar-list"
                  fullWidth
                  value={user.selectedAvatarIndex}
                  onChange={handleAvatarChange}
                >
                  {user.avatarUrl.map((avatar, index) => (
                    <MenuItem key={index} value={index}>
                      {index + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={9}>
              <TextField
                required
                margin="dense"
                id="avatarUrl"
                name="avatarUrl"
                label="Avatar Url"
                type="text"
                fullWidth
                variant="standard"
                value={currentAvatarUrl}
                disabled
                InputProps={{
                  endAdornment:
                    <div style={{ display: 'flex' }}>
                      <Tooltip title={
                        <img
                          alt="avatar-preview"
                          src={currentAvatarUrl}
                          style={{ width: '200px', height: '200px' }}
                        />
                      } arrow>
                        <IconButton edge="end">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                }}
              />
            </Grid>
          </Grid>
          <Grid sx={{ gridColumn: "span 4" }}>
            <FormControl sx={{ mt: "10px" }} fullWidth>
              <InputLabel id="role">Roles</InputLabel>
              <Select
                labelId="role"
                id="role"
                label="role"
                value={user.role}
                onChange={handleRoleChange}
              >
                {['Admin', 'Moderator', 'User', 'Guest'].map((roleOption) => (
                  <MenuItem key={roleOption} value={roleOption}>
                    {roleOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <FormControl variant="outlined" sx={{ gridColumn: "span 2" }} fullWidth>
            <InputLabel id="city-label">City</InputLabel>
            <Select
              labelId="city-label"
              name="city"
              label="City"
              value={user.city || ''}
              onChange={(event) => setUser({ ...user, city: event.target.value })}
            >
              <MenuItem value="" disabled>Please choose a City</MenuItem>
              {cities.map(city => (
                <MenuItem key={city.Id} value={city.Name}>{city.Name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ gridColumn: "span 2" }} fullWidth>
            <InputLabel id="district-label">District</InputLabel>
            <Select
              labelId="district-label"
              name="district"
              label="District"
              value={user?.district || ''}
              onChange={(event) => setUser({ ...user, district: event.target.value })}
            >
              <MenuItem value="" disabled>Please choose a District</MenuItem>
              {cities.find(city => city.Name === user.city)?.Districts.map(district => (
                <MenuItem key={district.Id} value={district.Name}>{district.Name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ gridColumn: "span 2" }} fullWidth>
            <InputLabel id="ward-label">Ward</InputLabel>
            <Select
              labelId="ward-label"
              name="ward"
              label="Ward"
              value={user?.ward || ''}
              onChange={(event) => setUser({ ...user, ward: event.target.value })}
            >
              <MenuItem value="" disabled>Please choose a Ward</MenuItem>
              {cities.find(city => city.Name === user.city)?.Districts.find(district => district.Name === user.district)?.Wards.map(ward => (
                <MenuItem key={ward.Id} value={ward.Name}>{ward.Name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            required
            id="zipcode"
            name="zipcode"
            label="Zip Code"
            type="text"
            fullWidth
            variant="outlined"
            value={user.zipCode}
            onChange={(e) => setUser({ ...user, zipCode: e.target.value })}
            sx={{ gridColumn: "span 2" }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color='success' onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
