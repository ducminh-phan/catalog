import { camelToSnake, Json, snakeToCamel } from "./misc";
import storage from "./storage";

type Method = "get" | "post" | "put" | "delete";

class Request {
  static request = async <T extends Json>(
    endpoint: string,
    method: Method,
    body?: Json,
  ): Promise<T> => {
    const token = storage.getToken();
    const headers: HeadersInit = {
      Accept: "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(camelToSnake(body));
      headers["Content-Type"] = "application/json";
    }

    const response = await window.fetch(
      `${process.env.REACT_APP_API_URL}/${endpoint}`,
      config,
    );

    const data = snakeToCamel(await response.json());

    if (response.ok) {
      return data as T;
    }

    return Promise.reject(data);
  };

  static get = <T extends Json = Json>(endpoint: string): Promise<T> =>
    Request.request(endpoint, "get");

  static post = <T extends Json = Json>(
    endpoint: string,
    body: Json,
  ): Promise<T> => Request.request<T>(endpoint, "post", body);

  static put = <T extends Json = Json>(
    endpoint: string,
    body: Json,
  ): Promise<T> => Request.request<T>(endpoint, "put", body);

  static delete = <T extends Json = Json>(endpoint: string): Promise<T> =>
    Request.request(endpoint, "delete");
}

export default Request;
