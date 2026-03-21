const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'components/teacher-profile-form.tsx',
  'components/onboarding-form.tsx',
  'components/profile/teacher-edit-dialog.tsx',
  'components/profile/student-edit-dialog.tsx'
];

filesToUpdate.forEach(file => {
  const fullPath = path.join('d:/Workspace/yogaflow-ai', file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Shrink huge border radii
  content = content.replace(/rounded-\[2\.5rem\]/g, 'rounded-2xl');
  content = content.replace(/rounded-\[2rem\]/g, 'rounded-xl');
  content = content.replace(/rounded-\[1\.5rem\]/g, 'rounded-xl');
  content = content.replace(/rounded-\[1\.8rem\]/g, 'rounded-xl');
  content = content.replace(/rounded-3xl/g, 'rounded-2xl');

  // Shrink huge paddings
  content = content.replace(/p-10/g, 'p-6');
  content = content.replace(/p-12/g, 'p-8');
  content = content.replace(/py-12/g, 'py-6');
  content = content.replace(/pt-12 pb-12/g, 'py-6');
  content = content.replace(/gap-12/g, 'gap-8');
  content = content.replace(/space-y-12/g, 'space-y-8');
  content = content.replace(/mb-12/g, 'mb-8');
  
  content = content.replace(/h-16/g, 'h-11');
  content = content.replace(/w-24/g, 'w-20');
  content = content.replace(/h-24/g, 'h-20');
  content = content.replace(/w-20/g, 'w-16');
  content = content.replace(/h-20/g, 'h-16');

  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${file}`);
});
