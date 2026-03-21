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
  ChevronLeft,
  Search,
  Filter,
  Mail,
  Calendar,
  Target,
  Activity,
  Award,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
  email: string;
  joinDate: string;
  streak: number;
  health: string | null;
  goals: string[];
  experience: number;
  fitness: number;
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
  const [history, setHistory] = useState<any[]>([]);
  const [trends, setTrends] = useState<{ fatigue: any[], motivation: any[] }>({ fatigue: [], motivation: [] });
  const [students, setStudents] = useState<Student[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeTab, setActiveTab] = useState<'ai' | 'history' | 'trends' | 'chat' | 'profile'>('ai');
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
          users!student_id (
            full_name, 
            avatar_url,
            email,
            created_at,
            streaks (current_streak),
            onboarding_quiz (*)
          ),
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
          const u = b.users as any;
          uniqueStudents.set(b.student_id, {
            id: b.student_id,
            full_name: u?.full_name || "Học viên",
            avatar_url: u?.avatar_url || "",
            priority: alertStudentIds.has(b.student_id) ? 'Urgent' : 'OK',
            last_class: new Date((b.class_sessions as any).scheduled_at).toLocaleDateString('vi-VN'),
            email: u?.email || "",
            joinDate: u?.created_at || "",
            streak: u?.streaks?.length > 0 ? u.streaks[0].current_streak : 0,
            health: u?.onboarding_quiz?.health_issues || null,
            goals: u?.onboarding_quiz?.goals || [],
            experience: u?.onboarding_quiz?.experience_level || 1,
            fitness: u?.onboarding_quiz?.fitness_level || 3
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
    setLoading(true);
    // 1. Fetch Suggestions
    const { data: insData } = await supabase
      .from("ai_suggestions")
      .select("*")
      .eq("student_id", studentId)
      .eq("teacher_decision", "pending")
      .order("created_at", { ascending: false });

    const formattedSuggs: Suggestion[] = insData?.flatMap(ins =>
      (ins.suggestions as any[]).map((s, idx) => ({
        id: ins.id, // Use the record ID
        type: s.type,
        action: s.action,
        reason: s.reason,
        priority: s.priority
      }))
    ) || [];

    setSuggestions(formattedSuggs);

    // 2. Fetch History (Past quizzes)
    const { data: quizData } = await supabase
      .from("session_quiz")
      .select("*")
      .eq("student_id", studentId)
      .order("submitted_at", { ascending: false });

    setHistory(quizData || []);

    // 3. Fetch Trends
    if (quizData && quizData.length > 0) {
      const sorted = [...quizData].sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
      const fatigue = sorted.map(q => ({
        d: new Date(q.submitted_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        v: q.fatigue_level
      }));
      const motivation = sorted.map(q => ({
        d: new Date(q.submitted_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        v: q.motivation_level
      }));
      setTrends({ fatigue, motivation });
    }

    setLoading(false);
  };

  const handleDecision = async (recordId: string, decision: 'approved' | 'dismissed') => {
    const { error } = await supabase
      .from("ai_suggestions")
      .update({
        teacher_decision: decision,
        decided_at: new Date().toISOString()
      })
      .eq("id", recordId);

    if (error) {
      toast.error("Lỗi cập nhật quyết định");
      return;
    }

    toast.success(`Gợi ý AI đã được ${decision === 'approved' ? 'duyệt' : 'bỏ qua'}`);
    setSuggestions(prev => prev.filter(s => s.id !== recordId));
  };

  if (loading) return <div className="p-20 text-center font-display text-base text-[var(--accent)] animate-pulse">Đang nạp AI Insights...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[var(--bg-base)] overflow-hidden" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Left Panel: Student List */}
      <aside className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-[var(--border)] flex flex-col shrink-0">
        <div className="p-4 border-b border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Học viên cần chú ý</h2>
            <Link href="/teacher/students">
              <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold text-slate-400 hover:text-accent p-0 h-6">
                <ChevronLeft className="w-3 h-3 mr-1" /> Quay lại
              </Button>
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none group-focus-within:text-emerald-500 transition-colors">
              <Search className="w-4 h-4 text-slate-300" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm học viên..."
              className="w-full h-10 pl-10 pr-10 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm outline-none txt-content"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <div className="w-6 h-6 rounded-md bg-white border border-slate-100 flex items-center justify-center text-[10px] text-slate-300 font-bold opacity-0 group-focus-within:opacity-100 transition-opacity">
                /
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {students.map(student => (
            <button
              key={student.id}
              onClick={() => { setSelectedStudent(student); fetchSuggestions(student.id); }}
              className={`w-full flex items-center gap-4 p-4 hover:bg-[var(--bg-sky)] transition-colors text-left ${selectedStudent?.id === student.id ? "bg-[var(--bg-sky)] border-r-4 border-[var(--accent)]" : ""}`}
            >
              <div className="w-9 h-9 rounded-full bg-[var(--accent-tint)] flex items-center justify-center font-bold text-[var(--accent)]">
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
            <header className="bg-white p-5 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white text-base font-display shrink-0">
                  {selectedStudent.full_name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h1 className="text-base truncate">{selectedStudent.full_name}</h1>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter h-5 border-[var(--border-strong)]">AI Analyst active</Badge>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] italic mb-2">Hệ thống đang theo sát tiến trình và phản hồi của học viên này.</p>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">
                    <span>Học viên gần đây</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Lớp cuối: {selectedStudent.last_class}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0">
                {/* Removed direct message button per request */}
              </div>
            </header>

            {/* Tabs */}
            <div className="flex overflow-x-auto px-5 bg-white border-b border-[var(--border)] hide-scrollbar">
              {[
                { id: 'ai', label: 'AI Gợi ý', icon: <Sparkles className="w-4 h-4" /> },
                { id: 'history', label: 'Lịch sử Quiz', icon: <History className="w-4 h-4" /> },
                { id: 'trends', label: 'Xu hướng', icon: <TrendingUp className="w-4 h-4" /> },
                { id: 'profile', label: 'Hồ sơ', icon: <Users className="w-4 h-4" /> },
                { id: 'chat', label: 'Trao đổi', icon: <MessageSquare className="w-4 h-4" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex shrink-0 items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 bg-[var(--bg-base)]">
              {activeTab === 'ai' && (
                <div className="max-w-3xl space-y-4">
                  <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-indigo-900">AI đã phân tích dữ liệu mới</span>
                    </div>
                    <p className="text-[11px] text-indigo-700 leading-relaxed italic">Dựa trên phản hồi sau buổi tập (Session Quiz) và xu hướng mệt mỏi của học viên, AI đề xuất các hành động dưới đây để bạn tối ưu hóa trải nghiệm cho học viên.</p>
                  </div>
                  {suggestions.length > 0 ? (
                    suggestions.map(s => (
                      <div key={s.id} className="bg-white rounded-xl p-4 shadow-sm border border-[var(--border)] space-y-4 animate-in fade-in slide-in-from-bottom-4 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start">
                          <Badge className={`${s.priority === 'urgent' ? "bg-red-500" : "bg-blue-500"} uppercase text-[10px] px-3 py-1`}>
                            {s.priority}
                          </Badge>
                          <div className="label-mono text-[10px] text-[var(--text-muted)]">Type: {s.type}</div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-base font-bold leading-tight">{s.action}</h3>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{s.reason}</p>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={() => handleDecision(s.id, 'approved')}
                            variant="default"
                            className="bg-[var(--accent)] hover:bg-[var(--accent-dark)] rounded-full px-6 flex-1 h-9"
                          >
                            <Check className="w-4 h-4 mr-2" /> Duyệt
                          </Button>
                          <Button variant="outline" className="border-[var(--border-strong)] rounded-full px-6 h-9">Chỉnh sửa</Button>
                          <Button
                            onClick={() => handleDecision(s.id, 'dismissed')}
                            variant="ghost"
                            className="text-red-500 hover:bg-red-50 rounded-full h-9"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-white rounded-xl border-2 border-dashed border-[var(--border)]">
                      <Check className="w-9 h-9 text-emerald-500 mx-auto mb-4" />
                      <p className="font-display text-base">Mọi thứ đều ổn!</p>
                      <p className="text-sm text-[var(--text-secondary)]">Không có gợi ý mới cho học viên này.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="max-w-4xl space-y-2">
                  <h3 className="font-display text-base">Lịch sử Feedback Loop</h3>
                  <div className="space-y-4">
                    {history.length > 0 ? history.map((h, i) => (
                      <div key={h.id} className="bg-white p-4 rounded-lg border border-[var(--border)] flex items-center justify-between group hover:border-[var(--accent)] transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${h.fatigue_level > 7 ? "bg-red-500" : h.fatigue_level > 4 ? "bg-amber-400" : "bg-emerald-400"}`} />
                          <div>
                            <div className="font-bold">Session Review — {new Date(h.submitted_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                            <div className="text-xs text-[var(--text-secondary)]">Mệt mỏi: {h.fatigue_level}/10 | Động lực: {h.motivation_level}/5</div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                      </div>
                    )) : (
                      <div className="p-12 text-center bg-white rounded-xl border-2 border-dashed border-slate-100 italic text-slate-400">
                        Chưa có dữ liệu lịch sử phản hồi.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'trends' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Card className="rounded-xl shadow-sm">
                      <CardHeader><CardTitle className="text-sm label-mono">Chỉ số Mệt mỏi</CardTitle></CardHeader>
                      <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trends.fatigue}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="d" />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="v" stroke="#2E7DD1" strokeWidth={3} dot={{ r: 4, fill: '#2E7DD1' }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <Card className="rounded-xl shadow-sm">
                      <CardHeader><CardTitle className="text-sm label-mono">Chỉ số Động lực</CardTitle></CardHeader>
                      <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trends.motivation}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="d" />
                            <YAxis domain={[0, 5]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="v" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, fill: '#F59E0B' }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 transition-all duration-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl flex flex-col items-start border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest"><Flame className="w-3.5 h-3.5 text-orange-500" /> Streak</div>
                      <div className="text-base font-bold text-slate-800">{selectedStudent.streak} ngày</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl flex flex-col items-start border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest"><Activity className="w-3.5 h-3.5 text-blue-500" /> Cấp độ</div>
                      <div className="text-base font-bold text-slate-800">Cấp {selectedStudent.experience}</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl flex flex-col items-start border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest"><Award className="w-3.5 h-3.5 text-purple-500" /> Thể lực</div>
                      <div className="text-base font-bold text-slate-800">{selectedStudent.fitness}/5</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl flex flex-col items-start border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest"><Calendar className="w-3.5 h-3.5 text-emerald-500" /> Tham gia</div>
                      <div className="text-sm font-bold text-slate-800">{new Date(selectedStudent.joinDate).toLocaleDateString('vi-VN')}</div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Email liên hệ</div>
                      <div className="text-sm font-bold text-slate-700">{selectedStudent.email}</div>
                    </div>
                  </div>

                  {/* Health & Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs opacity-80"><Activity className="w-4 h-4" /> Tình trạng sức khỏe & Lưu ý</div>
                    <div className={`p-6 rounded-3xl border shadow-sm ${selectedStudent.health ? "bg-red-50/50 border-red-100 text-red-700" : "bg-emerald-50/50 border-emerald-100 text-emerald-700"}`}>
                      {selectedStudent.health ? (
                        <p className="text-sm font-bold leading-relaxed">{selectedStudent.health}</p>
                      ) : (
                        <p className="text-sm font-bold opacity-70 italic">Học viên chưa báo cáo vấn đề sức khỏe đặc biệt.</p>
                      )}
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs opacity-80"><Target className="w-4 h-4" /> Mục tiêu tập luyện</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.goals.length > 0 ? selectedStudent.goals.map((g: string, i: number) => (
                        <Badge key={i} className="bg-indigo-50 text-indigo-600 border-indigo-100 py-2.5 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider">{g}</Badge>
                      )) : (
                        <p className="text-sm text-slate-300 italic">Chưa thiết lập mục tiêu.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="bg-white rounded-xl h-full border border-[var(--border)] flex flex-col items-center justify-center p-4 text-center min-h-[400px]">
                  <MessageSquare className="w-12 h-12 text-[var(--text-muted)] mb-4" />
                  <h3 className="text-base font-bold mb-2">Trao đổi với {selectedStudent.full_name}</h3>
                  <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-sm">Chuyển đến hộp thư để trực tiếp nhắn tin, gửi hướng dẫn bài tập hoặc động viên học viên này.</p>
                  <Link href={`/teacher/messages?user=${selectedStudent.id}`}>
                    <Button className="btn-primary">
                      Mở cuộc trò chuyện
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
            <div className="w-24 h-24 rounded-full bg-[var(--bg-muted)] flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-[var(--text-muted)]" />
            </div>
            <h2 className="text-base font-bold mb-2">Chọn một học viên</h2>
            <p className="text-[var(--text-secondary)]">Chọn học viên từ danh sách bên trái để xem phân tích AI và lịch sử tập luyện.</p>
          </div>
        )}
      </main>
    </div>
  );
}
