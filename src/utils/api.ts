import storage from "./storage";

type Method = "get" | "post" | "put";

class Request {
  static request = <T>(
    endpoint: string,
    method: Method,
    body?: object,
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
      config.body = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
    }

    return window
      .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
      .then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          return data;
        }

        return Promise.reject(data);
      });
  };

  static get = <T>(endpoint: string): Promise<T> =>
    Request.request(endpoint, "get");

  static post = <T>(endpoint: string, body: object): Promise<T> =>
    Request.request<T>(endpoint, "post", body);

  static put = <T>(endpoint: string, body: object): Promise<T> =>
    Request.request<T>(endpoint, "put", body);
}

export default Request;
