const fs = require('fs');
const path = require('path');

const files = [
  'app/teacher/page.tsx', 
  'app/student/page.tsx', 
  'app/teacher/profile/page.tsx'
];

files.forEach(file => {
  const p = path.join('d:/Workspace/yogaflow-ai', file);
  if (!fs.existsSync(p)) return;
  let s = fs.readFileSync(p, 'utf8');

  // Shrink fonts
  s = s.replace(/text-2xl/g, 'text-lg');
  s = s.replace(/text-3xl/g, 'text-xl');
  s = s.replace(/stats-value text-xl/g, 'stats-value text-lg');
  
  // Shrink icons
  s = s.replace(/w-9 h-9/g, 'w-7 h-7');
  s = s.replace(/w-6 h-6/g, 'w-4 h-4');
  s = s.replace(/w-10 h-10/g, 'w-8 h-8');
  
  // Shrink cards
  s = s.replace(/p-5/g, 'p-3');
  s = s.replace(/p-4/g, 'p-3');
  s = s.replace(/mb-4/g, 'mb-2');
  s = s.replace(/mb-6/g, 'mb-2');
  s = s.replace(/mb-8/g, 'mb-2');
  s = s.replace(/gap-4/g, 'gap-2');
  s = s.replace(/gap-6/g, 'gap-3');
  s = s.replace(/gap-12/g, 'gap-6');
  
  // Specific to profile header GV.
  if (file === 'app/teacher/profile/page.tsx') {
    s = s.replace(/GV\. <span className="italic text-emerald-600">\{fullName\.split\(" "\)\.pop\(\)\}<\/span>/g, '<span className="text-emerald-600">{fullName}</span>');
  }

  fs.writeFileSync(p, s);
  console.log(`Deeply shrunk ${file}`);
});
