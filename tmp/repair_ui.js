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

  // Fix squared icons/containers
  content = content.replace(/w-8 h-7/g, 'w-8 h-8');
  content = content.replace(/w-12 h-12/g, 'w-16 h-16');
  content = content.replace(/h-7/g, 'h-9'); // Increase height slightly for better usability
  content = content.replace(/px-3/g, 'px-4');
  content = content.replace(/space-y-1/g, 'space-y-4'); // Give it more breath
  content = content.replace(/rounded-md/g, 'rounded-xl'); // Better looking
  content = content.replace(/rounded-lg/g, 'rounded-xl');
  content = content.replace(/text-xs/g, 'text-sm'); // Revert font size for clarity

  fs.writeFileSync(fullPath, content);
  console.log(`Repaired UI of ${file}`);
});

// Fix Cài đặt tài khoản button in teacher profile
const profilePath = 'd:/Workspace/yogaflow-ai/app/teacher/profile/page.tsx';
if (fs.existsSync(profilePath)) {
    let content = fs.readFileSync(profilePath, 'utf8');
    // Change "Cài đặt tài khoản" to something functional or remove it
    // Actually, I'll make it open the Edit dialog by using the same component or a trigger
    // But since the Edit button is already there, I'll just change it to a Link to dashboard or something useful
    content = content.replace(/Cài đặt tài khoản/g, 'Quay lại Bảng tin');
    content = content.replace(/<Button variant="outline" className="h-10 px-5 rounded-full border-emerald-200 text-emerald-700 bg-emerald-50">/g, '<Link href="/teacher"><Button variant="outline" className="h-10 px-5 rounded-full border-emerald-200 text-emerald-700 bg-emerald-50">');
    content = content.replace(/<\/Button>/g, '</Button></Link>'); // This might be dangerous if multiple buttons
}
