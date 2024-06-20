import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie"

import { tokens } from '../../../theme';
import { Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditCategoryModal({ open, onClose, categoryData, setReloadData }) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formState, setFormState] = useState({
    categoryId: '',
    categoryName: '',
    categoryDescription: '',
    initialCategoryName: '',
    initialCategoryDescription: '',
  });

  const [formError, setFormError] = useState({
    categoryNameError: false,
    categoryDescriptionError: false,
  });

  const gBASE_URL = process.env.REACT_APP_API_URL;

  const accessToken = Cookies.get('accessToken');

  useEffect(() => {
    if (open && categoryData) {
      setFormState({
        categoryId: categoryData._id || '',
        categoryName: categoryData.name || '',
        categoryDescription: categoryData.description || '',
        initialCategoryName: categoryData.name || '',
        initialCategoryDescription: categoryData.description || '',
      });
    }
  }, [open, categoryData]);

  // valid
  const validateInputs = () => {
    let isValid = true;
    if (!formState.categoryName) {
      setFormError(prevState => ({ ...prevState, categoryNameError: true }));
      isValid = false;
    } else {
      setFormError(prevState => ({ ...prevState, categoryNameError: false }));
    }
    if (!formState.categoryDescription) {
      setFormError(prevState => ({ ...prevState, categoryDescriptionError: true }));
      isValid = false;
    } else {
      setFormError(prevState => ({ ...prevState, categoryDescriptionError: false }));
    }
    return isValid;
  };

  // handle save
  const handleSave = async () => {
    if (formState.categoryName === formState.initialCategoryName && formState.categoryDescription === formState.initialCategoryDescription) {
      toast.warn('No changes detected. Please modify the category before saving.', { draggable: true, autoClose: 3000, theme: "dark" });
      return;
    }
    const inputsAreValid = validateInputs();

    if (!inputsAreValid) {
      return;
    }

    const updateCategory = { name: formState.categoryName, description: formState.categoryDescription };

    try {
      const response = await axios.put(`${gBASE_URL}/category/${formState.categoryId}`, updateCategory, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken
        },
      });

      if (response.status === 200) {
        onClose();
        setReloadData(prev => !prev);
        toast.success('Category updated successfully', { draggable: true, autoClose: 3000, theme: "dark" });
      }
    } catch (error) {
      toast.error('Failed to update Category', { draggable: true, autoClose: 3000, theme: "dark" });
    }
  }

  return (
    <Dialog TransitionComponent={Transition} keepMounted open={open} onClose={onClose} sx={{ minWidth: '500px' }}>
      <DialogTitle>EDIT CATEGORY</DialogTitle>
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
        <TextField
          margin="dense"
          id="id"
          name="id"
          label="Category ID"
          type="text"
          fullWidth
          variant="standard"
          value={formState.categoryId}
          disabled
        />
        <TextField
          required
          margin="dense"
          id="name"
          name="name"
          label="Category Name"
          type="text"
          fullWidth
          variant="standard"
          value={formState.categoryName}
          onChange={(e) => setFormState(prevState => ({ ...prevState, categoryName: e.target.value }))}
          error={formError.categoryNameError}
          helperText={formError.categoryNameError && "Please enter a valid category name"}
        />
        <TextField
          required
          margin="dense"
          id="description"
          name="description"
          label="Category Description"
          type="text"
          fullWidth
          variant="standard"
          value={formState.categoryDescription}
          onChange={(e) => setFormState(prevState => ({ ...prevState, categoryDescription: e.target.value }))}
          error={formError.categoryDescriptionError}
          helperText={formError.categoryDescriptionError && "Please enter a valid category description"}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color='success' onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );

}
