import { USER_FETCH_REQUEST, USER_FETCH_SUCCESS, USER_FETCH_FAILURE } from '../constants/constant';
const initialState = {
  loading: false,
  error: '',
  totalAccounts: 0,
  percentAccountChange: 0,
  pending: false
};

// lưu dữ liệu 
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        pending: true,
      };
    case USER_FETCH_SUCCESS:
      return {
        loading: false,
        error: '',
        totalAccounts: action.payload.totalAccounts,
        percentAccountChange: action.payload.percentAccountChange,
        pending: false,
      };
    case USER_FETCH_FAILURE:
      return {
        loading: false,
        totalAccounts: 0,
        percentAccountChange: 0,
        error: action.payload,
        pending: false,
      };
    default:
      return state;
  }
};

export default userReducer;
