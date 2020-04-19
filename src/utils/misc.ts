export type JsonPrimitive = string | number | boolean | null;
export type JsonMap = {
  [member: string]: JsonPrimitive | JsonArray | JsonMap;
};
export type JsonArray = Array<JsonPrimitive | JsonArray | JsonMap>;
export type Json = JsonPrimitive | JsonMap | JsonArray;

export const toCamel = (str: string): string => {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
};

export const isObject = (obj: Json): obj is JsonMap => {
  return obj === Object(obj) && !Array.isArray(obj);
};

export const snakeToCamel = (obj: Json): Json => {
  if (isObject(obj)) {
    const n: { [key: string]: Json } = {};

    Object.keys(obj).forEach((k) => {
      n[toCamel(k)] = snakeToCamel(obj[k]);
    });

    return n;
  }

  if (Array.isArray(obj)) {
    return obj.map((i) => {
      return snakeToCamel(i);
    });
  }

  return obj;
};
