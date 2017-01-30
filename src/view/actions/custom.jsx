/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

import React from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import InfoTip from '@reactor/react-components/lib/infoTip';
import EditorButton from '@reactor/react-components/lib/reduxForm/editorButton';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import Checkbox from '@coralui/redux-form-react-coral/lib/Checkbox';
import Radio from '@coralui/redux-form-react-coral/lib/Radio';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import extensionViewReduxForm from '../extensionViewReduxForm';

const LANGUAGES = {
  JAVASCRIPT: 'javascript',
  HTML: 'html'
};

const Custom = ({ language }) => (
  <div>
    <label>
      <span className="u-label">Name</span>
      <Field
        name="name"
        component={ DecoratedInput }
        inputComponent={ Textfield }
      />
    </label>
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
          <InfoTip className="CustomAction-checkboxErrorTip">
            Global execution is only necessary when the script needs its
            own variables to be globally visible. Enabling this will disable binding of
            the variables &quot;this&quot;, &quot;event&quot;, and &quot;target&quot; within the
            script.
          </InfoTip>
        </div> : null
    }

    <div className="u-gapTop">
      <Field
        name="source"
        component={ EditorButton }
      />
    </div>
  </div>
);

const valueSelector = formValueSelector('default');
const stateToProps = state => ({ language: valueSelector(state, 'language') });

const ConnectedCustom = connect(stateToProps)(Custom);

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

    if (!values.name) {
      errors.name = 'Please provide a name.';
    }

    if (!values.source) {
      errors.source = 'Please provide custom code.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(ConnectedCustom);
