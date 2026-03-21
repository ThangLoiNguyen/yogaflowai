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

  // Compact spacing
  content = content.replace(/space-y-12/g, 'space-y-4');
  content = content.replace(/space-y-8/g, 'space-y-3');
  content = content.replace(/space-y-6/g, 'space-y-2');
  content = content.replace(/gap-12/g, 'gap-4');
  content = content.replace(/gap-8/g, 'gap-4');
  content = content.replace(/mb-8/g, 'mb-4');
  content = content.replace(/p-10/g, 'p-4');
  content = content.replace(/p-5/g, 'p-3');
  content = content.replace(/pt-4/g, 'pt-0');
  
  // Icon sizes
  content = content.replace(/w-10/g, 'w-8');
  content = content.replace(/h-10/g, 'h-8');
  content = content.replace(/w-5/g, 'w-4');
  content = content.replace(/h-5/g, 'h-4');

  fs.writeFileSync(fullPath, content);
  console.log(`Deep update of ${file}`);
});
