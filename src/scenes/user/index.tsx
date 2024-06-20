import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ToastContainer, toast } from 'react-toastify';
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityIcon from '@mui/icons-material/Security';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

import useCheckUserAuth from "../../hooks/useCheckUserAuth";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import DeleteUserModal from "../modal/user/deleteUserModal";
import EditUserModal from "../modal/user/editUserModal";

const Users = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [users, setUsers] = useState([]);
    const { isAuthenticated, userRoles } = useCheckUserAuth();

    const gBASE_URL = process.env.REACT_APP_API_URL;
    const accessToken = Cookies.get('accessToken');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${gBASE_URL}/user`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken
                }
            });
            if (response.ok) {
                const data = await response.json();
                const usersWithIds = data.data
                .filter(user => !user.isDeleted) // chỉ lấy những user có trường isDeleted là false
                .map((user, index) => ({ ...user, id: index + 1, fullname: user.firstName + " " + user.lastName }));                setUsers(usersWithIds);
            } else {
                toast.error('Failed to fetch users', { autoClose: 3000, theme: "dark" });
            }
        } catch (error) {
            toast.error('Failed to fetch users', { autoClose: 3000, theme: "dark" });
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenDeleteModal = (userId) => {
        setSelectedUserId(userId);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };
    const handleOpenEditModal = (userId) => {
        const userToEdit = users.find(user => user._id === userId);
        setSelectedUser(userToEdit);
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleDeleteUser = async () => {
        try {
            const accessToken = Cookies.get('accessToken');
            const response = await fetch(`${gBASE_URL}/user/${selectedUserId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken
                }
            });
            if (response.ok) {
                toast.success('User deleted successfully', { autoClose: 3000, theme: "dark" });
                fetchUsers();
            } else {
                toast.error('Failed to delete user', { autoClose: 3000, theme: "dark" });
            }
        } catch (error) {
            toast.error('Failed to delete user', { autoClose: 3000, theme: "dark" });
        }
        handleCloseDeleteModal();
    };
    const renderAccessLevel = (params) => {
        const access = params.row.roles[0].name;
        let icon, text;
        switch (access) {
            case 'Admin':
                icon = <AdminPanelSettingsOutlinedIcon />;
                text = 'Admin';
                break;
            case 'Moderator':
                icon = <SecurityIcon />;
                text = 'Moderator';
                break;
            case 'User':
                icon = <AccountCircleIcon />;
                text = 'User';
                break;
            case 'Guest':
                icon = <PersonIcon />;
                text = 'Guest';
                break;
            default:
                icon = null;
                text = 'Unknown';
        }
        return (
            <Box
                width="auto"
                m="0 auto"
                p="5px"
                display="flex"
                justifyContent="center"
                backgroundColor={
                    access === "Admin"
                        ? colors.greenAccent[600]
                        : access === "Moderator"
                            ? colors.greenAccent[700]
                            : colors.greenAccent[700]
                }
                borderRadius="4px"
            >
                {icon}
                <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                    {text}
                </Typography>
            </Box>
        );
    };
    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "fullname", headerName: "Full Name", flex: 1 },
        { field: "username", headerName: "Username", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "ward", headerName: "Ward", flex: 1 },
        { field: "district", headerName: "District", flex: 1 },
        { field: "accessLevel", headerName: "Access Level", align: 'center', flex: 1, renderCell: renderAccessLevel },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            renderCell: (params) => {
                const isAdmin = isAuthenticated && userRoles.includes('Admin');
                return (
                    <>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleOpenEditModal(params.row._id)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleOpenDeleteModal(params.row._id)}
                            disabled={!isAdmin}
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
            <Header title="User" subtitle="List of User" />
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
                <DataGrid rows={users} columns={columns} slots={{ toolbar: GridToolbar }} />
            </Box>
            <ToastContainer />
            <DeleteUserModal open={isDeleteModalOpen} onClose={handleCloseDeleteModal} onDelete={handleDeleteUser} />
            <EditUserModal open={isEditModalOpen} onClose={handleCloseEditModal} selectedUser={selectedUser} fetchUsers={fetchUsers} />
        </Box>
    );
};

export default Users;
