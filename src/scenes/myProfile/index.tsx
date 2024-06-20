import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, TextField, useTheme, Typography, MenuItem, Select, FormControl, InputLabel, useMediaQuery } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { tokens } from "../../theme";
import useUserData from "../../hooks/useUserData";
import { getLocaltion } from "../../actions/location.action";

const MyProfile = () => {

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const userData = useUserData();
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState(userData);
  const [initialValues, setInitialValues] = useState(userData);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(null);

  const [oldImageId, setOldImageId] = useState(null);

  const gBASE_URL = process.env.REACT_APP_API_URL;

  const cities = useSelector(state => state?.locationReducer?.cities);

  useEffect(() => {
    dispatch(getLocaltion());
  }, [dispatch]);

  useEffect(() => {
    setFormValues(userData);
    setInitialValues(userData);
  }, [userData]);

  // avatar load
  useEffect(() => {
    // Kiểm tra xem userData.avatarUrl có phải là ID hay không
    if (userData.avatarUrl && userData.avatarUrl.length === 24) {
      // Nếu phải, gọi API để lấy URL của ảnh
      fetch(`${gBASE_URL}/image/${userData.avatarUrl}`)
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setAvatarUrl(url);
          setOldImageId(userData.avatarUrl); // Lưu ID của ảnh cũ
        })
        .catch(error => console.error(error));
    } else {
      // Nếu không phải, chỉ cần sử dụng URL hiện tại
      setAvatarUrl(userData.avatarUrl);
    }
  }, [userData]);

  // form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevState => ({
      ...prevState,
      [name]: value
    }));
    setIsFormChanged(true); // Đánh dấu rằng có sự thay đổi trong form
  };

  // update profile
  const handleUpdateProfile = () => {
    if (!isFormChanged) {
      toast.error("Please enter new information before continuing", { autoClose: 3000, theme: "dark" });
      return;
    }

    const userId = Cookies.get("_id");
    const accessToken = Cookies.get("accessToken");

    const updatedData = {};

    // Compare current data with initial data to determine which fields have changed
    for (const key in formValues) {
      if (formValues[key] !== initialValues[key]) {
        updatedData[key] = formValues[key];
      }
    }

    axios.put(`${gBASE_URL}/user/${userId}`, updatedData, {
      headers: {
        "x-access-token": accessToken
      }
    })
      .then(response => {
        if (response.status === 200) {
          toast.success('Update Successfully', { autoClose: 3000, theme: "dark" });
          setIsFormChanged(false); // Mark that the data has been successfully updated
        } else {
          throw new Error('Update failed');
        }
      })
      .catch(error => {
        toast.warning('Update failed. Please try again.', { autoClose: 3000, theme: "dark" });
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Check if the file size is more than 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error('The file size should not exceed 5MB.', { autoClose: 3000, theme: "dark" });
      return;
    }
    const formData = new FormData();
    formData.append('image', file);

    axios.post(`${gBASE_URL}/upload`, formData)
      .then(response => {
        const imageId = response.data.data;
        setAvatarUrl(imageId);
        handleUpdateAvatar(imageId);
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error('An image with the same name and dimensions already exists!', { autoClose: 3000, theme: "dark" });
        } else {
          console.error(error);
        }
      });
  };


  const handleUpdateAvatar = (imageId) => {
    const userId = Cookies.get("_id");
    const accessToken = Cookies.get("accessToken");

    axios.put(`${gBASE_URL}/user/${userId}`, { avatarUrl: imageId }, {
      headers: {
        "x-access-token": accessToken
      }
    })
      .then(response => {
        if (response.status === 200) {
          toast.success('Avatar updated successfully', { autoClose: 2000, theme: "dark" });
          setTimeout(function () {
            window.location.reload();
          }, 2000);
          if (oldImageId) {
            // Nếu có ảnh cũ, xóa nó
            axios.delete(`${gBASE_URL}/image/${oldImageId}`, {
              headers: {
                "x-access-token": accessToken
              }
            })
              .catch(error => console.error(error));
          }
        } else {
          throw new Error('Update failed');
        }
      })
      .catch(error => {
        toast.warning('Update failed. Please try again.', { autoClose: 3000, theme: "dark" });
      });
  };


  const cssString = `
  .avatar-upload {
    position: relative;
    max-width: 205px;
    .avatar-edit {
        position: absolute;
        right: 12px;
        z-index: 1;
        top: 10px;
        input {
            display: none;
            + label {
                display: inline-block;
                width: 34px;
                height: 34px;
                margin-bottom: 0;
                border-radius: 100%;
                background: #FFFFFF;
                border: 1px solid transparent;
                box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
                cursor: pointer;
                font-weight: normal;
                transition: all .2s ease-in-out;
                &:hover {
                    background: #f1f1f1;
                    border-color: #d6d6d6;
                }
                &:after {
                    content: "✏️";
                    font-family: 'FontAwesome';
                    color: #757575;
                    position: absolute;
                    top: 8px; /* default 10px */
                    left: 0;
                    right: 0;
                    text-align: center;
                    margin: auto;
                }
            }
        }
    }
    .avatar-preview {
        width: 192px;
        height: 192px;
        position: relative;
        border-radius: 100%;
        border: 6px solid orange;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        > div {
            width: 100%;
            height: 100%;
            border-radius: 100%;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
        }
    }
}`

  return (
    <Box m="0 20px">
      <Box
        display="grid"
        gap="20px"
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
        <Box sx={{ gridColumn: "span 4" }} display="flex" justifyContent="center" alignItems="center">
          <style>{cssString}</style>
          <div className="avatar-upload">
            <div className="avatar-edit">
              <input type='file' id="imageUpload" accept="image/*" onChange={handleFileChange} />
              <label htmlFor="imageUpload"></label>
            </div>
            <div className="avatar-preview">
              <div id="imagePreview" style={{ backgroundImage: `url(${avatarUrl})` }}>
              </div>
            </div>
          </div>
        </Box>
        <Typography fontWeight="700" color="#FFAC1C" variant="h4" sx={{ gridColumn: "span 4" }}>Personal Information <EditIcon /></Typography>
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="First Name"
          name="firstName"
          value={formValues.firstName || ''}
          onChange={handleFormChange}
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Last Name"
          name="lastName"
          value={formValues.lastName || ''}
          onChange={handleFormChange}
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Email"
          value={formValues.email || ''}
          onChange={handleFormChange}
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="number"
          label="Phone Number"
          name="phoneNumber"
          value={formValues.phoneNumber || ''}
          onChange={handleFormChange}
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Address"
          name="address"
          value={formValues?.address || ''}
          onChange={handleFormChange}
          sx={{ gridColumn: "span 4" }}
        />
        <FormControl variant="filled" sx={{ gridColumn: "span 2" }} fullWidth>
          <InputLabel id="city-label">City</InputLabel>
          <Select
            labelId="city-label"
            name="city"
            label="City"
            value={formValues?.city || ''}
            onChange={handleFormChange}
          >
            <MenuItem value="" disabled>Please choose a City</MenuItem>
            {cities.map(city => (
              <MenuItem key={city?.Id} value={city?.Name}>{city?.Name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="filled" sx={{ gridColumn: "span 2" }} fullWidth>
          <InputLabel id="district-label">District</InputLabel>
          <Select
            labelId="district-label"
            name="district"
            label="District"
            value={formValues?.district || ''}
            onChange={handleFormChange}
          >
            <MenuItem value="" disabled>Please choose a District</MenuItem>
            {cities.find(city => city?.Name === formValues?.city)?.Districts.map(district => (
              <MenuItem key={district?.Id} value={district?.Name}>{district?.Name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="filled" sx={{ gridColumn: "span 2" }} fullWidth>
          <InputLabel id="ward-label">Ward</InputLabel>
          <Select
            labelId="ward-label"
            name="ward"
            label="Ward"
            value={formValues?.ward || ''}
            onChange={handleFormChange}
          >
            <MenuItem value="" disabled>Please choose a Ward</MenuItem>
            {cities.find(city => city?.Name === formValues?.city)?.Districts.find(district => district.Name === formValues?.district)?.Wards.map(ward => (
              <MenuItem key={ward?.Id} value={ward?.Name}>{ward?.Name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="ZipCode"
          name="zipCode"
          value={formValues.zipCode || ''}
          onChange={handleFormChange}
          sx={{ gridColumn: "span 2" }}
        />
      </Box>
      <Box display="flex" justifyContent="end" mt="20px">
        <Button type="button" color="secondary" variant="contained" onClick={handleUpdateProfile}>
          Update Profile
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default MyProfile;
