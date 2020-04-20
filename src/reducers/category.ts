import { createReducer } from "@reduxjs/toolkit";
import { normalize } from "normalizr";

import { addCategory, fetchCategories } from "actions/category";
import { CATEGORIES_PER_PAGE } from "enums";
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
  builder
    .addCase(fetchCategories.fulfilled, (state, action) => {
      const { payload } = action;
      const normalized = normalize(payload.categories, schemas.categories);

      return {
        totalCategories: payload.totalCategories,
        categories: normalized.entities.categories ?? {},
        ids: normalized.result,
      };
    })
    .addCase(addCategory.fulfilled, (state, action) => {
      const { payload } = action;
      const normalized = normalize(payload, schemas.category);
      const { ids, categories } = state;

      if (ids.length < CATEGORIES_PER_PAGE) {
        return {
          ...state,
          ids: [...ids, normalized.result],
          categories: { ...categories, ...normalized.entities.categories },
        };
      }

      return state;
    }),
);
