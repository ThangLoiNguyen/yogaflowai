const fs = require('fs');
const path = require('path');

const filePath = 'd:/Workspace/yogaflow-ai/app/teacher/page.tsx';
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Shrink Stats
  content = content.replace(/p-5 rounded-\[var\(--r-lg\)\]/g, 'p-4 rounded-xl');
  content = content.replace(/mb-6/g, 'mb-2');
  
  // Shrink Logic Cards
  content = content.replace(/p-4 bg-white border border-\[var\(--border\)\] rounded-\[var\(--r-lg\)\]/g, 'p-3 bg-white border border-[var(--border)] rounded-xl');
  content = content.replace(/mb-4/g, 'mb-2');
  content = content.replace(/mb-6/g, 'mb-2'); // already replaced once, be careful
  
  // Shrink Avatar in insights
  content = content.replace(/w-10 h-10 rounded-full bg-slate-100/g, 'w-8 h-8 rounded-full bg-slate-100');
  
  // Shrink headings
  content = content.replace(/text-2xl/g, 'text-xl');

  fs.writeFileSync(filePath, content);
  console.log(`Shrunk dashboard cards in ${filePath}`);
}
