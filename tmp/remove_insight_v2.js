const fs = require('fs');
const path = require('path');

const filePath = 'd:/Workspace/yogaflow-ai/app/teacher/profile/page.tsx';
if (fs.existsSync(filePath)) {
  let lines = fs.readFileSync(filePath, 'utf8').split('\n');
  
  // Find the lines with bg-emerald-900 (Teacher Insight)
  const startIndex = lines.findIndex(l => l.includes('bg-emerald-900'));
  if (startIndex !== -1) {
    // It's a div, find its close tag (roughly)
    let endIndex = -1;
    let openBrackets = 0;
    for (let i = startIndex; i < lines.length; i++) {
        if (lines[i].includes('<div')) openBrackets++;
        if (lines[i].includes('</div')) openBrackets--;
        if (openBrackets <= 0 && i > startIndex) {
            endIndex = i;
            break;
        }
    }
    if (endIndex !== -1) {
      lines.splice(startIndex, endIndex - startIndex + 1);
    }
  }

  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`Removed Insight card from ${filePath}`);
}
