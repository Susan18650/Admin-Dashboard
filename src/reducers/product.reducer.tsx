import { FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE } from '../constants/constant';
const initialState = {
  loading: false,
  error: '',
  totalProducts: 0,
  percentProductChange:  0,
  pending: false
};

// lưu dữ liệu
const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        pending: true,
      };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        loading: false,
        error: '',
        totalProducts: action.payload.totalProducts,
        percentProductChange: action.payload.percentProductChange,
        pending: false,
      };
    case FETCH_PRODUCTS_FAILURE:
      return {
        loading: false,
        totalProducts: 0,
        percentProductChange:  0,
        error: action.payload,
        pending: false,
      };
    default:
      return state;
  }
};

export default productReducer;
