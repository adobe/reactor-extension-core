/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import visitorTracking from '../helpers/visitorTracking';
import textMatch from '../helpers/textMatch';

function createLandingPageCondition({ visitorTracking, textMatch }) {
  return function (settings) {
    // empty strings aren't allowed because a landing page value is required in the UI.
    var storedLandingPage = visitorTracking.getLandingPage();
    if (!storedLandingPage) {
      return false;
    }

    var landingPageValues;
    if (!Array.isArray(settings.landingPages)) {
      // legacy support
      landingPageValues = [
        {
          value: settings.page,
          pageIsRegex: Boolean(settings.pageIsRegex)
        }
      ];
    } else {
      landingPageValues = settings.landingPages;
    }

    return landingPageValues.some(function (acceptablePageValue) {
      var acceptableValue = acceptablePageValue.pageIsRegex
        ? new RegExp(acceptablePageValue.value, 'i')
        : acceptablePageValue.value;
      return textMatch(storedLandingPage, acceptableValue);
    });
  };
}

const defaultLandingPageCondition = createLandingPageCondition({
  visitorTracking,
  textMatch
});

export default defaultLandingPageCondition;
export { createLandingPageCondition };
