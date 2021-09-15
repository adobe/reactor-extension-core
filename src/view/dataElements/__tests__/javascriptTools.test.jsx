/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { fireEvent, render, screen, within } from '@testing-library/react';
import {
  fillInTextBox,
  changePickerValue
} from '@test-helpers/react-testing-library';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import JavascriptTools, { formConfig } from '../javascriptTools';
import bootstrap from '../../bootstrap';
import operators from '../utils/javascriptTools/operators';
import metaByOperator from '../utils/javascriptTools/metaByOperator';

const pageElements = {
  getSourceValueTextBox: () =>
    screen.getByRole('textbox', { name: /data element/i }),
  operatorDropdown: {
    getTrigger: () => screen.getByRole('button', { name: /function/i })
  },
  getSearchValueTextBox: () =>
    screen.getByRole('textbox', { name: /search value/i }),
  getReplacementValueTextBox: () =>
    screen.getByRole('textbox', { name: /replacement value/i }),
  getReplaceAllCheckbox: () =>
    screen.getByRole('checkbox', { name: /replace all/i }),
  getRegexExpressionTextBox: () =>
    screen.getByRole('textbox', { name: /regex expression/i }),
  getCaseInsensitiveCheckbox: () =>
    screen.getByRole('checkbox', { name: /case insensitive/i }),
  getStartPositionTextBox: () =>
    screen.getByRole('textbox', { name: /start position/i }),
  getEndPositionTextBox: () =>
    screen.getByRole('textbox', { name: /end position/i }),
  getDelimiterTextBox: () =>
    screen.getByRole('textbox', { name: /value separator/i })
};

