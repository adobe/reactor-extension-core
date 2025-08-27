import { fileURLToPath } from 'url';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import html from '@rollup/plugin-html';
import styles from 'rollup-plugin-styles';
import fs from 'fs';
import extension from './extension.json' assert { type: 'json' };
import camelCase from 'camelcase';
import capitalize from 'capitalize';
import createEntryFile from './createEntryFile.js';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getEntries() {
  const entries = {};
  ['event', 'condition', 'action', 'dataElement', 'configuration'].forEach(
    (type) => {
      const typePluralized = type + 's';
      const delegates =
        type === 'configuration'
          ? [extension['configuration']]
          : extension[typePluralized];
      delegates.forEach((itemDescriptor) => {
        let itemNameCapitalized;
        let chunkName;
        if (itemDescriptor && itemDescriptor.viewPath) {
          if (type === 'configuration') {
            itemNameCapitalized = 'Configuration';
            chunkName = 'configuration/configuration';
          } else {
            const itemName = itemDescriptor.name;
            const itemNameCamelized = camelCase(itemName);
            itemNameCapitalized = capitalize(itemNameCamelized);
            chunkName = `${typePluralized}/${itemNameCamelized}`;
          }
          const entryPath = `./.entries/${chunkName}.js`;
          createEntryFile(entryPath, itemNameCapitalized, chunkName);
          entries[chunkName] = entryPath;
        }
      });
    }
  );
  return entries;
}

const entries = getEntries();

function htmlTemplate({ attributes, files, meta, publicPath, title }) {
  let template = fs.readFileSync('src/view/template.html', 'utf8');
  // Inject CDN scripts for externals
  const cdnScripts = [
    '<script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>',
    '<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>',
    // Add CDN links for react-spectrum if available, otherwise use local or custom CDN
    // Example:
    // '<script src="https://unpkg.com/@adobe/react-spectrum/dist/react-spectrum.min.js"></script>',
    // '<script src="https://unpkg.com/@react/collection-view/dist/collection-view.min.js"></script>',
    // '<script src="https://unpkg.com/@react/react-spectrum/dist/react-spectrum.min.js"></script>'
  ].join('\n');
  // Inject JS and CSS files
  const scripts = (files.js || [])
    .map(({ fileName }) => `<script src="${publicPath}${fileName}"></script>`)
    .join('\n');
  const stylesheets = (files.css || [])
    .map(({ fileName }) => `<link rel="stylesheet" href="${publicPath}${fileName}" />`)
    .join('\n');
  template = template.replace(/<title>.*<\/title>/, `<title>${title}</title>`);
  // Inject CDN scripts and stylesheets before </head>
  template = template.replace('</head>', `${cdnScripts}\n${stylesheets}\n</head>`);
  // Inject scripts before </body>
  template = template.replace('</body>', `${scripts}\n</body>`);
  return template;
}

const sharedPlugins = [
  nodeResolve({ extensions: ['.js', '.jsx', '.json'] }),
  json(),
  commonjs(),
  styles({
    mode: ['extract', null],
    include: ['**/*.css', '**/*.styl'],
    url: false
  }),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    presets: [
      ['@babel/preset-env', {
        targets: '> 1%, last 2 versions, not dead'
      }],
      '@babel/preset-react'
    ]
  }),
  replace({
    preventAssignment: true,
    'process.env.SCALE_MEDIUM': 'true',
    'process.env.SCALE_LARGE': 'false',
    'process.env.THEME_LIGHT': 'false',
    'process.env.THEME_LIGHTEST': 'true',
    'process.env.THEME_DARK': 'false',
    'process.env.THEME_DARKEST': 'false',
    'process.browser': 'true'
  }),
  copy({
    targets: [
      { src: 'resources/**/*', dest: 'dist/resources' }
    ],
    hook: 'writeBundle'
  })
];

const externals = [
  'react',
  'react-dom',
  '@adobe/react-spectrum',
  '@react/collection-view',
  '@react/react-spectrum'
];

export default Object.keys(entries).map((name) => ({
  input: entries[name],
  output: {
    file: path.resolve('dist', `${name}.js`),
    format: 'iife',
    sourcemap: true,
    name: name.replace(/\//g, '_'),
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      '@adobe/react-spectrum': 'reactSpectrum',
      '@react/collection-view': 'CollectionView',
      '@react/react-spectrum': 'ReactSpectrum'
    }
  },
  external: externals,
  plugins: [
    ...sharedPlugins,
    html({
      fileName: `${name}.html`,
      title: name,
      template: htmlTemplate
    })
  ],
  onwarn(warning, warn) {
    if (warning.code === 'ERROR') throw new Error(warning.message);
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  }
}));
