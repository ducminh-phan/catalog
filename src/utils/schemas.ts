import { schema } from "normalizr";

export const category = new schema.Entity("categories");

export const categories = [category];

export const item = new schema.Entity("items");

export const items = [item];
