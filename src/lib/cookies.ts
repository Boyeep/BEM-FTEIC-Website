import Cookies from "universal-cookie";

const cookies = new Cookies();
const TOKEN_COOKIE_KEY = "flexoo_token";
const LEGACY_TOKEN_COOKIE_KEY = "@flexoo/token";

export const getToken = (): string =>
  cookies.get(TOKEN_COOKIE_KEY) || cookies.get(LEGACY_TOKEN_COOKIE_KEY);

export const setToken = (token: string) => {
  cookies.set(TOKEN_COOKIE_KEY, token, { path: "/" });
  try {
    cookies.set(LEGACY_TOKEN_COOKIE_KEY, token, { path: "/" });
  } catch (error) {
    // Ignore invalid cookie name errors for legacy tokens
  }
};

export const removeToken = () => {
  cookies.remove(TOKEN_COOKIE_KEY, { path: "/" });
  try {
    cookies.remove(LEGACY_TOKEN_COOKIE_KEY, { path: "/" });
  } catch (error) {
    // Ignore invalid cookie name errors for legacy tokens
  }
};
