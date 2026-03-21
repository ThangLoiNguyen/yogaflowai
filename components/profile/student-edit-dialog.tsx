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
import { Edit, Camera, X } from "lucide-react";

interface StudentEditDialogProps {
  mode: "profile" | "avatar";
  trigger?: React.ReactNode;
}

export function StudentEditDialog({ mode, trigger }: StudentEditDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger onClick={() => setOpen(true)}>
        {trigger || (
          <Button 
            variant={mode === "avatar" ? "outline" : "default"} 
            className={mode === "avatar" ? "h-10 px-5 rounded-full border-[var(--border-medium)] text-[var(--text-primary)] font-medium bg-white" : "btn-primary h-10 px-5 rounded-full shadow-sky"}
          >
            {mode === "avatar" ? (
              <>Cập nhật ảnh đại diện</>
            ) : (
              <><Edit className="w-4 h-4 mr-2" /> Chỉnh sửa hồ sơ</>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent 
        open={open} 
        onOpenChange={setOpen}
        className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 bg-transparent"
      >
        <div className="bg-white rounded-[2.5rem] overflow-hidden">
            <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <div>
                    <DialogTitle className="text-2xl font-display">
                        {mode === "avatar" ? "Cập nhật ảnh đại diện" : "Chỉnh sửa thông tin cá nhân"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">
                        Cập nhật để AI tối ưu hóa lộ trình của bạn
                    </DialogDescription>
                </div>
                <Button variant="ghost" onClick={() => setOpen(false)} className="w-10 h-10 rounded-full p-0 flex items-center justify-center">
                    <X className="w-5 h-5" />
                </Button>
            </div>
            <div className="p-5 pt-12 pb-12">
                <OnboardingForm onSuccess={() => setOpen(false)} />
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
