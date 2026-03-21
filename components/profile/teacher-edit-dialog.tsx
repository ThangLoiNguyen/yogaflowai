"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TeacherProfileForm } from "@/components/teacher-profile-form";
import { Edit3, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeacherEditDialogProps {
  fullWidth?: boolean;
}

export function TeacherEditDialog({ fullWidth }: TeacherEditDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger onClick={() => setOpen(true)}>
        <Button className={cn(
          "btn-primary bg-emerald-600 hover:bg-emerald-700 h-10 px-8 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center font-black uppercase tracking-widest text-[11px] min-w-[200px]",
          fullWidth ? "w-full" : ""
        )}>
          <Edit3 className="w-4 h-4 mr-2" /> Chỉnh sửa hồ sơ
        </Button>
      </DialogTrigger>
      <DialogContent 
        open={open} 
        onOpenChange={setOpen}
        className="max-w-4xl w-[90vw] max-h-[95vh] overflow-y-auto rounded-[2.5rem] p-0 bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-2 border-emerald-50 custom-scrollbar"
      >
        <DialogHeader className="p-6 border-b border-emerald-50/50 bg-gradient-to-br from-emerald-50/50 via-white to-white flex flex-row items-center justify-between space-y-0 sticky top-0 z-20 backdrop-blur-xl">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 ml-4">
               <DialogTitle className="text-3xl font-display text-emerald-900 leading-none">
                 Hồ sơ chuyên môn
               </DialogTitle>
            </div>
          </div>
          <Button variant="ghost" onClick={() => setOpen(false)} className="w-12 h-12 rounded-2xl p-0 flex items-center justify-center hover:bg-emerald-50 text-emerald-300 shrink-0 border border-emerald-50">
            <X className="w-6 h-6" />
          </Button>
        </DialogHeader>
        <div className="p-6 pt-0">
          <TeacherProfileForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
