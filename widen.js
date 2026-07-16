const fs = require('fs');
let content = fs.readFileSync('src/app/admin/dashboard/page.js', 'utf8');

// Replace max-w-5xl and max-w-6xl in the main content areas
content = content.replace(/max-w-5xl mx-auto/g, 'max-w-7xl mx-auto');
content = content.replace(/max-w-6xl mx-auto/g, 'max-w-7xl mx-auto');

fs.writeFileSync('src/app/admin/dashboard/page.js', content);
console.log('Widened the main content container');
