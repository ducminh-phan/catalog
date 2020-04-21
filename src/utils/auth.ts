import Request from "./api";
import storage from "./storage";

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
  email: string;
  name: string;
};

export type RegisterResponse = {
  accessToken: string;
};

const handleAuthResponse = ({
  accessToken,
}: LoginResponse | RegisterResponse): void => storage.setToken(accessToken);

export const login = (body: LoginRequest): Promise<void> => {
  return Request.post<LoginResponse>("login", body).then(handleAuthResponse);
};

export const register = (body: RegisterRequest): Promise<void> => {
  return Request.post<RegisterResponse>("registrations", body).then(
    handleAuthResponse,
  );
};

export const logout = (): Promise<void> => {
  storage.removeToken();
  return Promise.resolve();
};

interface User {
  id: number;
  name: string;
}

export interface AppData {
  user: User;
}

export type UserResponse = {
  email: string;
  username: string;
  created: string;
  updated: string;
  name: string;
  id: number;
};

export const getAppData = async (): Promise<AppData | null> => {
  const token = storage.getToken();

  if (token === null) {
    return null;
  }

  return Request.get<UserResponse>("me")
    .then(({ id, name }) => ({ user: { id, name } }))
    .catch((error) => {
      logout();
      return Promise.reject(error);
    });
};
