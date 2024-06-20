import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const gREQUEST_STATUS_OK = 200;
const gBASE_URL = process.env.REACT_APP_API_URL;

const useCheckUserAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const checkUserAuth = async () => {
      const username = Cookies.get('username');
      const accessToken = Cookies.get('accessToken');

      if (username && accessToken) {
        try {
          const userResponse = await fetch(`${gBASE_URL}/user?username=${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': accessToken
            }
          });

          if (userResponse.status === gREQUEST_STATUS_OK) {
            const userData = await userResponse.json();
            if (userData.data) {
              const roles = userData.data.roles.map(role => role.name);
              setUserRoles(roles);
              setIsAuthenticated(true);
            }
          }
        } catch (error) {
          console.error('Error checking user authentication:', error);
        }
      }
    };

    checkUserAuth();
  }, []);

  return { isAuthenticated, userRoles };
};

export default useCheckUserAuth;
