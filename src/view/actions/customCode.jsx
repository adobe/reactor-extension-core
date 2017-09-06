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
import { Field, formValueSelector } from 'redux-form';
import InfoTip from '@reactor/react-components/lib/infoTip';
import EditorButton from '@reactor/react-components/lib/reduxForm/editorButton';
import Checkbox from '@coralui/redux-form-react-coral/lib/Checkbox';
import Radio from '@coralui/redux-form-react-coral/lib/Radio';
import extensionViewReduxForm from '../extensionViewReduxForm';

const LANGUAGES = {
  JAVASCRIPT: 'javascript',
  HTML: 'html'
};

const CustomCode = ({ language }) => (
  <div>
    <fieldset>
      <legend className="u-inlineBlock">
        <span className="u-label u-gapRight">Language</span>
      </legend>

      <Field
        name="language"
        component={ Radio }
        type="radio"
        value={ LANGUAGES.JAVASCRIPT }
      >
        JavaScript
      </Field>
      <Field
        name="language"
        component={ Radio }
        type="radio"
        value={ LANGUAGES.HTML }
      >
        HTML
      </Field>
    </fieldset>

    {
      language === LANGUAGES.JAVASCRIPT ?
        <div>
          <Field
            name="global"
            component={ Checkbox }
          >
            Execute globally
          </Field>
          <InfoTip className="u-noPadding">
            Global execution is needed only in cases when the script relies on its own variables to
            be globally visible. Turning this on will disable binding of the variables
            &quot;this&quot;, &quot;event&quot;, and &quot;target&quot; within the script.
          </InfoTip>
        </div> : null
    }

    <div className="u-gapTop">
      <Field
        name="source"
        component={ EditorButton }
        language={ language }
      />
    </div>
  </div>
);

const valueSelector = formValueSelector('default');
const stateToProps = state => ({ language: valueSelector(state, 'language') });

const ConnectedCustom = connect(stateToProps)(CustomCode);

const formConfig = {
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

export default extensionViewReduxForm(formConfig)(ConnectedCustom);
