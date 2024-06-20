import { combineReducers } from "redux";

import productReducer from "./product.reducer";
import userReducer from "./user.reducer";
import orderReducer from "./order.reducer";
import { locationReducer } from "./location.reducer";

const rootReducer = combineReducers({
    productReducer,
    userReducer,
    orderReducer,
    locationReducer
});

export default rootReducer;