const fs = require('fs');
const path = require('path');

const directories = ['app', 'components'];

const replacements = [
  { regex: /\bh-14\b/g, replacement: 'h-10' },
  { regex: /\bh-12\b/g, replacement: 'h-9' },
  { regex: /\bw-14\b/g, replacement: 'w-10' },
  { regex: /\bw-12\b/g, replacement: 'w-9' },
  { regex: /\bpx-8\b/g, replacement: 'px-5' },
  { regex: /\bpy-6\b/g, replacement: 'py-4' },
  { regex: /\bp-8\b/g, replacement: 'p-5' },
  { regex: /\bp-6\b/g, replacement: 'p-4' },
  { regex: /\btext-4xl\b/g, replacement: 'text-2xl' },
  { regex: /\btext-3xl\b/g, replacement: 'text-xl' },
  { regex: /\bgap-8\b/g, replacement: 'gap-5' },
  { regex: /\bgap-6\b/g, replacement: 'gap-4' },
  { regex: /\btext-5xl\b/g, replacement: 'text-3xl' },
  { regex: /\bpx-10\b/g, replacement: 'px-6' },
  { regex: /\bpx-12\b/g, replacement: 'px-6' }
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      for (const rule of replacements) {
        content = content.replace(rule.regex, rule.replacement);
      }

      if (content !== original) {
        // preserve original line endings if possible, but writeFileSync is fine
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

for (const dir of directories) {
  processDirectory(path.resolve(__dirname, '../', dir));
}
console.log('Done compacting UI!');
