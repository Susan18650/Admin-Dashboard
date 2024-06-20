import { useEffect, useState } from 'react';
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCheckUserAuth from '../../hooks/useCheckUserAuth';

import { tokens } from "../../theme";
import Header from "../../components/Header";
import DeleteCustomerModal from '../modal/customer/deleteCustomerModal';
import EditCustomerModal from '../modal/customer/editCustomerModal';

const Customer = () => {
  const { isAuthenticated, userRoles } = useCheckUserAuth();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [customerData, setCustomerData] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [reloadData, setReloadData] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState(null);
  const gBASE_URL = process.env.REACT_APP_API_URL;

  // get customer data
  const fetchData = async () => {
    try {
      const response = await fetch(`${gBASE_URL}/customers`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data && data.data) {
        const activeCustomers = data.data.filter(customer => !customer.isDeleted);
        const dataWithIds = activeCustomers.map((row) => {
          const ordersCount = row.orders.length;
          return {
            ...row,
            id: row._id,
            orders: ordersCount > 0 ? ordersCount : 0
          };
        });
        setCustomerData(dataWithIds);
      }
    } catch (error) {
      // console.error('Error fetching customer data:', error);
      toast.error('Error fetching customer data', { draggable: true, autoClose: 3000, theme: "dark" });
    }
  };

  useEffect(() => {
    fetchData();
  }, [reloadData]);

  // delete
  async function handleDeleteCustomer() {
    const response = await fetch(`${gBASE_URL}/customers/${selectedCustomerId}`, {
      method: 'DELETE',
    });

    if (response.ok) { // Check if response status is 200
      setOpenDeleteModal(false);
      fetchData();
      toast.success('Delete Customer Successfully', { draggable: true, autoClose: 3000, theme: "dark" });
    } else {
      // console.error('Error deleting customer:', error);
      toast.warning('Cannot Delete Customer', { draggable: true, autoClose: 3000, theme: "dark" });
    }
  }

  const handleEditCustomer = (customerId) => {
    const customerToEdit = customerData.find((customer) => customer._id === customerId);
    setEditModalData(customerToEdit);
    setOpenEditModal(true);
  };

  const columns = [
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "orders",
      headerName: "Orders",
      flex: 0.5,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
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
              onClick={() => {
                setOpenEditModal(true);
                handleEditCustomer(params.row._id);
              }}
            >
              Edit
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setOpenDeleteModal(true);
                setSelectedCustomerId(params.row._id);
              }}
              disabled={!isAdmin}
            >
              Delete
            </Button>
          </>
        );
      }
    },
  ];

  return (
    <Box m="0 20px">
      <Box>
        <Header title="CUSTOMERS" subtitle="Managing the Customer" />
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
        <DataGrid rows={customerData} columns={columns} slots={{ toolbar: GridToolbar }} />
      </Box>
      <DeleteCustomerModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleDelete={handleDeleteCustomer}
      />
      <EditCustomerModal
        open={openEditModal}
        handleClose={() => setOpenEditModal(false)}
        customerData={editModalData}
        setReloadData={setReloadData}
      />
      <ToastContainer />
    </Box>
  );
};

export default Customer;