describe('javascript tools view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(JavascriptTools, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  describe('when operator is simple replace', () => {
    it('sets form values from settings', () => {
      extensionBridge.init({
        settings: {
          sourceValue: '%Data Element 1%',
          operator: 'simpleReplace',
          searchValue: 'search',
          replacementValue: 'replace',
          replaceAll: true
        }
      });

      expect(pageElements.getSourceValueTextBox().value).toBe(
        '%Data Element 1%'
      );
      expect(
        within(pageElements.operatorDropdown.getTrigger()).getByText(
          'Simple Replace'
        )
      ).toBeTruthy();
      expect(pageElements.getSearchValueTextBox().value).toBe('search');
      expect(pageElements.getReplacementValueTextBox().value).toBe('replace');
      expect(pageElements.getReplaceAllCheckbox().checked).toBe(true);
    });

    it('sets settings from form values', async () => {
      fillInTextBox(pageElements.getSourceValueTextBox(), '%Data Element 1%');
      await changePickerValue(
        pageElements.operatorDropdown.getTrigger(),
        /simple replace/i
      );
      fillInTextBox(pageElements.getSearchValueTextBox(), 'search');
      fillInTextBox(pageElements.getReplacementValueTextBox(), 'replace');
      fireEvent.click(pageElements.getReplaceAllCheckbox());

      expect(extensionBridge.getSettings()).toEqual({
        sourceValue: '%Data Element 1%',
        operator: 'simpleReplace',
        searchValue: 'search',
        replacementValue: 'replace',
        replaceAll: true
      });
    });

    it('sets errors if search field is empty', () => {
      extensionBridge.init({
        settings: {
          sourceValue: '%Data Element 1%',
          operator: 'simpleReplace'
        }
      });

      fireEvent.focus(pageElements.getSearchValueTextBox());
      fireEvent.blur(pageElements.getSearchValueTextBox());

      expect(
        pageElements.getSearchValueTextBox().hasAttribute('aria-invalid')
      ).toBeTrue();
      expect(extensionBridge.validate()).toBe(false);
    });
  });

  describe('when operator is regex replace', () => {
    it('sets form values from settings', () => {
      extensionBridge.init({
        settings: {
          sourceValue: '%Data Element 1%',
          operator: 'regexReplace',
          regexInput: 'regex search',
          caseInsensitive: true,
          replacementValue: 'replace',
          replaceAll: true
        }
      });

      expect(pageElements.getSourceValueTextBox().value).toBe(
        '%Data Element 1%'
      );
      expect(
        within(pageElements.operatorDropdown.getTrigger()).getByText(
          'Regex Replace'
        )
      ).toBeTruthy();
      expect(pageElements.getRegexExpressionTextBox().value).toBe(
        'regex search'
      );
      expect(pageElements.getCaseInsensitiveCheckbox().checked).toBe(true);
      expect(pageElements.getReplacementValueTextBox().value).toBe('replace');
      expect(pageElements.getReplaceAllCheckbox().checked).toBe(true);
    });

    it('sets settings from form values', async () => {
      fillInTextBox(pageElements.getSourceValueTextBox(), '%Data Element 1%');
      await changePickerValue(
        pageElements.operatorDropdown.getTrigger(),
        /regex replace/i
      );
      fillInTextBox(pageElements.getRegexExpressionTextBox(), 'regex search');
      fireEvent.click(pageElements.getCaseInsensitiveCheckbox());
      fillInTextBox(pageElements.getReplacementValueTextBox(), 'replace');
      fireEvent.click(pageElements.getReplaceAllCheckbox());

      expect(extensionBridge.getSettings()).toEqual({
        sourceValue: '%Data Element 1%',
        operator: 'regexReplace',
        regexInput: 'regex search',
        caseInsensitive: true,
        replacementValue: 'replace',
        replaceAll: true
      });
    });

    it('sets errors if regex expression field is empty', () => {
      extensionBridge.init({
        settings: {
          sourceValue: '%Data Element 1%',
          operator: 'regexReplace'
        }
      });

      const regexExpressionTextBox = pageElements.getRegexExpressionTextBox();
      fireEvent.focus(regexExpressionTextBox);
      fireEvent.blur(regexExpressionTextBox);

      expect(
        pageElements.getRegexExpressionTextBox().hasAttribute('aria-invalid')
      ).toBeTrue();
      expect(extensionBridge.validate()).toBe(false);
    });
  });

  [
    [metaByOperator[operators.SUBSTRING].label, operators.SUBSTRING],
    [metaByOperator[operators.SLICE].label, operators.SLICE]
  ].forEach(([operatorLabel, operator]) => {
    describe('when operator is substring', () => {
      it('sets form values from settings', () => {
        extensionBridge.init({
          settings: {
            sourceValue: '%Data Element 1%',
            operator,
            start: 1,
            end: 5
          }
        });

        expect(pageElements.getSourceValueTextBox().value).toBe(
          '%Data Element 1%'
        );
        expect(
          within(pageElements.operatorDropdown.getTrigger()).getByText(
            operatorLabel
          )
        ).toBeTruthy();
        expect(pageElements.getStartPositionTextBox().value).toBe('1');
        expect(pageElements.getEndPositionTextBox().value).toBe('5');
      });

      it('sets settings from form values', async () => {
        fillInTextBox(pageElements.getSourceValueTextBox(), '%Data Element 1%');
        await changePickerValue(
          pageElements.operatorDropdown.getTrigger(),
          new RegExp(operatorLabel, 'i')
        );
        fillInTextBox(pageElements.getStartPositionTextBox(), '2');
        fillInTextBox(pageElements.getEndPositionTextBox(), '6');

        expect(extensionBridge.getSettings()).toEqual({
          sourceValue: '%Data Element 1%',
          operator,
          start: 2,
          end: 6
        });
      });

      it('sets errors if start position field is empty', () => {
        extensionBridge.init({
          settings: {
            sourceValue: '%Data Element 1%',
            operator
          }
        });

        const regexExpressionTextBox = pageElements.getStartPositionTextBox();
        fireEvent.focus(regexExpressionTextBox);
        fireEvent.blur(regexExpressionTextBox);

        expect(
          pageElements.getStartPositionTextBox().hasAttribute('aria-invalid')
        ).toBeTrue();
        expect(extensionBridge.validate()).toBe(false);
      });

      it('sets errors if start and end position fields are not numbers', () => {
        extensionBridge.init({
          settings: {
            sourceValue: '%Data Element 1%',
            operator: 'substring',
            start: 'a',
            end: 'b'
          }
        });

        expect(extensionBridge.validate()).toBe(false);
        expect(
          pageElements.getStartPositionTextBox().hasAttribute('aria-invalid')
        ).toBeTrue();
        expect(
          pageElements.getEndPositionTextBox().hasAttribute('aria-invalid')
        ).toBeTrue();
      });
    });
  });

  describe('when operator is regex match', () => {
    it('sets form values from settings', () => {
      extensionBridge.init({
        settings: {
          sourceValue: '%Data Element 1%',
          operator: 'regexMatch',
          regexInput: 'regex search',
          caseInsensitive: true
        }
      });

      expect(pageElements.getSourceValueTextBox().value).toBe(
        '%Data Element 1%'
      );
      expect(
        within(pageElements.operatorDropdown.getTrigger()).getByText(
          'Extract Value with Regex'
        )
      ).toBeTruthy();
      expect(pageElements.getRegexExpressionTextBox().value).toBe(
        'regex search'
      );
      expect(pageElements.getCaseInsensitiveCheckbox().checked).toBe(true);
    });

    it('sets settings from form values', async () => {
      fillInTextBox(pageElements.getSourceValueTextBox(), '%Data Element 1%');
      await changePickerValue(
        pageElements.operatorDropdown.getTrigger(),
        /extract value with regex/i
      );
      fillInTextBox(pageElements.getRegexExpressionTextBox(), 'regex search');
      fireEvent.click(pageElements.getCaseInsensitiveCheckbox());

      expect(extensionBridge.getSettings()).toEqual({
        sourceValue: '%Data Element 1%',
        operator: 'regexMatch',
        regexInput: 'regex search',
        caseInsensitive: true
      });
    });

    it('sets errors if regex expression field is empty', () => {
      extensionBridge.init({
        settings: {
          sourceValue: '%Data Element 1%',
          operator: 'regexMatch'
        }
      });

      const regexExpressionTextBox = pageElements.getRegexExpressionTextBox();
      fireEvent.focus(regexExpressionTextBox);
      fireEvent.blur(regexExpressionTextBox);

      expect(
        pageElements.getRegexExpressionTextBox().hasAttribute('aria-invalid')
      ).toBeTrue();
      expect(extensionBridge.validate()).toBe(false);
    });
  });

  [
    [metaByOperator[operators.INDEX_OF].label, operators.INDEX_OF],
    [metaByOperator[operators.LAST_INDEX_OF].label, operators.LAST_INDEX_OF]
  ].forEach(([operatorLabel, operator]) => {
    describe(`when operator is ${operatorLabel.toLowerCase()}`, () => {
      it('sets form values from settings', () => {
        extensionBridge.init({
          settings: {
            sourceValue: '%Data Element 1%',
            operator,
            searchValue: 'search'
          }
        });

        expect(pageElements.getSourceValueTextBox().value).toBe(
          '%Data Element 1%'
        );
        expect(
          within(pageElements.operatorDropdown.getTrigger()).getByText(
            operatorLabel
          )
        ).toBeTruthy();
        expect(pageElements.getSearchValueTextBox().value).toBe('search');
      });

      it('sets settings from form values', async () => {
        fillInTextBox(pageElements.getSourceValueTextBox(), '%Data Element 1%');
        await changePickerValue(
          pageElements.operatorDropdown.getTrigger(),
          new RegExp(operatorLabel, 'i')
        );
        fillInTextBox(pageElements.getSearchValueTextBox(), 'search');

        expect(extensionBridge.getSettings()).toEqual({
          sourceValue: '%Data Element 1%',
          operator,
          searchValue: 'search'
        });
      });

      it('sets errors if search field is empty', () => {
        extensionBridge.init({
          settings: {
            sourceValue: '%Data Element 1%',
            operator
          }
        });

        const textBox = pageElements.getSearchValueTextBox();
        fireEvent.focus(textBox);
        fireEvent.blur(textBox);

        expect(extensionBridge.validate()).toBe(false);
        expect(
          pageElements.getSearchValueTextBox().hasAttribute('aria-invalid')
        ).toBeTrue();
      });
    });
  });

  [
    [metaByOperator[operators.JOIN].label, operators.JOIN],
    [metaByOperator[operators.SPLIT].label, operators.SPLIT]
  ].forEach(([operatorLabel, operator]) => {
    describe(`when operator is ${operatorLabel.toLowerCase()}`, () => {
      it('sets form values from settings', () => {
        extensionBridge.init({
          settings: {
            sourceValue: '%Data Element 1%',
            operator,
            delimiter: ','
          }
        });

        expect(pageElements.getSourceValueTextBox().value).toBe(
          '%Data Element 1%'
        );
        expect(
          within(pageElements.operatorDropdown.getTrigger()).getByText(
            operatorLabel
          )
        ).toBeTruthy();
        expect(pageElements.getDelimiterTextBox().value).toBe(',');
      });

      it('sets settings from form values', async () => {
        fillInTextBox(pageElements.getSourceValueTextBox(), '%Data Element 1%');
        await changePickerValue(
          pageElements.operatorDropdown.getTrigger(),
          new RegExp(operatorLabel, 'i')
        );
        fillInTextBox(pageElements.getDelimiterTextBox(), ':');

        expect(extensionBridge.getSettings()).toEqual({
          sourceValue: '%Data Element 1%',
          operator,
          delimiter: ':'
        });
      });

      it('sets errors if search field is empty', () => {
        extensionBridge.init({
          settings: {
            sourceValue: '%Data Element 1%',
            operator
          }
        });

        const textBox = pageElements.getDelimiterTextBox();
        fireEvent.focus(textBox);
        fireEvent.blur(textBox);

        expect(extensionBridge.validate()).toBe(false);
        expect(
          pageElements.getDelimiterTextBox().hasAttribute('aria-invalid')
        ).toBeTrue();
      });
    });
  });

  it('sets errors when source value is not provided', () => {
    fireEvent.focus(pageElements.getSourceValueTextBox());
    fireEvent.blur(pageElements.getSourceValueTextBox());

    expect(
      pageElements.getSourceValueTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBe(false);
  });
});
