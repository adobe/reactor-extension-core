/***************************************************************************************
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import React from 'react';
import Link from '@react/react-spectrum/Link';
import './selectorLearnMoreLink.styl';

// when an input field ends with a "learn more" link,
// we insert padding for the form validation tooltip to display correctly
export default () => (
  <Link
    className="SelectorLearnMoreLink u-gapLeft"
    href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors"
    rel="noopener noreferrer"
    target="_blank"
  >
    Learn more
  </Link>
);
