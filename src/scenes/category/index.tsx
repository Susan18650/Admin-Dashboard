import { useState, useEffect } from 'react';
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";

import useCheckUserAuth from '../../hooks/useCheckUserAuth';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DeleteCategoryModal from '../modal/category/deleteCategoryModal';
import EditCategoryModal from '../modal/category/editCategoryModal';
import CreateCategoryModal from '../modal/category/createCategory';

const Category = () => {
  const { isAuthenticated, userRoles } = useCheckUserAuth();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [reloadData, setReloadData] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState(null);

  const [category, setCategory] = useState([])

  const gBASE_URL = process.env.REACT_APP_API_URL;

  const accessToken = Cookies.get('accessToken');

  // fetch data
  const fetchData = async () => {
    try {
      const response = await fetch(`${gBASE_URL}/category`);
      const data = await response.json();
      const categoryData = data.data.map((category, index) => ({
        ...category,
        id: index + 1,
      }));
      setCategory(categoryData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reloadData]);

  // create
  const handleCreatCategory = () => {
    setOpenCreateModal(true);
  }

  // edit
  const handleEditCategory = (categoryId) => {
    const categoryToEdit = category.find((category) => category._id === categoryId);
    setEditModalData(categoryToEdit);
    setOpenEditModal(true);
  };

  // delete
  const handleDeleteCategory = async () => {
    const response = await fetch(`${gBASE_URL}/category/${selectedCategoryId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': accessToken
      },
      method: 'DELETE',
    });

    if (response.ok) { // Check if response status is 200
      setOpenDeleteModal(false);
      fetchData();
      toast.success('Delete Category Successfully', { draggable: true, autoClose: 3000, theme: "dark" });
    } else if (response.status === 400) {
      toast.warning('Cannot delete because there are products containing this category', { draggable: true, autoClose: 3000, theme: "dark" });
    } else {
      toast.warning('Failed to delete Category', { draggable: true, autoClose: 3000, theme: "dark" });
    } 
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
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
                handleEditCategory(params.row._id);
              }}
            >
              Edit
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setOpenDeleteModal(true);
                setSelectedCategoryId(params.row._id);
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="CATEGORY" subtitle="List of Category"
        />
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
              handleCreatCategory()
            }}
          >
            <AddBoxIcon sx={{ mr: "10px" }} />
            Create Category
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
        <DataGrid
          rows={category}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
      <CreateCategoryModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        setReloadData={setReloadData}
      />
      <DeleteCategoryModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onDelete={handleDeleteCategory}
      />
      <EditCategoryModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        categoryData={editModalData}
        setReloadData={setReloadData}
      />
      <ToastContainer />
    </Box>
  );
};

export default Category;
