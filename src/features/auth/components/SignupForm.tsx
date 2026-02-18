// SignupForm component
// Handles user registration form UI and submission logic.
// Triggers email verification process after successful signup.

"use client";

import Input from "@/components/input/Input";
import { useSignupMutation } from "@/features/auth/hooks/useSignupMutation";
import { SignupRequest } from "@/features/auth/types";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const methods = useForm<SignupRequest>({
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { mutate: signup, isPending } = useSignupMutation();

  const onSubmit = (data: SignupRequest) => {
    signup(data);
  };

  return (
    <div className="bg-white p-10 rounded-[15px] shadow-sm w-full max-w-[400px] text-center">
      <header className="mb-8">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
          SIGN UP
        </p>
        <h1 className="text-2xl font-extrabold text-[#5172E8] tracking-tight">
          Buat akun baru
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
            id="email"
            label="EMAIL"
            type="email"
            placeholder="boysteven@gmail.com"
            className="bg-[#D9D9D9] border-none rounded-lg"
            labelClassName="text-[10px] font-bold text-gray-400"
            validation={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
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
            {isPending ? "Creating account..." : "SIGNUP"}
          </button>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-[#4A70E2] text-sm font-medium hover:underline"
            >
              Sudah memiliki akun?
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
