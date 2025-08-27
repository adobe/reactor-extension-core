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

import visitorTracking from '../helpers/visitorTracking.js';
import compareNumbers from './helpers/compareNumbers.js';

const duration = {
  LIFETIME: 'lifetime',
  SESSION: 'session'
};

export default function (settings) {
  const methodName =
    settings.duration === duration.LIFETIME
      ? 'getLifetimePageViewCount'
      : 'getSessionPageViewCount';
  return compareNumbers(
    visitorTracking[methodName](),
    settings.operator,
    settings.count
  );
}
