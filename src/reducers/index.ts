import { combineReducers } from "@reduxjs/toolkit";

import category from "./category";

const rootReducer = combineReducers({ category });

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
