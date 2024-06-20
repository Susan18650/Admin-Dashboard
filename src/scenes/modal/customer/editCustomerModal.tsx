import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Button, TextField, useTheme, MenuItem, Select, FormControl, InputLabel, useMediaQuery, FormHelperText } from "@mui/material";
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Slide } from '@mui/material';

import { tokens } from '../../../theme';
import { getLocaltion } from '../../../actions/location.action';

import OrderModal from './orderModal';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditCustomerModal({ open, handleClose, customerData, setReloadData }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [email, setEmail] = useState('');

  const [initialName, setInitialName] = useState('');
  const [initialPhone, setInitialPhone] = useState('');
  const [initialAddress, setInitialAddress] = useState('');
  const [initialCity, setInitialCity] = useState('');
  const [initialDistrict, setInitialDistrict] = useState('');
  const [initialWard, setInitialWard] = useState('');
  const [initialEmail, setInitialEmail] = useState('');

  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [districtError, setDistrictError] = useState(false);
  const [wardError, setWardError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const cities = useSelector(state => state?.locationReducer?.cities);

  useEffect(() => {
    dispatch(getLocaltion());
  }, [dispatch]);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const gBASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (open && customerData) {
      setName(customerData.fullName || '');
      setPhone(customerData.phone || '');
      setAddress(customerData.address || '');
      setCity(customerData.city || '');
      setDistrict(customerData.district || '');
      setWard(customerData.ward || '');
      setEmail(customerData.email || '');
      setInitialName(customerData.fullName || '');
      setInitialPhone(customerData.phone || '');
      setInitialAddress(customerData.address || '');
      setInitialCity(customerData.city || '');
      setInitialDistrict(customerData.district || '');
      setInitialWard(customerData.ward || '');
      setInitialEmail(customerData.email || '');
    }
  }, [open, customerData]);

  // save button
  const handleSave = async () => {
    if (name === initialName && phone === initialPhone && address === initialAddress && city === initialCity && district === initialDistrict && ward === initialWard && email === initialEmail) {
      toast.warn('No changes detected. Please modify the customer details before saving.', { draggable: true, autoClose: 3000, theme: "dark" });
      return;
    }
    if (validateInputs()) {
      try {
        const updatedCustomer = { fullName: name, phone, address, city, district, ward, email };

        const response = await axios.put(`${gBASE_URL}/customers/${customerData._id}`, updatedCustomer, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          handleClose();
          setReloadData(prev => !prev);
          toast.success('Customer updated successfully', { draggable: true, autoClose: 3000, theme: "dark" });
        }
      } catch (error) {
        toast.error('Failed to update Customer', { draggable: true, autoClose: 3000, theme: "dark" });
      }
    }
  };

  // valid data
  const validateInputs = () => {
    let isValid = true;
    if (!name) {
      setNameError(true);
      isValid = false;
    } else {
      setNameError(false);
    }

    if (!phone || !/^(\+?84|0)\d{9,12}$/.test(phone)) {
      setPhoneError(true);
      isValid = false;
    } else {
      setPhoneError(false);
    }

    if (!address) {
      setAddressError(true);
      isValid = false;
    } else {
      setAddressError(false);
    }

    if (!city) {
      setCityError(true);
      isValid = false;
    } else {
      setCityError(false);
    }

    if (!district) {
      setDistrictError(true);
      isValid = false;
    } else {
      setDistrictError(false);
    }
  
    if (!ward) {
      setWardError(true);
      isValid = false;
    } else {
      setWardError(false);
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    return isValid;
  };

  const handleOrderClick = () => {
    setIsOrderModalOpen(true);
  };

  // Hàm xử lý khi đóng OrderModal
  const handleOrderModalClose = () => {
    setIsOrderModalOpen(false);
  };
  return (
    <Dialog TransitionComponent={Transition} keepMounted open={open} onClose={handleClose} sx={{ minWidth: '500px' }}>
      <DialogTitle>Edit Customer</DialogTitle>
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
            autoFocus
            sx={{ gridColumn: "span 4" }}
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={nameError}
            helperText={nameError && "Please enter a valid name"}
          />
          <TextField
            required
            margin="dense"
            sx={{ gridColumn: "span 4" }}
            id="phone"
            name="phone"
            label="Phone Number"
            type="text"
            fullWidth
            variant="standard"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={phoneError}
            helperText={phoneError && "Please enter a valid phone number (starting with +84 or 0 and containing 9-12 digits)"}
          />
          <TextField
            required
            disabled
            margin="dense"
            sx={{ gridColumn: "span 4" }}
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            helperText={emailError && "Please enter a valid email address"}
          />
          <TextField
            required
            sx={{ gridColumn: "span 2" }}
            id="address"
            name="address"
            label="Address"
            type="text"
            fullWidth
            variant="standard"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={addressError}
            helperText={addressError && "Please enter a valid address"}
          />
          <FormControl variant="standard" sx={{ gridColumn: "span 2" }} fullWidth>
            <InputLabel id="city-label">City</InputLabel>
            <Select
              labelId="city-label"
              name="city"
              label="City"
              value={city || ''}
              onChange={(e) => setCity(e.target.value)}
            >
              <MenuItem value="" disabled>Please choose a City</MenuItem>
              {cities.map(city => (
                <MenuItem key={city.Id} value={city.Name}>{city.Name}</MenuItem>
              ))}
            </Select>
            {cityError && <FormHelperText>Please select a city</FormHelperText>}
          </FormControl>
          <FormControl variant="standard" sx={{ gridColumn: "span 2" }} fullWidth>
            <InputLabel id="district-label">District</InputLabel>
            <Select
              labelId="district-label"
              name="district"
              label="District"
              value={district || ''}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <MenuItem value="" disabled>Please choose a District</MenuItem>
              {cities.find(cityItem => cityItem.Name === city)?.Districts.map(districtItem => (
                <MenuItem key={districtItem.Id} value={districtItem.Name}>{districtItem.Name}</MenuItem>
              ))}
            </Select>
            {districtError && <FormHelperText>Please select a District</FormHelperText>}
          </FormControl>
          <FormControl variant="standard" sx={{ gridColumn: "span 2" }} fullWidth>
            <InputLabel id="ward-label">Ward</InputLabel>
            <Select
              labelId="ward-label"
              name="ward"
              label="Ward"
              value={ward || ''}
              onChange={(e) => setWard(e.target.value)}
            >
              <MenuItem value="" disabled>Please choose a Ward</MenuItem>
              {cities.find(cityItem => cityItem.Name === city)?.Districts.find(districtItem => districtItem.Name === district)?.Wards.map(wardItem => (
                <MenuItem key={wardItem.Id} value={wardItem.Name}>{wardItem.Name}</MenuItem>
              ))}
            </Select>
            {wardError && <FormHelperText>Please select a Ward</FormHelperText>}
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>Cancel</Button>
        <Button variant='contained' sx={{ backgroundColor: '#BF40BF' }} onClick={handleOrderClick} >Order</Button>
        <Button variant="contained" color='success' onClick={handleSave}>Save</Button>
      </DialogActions>
      <OrderModal open={isOrderModalOpen} handleClose={handleOrderModalClose} customerId={customerData?._id} />
    </Dialog>
  );
}
