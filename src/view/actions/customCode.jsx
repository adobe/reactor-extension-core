/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
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
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import Checkbox from '@react/react-spectrum/Checkbox';
import Radio from '@react/react-spectrum/Radio';
import RadioGroup from '@react/react-spectrum/RadioGroup';
import InfoTip from '../components/infoTip';
import EditorButton from '../components/editorButton';
import WrappedField from '../components/wrappedField';

const LANGUAGES = {
  JAVASCRIPT: 'javascript',
  HTML: 'html'
};

const CustomCode = ({ language }) => (
  <div>
    <fieldset>
      <legend>
        Language
      </legend>

      <WrappedField
        name="language"
        component={RadioGroup}
      >
        <Radio value={LANGUAGES.JAVASCRIPT} label="JavaScript" />
        <Radio value={LANGUAGES.HTML} label="HTML" />
      </WrappedField>
    </fieldset>

    {
      language === LANGUAGES.JAVASCRIPT ?
        (
          <div>
            <WrappedField
              name="global"
              component={Checkbox}
              label="Execute globally"
              className="u-noPaddingRight"
            />
            <InfoTip className="u-noPadding">
            Global execution is needed only in cases when the script relies on its own variables to
            be globally visible. Turning this on will disable binding of the variables
            &quot;this&quot;, &quot;event&quot;, and &quot;target&quot; within the script.
            </InfoTip>
          </div>
        ) : null
    }

    <div className="u-gapTop">
      <WrappedField
        name="source"
        component={EditorButton}
        language={language}
      />
    </div>
  </div>
);

const valueSelector = formValueSelector('default');
const stateToProps = state => ({ language: valueSelector(state, 'language') });

export default connect(stateToProps)(CustomCode);

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings,
      language: settings.language || LANGUAGES.JAVASCRIPT
    };
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings,
      ...values
    };

    if (settings.language === LANGUAGES.HTML) {
      delete settings.global;
    }

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.source) {
      errors.source = 'Please provide custom code.';
    }

    return errors;
  }
};
