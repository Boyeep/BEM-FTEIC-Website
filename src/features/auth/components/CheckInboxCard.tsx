// CheckInboxCard component
// Displays a message instructing the user to check their email inbox.
// Used after successful signup to inform the user to verify their email.

import Typography from "@/components/Typography";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function CheckInboxCard() {
  return (
    <div className="bg-white p-10 rounded-[15px] shadow-sm w-full max-w-[420px] text-center flex flex-col items-center">
      <div className="relative bg-[#5172E8] p-6 rounded-2xl mb-8 shadow-md">
        <Mail className="w-16 h-16 text-white" strokeWidth={1.5} />

        <div className="absolute top-1 right-1 w-4 h-4 bg-[#EBB85E] rounded-full border-2 border-white"></div>
      </div>

      <Typography as="h1" className="text-xl font-bold text-black mb-2">
        Cek Inbox pada email kamu, ya!
      </Typography>

      <Typography
        as="p"
        className="text-[13px] text-gray-500 max-w-[280px] leading-relaxed mb-8"
      >
        Silakan periksa email Anda untuk melakukan verifikasi akun dan
        menyelesaikan pendaftaran.
      </Typography>

      <div className="w-full pt-2">
        <Link href="/login" className="block w-full">
          <button className="w-full bg-[#EBB85E] hover:brightness-95 text-black font-bold py-3 rounded-[10px] uppercase tracking-wider transition-all">
            KEMBALI KE LOGIN
          </button>
        </Link>
      </div>

      <p className="mt-6 text-[11px] text-gray-400">
        Tidak menerima email?{" "}
        <span className="text-[#4A70E2] cursor-pointer hover:underline">
          Kirim ulang
        </span>
      </p>
    </div>
  );
}
