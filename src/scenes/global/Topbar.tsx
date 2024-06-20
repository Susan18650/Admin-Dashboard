import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { Box, IconButton, useTheme, Typography } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Cookies from 'js-cookie';
import useUserData from "../../hooks/useUserData";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const userData = useUserData();

  const [avatarUrl, setAvatarUrl] = useState(null);

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

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    ['accessToken', 'username', 'isAuthorized'].forEach(cookie => Cookies.remove(cookie));
    window.location.reload();
  };

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
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <Tooltip title="Profile">
          <IconButton
            onClick={handleClick}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <PersonOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <style>{cssString}</style>
              <div className="avatar-preview">
                <div id="imagePreview" style={{ backgroundImage: `url(${avatarUrl})` }}>
                </div>
              </div>
              <Box>
                <Typography variant="body1" sx={{ fontSize: '17px', fontWeight: '600' }}>{userData.username}</Typography>
                <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: '400', fontStyle: 'italic' }}>{userData.roleName}</Typography>
              </Box>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem component={Link} to="/my-profile">
            <ListItemIcon>
              <Settings fontSize="medium" />
            </ListItemIcon>
            <Typography variant="body1" sx={{ fontSize: '15px', fontWeight: '500' }}>Settings</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <Typography variant="body1" sx={{ fontSize: '15px', fontWeight: '500' }}>Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
