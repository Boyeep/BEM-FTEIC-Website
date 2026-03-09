import Cookies from "universal-cookie";

const cookies = new Cookies();
const TOKEN_COOKIE_KEY = "flexoo_token";
const LEGACY_TOKEN_COOKIE_KEY = "@flexoo/token";

export const getToken = (): string =>
  cookies.get(TOKEN_COOKIE_KEY) || cookies.get(LEGACY_TOKEN_COOKIE_KEY);

export const setToken = (token: string) => {
  cookies.set(TOKEN_COOKIE_KEY, token, { path: "/" });
  cookies.set(LEGACY_TOKEN_COOKIE_KEY, token, { path: "/" });
};

export const removeToken = () => {
  cookies.remove(TOKEN_COOKIE_KEY, { path: "/" });
  cookies.remove(LEGACY_TOKEN_COOKIE_KEY, { path: "/" });
};
