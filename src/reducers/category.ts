import { createReducer } from "@reduxjs/toolkit";
import { normalize } from "normalizr";

import { fetchCategories } from "actions/category";
import * as schemas from "utils/schemas";
import * as types from "utils/types";

interface CategoryState {
  totalCategories: number;
  categories: {
    [key: string]: types.Category;
  };
  ids: string[];
}

const initialState: CategoryState = {
  totalCategories: 0,
  categories: {},
  ids: [],
};

export default createReducer(initialState, (builder) =>
  builder.addCase(fetchCategories.fulfilled, (state, action) => {
    const { payload } = action;
    const normalized = normalize(payload.categories, schemas.categories);

    return {
      totalCategories: payload.totalCategories,
      categories: normalized.entities.categories ?? {},
      ids: normalized.result,
    };
  }),
);
