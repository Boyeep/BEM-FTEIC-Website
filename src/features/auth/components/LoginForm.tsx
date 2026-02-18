// LoginForm component
// Handles user login form UI, validation, and submission.
// Uses useLoginMutation hook for authentication request.

"use client";

import Input from "@/components/input/Input";
import { useLoginMutation } from "@/features/auth/hooks/useLoginMutation";
import { LoginRequest } from "@/features/auth/types";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const methods = useForm<LoginRequest>({
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useLoginMutation();

  const onSubmit = (data: LoginRequest) => {
    login(data);
  };

  return (
    <div className="bg-white p-10 rounded-[15px] shadow-sm w-full max-w-[400px] text-center">
      <header className="mb-8">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
          Selamat Datang
        </p>
        <h1 className="text-2xl font-extrabold text-[#5172E8] tracking-tight">
          ELECTICS
        </h1>
      </header>

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-4 text-left"
        >
          <Input
            id="username"
            label="USERNAME"
            type="text"
            placeholder="Boy Steven"
            className="bg-[#D9D9D9] border-none rounded-lg"
            labelClassName="text-[10px] font-bold text-gray-400"
            validation={{
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            }}
          />

          <Input
            id="password"
            label="PASSWORD"
            type={showPassword ? "text" : "password"}
            placeholder="Password123"
            className="bg-[#D9D9D9] border-none rounded-lg"
            labelClassName="text-[10px] font-bold text-gray-400"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
            validation={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#EBB85E] hover:brightness-95 text-black font-bold py-3 rounded-[10px] uppercase tracking-wider transition-all mt-4"
          >
            {isPending ? "Logging in..." : "LOGIN"}
          </button>

          <div className="mt-6 text-center">
            <Link
              href="/signup"
              className="text-[#4A70E2] text-sm font-medium hover:underline"
            >
              Belum memiliki akun?
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
