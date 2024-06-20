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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditProductModal({ open, onClose, onSave, product }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [editedProduct, setEditedProduct] = useState(product);
  const [selectedImageUrl, setSelectedImageUrl] = useState(editedProduct && editedProduct.imageUrls.length > 0 ? editedProduct.imageUrls[0] : '');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [image, setImage] = useState(null);

  const [showAddImageTooltip, setShowAddImageTooltip] = useState(false);

  const [uploadError, setUploadError] = useState('');

  const [isEdited, setIsEdited] = useState(false);

  const [category, setCategory] = useState([])

  const gBASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    setEditedProduct(product);
    setSelectedImageUrl(product ? product.imageUrls[0] : '');
  }, [product]);

  useEffect(() => {
    if (editedProduct) {
      setSelectedCategories(editedProduct.category.map((item) => item.name));
    }
  }, [editedProduct]);

  // load image
  useEffect(() => {
    if (selectedImageUrl && selectedImageUrl.length === 24) { // Kiểm tra nếu selectedImageUrl có độ dài bằng 24 (độ dài của id MongoDB)
      fetch(`${gBASE_URL}/image/${selectedImageUrl}`)
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setImage(url);
        })
        .catch(error => console.error(error));
    } else {
      setImage(selectedImageUrl);
    }
  }, [selectedImageUrl]);


  // fetch category
  const fetchCategory = async () => {
    try {
      const response = await fetch(`${gBASE_URL}/category`);
      const data = await response.json();
      if (response.ok) {
        setCategory(data.data);
      } else {
        console.log('Error fetching category', data)
      }
    } catch (error) {
      console.log('Error fetching category', error)
    }
  }
  useEffect(() => {
    fetchCategory()
  }, [])

  const handleInputChange = (e) => {
    setIsEdited(true);
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  // add img with local upload 
  const handleFileChange = (e) => {
    setIsEdited(true);
    const file = e.target.files[0];
    if (file) {
      // Check if the file size is more than 5MB
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('The file size should not exceed 5MB.');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      fetch(`${gBASE_URL}/upload`, {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (response.ok) {
            setUploadError('')
            return response.json();
          } else if (response.status === 400) {
            setUploadError('An image with the same name and dimensions already exists!');
            throw new Error('Image upload failed');
          } else {
            throw new Error('Image upload failed');
          }
        })
        .then(data => {
          const newImageUrl = data.data;
          setSelectedImageUrl(newImageUrl);
          setUploadError('')
          const updatedImageUrls = editedProduct.imageUrls.map(url => url === selectedImageUrl ? newImageUrl : url);
          setEditedProduct(prevState => ({
            ...prevState,
            imageUrls: updatedImageUrls
          }));
        })
        .catch(error => console.error(error));
    }
  };


  // change img 
  const handleImageChange = (e) => {
    setIsEdited(true);
    const newImageUrl = e.target.value;
    setSelectedImageUrl(newImageUrl);
    const updatedImageUrls = editedProduct.imageUrls.map(url => url === selectedImageUrl ? newImageUrl : url);
    setEditedProduct(prevState => ({
      ...prevState,
      imageUrls: updatedImageUrls
    }));
  };

  // save button
  const handleSave = () => {
    if (isValidData() && selectedCategories.length > 0) { // Kiểm tra xem có ít nhất một category được chọn
      if (isEdited) {
        const productToSave = {
          ...editedProduct,
          category: selectedCategories
        };
        delete productToSave.image;
        onSave(productToSave);
        onClose();
      } else {
        toast.error('No changes were made.', { draggable: true, autoClose: 3000, theme: "dark" });
      }
    } else {
      toast.error('Invalid data. Please fill in all required fields and select at least one category.', { draggable: true, autoClose: 3000, theme: "dark" });
    }
  };

  const isValidData = () => {
    return editedProduct.name && editedProduct.description && editedProduct.buyPrice && editedProduct.promotionPrice && Number.isFinite(editedProduct.amount);
  };

  const handleDeleteImageUrl = () => {
    const updatedImageUrls = editedProduct.imageUrls.filter(url => url !== selectedImageUrl);
    setIsEdited(true);
    setEditedProduct(prevState => ({
      ...prevState,
      imageUrls: updatedImageUrls
    }));
    setSelectedImageUrl(updatedImageUrls[0] || '');

    // If the selectedImageUrl is an ID, delete the image from the database
    if (selectedImageUrl.length === 24) {
      fetch(`${gBASE_URL}/image/${selectedImageUrl}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to delete image');
          }
        })
        .catch(error => console.error(error));
    }
  };


  // add img with url
  const handleAddImageUrl = () => {
    setSelectedImageUrl('');
    setEditedProduct(prevState => ({
      ...prevState,
      imageUrls: ['', ...prevState.imageUrls]
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} keepMounted sx={{ minWidth: '500px' }}>
      <DialogTitle>Edit Product</DialogTitle>
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
          autoFocus
          required
          margin="dense"
          id="id"
          name="id"
          label="Product ID"
          type="text"
          fullWidth
          variant="standard"
          value={editedProduct ? editedProduct._id : ''}
          disabled
        />
        <TextField
          required
          margin="dense"
          id="name"
          name="name"
          label="Product Name"
          type="text"
          fullWidth
          variant="standard"
          value={editedProduct ? editedProduct.name : ''}
          onChange={handleInputChange}
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
          value={editedProduct ? editedProduct.description : ''}
          onChange={handleInputChange}
        />
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item xs={3}>
            <FormControl fullWidth>
              <Select
                id="image-select"
                value={selectedImageUrl}
                onChange={(e) => setSelectedImageUrl(e.target.value)}
                fullWidth
              >
                <MenuItem value="" onClick={() => { handleAddImageUrl(); setShowAddImageTooltip(true); }} sx={{ paddingLeft: '0px' }}>
                  <IconButton>
                    <AddIcon />
                  </IconButton>
                </MenuItem>
                {editedProduct && editedProduct.imageUrls.map((url, index) => (
                  <MenuItem
                    onClick={() => { setShowAddImageTooltip(false) }}
                    key={index} value={url}>
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
              id="imageUrl"
              name="imageUrl"
              label="Image Url"
              type="text"
              fullWidth
              variant="standard"
              value={selectedImageUrl}
              onChange={handleImageChange}
              helperText={uploadError}
              error={!!uploadError}
              InputProps={{
                endAdornment:
                  <div style={{ display: 'flex' }}>
                    {showAddImageTooltip && (
                      <Tooltip title="Add image">
                        <IconButton edge="end" component="label">
                          <input type="file" accept='image/*' hidden onChange={handleFileChange} />
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title={
                      <img
                        src={image}
                        alt="preview"
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
          value={selectedCategories}
          onChange={(event, newValue) => {
            setSelectedCategories(newValue);
            setIsEdited(true);
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
          value={editedProduct ? editedProduct.buyPrice : ''}
          onChange={handleInputChange}
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
          value={editedProduct ? editedProduct.promotionPrice : ''}
          onChange={handleInputChange}
        />
        <TextField
          disabled
          margin="dense"
          id="percentDiscount"
          name="percentDiscount"
          label="Percent Discount (%)"
          type="number"
          fullWidth
          variant="standard"
          value={editedProduct ? editedProduct.percentDiscount : ''}
          onChange={handleInputChange}
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
          value={editedProduct ? editedProduct.amount : ''}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color='success' onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
