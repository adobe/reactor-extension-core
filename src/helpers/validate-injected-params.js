/***************************************************************************************
 * (c) 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

// reads the function signature and sees if a caller doesn't pass enough parameters
export default function validateInjectedParams(fn) {
  if (REACTOR_KARMA_CI_UNIT_TEST_MODE) {
    /* START.TESTS_ONLY */
    return function proxyValidateArgs(args = {}) {
      const missing = [];

      // Call fn with Proxy to detect what props it tries to access
      const proxy = new Proxy(args, {
        get(target, prop) {
          if (!(prop in target)) {
            missing.push(prop);
          }
          return target[prop];
        }
      });

      fn(proxy);

      if (missing.length > 0) {
        throw new Error(
          `${fn.name}: Missing required argument(s): ${missing.join(', ')}`
        );
      }

      // All required keys accessed successfully — call with original args
      return fn(args);
    };
    /* END.TESTS_ONLY */
  } else {
    // in production builds we have run all our tests and trust that the files
    // whose default export functions use an inject pattern contain the appropriate
    // production-ready require statements to make the module run.
    return fn;
  }
}
