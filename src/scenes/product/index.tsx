import React, { useState, useEffect } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from '@emotion/styled';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Cookies from "js-cookie";

import useCheckUserAuth from "../../hooks/useCheckUserAuth";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import CreateProductModal from "../modal/product/createProductModal";
import DeleteProductModal from "../modal/product/deleteProductModal";
import EditProductModal from "../modal/product/editProductModal";

const Products = () => {
  const { isAuthenticated, userRoles } = useCheckUserAuth();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { palette } = useTheme();

  const [products, setProducts] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // reload data
  const [reloadData, setReloadData] = useState(false);

  const gBASE_URL = process.env.REACT_APP_API_URL;

  const accessToken = Cookies.get('accessToken');


  function fetchProducts() {
    fetch(`${gBASE_URL}/product?limit=unlimit`)
      .then((response) => response.json())
      .then((data) => {
        const activeProducts = data.data.filter(product => !product.isDeleted);
        const formattedData = activeProducts.map((product, index) => ({
          id: index + 1,
          _id: product._id,
          image: product.imageUrls[0],
          name: product.name,
          description: product.description,
          buyPrice: product.buyPrice,
          promotionPrice: product.promotionPrice,
          percentDiscount: product.percentDiscount,
          amount: product.amount,
          imageUrls: product.imageUrls,
          category: product.category
        }));
        setProducts(formattedData);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }
  useEffect(() => {
    fetchProducts();
  }, [reloadData]);

  // create 
  const handleCreateProduct = () => {
    setIsCreateModalOpen(true);
  }

  // edit
  function handleEditClick(product) {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  }

  //delete 
  function handleDeleteClick(productId) {
    setSelectedProductId(productId);
    setIsDeleteModalOpen(true);
  }
  async function handleDeleteConfirm() {
    const response = await fetch(`${gBASE_URL}/product/${selectedProductId}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken
        },
        method: "DELETE",
    });

    if (response.ok) { // Check if response status is 200
        fetchProducts();
        setIsDeleteModalOpen(false);
        toast.success('Delete Product Successfully', { draggable: true, autoClose: 3000, theme: "dark" });
    } else {
        toast.warning('Cannot Delete Product', { draggable: true, autoClose: 3000, theme: "dark" });
    }
}


async function handleSaveProduct(updatedProduct) {
  const response = await fetch(`${gBASE_URL}/product/${updatedProduct._id}`, {
      method: "PUT",
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken
      },
      body: JSON.stringify(updatedProduct),
  });

  if (response.ok) { // Check if response status is 200
      fetchProducts();
      setIsEditModalOpen(false);
      toast.success('Product Updated Successfully', { draggable: true, autoClose: 3000, theme: "dark" });
  } else {
      toast.warning('Cannot Update Product', { draggable: true, autoClose: 3000, theme: "dark" });
  }
}

  // image column
  function renderImageCell(params) {
    if (!params.value) {
      return <img alt={"No Image"}/>;
    }
  
    let imageUrl = params.value;
    const isUrl = imageUrl.startsWith('http') || imageUrl.startsWith('https');
  
    if (!isUrl) {
      imageUrl = `${gBASE_URL}/image/${imageUrl}`;
    }
  
    return <img src={imageUrl} alt={params.row.name} style={{ width: "70px", height: "65px", padding: "5px" }} />;
  }
  
  // amout column
  const Small = styled("small")(({ bgcolor }) => ({
    height: 15,
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "4px",
    background: bgcolor,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
  }));
  const renderAmountCell = (params) => {
    const amount = params.value;
    let statusText;
    let bgColor;

    if (amount === 0) {
      statusText = "out of stock";
      bgColor = palette.error.main;
    } else if (amount < 20) {
      statusText = `${amount} available`;
      bgColor = palette.warning.dark;
    } else {
      statusText = "in stock";
      bgColor = palette.secondary.main;
    }

    return <Small bgcolor={bgColor}>{statusText}</Small>;
  };
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "image", headerName: "Image", flex: 1, renderCell: renderImageCell },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "buyPrice", headerName: "Buy Price ($)", flex: 1, valueFormatter: (params) => `$${params.value}`, },
    { field: "promotionPrice", headerName: "Promotion Price ($)", flex: 1, valueFormatter: (params) => `$${params.value}`, },
    { field: "amount", headerName: "Stock Status", flex: 1, renderCell: renderAmountCell },
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
              onClick={() => handleEditClick(params.row)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteClick(params.row._id)}
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
              setIsCreateModalOpen(true)
              handleCreateProduct()
            }}
          >
            <AddBoxIcon sx={{ mr: "10px" }} />
            Create Product
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
        <DataGrid pageSizeOptions={[10, 20, 30, 100]} rows={products} columns={columns} slots={{ toolbar: GridToolbar }} />
      </Box>
      <CreateProductModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        setReloadData={setReloadData}
      />
      {selectedProduct && (
        <EditProductModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={selectedProduct}
          onSave={handleSaveProduct}
        />
      )}
      <DeleteProductModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteConfirm}
      />
      <ToastContainer />
    </Box>
  );
};

export default Products;
