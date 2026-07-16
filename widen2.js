const fs = require('fs');
let content = fs.readFileSync('src/app/admin/dashboard/page.js', 'utf8');

content = content.replace(/max-w-7xl/g, 'max-w-[1400px]');

fs.writeFileSync('src/app/admin/dashboard/page.js', content);
console.log('Set to max-w-[1400px]');
