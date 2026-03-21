const fs = require('fs');
const path = require('path');

const files = [
  'app/teacher/page.tsx', 
  'app/student/page.tsx', 
  'app/teacher/profile/page.tsx',
  'app/teacher/ai-insights/page.tsx'
];

files.forEach(file => {
  const p = path.join('d:/Workspace/yogaflow-ai', file);
  if (!fs.existsSync(p)) return;
  let s = fs.readFileSync(p, 'utf8');

  // Hero cases
  s = s.replace(/p-10/g, 'p-4');
  s = s.replace(/py-16/g, 'py-8');
  s = s.replace(/py-20/g, 'py-8');
  s = s.replace(/rounded-\[var\(--r-xl\)\]/g, 'rounded-xl');
  s = s.replace(/rounded-\[var\(--r-lg\)\]/g, 'rounded-lg');
  s = s.replace(/space-y-12/g, 'space-y-4');
  s = s.replace(/space-y-10/g, 'space-y-3');
  s = s.replace(/space-y-8/g, 'space-y-2');
  s = s.replace(/space-y-6/g, 'space-y-2');
  
  // Font sizes for headings
  s = s.replace(/text-xl/g, 'text-base');
  s = s.replace(/text-lg/g, 'text-sm');
  s = s.replace(/text-2xl/g, 'text-base');

  fs.writeFileSync(p, s);
  console.log(`Final polish of ${file}`);
});
