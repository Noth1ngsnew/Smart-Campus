const fs = require('fs');
const path = require('path');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

let total = 0;
for (const f of walk('src').filter((f) => /\.(ts|tsx)$/.test(f))) {
  const n = fs.readFileSync(f, 'utf8').split(/\r?\n/).length;
  total += n;
  console.log(String(n).padStart(5), f);
}
console.log(String(total).padStart(5), 'TOTAL');