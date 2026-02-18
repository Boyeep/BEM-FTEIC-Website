// input component
// Reusable input field with label, error handling, and optional right icon.
// Used in login and signup forms for consistent styling and validation.

"use client";

import clsxm from "@/lib/clsxm";
import React from "react";
import { useFormContext } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  validation?: object;
  labelClassName?: string;
  rightIcon?: React.ReactNode;
}

const Input = ({
  id,
  label,
  validation,
  className,
  labelClassName,
  rightIcon,
  type = "text",
  ...rest
}: InputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[id];

  return (
    <div className="flex flex-col gap-1 w-full text-left">
      <label
        htmlFor={id}
        className={clsxm(
          "text-[10px] font-bold text-gray-400 uppercase ml-1",
          error && "text-red-500",
          labelClassName,
        )}
      >
        {label}
      </label>

      <div className="relative">
        <input
          {...register(id, validation)}
          {...rest}
          id={id}
          type={type}
          className={clsxm(
            "w-full bg-[#D9D9D9] border-none rounded-lg p-3 text-sm text-black placeholder:text-gray-500 outline-none transition-all focus:ring-2 focus:ring-[#5172E8]/50",
            rightIcon ? "pr-10" : undefined,
            error && "ring-2 ring-red-500",
            className,
          )}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <span className="text-[10px] text-red-500 ml-1 font-medium">
          {error.message as string}
        </span>
      )}
    </div>
  );
};

export default Input;
