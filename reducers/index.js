import { combineReducers } from "redux";
import paymnt from "./paymnt";
import auth from "./auth";
import comp from "./comp";
import { HYDRATE } from 'next-redux-wrapper';



// const rootReducer = combineReducers({
//   paymnt,
//   auth,
// });

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        paymnt,
        auth,
        comp,

      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;