"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({ id, name, placeholder = "••••••••", required = true, label = "Mật khẩu" }: { id: string, name: string, placeholder?: string, required?: boolean, label?: string }) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id} className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          required={required}
          className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6 pr-14"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
