import React, { useState, useEffect } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from '@emotion/styled';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Cookies from "js-cookie"

import useCheckUserAuth from '../../hooks/useCheckUserAuth';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DeleteVoucherModal from "../modal/voucher/deleteVoucherModal";
import CreateVoucherModal from "../modal/voucher/createVoucherModal";


const VoucherManage = () => {
    const { isAuthenticated, userRoles } = useCheckUserAuth();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { palette } = useTheme();

    const [openCreateModal, setOpenCreateModal] = useState(false);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);

    const [voucher, setVoucher] = useState([]);

    const [reloadData, setReloadData] = useState(false);

    const gBASE_URL = process.env.REACT_APP_API_URL;

    const accessToken = Cookies.get('accessToken');

    const fetchData = async () => {
        try {
            const response = await fetch(`${gBASE_URL}/voucher`);
            const data = await response.json();
            const voucherData = data.data.map((voucher, index) => ({
                ...voucher,
                id: index + 1
            }));
            setVoucher(voucherData);
        } catch (error) {
            // error
        }
    };
    useEffect(() => {
        fetchData();
    }, [reloadData])

    // create 
    const handleCreatVoucher = () => {
        setOpenCreateModal(true);
    }
    // delete
    const handleDeleteVoucher = async () => {
        const response = await fetch(`${gBASE_URL}/voucher/${selectedVoucherId}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken
            },
            method: 'DELETE',
        });

        if (response.ok) { // Check if response status is 200
            setOpenDeleteModal(false);
            fetchData();
            toast.success('Delete Voucher Successfully', { draggable: true, autoClose: 3000, theme: "dark" });
        } else {
            toast.warning('Cannot Delete Voucher', { draggable: true, autoClose: 3000, theme: "dark" });
        }
    };


    // amout column
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
        let bgColor;

        switch (status) {
            case 'Active':
                bgColor = palette.success.main;
                break;
            case 'Redeemed':
            case 'Used':
                bgColor = palette.warning.dark;
                break;
            case 'Expired':
            case 'Inactive':
            case 'Cancelled':
                bgColor = palette.error.main;
                break;
            case 'Unused':
                bgColor = palette.info.main;
                break;
            default:
                bgColor = palette.grey[500];
        }

        return <Small bgcolor={bgColor}>{status}</Small>;
    };
    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "code", headerName: "Code", flex: 1 },
        { field: "discount", headerName: "Discount", flex: 1, valueFormatter: (params) => `${params.value}%`, },
        { field: "startDate", headerName: "Start Date", flex: 1, valueFormatter: (params) => new Date(params.value).toLocaleString() },
        { field: "endDate", headerName: "End Date", flex: 1, valueFormatter: (params) => new Date(params.value).toLocaleString() },
        { field: "status", headerName: "Voucher Status", flex: 1, renderCell: renderStatusCell },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            renderCell: (params) => {
                return (
                    <>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                setOpenDeleteModal(true);
                                setSelectedVoucherId(params.row._id);
                            }}
                        >
                            Delete
                        </Button>
                    </>
                )
            }
        },
    ];

    return (
        <Box m="0 20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Products" subtitle="List of Products" />
                <Box>
                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                        onClick={() => {
                            setOpenCreateModal(true)
                            handleCreatVoucher()
                        }}
                    >
                        <AddBoxIcon sx={{ mr: "10px" }} />
                        Create Voucher
                    </Button>
                </Box>
            </Box>
            <Box
                m="30px 0 0 0"
                height="75vh"
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
                <DataGrid rows={voucher} columns={columns} slots={{ toolbar: GridToolbar }} />
            </Box>
            <ToastContainer />
            <CreateVoucherModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                setReloadData={setReloadData}
            />
            <DeleteVoucherModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onDelete={handleDeleteVoucher}
            />
        </Box>
    );
};

export default VoucherManage;
