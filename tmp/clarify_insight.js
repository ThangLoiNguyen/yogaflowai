const fs = require('fs');
const path = require('path');

const filePath = 'd:/Workspace/yogaflow-ai/app/teacher/page.tsx';
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Explain AI Insights Feed
  const oldHeader = `<h3 className="text-2xl font-display">AI Insights Feed</h3>`;
  const newHeader = `<div className="flex flex-col gap-0.5">
               <h3 className="text-xl font-display">AI Insights Feed</h3>
               <p className="text-[10px] text-[var(--text-muted)] italic leading-tight">Phân tích phản hồi học viên và đề xuất điều chỉnh lớp học hoặc nhắn tin riêng.</p>
            </div>`;
  
  if (content.includes(oldHeader)) {
    content = content.replace(oldHeader, newHeader);
    // Remove the icon parent or shrink it
    content = content.replace(/<Sparkles className="w-5 h-5 text-indigo-500" \/>/g, `<Sparkles className="w-4 h-4 text-indigo-500 mt-1" />`);
    // Adjust top container gap
    content = content.replace(/<div className="flex items-center gap-2 px-2">/g, `<div className="flex items-start gap-2 px-2">`);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Clarified AI Insights Feed in ${filePath}`);
}
