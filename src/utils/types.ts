export type PaginationParams = {
  offset: number;
  limit: number;
};

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type Item = {
  id: number;
  userId: number;
  name: string;
  description: string;
  price: number;
};
