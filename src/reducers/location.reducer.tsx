import { FETCH_CITY } from "../constants/constant";

const initialState = {
  cities: [],
};

//Control city selection
export const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CITY:
      state.cities = action.payload;
      break;
    default:
      break;
  }
  return { ...state };
};
