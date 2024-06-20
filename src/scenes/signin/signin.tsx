import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        ADMINICATE
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const gREQUEST_STATUS_OK = 200;
  const gBASE_URL = process.env.REACT_APP_API_URL;
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
        if (!username || !password) {
            toast.warning('Please enter both username and password.', { autoClose: 3000, theme: "dark" });
            return;
        }
        const response = await fetch(`${gBASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.status === gREQUEST_STATUS_OK) {
            const data = await response.json();
            const refreshToken = data.refreshToken;
            const accessToken = data.accessToken;
            const userId = data._id;
            Cookies.set('refreshToken', refreshToken, { expires: 1 });
            Cookies.set('accessToken', accessToken, { expires: 1 });
            Cookies.set('username', username, { expires: 1 })
            Cookies.set('_id', userId, { expires: 1 })

            const userResponse = await fetch(`${gBASE_URL}/user?username=${encodeURIComponent(username)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken
                }
            });

            const userData = await userResponse.json();

            if (userResponse.status === gREQUEST_STATUS_OK && userData.data) {
                const userRoles = userData.data.roles.map(role => role.name);
                if (userRoles.includes('Admin')) {
                    toast.success('Login Successfully', { autoClose: 3000, theme: "dark" });
                    Cookies.set('isAuthorized', 'true', { expires: 1 });
                    Cookies.set('username', username, { expires: 1 });
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                } else if (userRoles.includes('Moderator')) {
                    toast.success('Login Successfully as Moderator', { autoClose: 3000, theme: "dark" });
                    Cookies.set('isAuthorized', 'true', { expires: 1 });
                    Cookies.set('username', username, { expires: 1 });
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                } else {
                    toast.warning('Unauthorized access', { autoClose: 3000, theme: "dark" });
                }
            } else {
                toast.warning('Unauthorized access', { autoClose: 3000, theme: "dark" });
            }
        } else {
            toast.warning('Login failed. Please check your credentials.', { autoClose: 3000, theme: "dark" });
        }
    } catch (error) {
        // console.error('Error during login:', error);
    }
};


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Your Username"
              name="username"
              autoComplete="email"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
      <ToastContainer/>
    </ThemeProvider>
  );
}