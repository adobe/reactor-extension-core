# @adobe/reactor-extension-core

This is the Core extension for [Adobe Experience Platform Launch](https://www.adobe.com/experience-platform/launch.html). It provides default event, condition, and data element types available to all Launch properties.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information about how our community works.

1. Install [node.js](https://nodejs.org/).
1. Clone this repository.
1. After navigating into the project directory, install project dependencies by running `npm install`.

Several npm scripts have been provided for assisting in development. Each script can be run by navigating to the cloned repository directory in a terminal and executing `npm run scriptname` where `scriptname` is the name of the script you would like to run. The most useful scripts are as follows:

* `sandbox` Spins up a sandbox where extension views and library modules can be manually tested. See the [@adobe/reactor-sandbox README](https://github.com/Adobe-Marketing-Cloud/reactor-sandbox) for more information.
* `test` Runs unit tests against source files. Tests can be found in the `src` directory within files ending in `.test.js`.
* `test:watch` Same as `test`, but will re-run the tests as you change source files or test files.
* `lint` Analyzes code for potential errors.

Thank you for your interest in contributing!
