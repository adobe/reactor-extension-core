# Core Extension for Adobe Experience Platform Tags

[![Build Status](https://img.shields.io/github/workflow/status/adobe/reactor-extension-core/ci?style=flat)](https://github.com/adobe/reactor-extension-core/actions)
[![Coverage Status](https://coveralls.io/repos/github/adobe/reactor-extension-core/badge.svg?branch=master)](https://coveralls.io/github/adobe/reactor-extension-core?branch=master)

This is the Core extension for [Adobe Experience Platform Tags](https://experienceleague.adobe.com/docs/experience-platform_en/tags/). It provides default event, condition, and data element types available to all Tags properties.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](.github/CONTRIBUTING.md) for more information about how our community works.

1. [Install node.js](https://nodejs.org/).
1. Clone this repository.
1. After navigating into the project directory, install project dependencies by running `npm ci`.

Several npm scripts have been provided for assisting in development. Each script can be run by navigating to the cloned repository directory in a terminal and executing `npm run scriptname` where `scriptname` is the name of the script you would like to run. The most useful scripts are as follows:

* `sandbox` Spins up a sandbox where extension views and library modules can be manually tested. See the [@adobe/reactor-sandbox README](https://github.com/Adobe-Marketing-Cloud/reactor-sandbox) for more information.
* `test` Runs unit tests against source files. Tests can be found in the `src` directory within files ending in `.test.js`.
* `test:watch` Same as `test`, but will re-run the tests as you change source files or test files.
* `lint` Analyzes code for potential errors.

Thank you for your interest in contributing!

## Internal Dependencies

This project depends on the @react/react-spectrum package which depends on the @react/collection-view package. Neither package is published to the public npm repository. In order to support their installation and use, they have been included in this project as tar files. Each file has been prepended with the following message regarding the license:

```js
/**
 * Use of this code is governed by the Adobe Terms of Use and
 * Adobe Developer Additional Terms, and the license attached
 * to this repo does not apply.
 */
```
