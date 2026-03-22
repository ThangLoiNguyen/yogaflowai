const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, 'components/video/TeacherLiveRoom.tsx'),
  path.join(__dirname, 'components/video/LiveRoom.tsx')
];

const replacements = [
  // Backgrounds
  { regex: /bg-\[#0a0a0f\]/g, replace: 'bg-slate-50' },
  { regex: /bg-\[#09090b\]/g, replace: 'bg-slate-50' },
  { regex: /bg-\[#0d0d1a\]/g, replace: 'bg-slate-50' },
  { regex: /bg-\[#11111a\]/g, replace: 'bg-slate-200' },
  { regex: /bg-\[#111827\]/g, replace: 'bg-slate-200' },
  { regex: /bg-\[#16161e\]/g, replace: 'bg-slate-200' },
  { regex: /bg-\[#18181b\]/g, replace: 'bg-slate-200' },
  { regex: /bg-\[#161b22\]/g, replace: 'bg-white' },
  { regex: /bg-\[#0d1117\]\/50/g, replace: 'bg-slate-50' },
  { regex: /bg-slate-900\/80/g, replace: 'bg-slate-200' },
  { regex: /bg-slate-900\/95/g, replace: 'bg-slate-100' },
  { regex: /bg-slate-900/g, replace: 'bg-slate-200' },
  { regex: /bg-black\/40/g, replace: 'bg-slate-800/40' },
  { regex: /bg-black\/50/g, replace: 'bg-slate-100/80' },
  { regex: /bg-black\/60/g, replace: 'bg-slate-100/90' },
  { regex: /bg-white\/\[0\.03\]/g, replace: 'bg-white border border-slate-200 shadow-sm' },
  
  // Custom button bg
  { regex: /bg-white\/5(?!0)/g, replace: 'bg-white border-slate-200' },
  { regex: /bg-white\/10/g, replace: 'bg-white border-slate-200 shadow-sm text-slate-700' },
  { regex: /hover:bg-white\/10/g, replace: 'hover:bg-slate-100' },
  { regex: /hover:bg-white\/15/g, replace: 'hover:bg-slate-100' },
  { regex: /hover:bg-white\/20/g, replace: 'hover:bg-slate-100' },
  { regex: /bg-[#0d1117]\/50/g, replace: 'bg-slate-50' },

  // Text colors
  { regex: /text-white\/90/g, replace: 'text-slate-800' },
  { regex: /text-white\/80/g, replace: 'text-slate-700' },
  { regex: /text-white\/70/g, replace: 'text-slate-600' },
  { regex: /text-white\/60/g, replace: 'text-slate-500' },
  { regex: /text-white\/50/g, replace: 'text-slate-500' },
  { regex: /text-white\/40/g, replace: 'text-slate-500' },
  { regex: /text-white\/30/g, replace: 'text-slate-400' },
  { regex: /text-white\/20/g, replace: 'text-slate-300' },
  { regex: /text-white(?![\/\-\w])/g, replace: 'text-slate-900' },
  
  // Border colors
  { regex: /border-white\/5/g, replace: 'border-slate-200' },
  { regex: /border-white\/10/g, replace: 'border-slate-300' },
  { regex: /border-white\/15/g, replace: 'border-slate-300' },

  // Shadows
  { regex: /shadow-black\/60/g, replace: 'shadow-slate-200/60' },

  // Specific components overrides
  { regex: /text-\[10px\] font-bold text-slate-500/g, replace: 'text-[10px] font-bold text-slate-400' },
  { regex: /placeholder:text-white\/30/g, replace: 'placeholder:text-slate-400' }
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix issue "bị đẩy phần tử xuống" on mobile by floating the sidebar
    // TeacherLiveRoom.tsx sidebar:
    content = content.replace(
      /className=\{\`flex flex-shrink-0 overflow-auto lk-custom-sidebar transition-all duration-300\s+flex-row w-full h-\[90px\](.*?)\`\}/g,
      'className={`flex sm:flex-shrink-0 overflow-auto lk-custom-sidebar transition-all duration-300\n            absolute bottom-[80px] left-0 right-0 z-[50] flex-row w-full h-[90px] px-2 sm:px-0 \n            sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:z-auto sm:h-auto sm:w-auto\n            ${isChatOpen ? "sm:w-[120px] lg:w-[150px]" : "sm:w-[160px] lg:w-[220px]"} \n            sm:flex-col gap-2 sm:gap-3 sm:pb-4 sm:pr-1`}'
    );

    replacements.forEach(r => {
      content = content.replace(r.regex, r.replace);
    });

    // Manual fixes for things that regex might break:
    // Make sure leave button and text colors in red/emerald buttons are still white
    content = content.replace(/bg-red-500 text-slate-900/g, 'bg-red-500 text-white');
    content = content.replace(/bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 flex items-center justify-center text-slate-900/g, 'bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 flex items-center justify-center text-white');
    content = content.replace(/bg-emerald-600 hover:bg-emerald-500 active:scale-\[0.98\] text-slate-900/g, 'bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white');
    
    // Nút "Đang bật camera" text colors in lobby
    content = content.replace(/border-slate-300 text-slate-900/g, 'border-slate-300 text-slate-700 bg-white');

    // Sidebar text size
    content = content.replace(/text-gray-500/g, 'text-slate-500');

    // Restore text-white for buttons where it was intended
    content = content.replace(/bg-red-500(.*?)text-slate-900/g, 'bg-red-500$1text-white');
    content = content.replace(/bg-emerald-500\/90 text-slate-900/g, 'bg-emerald-500/90 text-white');
    content = content.replace(/bg-emerald-500 text-black/g, 'bg-emerald-500 text-white');

    // In Modal
    content = content.replace(/text-xl font-bold text-slate-900/g, 'text-xl font-bold text-slate-900');
    content = content.replace(/text-slate-500 text-sm mb-6/g, 'text-slate-600 text-sm mb-6');

    // In Chat Panel (which gets border-slate-200)
    // Make sure chat headers are fine

    // Update Glassmorphism overlay for Name Badge
    content = content.replace(/rgba\(15, 23, 42, 0.45\)/g, 'rgba(255, 255, 255, 0.6)');
    content = content.replace(/color: white !important;/g, 'color: #0f172a !important;');
    
    fs.writeFileSync(file, content);
    console.log('Processed', file);
  }
});
