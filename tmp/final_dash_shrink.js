const fs = require('fs');
const path = require('path');

// 1. Shrink Teacher Dashboard more
const teacherPath = 'd:/Workspace/yogaflow-ai/app/teacher/page.tsx';
if (fs.existsSync(teacherPath)) {
  let content = fs.readFileSync(teacherPath, 'utf8');
  content = content.replace(/space-y-8/g, 'space-y-4');
  content = content.replace(/gap-12/g, 'gap-6');
  fs.writeFileSync(teacherPath, content);
}

// 2. Shrink Student Dashboard
const studentPath = 'd:/Workspace/yogaflow-ai/app/student/page.tsx';
if (fs.existsSync(studentPath)) {
  let content = fs.readFileSync(studentPath, 'utf8');
  content = content.replace(/space-y-12/g, 'space-y-4');
  content = content.replace(/p-5 rounded-\[var\(--r-lg\)\]/g, 'p-3 rounded-xl');
  content = content.replace(/p-10/g, 'p-4');
  content = content.replace(/mb-6/g, 'mb-2');
  content = content.replace(/mb-8/g, 'mb-3');
  content = content.replace(/mb-4/g, 'mb-2');
  content = content.replace(/text-2xl/g, 'text-xl');
  content = content.replace(/gap-12/g, 'gap-6');
  content = content.replace(/gap-10/g, 'gap-4');
  content = content.replace(/w-9 h-9/g, 'w-7 h-7');
  content = content.replace(/w-6 h-6/g, 'w-4 h-4');
  fs.writeFileSync(studentPath, content);
}

// 3. Fix Teacher Profile Page (Chunk failures)
const profilePath = 'd:/Workspace/yogaflow-ai/app/teacher/profile/page.tsx';
if (fs.existsSync(profilePath)) {
  let content = fs.readFileSync(profilePath, 'utf8');
  
  // Identities card
  content = content.replace(/p-10 rounded-\[var\(--r-xl\)\] bg-white border border-\[var\(--border\)\] shadow-sm space-y-8/g, 'p-5 rounded-2xl bg-white border border-[var(--border)] shadow-sm space-y-4');
  content = content.replace(/w-40 h-40/g, 'w-24 h-24');
  
  // Teacher Insight card
  content = content.replace(/p-10 rounded-\[var\(--r-xl\)\] bg-emerald-900/g, 'p-5 rounded-2xl bg-emerald-900');
  content = content.replace(/<span className="font-mono text-\[11px\] font-bold uppercase tracking-widest text-emerald-400">Teacher Insight<\/span>/g, '<div className="flex flex-col"><span className="font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-400">Phân tích AI</span><span className="text-[10px] text-emerald-400/60 transition-opacity">Báo cáo hiệu suất hàng tháng</span></div>');
  content = content.replace(/text-lg font-display italic leading-relaxed mb-8/g, 'text-sm font-display italic leading-relaxed mb-4');
  content = content.replace(/<Button variant="outline" className="w-full border-emerald-400\/30 text-emerald-400 hover:bg-emerald-400\/10 h-9 rounded-xl text-xs font-bold uppercase tracking-widest ring-0">Duyệt Báo Cáo Tháng<\/Button>/g, '<Link href="/teacher/ai-insights" className="block"><Button variant="outline" className="w-full border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10 h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest ring-0">Xem Báo Cáo Tháng</Button></Link>');

  fs.writeFileSync(profilePath, content);
}
