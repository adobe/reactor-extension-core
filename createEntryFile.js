const fs = require('fs-extra');

module.exports = function(outputPath, componentName, viewFileName) {
  fs.outputFileSync(outputPath,
`import renderView from '../../src/view/renderView';
import ${componentName}, { formConfig } from '../../src/view/${viewFileName}';

export default renderView(${componentName}, formConfig);`
  );
};
