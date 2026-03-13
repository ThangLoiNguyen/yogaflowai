"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({ id, name, placeholder = "••••••••", required = true, label = "Password" }: { id: string, name: string, placeholder?: string, required?: boolean, label?: string }) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={id} className="font-semibold text-slate-700 dark:text-slate-300">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          required={required}
          className="h-11 shadow-sm pr-10"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
