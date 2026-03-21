"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Sparkles, 
  AlertCircle, 
  Check, 
  X, 
  History, 
  TrendingUp, 
  MessageSquare,
  ChevronRight,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface Student {
  id: string;
  full_name: string;
  avatar_url: string;
  priority: 'Urgent' | 'New' | 'OK';
  last_class: string;
}

interface Suggestion {
  id: string;
  type: string;
  action: string;
  reason: string;
  priority: 'urgent' | 'recommended' | 'optional';
}

export default function AIInsightsPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeTab, setActiveTab] = useState<'ai' | 'history' | 'trends' | 'chat'>('ai');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const searchParams = useSearchParams();
  const studentParam = searchParams.get("student");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Students who have booked with this teacher
      const { data: bookingData } = await supabase
        .from("bookings")
        .select(`
          student_id,
          users!student_id (full_name, avatar_url),
          class_sessions!inner (teacher_id, scheduled_at)
        `)
        .eq("class_sessions.teacher_id", user.id)
        .order("class_sessions(scheduled_at)", { ascending: false });

      // 2. Fetch Pending Suggestions to set priority
      const { data: alerts } = await supabase
        .from("ai_suggestions")
        .select("student_id")
        .eq("teacher_id", user.id)
        .eq("teacher_decision", "pending");

      const alertStudentIds = new Set(alerts?.map(a => a.student_id));

      // Unique students with metadata
      const uniqueStudents: Map<string, Student> = new Map();
      bookingData?.forEach(b => {
        if (!uniqueStudents.has(b.student_id)) {
          uniqueStudents.set(b.student_id, {
            id: b.student_id,
            full_name: (b.users as any).full_name || "Học viên",
            avatar_url: (b.users as any).avatar_url || "",
            priority: alertStudentIds.has(b.student_id) ? 'Urgent' : 'OK',
            last_class: new Date((b.class_sessions as any).scheduled_at).toLocaleDateString('vi-VN')
          });
        }
      });

      const studentList = Array.from(uniqueStudents.values());
      setStudents(studentList);

      // Auto-select student from param if exists
      if (studentParam) {
        const student = studentList.find(s => s.id === studentParam);
        if (student) {
          setSelectedStudent(student);
          fetchSuggestions(student.id);
        }
      }
      
      if (studentList.length > 0) {
        setSelectedStudent(studentList[0]);
        fetchSuggestions(studentList[0].id);
      }

      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const fetchSuggestions = async (studentId: string) => {
    const { data: insData } = await supabase
      .from("ai_suggestions")
      .select("*")
      .eq("student_id", studentId)
      .eq("teacher_decision", "pending")
      .order("created_at", { ascending: false });

    const formattedSuggs: Suggestion[] = insData?.flatMap(ins => 
      (ins.suggestions as any[]).map((s, idx) => ({
        id: `${ins.id}-${idx}`,
        type: s.type,
        action: s.action,
        reason: s.reason,
        priority: s.priority
      }))
    ) || [];

    setSuggestions(formattedSuggs);
  };

  const handleDecision = async (id: string, decision: 'approved' | 'dismissed') => {
    toast.success(`Gợi ý AI đã được ${decision === 'approved' ? 'duyệt' : 'bỏ qua'}`);
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  if (loading) return <div className="p-20 text-center font-display text-2xl text-[var(--accent)] animate-pulse">Đang nạp AI Insights...</div>;

  return (
    <div className="flex h-screen bg-[var(--bg-base)] font-ui overflow-hidden">
      {/* Left Panel: Student List */}
      <aside className="w-80 bg-white border-r border-[var(--border)] flex flex-col">
        <div className="p-6 border-b border-[var(--border)] space-y-4">
          <CardTitle className="font-display">Học viên cần chú ý</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Tìm học viên..." 
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-muted)] rounded-lg text-sm outline-none focus:ring-2 ring-[var(--accent-light)]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {students.map(student => (
            <button
              key={student.id}
              onClick={() => { setSelectedStudent(student); fetchSuggestions(student.id); }}
              className={`w-full flex items-center gap-4 p-4 hover:bg-[var(--bg-sky)] transition-colors text-left ${selectedStudent?.id === student.id ? "bg-[var(--bg-sky)] border-r-4 border-[var(--accent)]" : ""}`}
            >
              <div className="w-12 h-12 rounded-full bg-[var(--accent-tint)] flex items-center justify-center font-bold text-[var(--accent)]">
                {student.full_name[0]}
              </div>
              <div className="flex-1">
                <div className="font-bold text-[var(--text-primary)]">{student.full_name}</div>
                <div className="text-[10px] text-[var(--text-secondary)]">Gần nhất: {student.last_class}</div>
              </div>
              {student.priority !== 'OK' && (
                <Badge variant={student.priority === 'Urgent' ? 'destructive' : 'default'} className={student.priority === 'Urgent' ? "bg-red-500" : "bg-blue-500"}>
                  {student.priority}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Right Panel: Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {selectedStudent ? (
          <>
            {/* Header */}
            <header className="bg-white p-8 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white text-3xl font-display">
                    {selectedStudent.full_name[0]}
                 </div>
                 <div>
                    <h1 className="text-3xl mb-1">{selectedStudent.full_name}</h1>
                    <div className="flex gap-4 text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">
                       <span>Enrolled since Jan 2024</span>
                       <span>•</span>
                       <span>24 Sessions</span>
                       <span>•</span>
                       <span>12 Day Streak</span>
                    </div>
                 </div>
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" className="rounded-full border-[var(--border-strong)]">Xem hồ sơ đầy đủ</Button>
                 <Button className="btn-primary">Nhắn tin ngay</Button>
              </div>
            </header>

            {/* Tabs */}
            <div className="flex px-8 bg-white border-b border-[var(--border)]">
               {[
                 { id: 'ai', label: 'AI Gợi ý', icon: <Sparkles className="w-4 h-4" /> },
                 { id: 'history', label: 'Lịch sử Quiz', icon: <History className="w-4 h-4" /> },
                 { id: 'trends', label: 'Xu hướng', icon: <TrendingUp className="w-4 h-4" /> },
                 { id: 'chat', label: 'Trao đổi', icon: <MessageSquare className="w-4 h-4" /> },
               ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                 >
                   {tab.icon}
                   {tab.label}
                 </button>
               ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-[var(--bg-base)]">
               {activeTab === 'ai' && (
                 <div className="max-w-3xl space-y-6">
                    {suggestions.length > 0 ? (
                      suggestions.map(s => (
                        <div key={s.id} className="bg-white rounded-[var(--r-xl)] p-6 shadow-sm border border-[var(--border)] space-y-4 animate-in fade-in slide-in-from-bottom-4 transition-all hover:shadow-md">
                           <div className="flex justify-between items-start">
                              <Badge className={`${s.priority === 'urgent' ? "bg-red-500" : "bg-blue-500"} uppercase text-[10px] px-3 py-1`}>
                                 {s.priority}
                              </Badge>
                              <div className="label-mono text-[10px] text-[var(--text-muted)]">Type: {s.type}</div>
                           </div>
                           <div className="space-y-2">
                             <h3 className="text-xl font-bold leading-tight">{s.action}</h3>
                             <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{s.reason}</p>
                           </div>
                           <div className="flex gap-3 pt-2">
                              <Button 
                                onClick={() => handleDecision(s.id, 'approved')}
                                variant="default" 
                                className="bg-[var(--accent)] hover:bg-[var(--accent-dark)] rounded-full px-6 flex-1 h-12"
                              >
                                 <Check className="w-4 h-4 mr-2" /> Duyệt
                              </Button>
                              <Button variant="outline" className="border-[var(--border-strong)] rounded-full px-6 h-12">Chỉnh sửa</Button>
                              <Button 
                                onClick={() => handleDecision(s.id, 'dismissed')}
                                variant="ghost" 
                                className="text-red-500 hover:bg-red-50 rounded-full h-12"
                              >
                                 <X className="w-4 h-4" />
                              </Button>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-20 bg-white rounded-[var(--r-xl)] border-2 border-dashed border-[var(--border)]">
                         <Check className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                         <p className="font-display text-xl">Mọi thứ đều ổn!</p>
                         <p className="text-sm text-[var(--text-secondary)]">Không có gợi ý mới cho học viên này.</p>
                      </div>
                    )}
                 </div>
               )}

               {activeTab === 'history' && (
                 <div className="max-w-4xl space-y-8">
                    <h3 className="font-display text-2xl">Lịch sử Feedback Loop</h3>
                    <div className="space-y-4">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="bg-white p-6 rounded-[var(--r-lg)] border border-[var(--border)] flex items-center justify-between group hover:border-[var(--accent)] transition-all cursor-pointer">
                            <div className="flex items-center gap-6">
                               <div className={`w-3 h-3 rounded-full ${i === 1 ? "bg-red-500" : i === 2 ? "bg-amber-400" : "bg-emerald-400"}`} />
                               <div>
                                  <div className="font-bold">Session Review — 2{i} March 2026</div>
                                  <div className="text-xs text-[var(--text-secondary)]">Fatigue: {i*3} | Motivation: {5-i}</div>
                               </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               {activeTab === 'trends' && (
                 <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <Card className="rounded-[var(--r-xl)] shadow-sm">
                          <CardHeader><CardTitle className="text-sm label-mono">Fatigue Trend</CardTitle></CardHeader>
                          <CardContent className="h-64">
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[{d: '21/3', v: 4}, {d: '22/3', v: 6}, {d: '23/3', v: 9}, {d: '24/3', v: 5}]}>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                   <XAxis dataKey="d" />
                                   <YAxis />
                                   <Tooltip />
                                   <Line type="monotone" dataKey="v" stroke="#2E7DD1" strokeWidth={3} dot={{r: 4, fill: '#2E7DD1'}} />
                                </LineChart>
                             </ResponsiveContainer>
                          </CardContent>
                       </Card>
                       <Card className="rounded-[var(--r-xl)] shadow-sm">
                          <CardHeader><CardTitle className="text-sm label-mono">Motivation Trend</CardTitle></CardHeader>
                          <CardContent className="h-64">
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[{d: '21/3', v: 5}, {d: '22/3', v: 4}, {d: '23/3', v: 2}, {d: '24/3', v: 4}]}>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                   <XAxis dataKey="d" />
                                   <YAxis />
                                   <Tooltip />
                                   <Line type="monotone" dataKey="v" stroke="#F59E0B" strokeWidth={3} dot={{r: 4, fill: '#F59E0B'}} />
                                </LineChart>
                             </ResponsiveContainer>
                          </CardContent>
                       </Card>
                    </div>
                 </div>
               )}

               {activeTab === 'chat' && (
                 <div className="bg-white rounded-[var(--r-xl)] h-full border border-[var(--border)] flex flex-col">
                    <div className="flex-1 p-8">
                       <p className="text-center text-[var(--text-muted)] text-sm italic">Bắt đầu cuộc trò chuyện với {selectedStudent.full_name} về lộ trình học tập của họ.</p>
                    </div>
                    <div className="p-4 border-t border-[var(--border)]">
                       <input 
                         type="text" 
                         placeholder="Nhập tin nhắn..." 
                         className="w-full p-4 bg-[var(--bg-muted)] rounded-xl outline-none"
                       />
                    </div>
                 </div>
               )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
             <div className="w-24 h-24 rounded-full bg-[var(--bg-muted)] flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-[var(--text-muted)]" />
             </div>
             <h2 className="text-2xl font-display mb-2">Chọn một học viên</h2>
             <p className="text-[var(--text-secondary)]">Chọn học viên từ danh sách bên trái để xem phân tích AI và lịch sử tập luyện.</p>
          </div>
        )}
      </main>
    </div>
  );
}
