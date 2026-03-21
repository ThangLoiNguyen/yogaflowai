const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'components/teacher-profile-form.tsx',
  'components/onboarding-form.tsx'
];

filesToUpdate.forEach(file => {
  const fullPath = path.join('d:/Workspace/yogaflow-ai', file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Aggressive Shinking
  content = content.replace(/h-10/g, 'h-7');
  content = content.replace(/h-9/g, 'h-7');
  content = content.replace(/h-8/g, 'h-7');
  content = content.replace(/px-6/g, 'px-3');
  content = content.replace(/px-5/g, 'px-3');
  content = content.replace(/text-sm/g, 'text-xs');
  content = content.replace(/text-lg/g, 'text-sm');
  content = content.replace(/text-\[10px\]/g, 'text-[9px]');
  content = content.replace(/gap-8/g, 'gap-3');
  content = content.replace(/gap-4/g, 'gap-2');
  content = content.replace(/space-y-6/g, 'space-y-2');
  content = content.replace(/space-y-4/g, 'space-y-2');
  content = content.replace(/space-y-3/g, 'space-y-1');
  content = content.replace(/rounded-2xl/g, 'rounded-lg');
  content = content.replace(/rounded-xl/g, 'rounded-md');
  
  // Specific to avatar
  content = content.replace(/w-16 h-16/g, 'w-12 h-12');
  content = content.replace(/w-8 h-8/g, 'w-6 h-6');

  fs.writeFileSync(fullPath, content);
  console.log(`Extreme shrink of ${file}`);
});
