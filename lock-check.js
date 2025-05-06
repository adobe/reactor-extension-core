/*
 * https://git.corp.adobe.com/gist/luyau/5033d7b6fb95deb94be24c623e0b1118
 * This script will report packages under the react-spectrum (v3) umbrella which have multiple versions in a project repo
 * by looking at either the package-lock.json or yarn.lock file. Any packages that are reported by this script should be 
 * fixed to only have 1 imported version so that react-spectrum works correctly in the project repo.
 *
 * To run this script, temporarily copy it to the root directory of your project and run with node:
 * `node lockCheck.cjs`
 *
 * Please feel free to report any errors/issues.
 */
let {existsSync, promises} = require('fs');

// reg exps for yarn.lock entries
const rePackage = new RegExp(/^(?:"?(@?[^\s@]+)@(npm:)?([^,"]+)[",:]+\s*)+$/);
const reVersion = new RegExp(/^\s+version:? "?([^"]+)"?\s*$/);

const patterns = [
  // packages
  '@adobe/react-spectrum',
  'react-stately',
  'react-aria',
  'react-aria-components',

  // scopes
  '@internationalized/',
  '@react-aria/',
  '@react-spectrum/',
  '@react-stately/',
  '@react-types/',
  '@spectrum-icons/',
];

const versions = {};
function addVersion(pkg, version) {
  if (!versions[pkg]) {
    versions[pkg] = new Set();
  }
  versions[pkg].add(version);
}

function patternMatch(str) {
  return patterns.some(pattern => {
    if (pattern.endsWith('/')) {
      return str.startsWith(pattern);
    }
    return str === pattern;
  });
}

function printConflicts(file) {
  const title = `| ${file.toUpperCase()} REPORT |`;
  console.log('-'.repeat(title.length));
  console.log(title);
  console.log('-'.repeat(title.length));
  let maxPkgLen = 0;
  Object.entries(versions).forEach(([pkg, versions]) => {
  
    if (versions.size > 1 && pkg.length > maxPkgLen) {
      maxPkgLen = pkg.length;
    }

  });
  Object.keys(versions).sort().forEach(pkg => {
    const pkgVersions = versions[pkg];
    if (pkgVersions.size > 1) {
      const label = `${pkg} (${pkgVersions.size})`;
      console.log(`${label.padEnd(maxPkgLen + 5)} - ${Array.from(pkgVersions).sort().join(', ')}`)
    }
  });
}

const testedLockfileVersions = new Set([2, 3]);
async function checkPackageLock() {
  const jsonFileContents = await promises.readFile('./package-lock.json', 'binary');
  const jsonFile = JSON.parse(jsonFileContents);

  if (!testedLockfileVersions.has(jsonFile.lockfileVersion)) {
    console.warn(`WARNING: This script has not been tested with your current lockfile version (${jsonFile.lockfileVersion}), so results may not be accurate.`);
  }

  // lockfile version 3
  Object.entries(jsonFile.packages ?? {}).forEach(([pkgPath, details]) => {
    const parts = pkgPath.split('node_modules/');
    if (!parts.length) {
      return;
    }
    const pkg = parts[parts.length - 1];
    if (patternMatch(pkg)) {
      addVersion(pkg, details.version);
    }
  });

  // lockfile version 2
  Object.entries(jsonFile.dependencies ?? {}).forEach(([pkg, details]) => {
    if (patternMatch(pkg)) {
      addVersion(pkg, details.version);
    }

    // check package deps
    Object.entries(details.dependencies ?? {}).forEach(([depPkg, depPkgDetails]) => {
      if (patternMatch(depPkg)) {
        addVersion(depPkg, depPkgDetails.version);
      }
    });
  });

  printConflicts('package.lock');
}

async function checkYarnLock() {
  const fileContents = await promises.readFile('./yarn.lock', 'binary');

  const lines = fileContents.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let matches = line.match(rePackage);
    if (matches) {
      const nextLine = lines[++i];
      const versionMatches = nextLine.match(reVersion);
      if (patternMatch(matches[1])) {
        addVersion(matches[1], versionMatches[1]);
      }
    }
  }

  printConflicts('yarn.lock');
}

(async function main() {
  if (existsSync('./package-lock.json')) {
    await checkPackageLock();
  }
  if (existsSync('./yarn.lock')) {
    await checkYarnLock();
  }
})();
