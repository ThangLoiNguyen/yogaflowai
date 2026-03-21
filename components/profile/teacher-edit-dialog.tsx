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
import { TeacherProfileForm } from "@/components/teacher-profile-form";
import { Edit3, X } from "lucide-react";

export function TeacherEditDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger onClick={() => setOpen(true)}>
        <Button className="btn-primary bg-emerald-600 hover:bg-emerald-700 h-10 px-5 rounded-full shadow-lg">
          <Edit3 className="w-4 h-4 mr-2" /> Chỉnh sửa hồ sơ
        </Button>
      </DialogTrigger>
      <DialogContent 
        open={open} 
        onOpenChange={setOpen}
        className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 bg-transparent"
      >
        <div className="bg-white rounded-[2.5rem] overflow-hidden">
            <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <div>
                    <DialogTitle className="text-2xl font-display text-emerald-900">
                        Chỉnh sửa hồ sơ chuyên môn
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">
                        Cập nhật chuyên môn để học viên thấu hiểu bạn hơn
                    </DialogDescription>
                </div>
                <Button variant="ghost" onClick={() => setOpen(false)} className="w-10 h-10 rounded-full p-0 flex items-center justify-center hover:bg-emerald-50 text-emerald-600">
                    <X className="w-5 h-5" />
                </Button>
            </div>
            <div className="p-10">
                <TeacherProfileForm onSuccess={() => setOpen(false)} />
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
