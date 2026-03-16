"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function TeacherSessionForm({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    class_type: "",
    flexibility_score: 50,
    strength_score: 50,
    notes: "",
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/teacher/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, student_id: studentId }),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({
            ...form,
            class_type: "",
            notes: "",
            flexibility_score: 50,
            strength_score: 50,
        });
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs uppercase font-bold text-slate-500">Class Type</Label>
          <Input 
            required 
            placeholder="e.g. Vinyasa Flow" 
            value={form.class_type} 
            onChange={(e) => setForm({...form, class_type: e.target.value})} 
            className="rounded-xl h-11"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase font-bold text-slate-500">Session Date</Label>
          <Input 
            type="date" 
            required 
            value={form.date} 
            onChange={(e) => setForm({...form, date: e.target.value})} 
            className="rounded-xl h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase font-bold text-slate-500">Flexibility</Label>
            <span className="text-lg font-black text-emerald-500">{form.flexibility_score}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={form.flexibility_score} 
            onChange={(e) => setForm({...form, flexibility_score: parseInt(e.target.value)})}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase font-bold text-slate-500">Strength</Label>
            <span className="text-lg font-black text-indigo-500">{form.strength_score}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={form.strength_score} 
            onChange={(e) => setForm({...form, strength_score: parseInt(e.target.value)})}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
          />
        </div>
      </div>

      <div className="space-y-2">
         <Label className="text-xs uppercase font-bold text-slate-500">Notes & Feedback</Label>
         <Textarea 
            placeholder="How did the student perform? Any specific posture improvements?" 
            className="rounded-2xl min-h-[100px] border-slate-200 dark:border-slate-800"
            value={form.notes}
            onChange={(e) => setForm({...form, notes: e.target.value})}
         />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
         {success && (
            <span className="flex items-center gap-2 text-sm font-bold text-emerald-600 animate-in fade-in">
               <CheckCircle2 className="w-4 h-4" /> Report Saved!
            </span>
         )}
         <Button 
            disabled={loading} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 px-8 rounded-xl h-11 font-bold"
         >
            {loading ? "Saving..." : <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Submit Session Report</span>}
         </Button>
      </div>
    </form>
  );
}
