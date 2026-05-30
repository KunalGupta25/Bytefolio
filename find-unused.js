const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');
const components = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx')).map(f => f.replace('.tsx', ''));

const unused = [];

for (const comp of components) {
  try {
    // Search for imports of this component in the src directory
    // Example: from "@/components/ui/button" or from './ui/button'
    const cmd = `git grep -l "components/ui/${comp}" src/`;
    execSync(cmd, { stdio: 'ignore' });
  } catch (e) {
    // If git grep exits with 1, it means no matches found.
    unused.push(comp);
  }
}

console.log("Unused components:", unused.join(', '));
