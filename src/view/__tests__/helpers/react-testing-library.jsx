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

/*eslint import/no-extraneous-dependencies: 0*/
import { screen, waitFor } from '@testing-library/react';

// this function is nice for pausing the UI to see what's going on in Karma
export const DEBUG_UTILITIES = {
  WAIT_MAX_TIMEOUT: async (timeout = 4900) => {
    await waitFor(
      () => {
        return new Promise((resolve) => {
          setTimeout(resolve, timeout);
        });
      },
      { timeout: 5000 }
    );
  }
};

// put elements in here that are repeated on other views.
// NOTE: regex toggles aren't here because sometimes they're in rows, other times
// they're the only toggle on the page.
export const sharedTestingElements = {
  advancedSettings: {
    getToggleTrigger: () => {
      return screen.getByText(/advanced/i);
    },
    getBubbleFireIfParentCheckbox: () => {
      return screen.getByRole('checkbox', {
        name: /run this rule even when the event originates from a descendant element/i
      });
    },
    getBubbleFireIfChildFiredCheckbox: () => {
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
    getBubbleStopCheckBox: () => {
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
      getSpecificElements: () => {
        return screen.getByRole('radio', { name: /specific elements/i });
      },
      getAnyElement: () => {
        return screen.getByRole('radio', { name: /any element/i });
      }
    },
    getCssSelectorTextBox: () => {
      return screen.getByRole('textbox', { name: /selector/i });
    },
    queryForCssSelectorTextBox: () => {
      return screen.queryByRole('textbox', { name: /selector/i });
    }
  },
  customCodeEditor: {
    getTriggerButton: () => {
      return screen.getByRole('button', { name: /open editor/i });
    }
  }
};

// used for testing validity of spectrum buttons
export function isButtonValid(el) {
  return Array.from(el.classList).join().indexOf('--warning') === -1;
}

// helpful for testing tooltips
export function elementIsPosition(el, position) {
  if (!['top', 'bottom', 'left', 'right'].includes(position)) {
    throw new Error(`unknown position type of ${position}`);
  }

  return Array.from(el.classList).join().indexOf(position) !== -1;
}
