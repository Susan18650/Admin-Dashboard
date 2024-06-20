import axios from "axios";
import { FETCH_CITY, FETCH_LOCATION_ERROR } from "../constants/constant";

export const getLocaltion = () => {
  return async (dispatch) => {
    try {
      const response = await axios(
        "https://raw.githubusercontent.com/Susan18650/administrative-boundaries/master/data.json",
      );
      const data = await response.data;
      return dispatch({
        type: FETCH_CITY,
        payload: data,
      });
    } catch (error) {
      return dispatch({
        type: FETCH_LOCATION_ERROR,
      });
    }
  };
};
