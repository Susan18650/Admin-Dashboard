import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

const useUserData = () => {
  const [userData, setUserData] = useState({
    username: "Unknow",
    avatarUrl: "https://static-00.iconduck.com/assets.00/person-icon-1901x2048-a9h70k71.png",
    roleName: "Unknown",
    works: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = Cookies.get('accessToken');
      const userId = Cookies.get('_id');
      const gBASE_URL = process.env.REACT_APP_API_URL;
      if (accessToken && userId) {
        try {
          const response = await fetch(`${gBASE_URL}/user/${userId}`, {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': accessToken
            }
          });
          if (response.ok) {
            const data = await response.json();
            const { username, firstName, lastName, email, phoneNumber, address, city, district, ward, zipCode, avatarUrl, roles, works } = data.data;
            const roleName = roles.length > 0 ? roles[0].name : "Unknown";
            setUserData({
              username: username,
              firstName: firstName,
              lastName: lastName,
              email: email,
              phoneNumber: phoneNumber,
              address: address,
              city: city,
              district: district,
              ward: ward, 
              zipCode: zipCode,
              avatarUrl: avatarUrl.length > 0 ? avatarUrl[0] : "https://static-00.iconduck.com/assets.00/person-icon-1901x2048-a9h70k71.png",
              roleName: roleName,
              works: works
            });
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchData();
  }, []);

  return userData;
};

export default useUserData;
