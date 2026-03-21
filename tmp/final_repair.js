const fs = require('fs');
const path = require('path');

// 1. Repair Profile Update Logic & UI
const formPath = 'd:/Workspace/yogaflow-ai/components/teacher-profile-form.tsx';
if (fs.existsSync(formPath)) {
  let content = fs.readFileSync(formPath, 'utf8');

  // Fix save logic: Ensure success is visible and reload happens
  content = content.replace(/router\.refresh\(\);/g, 'router.refresh(); setTimeout(() => window.location.reload(), 1000);');
  
  // Fix UI spacing (reverting some extreme shrinks)
  content = content.replace(/h-7/g, 'h-9');
  content = content.replace(/space-y-1/g, 'space-y-4');
  content = content.replace(/gap-2/g, 'gap-4');
  content = content.replace(/text-xs/g, 'text-sm');
  content = content.replace(/text-\[9px\]/g, 'text-xs');
  content = content.replace(/w-8 h-8/g, 'w-9 h-9');
  
  // Ensure "Update Avatar" looks good
  content = content.replace(/p-3/g, 'p-4');
  
  fs.writeFileSync(formPath, content);
}

// 2. Fix Teacher Profile Header Non-functional button
const profilePath = 'd:/Workspace/yogaflow-ai/app/teacher/profile/page.tsx';
if (fs.existsSync(profilePath)) {
  let content = fs.readFileSync(profilePath, 'utf8');

  // Replace non-functional "Cài đặt tài khoản" with a link back to dashboard
  const oldBtnBlock = `<Button variant="outline" className="h-10 px-5 rounded-full border-emerald-200 text-emerald-700 bg-emerald-50">
                   Cài đặt tài khoản
                </Button>`;
  const newBtnBlock = `<Link href="/teacher">
                 <Button variant="outline" className="h-10 px-5 rounded-full border-emerald-200 text-emerald-700 bg-emerald-50">
                    Bảng điều khiển
                 </Button>
               </Link>`;
  
  if (content.includes(oldBtnBlock)) {
      content = content.replace(oldBtnBlock, newBtnBlock);
  } else {
      // Fallback fallback
      content = content.replace(/Cài đặt tài khoản/g, 'Bảng điều khiển');
  }

  fs.writeFileSync(profilePath, content);
}
