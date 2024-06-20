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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Cookies from "js-cookie"

import { tokens } from '../../../theme';
import { Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateVoucherModal({ open, onClose, setReloadData }) {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [discount, setDiscount] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [error, setError] = useState({});

    const gBASE_URL = process.env.REACT_APP_API_URL;

    const accessToken = Cookies.get('accessToken');

    const handleCreate = async () => {
        let discountError = false;
        let startDateError = false;
        let endDateError = false;

        if (!discount || discount < 1 || discount > 100) {
            discountError = true;
        }

        if (!startDate) {
            startDateError = true;
        }

        if (!endDate) {
            endDateError = true;
        }

        setError({
            discount: discountError,
            startDate: startDateError,
            endDate: endDateError
        });

        if (discountError || startDateError || endDateError) {
            return;
        }

        if (startDate >= endDate) {
            setError({ startDate: true, endDate: true });
            toast.error('startDate must be before endDate!', { draggable: true, autoClose: 3000, theme: "dark" });
            return;
        }

        if (endDate <= new Date()) {
            setError({ endDate: true });
            toast.error('endDate must be in the future!', { draggable: true, autoClose: 3000, theme: "dark" });
            return;
        }

        try {
            const response = await axios.post(`${gBASE_URL}/voucher`, {
                discount,
                startDate: startDate.format('YYYY-MM-DDTHH:mm:ss'),
                endDate: endDate.format('YYYY-MM-DDTHH:mm:ss')
            }, {
                headers: {
                    accept: 'application/json',
                    'x-access-token': accessToken
                },
            });

            if (response.status === 200) {
                toast.success('Voucher created successfully', { draggable: true, autoClose: 3000, theme: "dark" });
                setReloadData(prev => !prev);
                onClose();
            }
        } catch (err) {
            const errorMessage = err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : 'Failed to create voucher';
            toast.error(errorMessage, { draggable: true, autoClose: 3000, theme: "dark" });
        }
    };

    // Clear the form when the modal is closed
    useEffect(() => {
        if (!open) {
            setDiscount('');
            setStartDate(null);
            setEndDate(null);
            setError({});
        }
    }, [open]);

    return (
        <Dialog TransitionComponent={Transition} keepMounted open={open} onClose={onClose} sx={{ minWidth: '500px' }}>
            <DialogTitle>CREATE NEW VOUCHER</DialogTitle>
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
                    id="discount"
                    name="discount"
                    label="Discount"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    error={!!error.discount}
                    helperText={error.discount && (discount ? "Discount must be between 1 and 100!" : "Please enter a discount")}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        sx={{ width: '100%', marginTop: "10px" }}
                        required
                        margin="dense"
                        id="startDate"
                        name="startDate"
                        label="Start Date"
                        fullWidth
                        variant="standard"
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                        slotProps={{
                            textField: {
                                error: !!error.startDate,
                                helperText: error.startDate && "Please select a start date",
                            },
                        }}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        sx={{ width: '100%', marginTop: "10px" }}
                        required
                        margin="dense"
                        id="endDate"
                        name="endDate"
                        label="End Date"
                        fullWidth
                        variant="standard"
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                        error={!!error.endDate}
                        helperText={error.endDate && "Please select an end date"}
                        slotProps={{
                            textField: {
                                error: !!error.endDate,
                                helperText: error.endDate && "Please select a start date",
                            },
                        }}
                    />
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onClose}>Cancel</Button>
                <Button variant="contained" color='success' onClick={handleCreate}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}
