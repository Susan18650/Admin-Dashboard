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
import Cookies from "js-cookie";

import { tokens } from '../../../theme';
import { Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateCategoryModal({ open, onClose, setReloadData }) {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [error, setError] = useState({});

    const gBASE_URL = process.env.REACT_APP_API_URL;

    const accessToken = Cookies.get('accessToken');

    const handleCreate = async () => {
        if (!categoryName || !categoryDescription) {
            setError({
                name: categoryName ? null : "Please enter a category name",
                description: categoryDescription ? null : "Please enter a category description"
            });

            return;
        }

        try {
            const response = await axios.post(`${gBASE_URL}/category`, {
                name: categoryName,
                description: categoryDescription
            }, {
                headers: {
                    accept: 'application/json',
                    'x-access-token': accessToken
                },
            });

            if (response.status === 200) {
                toast.success('Category created successfully', { draggable: true, autoClose: 3000, theme: "dark" });
                setReloadData(prev => !prev);
                onClose();
            }
        } catch (err) {
            if (err.response.status === 500) {
                setError({ name: "Category name already exists" });
            } else {
                setError(err.response.data);
            }
        }
    };

    // Clear the form when the modal is closed
    useEffect(() => {
        if (!open) {
            setCategoryName('');
            setCategoryDescription('');
            setError({});
        }
    }, [open]);

    return (
        <Dialog TransitionComponent={Transition} keepMounted open={open} onClose={onClose} sx={{ minWidth: '500px' }}>
            <DialogTitle>CREATE NEW CATEGORY</DialogTitle>
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
                    required
                    margin="dense"
                    id="name"
                    name="name"
                    label="Category Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    error={!!error.name}
                    helperText={error.name}
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
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    error={!!error.description}
                    helperText={error.description && "Please enter a category description"}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onClose}>Cancel</Button>
                <Button variant="contained" color='success' onClick={handleCreate}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}
