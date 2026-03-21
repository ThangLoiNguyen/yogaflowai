const fs = require('fs');
const path = require('path');

const filePath = 'd:/Workspace/yogaflow-ai/app/teacher/profile/page.tsx';
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the return block start
  const returnStart = content.indexOf('return (');
  if (returnStart !== -1) {
    // We'll replace the entire return block header part
    // Up to line grid-cols-12
    const beforeHeader = content.substring(0, returnStart + 8);
    const gridStart = content.indexOf('<div className="grid lg:grid-cols-12 gap-6 items-start">');
    const afterHeader = content.substring(gridStart);

    const newReturnBody = `
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-xl font-display text-emerald-600 px-2">{fullName}</h1>
        <div className="flex gap-2">
           {isOwnProfile && (
             <div className="flex gap-2">
               <Link href="/teacher">
                 <Button variant="outline" className="h-9 px-4 rounded-full border-emerald-100 text-emerald-600 bg-emerald-50 text-xs shadow-sm">
                    Bảng điều khiển
                 </Button>
               </Link>
               <TeacherEditDialog />
             </div>
           )}
        </div>
      </div>

      `;

    fs.writeFileSync(filePath, beforeHeader + newReturnBody + afterHeader);
    console.log(`Fully reconstructed header in ${filePath}`);
  }
}
