"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OnboardingForm } from "@/components/onboarding-form";
import { Edit, Camera, X, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentEditDialogProps {
  mode: "profile" | "avatar";
  trigger?: React.ReactNode;
  fullWidth?: boolean;
}

export function StudentEditDialog({ mode, trigger, fullWidth }: StudentEditDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger onClick={() => setOpen(true)}>
        {trigger || (
          <Button 
            variant={mode === "avatar" ? "outline" : "default"} 
            className={cn(
               mode === "avatar" ? "h-10 px-6 rounded-2xl border-slate-200" : "h-10 px-8 bg-indigo-600 text-white hover:bg-indigo-700 font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl transition-all min-w-[200px]",
               fullWidth ? "w-full" : ""
            )}
          >
            {mode === "avatar" ? <Camera className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
            {mode === "avatar" ? "Cập nhật ảnh" : "Thông tin cá nhân"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent 
        open={open} 
        onOpenChange={setOpen}
        className="max-w-4xl w-[90vw] max-h-[95vh] overflow-y-auto rounded-[2.5rem] p-0 bg-white shadow-[0_50px_100px_-20px_rgba(79,70,229,0.2)] border-2 border-indigo-50 custom-scrollbar"
      >
        <DialogHeader className="p-6 border-b border-indigo-50/50 bg-gradient-to-br from-indigo-50/50 via-white to-white flex flex-row items-center justify-between space-y-0 sticky top-0 z-20 backdrop-blur-xl">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
               <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg"><User className="w-4 h-4 text-white" /></div>
               <DialogTitle className="text-xl font-display text-indigo-900 leading-none">
                 {mode === "avatar" ? "Cập nhật ảnh" : "Cá nhân hóa AI"}
               </DialogTitle>
            </div>
            <DialogDescription className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.2em] leading-none ml-12">
              Dữ liệu của bạn - Thông minh hơn cùng YogAI
            </DialogDescription>
          </div>
          <Button variant="ghost" onClick={() => setOpen(false)} className="w-12 h-12 rounded-2xl p-0 flex items-center justify-center hover:bg-indigo-50 text-indigo-300 shrink-0 border border-indigo-50">
            <X className="w-6 h-6" />
          </Button>
        </DialogHeader>
        <div className="p-6">
          <OnboardingForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
