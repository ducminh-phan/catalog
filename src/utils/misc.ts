export type JsonPrimitive = string | number | boolean | null;
export type JsonMap = {
  [member: string]: JsonPrimitive | JsonArray | JsonMap;
};
export type JsonArray = Array<JsonPrimitive | JsonArray | JsonMap>;
export type Json = JsonPrimitive | JsonMap | JsonArray;

export const toCamel = (str: string): string =>
  str.replace(/([-_][a-z])/gi, ($1) =>
    $1.toUpperCase().replace("-", "").replace("_", ""),
  );

export const toSnake = (str: string): string =>
  str.replace(/\.?([A-Z])/g, (x, y) => `_${y.toLowerCase()}`).replace(/^_/, "");

export const isObject = (obj: Json): obj is JsonMap => {
  return obj === Object(obj) && !Array.isArray(obj);
};

export const convert = (obj: Json, fn: (s: string) => string): Json => {
  if (isObject(obj)) {
    const n: { [key: string]: Json } = {};

    Object.keys(obj).forEach((k) => {
      n[fn(k)] = convert(obj[k], fn);
    });

    return n;
  }

  if (Array.isArray(obj)) {
    return obj.map((i) => {
      return convert(i, fn);
    });
  }

  return obj;
};

export const snakeToCamel = (o: Json): Json => convert(o, toCamel);
export const camelToSnake = (o: Json): Json => convert(o, toSnake);
