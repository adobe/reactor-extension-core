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

'use strict';

var screen = require('@testing-library/react').screen;

var sharedTestingElements = {
  advancedSettings: {
    getSettingsToggleTrigger: function () {
      return screen.getByText(/advanced/i);
    },
    getBubbleFireIfParentCheckbox: function () {
      return screen.getByRole('checkbox', {
        name: /run this rule even when the event originates from a descendant element/i
      });
    },
    getBubbleFireIfChildFiredCheckbox: function () {
      return screen.getByRole('checkbox', {
        name: new RegExp(
          [
            'allow this rule to run even if the event already triggered a rule',
            'targeting a descendant element'
          ].join(' '),
          'i'
        )
      });
    },
    getBubbleStopCheckBox: function () {
      return screen.getByRole('checkbox', {
        name: new RegExp(
          [
            'after the rule runs, prevent the event from triggering rules targeting',
            'ancestor elements'
          ].join(' '),
          'i'
        )
      });
    }
  },
  elementsMatching: {
    radioGroup: {
      getSpecificElements: function () {
        return screen.getByRole('radio', { name: /specific elements/i });
      },
      getAnyElement: function () {
        return screen.getByRole('radio', { name: /any element/i });
      }
    },
    getCssSelectorTextBox: function () {
      return screen.getByRole('textbox', { name: /selector/i });
    }
  }
};

module.exports = {
  sharedTestingElements: sharedTestingElements
};
