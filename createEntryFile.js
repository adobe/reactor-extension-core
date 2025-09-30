import fs from 'fs-extra';

export default function createEntryFile(
  outputPath,
  componentName,
  viewFileName
) {
  fs.outputFileSync(
    outputPath,
    `import renderView from '../../src/view/renderView';
import ${componentName}, { formConfig } from '../../src/view/${viewFileName}';

export default renderView(${componentName}, formConfig);`
  );
}
