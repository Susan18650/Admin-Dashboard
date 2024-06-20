import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import {
  MenuItem,
  Select,
  FormControl,
  Autocomplete,
  TextField
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateProductModal({ open, onClose, setReloadData }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [buyPrice, setBuyPrice] = useState(0);
  const [promotionPrice, setPromotionPrice] = useState(0);
  const [amount, setAmount] = useState(0);

  const [showAddImageTooltip, setShowAddImageTooltip] = useState(false);

  const [image, setImage] = useState(null);

  const [uploadError, setUploadError] = useState('');

  const [category, setCategory] = useState([])

  const gBASE_URL = process.env.REACT_APP_API_URL;

  const accessToken = Cookies.get('accessToken');

  // load category
  const fetchCategory = async () => {
    try {
      const response = await fetch(`${gBASE_URL}/category`);
      const data = await response.json();
      if (response.ok) {
        setCategory(data.data);
      } else {
        // xử lý lỗi
      }
    } catch (error) {
      // xử lý lỗi
    }
  }
  useEffect(() => {
    fetchCategory()
  }, [])


  // load/show image 
  useEffect(() => {
    if (imageUrl && imageUrl.length === 24) { // Check if imageUrl is an ID
      fetch(`${gBASE_URL}/image/${imageUrl}`)
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setImage(url);
        })
        .catch(error => console.error(error));
    } else {
      setImage(imageUrl);
    }
  }, [imageUrl]);

  // upload image to server
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    // Check if the file size is more than 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('The file size should not exceed 5MB.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch(`${gBASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setImageUrl(data.data);
        setUploadError(''); // Clear the error message if the upload is successful
      } else if (response.status === 400) {
        setUploadError('An image with the same name and dimensions already exists!');
      } else {
        // handle other errors
      }
    } catch (error) {
      // handle error
    }
  };

  // create product function
  const handleCreate = async () => {
    // Validate the input
    if (!name || !description || !imageUrl || !buyPrice || !promotionPrice || !amount || categories.length === 0) {
      toast.error('All fields are required.', { draggable: true, autoClose: 3000, theme: "dark" });
      return;
    }
    if (buyPrice <= 0 || promotionPrice <= 0) {
      toast.error('Buy Price and Promotion Price cannot be negative or zero.', { draggable: true, autoClose: 3000, theme: "dark" });
      return;
    }
    if (promotionPrice > buyPrice) {
      toast.error('Promotion Price cannot be greater than Buy Price.', { draggable: true, autoClose: 3000, theme: "dark" });
      return;
    }

    const product = {
      name,
      description,
      category: categories,
      imageUrls: [imageUrl],
      buyPrice,
      promotionPrice,
      amount
    };
    try {
      const response = await fetch(`${gBASE_URL}/product`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken
        },
        method: 'POST',
        body: JSON.stringify(product)
      });
      if (response.ok) {
        toast.success('Product created successfully', { draggable: true, autoClose: 3000, theme: "dark" });
        setReloadData();
        onClose()
      } else {
        toast.error('Failed to create product', { draggable: true, autoClose: 3000, theme: "dark" });
      }
    } catch (error) {
      toast.error('Failed to create product', { draggable: true, autoClose: 3000, theme: "dark" });
    }
  };

  // delete image
  const handleDeleteImageUrl = () => {
    // If the imageUrl is an ID, delete the image from the database
    if (imageUrl.length === 24) {
      fetch(`${gBASE_URL}/image/${imageUrl}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to delete image');
          }
          // If the DELETE request is successful, clear the imageUrl state
          setImageUrl('');
        })
        .catch(error => console.error(error));
    }
  };

  // Clear the form when the modal is closed
  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
      setImageUrl('');
      setCategories([]);
      setBuyPrice(0);
      setPromotionPrice(0);
      setAmount(0);
      setShowAddImageTooltip(false);
      setImage(null)
      setUploadError('');
    }
  }, [open]);
  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} keepMounted sx={{ minWidth: '500px' }}>
      <DialogTitle>CREATE PRODUCT</DialogTitle>
      <DialogContent
        sx={{
          width: 'auto',
          '& label.Mui-focused': {
            color: colors.grey[100],
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: colors.grey[100],
          }
        }}>
        <TextField
          required
          margin="dense"
          id="name"
          name="name"
          label="Product Name"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          required
          margin="dense"
          id="description"
          name="description"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item xs={2}>
            <FormControl fullWidth>
              <Select
                id="image-select"
                fullWidth
              >
                <MenuItem sx={{ paddingLeft: '0px' }} onClick={() => { setShowAddImageTooltip(true) }}>
                  <IconButton>
                    <AddIcon />
                  </IconButton>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={10}>
            <TextField
              required
              margin="dense"
              id="imageUrl"
              name="imageUrl"
              label="Image Url"
              type="text"
              fullWidth
              variant="standard"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              helperText={uploadError}
              error={!!uploadError}
              InputProps={{
                endAdornment:
                  <div style={{ display: 'flex' }}>
                    {showAddImageTooltip && (
                      <Tooltip title="Add image">
                        <IconButton edge="end" component="label">
                          <input type="file" hidden accept='image/*' onChange={handleImageUpload} />
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title={
                      <img
                        src={image}
                        alt="Image"
                        style={{ width: '200px', height: '200px' }}
                      />
                    } arrow>
                      <IconButton edge="end">
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete image">
                      <IconButton edge="end" onClick={handleDeleteImageUrl}>
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
              }}
            />
          </Grid>
        </Grid>
        <Autocomplete
          sx={{ mt: "10px", width: "100%" }}
          multiple
          id="categories-select"
          options={category.map((item) => item.name)}
          getOptionLabel={(option) => option}
          disableCloseOnSelect
          value={categories}
          onChange={(event, newValue) => {
            setCategories(newValue);
          }}
          renderOption={(props, option, { selected }) => (
            <MenuItem
              key={option._id}
              value={option}
              sx={{ justifyContent: "space-between" }}
              {...props}
            >
              {option}
              {selected ? <CheckIcon color="info" /> : null}
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Category Select"
              placeholder="Categories"
            />
          )}
        />
        <TextField
          required
          margin="dense"
          id="buyPrice"
          name="buyPrice"
          label="Buy Price ($)"
          type="number"
          fullWidth
          variant="standard"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
        />
        <TextField
          required
          margin="dense"
          id="promotionPrice"
          name="promotionPrice"
          label="Promotion Price ($)"
          type="number"
          fullWidth
          variant="standard"
          value={promotionPrice}
          onChange={(e) => setPromotionPrice(e.target.value)}
        />
        <TextField
          required
          margin="dense"
          id="amount"
          name="amount"
          label="Amount"
          type="number"
          fullWidth
          variant="standard"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color='success' onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
