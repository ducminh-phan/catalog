class Storage {
  private readonly prefix: string;

  private static readonly tokenKey: "token";

  constructor(localStoragePrefix: string) {
    this.prefix = localStoragePrefix;
  }

  getItem = (key: string): string | null =>
    localStorage.getItem(`${this.prefix}:${key}`);

  setItem = (key: string, value: string): void =>
    localStorage.setItem(`${this.prefix}:${key}`, value);

  removeItem = (key: string): void =>
    localStorage.removeItem(`${this.prefix}:${key}`);

  getToken = (): string | null => this.getItem(Storage.tokenKey);

  setToken = (token: string): void => this.setItem(Storage.tokenKey, token);

  removeToken = (): void => this.removeItem(Storage.tokenKey);
}

export default new Storage(process.env.REACT_APP_LOCAL_STORAGE_PREFIX);
