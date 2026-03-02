import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getToken = (): string => cookies.get("@flexoo/token");

export const setToken = (token: string) => {
  cookies.set("@flexoo/token", token, { path: "/" });
};

export const removeToken = () => cookies.remove("@flexoo/token", { path: "/" });
