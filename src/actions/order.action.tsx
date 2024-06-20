import { ORDER_FETCH_REQUEST, ORDER_FETCH_SUCCESS, ORDER_FETCH_FAILURE } from '../constants/constant';

import axios from 'axios';

export const fetchOrdersRequest = () => ({
  type: ORDER_FETCH_REQUEST,
});

export const fetchOrdersSuccess = (users, totalOrders, percentOrderChange, weeklyOrderStats) => ({
  type: ORDER_FETCH_SUCCESS,
  payload: { users, totalOrders, percentOrderChange, weeklyOrderStats },
});

export const fetchOrdersFailure = (error) => ({
  type: ORDER_FETCH_FAILURE,
  payload: error,
});

export const fetchOrders = () => {
    return async (dispatch) => {
        dispatch(fetchOrdersRequest());
        try {
          const gBASE_URL= process.env.REACT_APP_API_URL;
            const response = await axios.get(`${gBASE_URL}/order`);
            const { data, totalOrders, percentOrderChange, weeklyOrderStats } = response.data;
            dispatch(fetchOrdersSuccess(data, totalOrders, percentOrderChange, weeklyOrderStats));
        } catch (error) {
            dispatch(fetchOrdersFailure(error.message));
        }
    };
};
