import { ORDER_FETCH_REQUEST, ORDER_FETCH_SUCCESS, ORDER_FETCH_FAILURE } from '../constants/constant';
const initialState = {
  loading: false,
  error: '',
  totalOrders: 0,
  percentOrderChange:  0,
  weeklyOrderStats: [],
  pending: false
};

// lưu dữ liệu
const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDER_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        pending: true,
      };
    case ORDER_FETCH_SUCCESS:
      return {
        loading: false,
        error: '',
        totalOrders: action.payload.totalOrders,
        percentOrderChange: action.payload.percentOrderChange,
        weeklyOrderStats: action.payload.weeklyOrderStats,
        pending: false,
      };
    case ORDER_FETCH_FAILURE:
      return {
        loading: false,
        totalOrders: 0,
        percentOrderChange:  0,
        error: action.payload,
        pending: false,
      };
    default:
      return state;
  }
};

export default orderReducer;
