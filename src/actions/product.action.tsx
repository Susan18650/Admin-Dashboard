import { FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE} from '../constants/constant';

import axios from 'axios';

export const fetchProductsRequest = () => ({
  type: FETCH_PRODUCTS_REQUEST,
});

export const fetchProductsSuccess = (products, totalProducts, percentProductChange) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: { products, totalProducts, percentProductChange },
});

export const fetchProductsFailure = (error) => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});

export const fetchProducts = () => {
    return async (dispatch) => {
        dispatch(fetchProductsRequest());
        try {
          const gBASE_URL= process.env.REACT_APP_API_URL;
            const response = await axios.get(`${gBASE_URL}/product`);
            const { data, totalProducts, percentProductChange } = response.data;
            dispatch(fetchProductsSuccess(data, totalProducts, percentProductChange));
        } catch (error) {
            dispatch(fetchProductsFailure(error.message));
        }
    };
};
