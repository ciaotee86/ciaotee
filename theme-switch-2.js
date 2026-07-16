const fs = require('fs');
let content = fs.readFileSync('src/app/admin/dashboard/page.js', 'utf8');

// We want to replace text-white with text-[#111318]
// BUT we should NOT replace it if it's inside a button/element with bg-[#3867FF] or bg-[#5B8CFF] or bg-[#FF5D68]

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Exclude buttons with dark backgrounds that need white text
  if (line.includes('bg-[#3867FF]') || line.includes('bg-[#5B8CFF]') || line.includes('bg-[#FF5D68]')) {
    continue;
  }
  
  // Otherwise, replace text-white with text-[#111318]
  lines[i] = line.replace(/text-white/g, 'text-[#111318]');
}

content = lines.join('\n');
fs.writeFileSync('src/app/admin/dashboard/page.js', content);
console.log('Fixed text colors');
