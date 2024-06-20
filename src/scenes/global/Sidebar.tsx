import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import Divider from '@mui/material/Divider';
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import LabelIcon from '@mui/icons-material/Label';
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import useUserData from "../../hooks/useUserData";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const userData = useUserData();

  const [avatarUrl, setAvatarUrl] = useState(null);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const gBASE_URL = process.env.REACT_APP_API_URL;

  // avatar load
  useEffect(() => {
    // Kiểm tra xem userData.avatarUrl có phải là ID hay không
    if (userData.avatarUrl && userData.avatarUrl.length === 24) {
      // Nếu phải, gọi API để lấy URL của ảnh
      fetch(`${gBASE_URL}/image/${userData.avatarUrl}`)
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setAvatarUrl(url);
        })
        .catch(error => console.error(error));
    } else {
      // Nếu không phải, chỉ cần sử dụng URL hiện tại
      setAvatarUrl(userData.avatarUrl);
    }
  }, [userData]);

  const cssString = `
    .avatar-preview {
        width: 50px;
        height: 50px;
        position: relative;
        border-radius: 100%;
        border: 2px solid orange;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        > div {
            width: 100%;
            height: 100%;
            border-radius: 100%;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
        }
    }
}`

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ?
              <svg width="32" height="32" viewBox="0 0 32 32">
                <defs>
                  <linearGradient x1="28.538%" y1="20.229%" x2="100%" y2="108.156%" id="logo-a">
                    <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%" />
                    <stop stopColor="#A5B4FC" offset="100%" />
                  </linearGradient>
                  <linearGradient x1="88.638%" y1="29.267%" x2="22.42%" y2="100%" id="logo-b">
                    <stop stopColor="#38BDF8" stopOpacity="0" offset="0%" />
                    <stop stopColor="#38BDF8" offset="100%" />
                  </linearGradient>
                </defs>
                <rect fill="#6366F1" width="32" height="32" rx="16" />
                <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z" fill="#4F46E5" />
                <path
                  d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z"
                  fill="url(#logo-a)"
                />
                <path
                  d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z"
                  fill="url(#logo-b)"
                />
              </svg> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <svg width="32" height="32" viewBox="0 0 32 32">
                  <defs>
                    <linearGradient x1="28.538%" y1="20.229%" x2="100%" y2="108.156%" id="logo-a">
                      <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%" />
                      <stop stopColor="#A5B4FC" offset="100%" />
                    </linearGradient>
                    <linearGradient x1="88.638%" y1="29.267%" x2="22.42%" y2="100%" id="logo-b">
                      <stop stopColor="#38BDF8" stopOpacity="0" offset="0%" />
                      <stop stopColor="#38BDF8" offset="100%" />
                    </linearGradient>
                  </defs>
                  <rect fill="#6366F1" width="32" height="32" rx="16" />
                  <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z" fill="#4F46E5" />
                  <path
                    d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z"
                    fill="url(#logo-a)"
                  />
                  <path
                    d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z"
                    fill="url(#logo-b)"
                  />
                </svg>
                <Typography variant="h4" color={colors.grey[100]}>
                  ADMINICATE
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          <Divider />

          {!isCollapsed && (
            <Box mb="25px" mt="25px">
              <style>{cssString}</style>
              <Box display="flex" justifyContent="center" alignItems="center" position="relative">
                <div className="avatar-preview">
                  <div id="imagePreview" style={{ backgroundImage: `url(${avatarUrl})` }}>
                  </div>
                </div>
                <Tooltip title={"Online"}>
                  <div style={{
                    width: '13px',
                    height: '13px',
                    backgroundColor: '#4CAF50',
                    borderRadius: '50%',
                    position: 'absolute',
                    bottom: '0',
                    right: '42%',
                    border: '2px solid #fff'
                  }} />
                </Tooltip>
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  color={colors.grey[100]}
                  fontWeight="600"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {userData.username}
                </Typography>
                <Typography variant="h6" color={colors.greenAccent[500]}>
                  Access as {userData.roleName}
                </Typography>
              </Box>
            </Box>
          )}
          <Divider />
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Customer Manage"
              to="/customer-manage"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Category Information"
              to="/category-manage"
              icon={<CategoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Product Manage"
              to="/product-manage"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="User Manage"
              to="/user-manage"
              icon={<SupervisedUserCircleIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Voucher Manage"
              to="/voucher-manage"
              icon={<LabelIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Personal
            </Typography>
            <Item
              title="Profile Setting"
              to="/my-profile"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Add User"
              to="/add-account"
              icon={<PersonAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Apps
            </Typography>
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Kanban"
              to="/kanban"
              icon={<ViewKanbanIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Others
            </Typography>
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
