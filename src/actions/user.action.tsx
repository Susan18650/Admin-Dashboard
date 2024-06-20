import { USER_FETCH_REQUEST, USER_FETCH_SUCCESS, USER_FETCH_FAILURE } from '../constants/constant';
import axios from 'axios';
import Cookies from 'js-cookie';

export const fetchAccountsRequest = () => ({
  type: USER_FETCH_REQUEST,
});

export const fetchAccountsSuccess = (users, totalAccounts, percentAccountChange) => ({
  type: USER_FETCH_SUCCESS,
  payload: { users, totalAccounts, percentAccountChange },
});

export const fetchAccountsFailure = (error) => ({
  type: USER_FETCH_FAILURE,
  payload: error,
});

export const fetchAccounts = () => {
    return async (dispatch) => {
        dispatch(fetchAccountsRequest());
        try {
            const gBASE_URL= process.env.REACT_APP_API_URL;
            const accessToken = Cookies.get('accessToken');
            const api = axios.create({
                baseURL: gBASE_URL,
                headers: {
                    'x-access-token': accessToken
                }
            });
            const response = await api.get('/user');
            const { data, totalAccounts, percentAccountChange } = response.data;
            dispatch(fetchAccountsSuccess(data, totalAccounts, percentAccountChange));
        } catch (error) {
            dispatch(fetchAccountsFailure(error.message));
        }
    };
};
