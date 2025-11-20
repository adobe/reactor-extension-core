import fs from 'fs';
import path from 'path';

const outputFile = './testIndex.generated.js';
const entriesDir = './.entries';
const helpers = {
  wrapper: './helpers/mockDelegateWrapper.js',
  injectGlobals: './helpers/rollup-plugin-inject-globals.js',
};

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, filelist);
    } else if (filepath.endsWith('.js') || filepath.endsWith('.jsx')) {
      filelist.push(filepath);
    }
  }
  return filelist;
}

const allDelegates = walk(entriesDir);

const imports = allDelegates
  .map((file, idx) => `import delegate${idx} from '${file.replace(/\\/g, '/')}';`)
  .join('\n');

const wrappedDelegates = allDelegates
  .map((_, idx) => `const wrapped${idx} = wrapDelegate(delegate${idx});`)
  .join('\n');

const exportLines = allDelegates
  .map((_, idx) => `wrapped${idx}`)
  .join(',\n  ');

const content = `
// Auto-generated. Do not edit.
import { wrapDelegate } from '${helpers.wrapper}';
import '${helpers.injectGlobals}';

${imports}

${wrappedDelegates}

export const delegates = [
  ${exportLines}
];
`;

fs.writeFileSync(outputFile, content);
console.log(`Generated ${outputFile} with ${allDelegates.length} delegates.`);
