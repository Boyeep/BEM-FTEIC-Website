// clsxm.ts a.k.a utils.ts

import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export default function clsxm(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}
