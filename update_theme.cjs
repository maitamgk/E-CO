const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/bg-\[#fdfaf5\]/g, 'bg-background');
      content = content.replace(/text-\[#1e332a\]/g, 'text-foreground');
      content = content.replace(/border-\[#1e332a\]/g, 'border-border');
      
      content = content.replace(/bg-\[#1e332a\]/g, 'bg-primary');
      content = content.replace(/text-\[#fdfaf5\]/g, 'text-primary-foreground');
      content = content.replace(/border-\[#fdfaf5\]/g, 'border-primary-foreground');
      
      content = content.replace(/hover:bg-\[#1e332a\]/g, 'hover:bg-primary');
      content = content.replace(/hover:text-\[#fdfaf5\]/g, 'hover:text-primary-foreground');
      content = content.replace(/hover:bg-\[#fdfaf5\]/g, 'hover:bg-background');
      content = content.replace(/hover:text-\[#1e332a\]/g, 'hover:text-foreground');
      
      content = content.replace(/border-\[#2d4a3e\]/g, 'border-secondary');
      content = content.replace(/bg-\[#2d4a3e\]/g, 'bg-secondary');

      // We intentionally do not replace bg-white globally to avoid ruining image overlays.
      // But we replace it in standard boxy structures where it's paired with border-[#1e332a]
      // Wait, let's just leave bg-white alone. Tailwind's dark:bg-card can be added manually.
      // Actually, bg-white dark:bg-card is safe. Let's replace bg-white with bg-card
      // But only if it's not text-white.
      // And in Home.tsx hero it uses text-white, which is fine.
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('./src/pages');
processDir('./src/components');
console.log('Theme replacements done!');
