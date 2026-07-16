const fs = require('fs');
let content = fs.readFileSync('src/app/admin/dashboard/page.js', 'utf8');

const replacements = {
  '#050816': '#F5F2EA',
  '#070B18': '#EBE6DA',
  '#0B1120': '#FFFFFF',
  '#10182B': '#F0EBE0',
  '#202B43': '#D6D1C4',
  '#F4F7FC': '#111318',
  '#9AA8C2': '#4A505C',
  '#64718A': '#828A9A'
};

for (const [dark, light] of Object.entries(replacements)) {
  content = content.split(dark).join(light);
}

fs.writeFileSync('src/app/admin/dashboard/page.js', content);
console.log('Replaced colors successfully');
