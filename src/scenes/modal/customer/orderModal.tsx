import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stepper,
    Step,
    StepLabel,
    TextField,
    Box
} from '@mui/material';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import dayjs, { Dayjs } from 'dayjs';
import { useTheme } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Slide } from '@mui/material';

import { tokens } from '../../../theme';
import DeleteOrderModal from './deleteOrderModal';
import useCheckUserAuth from '../../../hooks/useCheckUserAuth';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const steps = ['Orders', 'Orders Detail', 'Order Products'];

const OrderModal = ({ open, handleClose, customerId }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { palette } = useTheme();
    const { isAuthenticated, userRoles } = useCheckUserAuth();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [activeStep, setActiveStep] = useState(0);

    // global state
    const [orders, setOrders] = useState([]);

    // edit state
    const [selectedOrder, setSelectedOrder] = useState(null);

    // delete state
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // state update
    const [newShippedDate, setNewShippedDate] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [productDetails, setProductDetails] = useState([]);

    const gBASE_URL = process.env.REACT_APP_API_URL;

    const fetchData = async () => {
        if (open) {
            try {
                const response = await axios.get(`${gBASE_URL}/order/${customerId}`);
                if (response.status === 200) {
                    const data = await response.data;
                    const formattedData = data.data
                        .filter(order => !order.isDeleted) // chỉ lấy những order có isDeleted là false
                        .map((order, index) => ({
                            ...order,
                            orderDetailsCount: order.orderDetails.length,
                            id: index + 1,
                            shippedDate: formatDate(order.shippedDate),
                            orderDate: formatDate(order.orderDate)
                        }));
                    setOrders(formattedData);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [open, customerId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const handleCloseModal = () => {
        setActiveStep(0);
        setSelectedOrder(null);
        handleClose();
    };

    // delete function
    const handleOpenDeleteClick = (orderId) => {
        setSelectedOrderId(orderId);
        setIsDeleteModalOpen(true);
    };
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    // delete order 
    async function handleDeleteOrder() {
        const response = await fetch(`${gBASE_URL}/order/${selectedOrderId}`, {
            method: 'DELETE',
        });

        if (response.ok) { // Check if response status is 200
            await fetchData();
            toast.success('Delete Order Successfully', { draggable: true, autoClose: 3000, theme: "dark" });
            setSelectedOrderId(null);
        } else {
            console.error('Error deleting order:', error);
            toast.warning('Cannot Delete Order', { draggable: true, autoClose: 3000, theme: "dark" });
        }
    }

    // edit function
    const handleEditClick = (order) => {
        setSelectedOrder(order);
        setActiveStep(1);
    };

    const handleBackClick = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // update
    useEffect(() => {
        if (selectedOrder) {
            setNewShippedDate(selectedOrder.shippedDate);
            setNewStatus(selectedOrder.status);
        }
    }, [selectedOrder]);

    // update function
    const handleSaveClick = async () => {
        if (newShippedDate === selectedOrder.shippedDate && newStatus === selectedOrder.status) {
            toast.warning('No changes have been made', { draggable: true, autoClose: 3000, theme: "dark" });
            return;
        }

        // Check if the shippedDate has been entered
        if (!newShippedDate) {
            toast.warning('Please enter a shipped date', { draggable: true, autoClose: 3000, theme: "dark" });
            return;
        }

        // Check if the shippedDate is later than the orderDate
        if (new Date(newShippedDate) <= new Date(selectedOrder.orderDate)) {
            toast.warning('The shipped date must be later than the order date', { draggable: true, autoClose: 3000, theme: "dark" });
            return;
        }
        try {
            const updatedOrder = {
                shippedDate: newShippedDate,
                status: newStatus,
            };

            const response = await axios.put(`${gBASE_URL}/order/${selectedOrder._id}`, updatedOrder, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setActiveStep(0);
                fetchData();
                setSelectedOrder(null);
                toast.success('Order updated successfully', { draggable: true, autoClose: 3000, theme: "dark" });
            }
        } catch (error) {
            toast.error('Failed to update order', { draggable: true, autoClose: 3000, theme: "dark" });
        }
    };

    const Small = styled("small")(({ bgcolor }) => ({
        height: 15,
        color: "#fff",
        padding: "2px 8px",
        borderRadius: "4px",
        background: bgcolor,
        boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
    }));

    const renderStatusCell = (params) => {
        const status = params.value;
        let statusText;
        let bgColor;
        switch (status) {
            case "pending":
                statusText = "Pending";
                bgColor = palette.warning.dark;
                break;
            case "processing":
                statusText = "Processing";
                bgColor = palette.info.main;
                break;
            case "cancelled":
                statusText = "Cancelled";
                bgColor = palette.error.main;
                break;
            case "completed":
                statusText = "Completed";
                bgColor = palette.secondary.main;
                break;
            default:
                statusText = "Unknown";
                bgColor = "#000000";
        }

        return <Small bgcolor={bgColor}>{statusText}</Small>;
    };

    // order datagrid
    const orderColumns = [
        {
            field: "id",
            headerName: "ID",
            flex: 0.5,
            cellClassName: "name-column--cell",
        },
        {
            field: "orderDetailsCount",
            headerName: "Total Product",
            flex: 1,
        },
        {
            field: "note",
            headerName: "Note",
            flex: 1,
        },
        {
            field: "cost",
            headerName: "Cost",
            flex: 0.5,
            valueFormatter: (params) => `$${params.value}`,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: renderStatusCell
        },
        {
            field: "action",
            headerName: "Action",
            flex: 1.5,
            renderCell: (params) => {
                const isAdmin = isAuthenticated && userRoles.includes('Admin');
                // const isEditable = params.row.status !== 'cancelled' && params.row.status !== 'completed';
                return (
                    <>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleEditClick(params.row)}
                        // disabled={!isEditable}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleOpenDeleteClick(params.row._id)}
                            disabled={!isAdmin}
                        >
                            Delete
                        </Button>
                    </>
                );
            }
        },
    ];


    // see all detail function
    const handleSeeAllDetail = async () => {
        try {
            const response = await axios.get(`${gBASE_URL}/order/${selectedOrder._id}/orderDetail`);
            if (response.status === 200) {
                const orderDetails = response.data.data;
                const validOrderDetails = orderDetails.filter(orderDetail => !orderDetail.isDeleted); // chỉ lấy những orderDetail có isDeleted là false
                const productDetails = await Promise.all(validOrderDetails.map(async (orderDetail, index) => {
                    const productResponse = await axios.get(`${gBASE_URL}/product/${orderDetail.product._id}`);
                    const productData = productResponse.data.data;
                    return {
                        id: index + 1,
                        image: productData.imageUrls[0],
                        name: productData.name,
                        buyPrice: productData.buyPrice,
                        promotionPrice: productData.promotionPrice,
                        amount: productData.amount,
                    };
                }));
                // Now you have the product details, you can set it to your state
                setProductDetails(productDetails);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
        setActiveStep(2);
    };



    // product datagrid
    const productColumns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "image", headerName: "Image", flex: 1, renderCell: renderImageCell },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "buyPrice", headerName: "Buy Price ($)", flex: 1 },
        { field: "promotionPrice", headerName: "Promotion Price ($)", flex: 1 },
    ];

    function renderImageCell(params) {
        return <img src={params.value} alt={params.row.name} style={{ width: "70px", height: "65px", padding: "5px" }} />;
    }

    return (
        <Dialog TransitionComponent={Transition} keepMounted open={open} onClose={handleCloseModal} sx={{ minWidth: '500px' }}>
            <DialogTitle>{steps[activeStep]}</DialogTitle>
            <DialogContent
                sx={{
                    width: '600px',
                    '& label.Mui-focused': {
                        color: colors.grey[100],
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: colors.grey[100],
                    }
                }}>
                <div>
                    <div>
                        {activeStep === 0 && (
                            <div>
                                <Box
                                    m="10px 0 0 0"
                                    sx={{
                                        "& .MuiDataGrid-root": {
                                            border: "none",
                                        },
                                        "& .MuiDataGrid-cell": {
                                            borderBottom: "none",
                                        },
                                        "& .name-column--cell": {
                                            color: colors.greenAccent[300],
                                        },
                                        "& .MuiDataGrid-columnHeaders": {
                                            backgroundColor: colors.blueAccent[700],
                                            borderBottom: "none",
                                        },
                                        "& .MuiDataGrid-virtualScroller": {
                                            backgroundColor: colors.primary[400],
                                        },
                                        "& .MuiDataGrid-footerContainer": {
                                            borderTop: "none",
                                            backgroundColor: colors.blueAccent[700],
                                        },
                                        "& .MuiCheckbox-root": {
                                            color: `${colors.greenAccent[200]} !important`,
                                        },
                                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                            color: `${colors.grey[100]} !important`,
                                        },
                                    }}
                                >
                                    <DataGrid style={{ height: 400, width: '100%' }} rows={orders} columns={orderColumns} slots={{ toolbar: GridToolbar }} />
                                </Box>
                            </div>
                        )}
                        {activeStep === 1 && (
                            <div>
                                <TextField
                                    autoFocus
                                    required
                                    margin="dense"
                                    id="id"
                                    name="id"
                                    label="Order ID"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={selectedOrder?._id}
                                    disabled
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="note"
                                    name="note"
                                    label="Order Note"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={selectedOrder?.note}
                                    disabled
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="orderDate"
                                    name="orderDate"
                                    label="Order Date"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={selectedOrder?.orderDate}
                                    disabled
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                                        <DatePicker
                                            disabled={selectedOrder?.status === 'cancelled' || selectedOrder?.status === 'completed'}
                                            sx={{ width: '100%' }}
                                            label="Shipped Date"
                                            value={dayjs(newShippedDate)}
                                            onChange={(newValue: Dayjs | null) => {
                                                setNewShippedDate(newValue?.format('YYYY-MM-DD'));
                                            }}
                                            textField={
                                                <TextField />
                                            }
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>

                                <FormControl sx={{ mt: "10px" }} fullWidth>
                                    <InputLabel id="status">Status</InputLabel>
                                    <Select
                                        disabled={selectedOrder?.status === 'cancelled' || selectedOrder?.status === 'completed'}
                                        labelId="status"
                                        id="status"
                                        label="Status"
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                    >
                                        {['pending', 'completed', 'processing', 'cancelled'].map((statusOption) => (
                                            <MenuItem key={statusOption} value={statusOption}>
                                                {statusOption}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    required
                                    margin="dense"
                                    id="orderDetail"
                                    name="orderDetail"
                                    label="Order Detail"
                                    type="number"
                                    fullWidth
                                    variant="standard"
                                    value={selectedOrder?.orderDetails.length}
                                    disabled
                                    InputProps={{
                                        endAdornment:
                                            <IconButton edge="end" onClick={() => handleSeeAllDetail(selectedOrder._id)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                    }}
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="cost"
                                    name="cost"
                                    label="Order Cost"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={selectedOrder?.cost}
                                    disabled
                                />
                            </div>
                        )}
                        {activeStep === 2 && (
                            <div>
                                <Box
                                    m="10px 0 0 0"
                                    sx={{
                                        "& .MuiDataGrid-root": {
                                            border: "none",
                                        },
                                        "& .MuiDataGrid-cell": {
                                            borderBottom: "none",
                                        },
                                        "& .name-column--cell": {
                                            color: colors.greenAccent[300],
                                        },
                                        "& .MuiDataGrid-columnHeaders": {
                                            backgroundColor: colors.blueAccent[700],
                                            borderBottom: "none",
                                        },
                                        "& .MuiDataGrid-virtualScroller": {
                                            backgroundColor: colors.primary[400],
                                        },
                                        "& .MuiDataGrid-footerContainer": {
                                            borderTop: "none",
                                            backgroundColor: colors.blueAccent[700],
                                        },
                                        "& .MuiCheckbox-root": {
                                            color: `${colors.greenAccent[200]} !important`,
                                        },
                                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                            color: `${colors.grey[100]} !important`,
                                        },
                                    }}
                                >
                                    <DataGrid style={{ height: 400, width: '100%' }} rows={productDetails} columns={productColumns} slots={{ toolbar: GridToolbar }} />
                                </Box>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                {activeStep === 0 ? (
                    <Button variant="contained" onClick={handleClose}>Cancel</Button>
                ) : (
                    <>
                        <Button variant="contained" onClick={handleBackClick}>Back</Button>
                        {activeStep === 1 && <Button variant="contained" color="success" disabled={selectedOrder?.status === 'cancelled' || selectedOrder?.status === 'completed'} onClick={handleSaveClick}>Save</Button>}
                    </>
                )}
            </DialogActions>
            {selectedOrderId && (
                <DeleteOrderModal
                    open={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    onDelete={handleDeleteOrder}
                />
            )}
        </Dialog>
    );
}

export default OrderModal;