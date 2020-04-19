import { combineReducers } from "@reduxjs/toolkit";

import category from "./category";
import item from "./item";

const rootReducer = combineReducers({
  category,
  item,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
