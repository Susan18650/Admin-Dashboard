import { useState, useEffect } from "react";
import { Box, useTheme, Typography, Button } from "@mui/material";
import { AppBar } from '@mui/material';

import Inventory2Icon from '@mui/icons-material/Inventory2';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import { useSpring, animated } from 'react-spring';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

import { tokens } from "../../theme";
// component
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import BarChart from "../../components/BarChart";
// reducer
import { fetchProducts } from "../../actions/product.action";
import { fetchAccounts } from "../../actions/user.action";
import { fetchOrders } from "../../actions/order.action";

import DeleteContactModal from "../modal/contact/deleteContactModal";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();

  const { totalProducts, percentProductChange } = useSelector((state) => state?.productReducer);

  const { totalAccounts, percentAccountChange } = useSelector((state) => state?.userReducer);

  const { totalOrders, percentOrderChange, weeklyOrderStats } = useSelector((state) => state?.orderReducer);

  const [contacts, setContacts] = useState([]);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const gBASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchAccounts());
    dispatch(fetchOrders());

    // fetch contact
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${gBASE_URL}/contact`, {
          headers: {
            'x-access-token': Cookies.get('accessToken')
          }
        });

        if (!response.ok) {
          setContacts([]);
          return;
        }

        const data = await response.json();
        setContacts(data.data);
      } catch (error) {
        setContacts([]);
      }
    };

    fetchContacts();

  }, [dispatch]);

  const handleOpenDeleteModal = (contact) => {
    setSelectedContact(contact);
    setOpenDeleteModal(true);
  };

  const handleDeleteContact = async () => {
    try {
      const response = await fetch(`${gBASE_URL}/contact/${selectedContact._id}`, {
        method: 'DELETE',
        headers: {
          'x-access-token': Cookies.get('accessToken')
        }
      });

      if (!response.ok) {
        toast.error("Error deleting contact", { autoClose: 3000, theme: "dark" });
        return;
      }

      // Remove the deleted contact from the contacts state
      setContacts(contacts.filter(contact => contact._id !== selectedContact._id));
      toast.success("Deleted contact successfully", { autoClose: 2500, theme: "dark" });
    } catch (error) {
      console.error(error);
      toast.error("Error deleting contact", { autoClose: 3000, theme: "dark" });
    }

    setOpenDeleteModal(false);
  };


  // animation
  const AnimatedNumber = ({ value }) => {
    const props = useSpring({ number: value, from: { number: 0 } });

    return <animated.span>{props.number.to((val) => Math.floor(val))}</animated.span>;
  };

  const AnimatedNumberWithDecimal = ({ value }) => {
    const props = useSpring({ number: value, from: { number: 0 } });

    return <animated.span>{props.number.to((val) => val.toFixed(1))}</animated.span>;
  };

  const percentProductChangeStyle = percentProductChange >= 0
    ? { color: colors.greenAccent[600], sign: '+' }
    : { color: colors.redAccent[600], sign: '-' };
  const percentAccountChangeStyle = percentAccountChange >= 0
    ? { color: colors.greenAccent[600], sign: '+' }
    : { color: colors.redAccent[600], sign: '-' };
  const percentOrderChangeStyle = percentOrderChange >= 0
    ? { color: colors.greenAccent[600], sign: '+' }
    : { color: colors.redAccent[600], sign: '-' };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={<AnimatedNumber value={totalProducts} />}
            subtitle="Products"
            progress={percentProductChange / 100}
            increase={
              <span style={{ color: percentProductChangeStyle.color }}>
                {percentProductChangeStyle.sign}
                <AnimatedNumberWithDecimal value={Math.abs(percentProductChange)} />
                %
              </span>
            }
            icon={
              <ReceiptOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={<AnimatedNumber value={totalAccounts} />}
            subtitle="Total Accounts"
            progress={percentAccountChange / 100}
            increase={
              <span style={{ color: percentAccountChangeStyle.color }}>
                {percentAccountChangeStyle.sign}
                <AnimatedNumberWithDecimal value={Math.abs(percentAccountChange)} />
                %
              </span>
            }
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={<AnimatedNumber value={totalOrders} />}
            subtitle="Total Orders"
            progress={percentOrderChange / 100}
            increase={
              <span style={{ color: percentOrderChangeStyle.color }}>
                {percentOrderChangeStyle.sign}
                <AnimatedNumberWithDecimal value={Math.abs(percentOrderChange)} />
                %
              </span>
            }
            icon={
              <Inventory2Icon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}

        {/* bar chart */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Weekly Orders
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart weeklyOrderStats={weeklyOrderStats} />
          </Box>
        </Box>

        {/* support */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <AppBar position="sticky">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              colors={colors.grey[100]}
              p="15px"
            >
              <Typography style={{ color: "white" }} variant="h5" fontWeight="600">
                Need support
              </Typography>
            </Box>
          </AppBar>
          {contacts.map((contact) => (
            <Box
              key={contact._id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {contact.name}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {contact.email}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {new Date(contact.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>
                <Button variant="contained" color="error" onClick={() => handleOpenDeleteModal(contact)}>Delete</Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <DeleteContactModal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} onDelete={handleDeleteContact} />
      <ToastContainer />
    </Box>
  );
};

export default Dashboard;
