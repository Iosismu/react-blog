const LOCAL_STORAGE_TOKEN_KEY_NAKE = "token";

export default class TokenService {
  public static get(): string | null {
    return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY_NAKE);
  }

  public static set(token: string): void {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY_NAKE, token);
  }

  public static remove(): void {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY_NAKE);
  }
}
