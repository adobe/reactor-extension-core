import React from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import { InfoTip } from '@reactor/react-components';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import Alert from '@coralui/react-coral/lib/Alert';
import Checkbox from '@coralui/redux-form-react-coral/lib/Checkbox';
import Radio from '@coralui/redux-form-react-coral/lib/Radio';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import extensionViewReduxForm from '../extensionViewReduxForm';
import EditorButton from '../components/editorButton';

const LANGUAGES = {
  JAVASCRIPT: 'javascript',
  HTML: 'html'
};

// When tested against a string, it will return true if an opening script tag is found without
// a src attribute.
const containsInlineScriptRegex = /<script(?![^>]*\bsrc\b)/i;

const Custom = ({ language, sequential, source }) => (
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

    <div>
      <Field
        name="sequential"
        component={ Checkbox }
      >
        Sequential
      </Field>
      <InfoTip className="CustomAction-checkboxErrorTip">
        When sequential is enabled, the code in this action will be executed sequentially in
        relation to other custom actions that have sequential enabled. For example, if custom
        action A is sequential, B is not sequential, and C is sequential, A is guaranteed to be
        executed before C while B may be executed first, second, or third.
      </InfoTip>
    </div>

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
            the variables "this", "event", and "target" within the script.
          </InfoTip>
        </div> : null
    }

    {
      language === LANGUAGES.HTML && sequential ?
        <Alert variant="warning">
          Please note that sequential HTML will only work for rules that fire before the
          page's HTML document has been loaded and parsed. Such rules typically use either
          the Top of Page or Bottom of Page event.
        </Alert> : null
    }

    {
      // Remove when we drop IE9 support.
      language === LANGUAGES.HTML && sequential &&
          containsInlineScriptRegex.test(source) ?
        <Alert variant="warning">
          Please note that if this rule is fired in Internet Explorer 9 before the page's
          HTML document has been loaded and parsed, any inline script
          (e.g., &lt;script&gt;console.log('test');&lt;script&gt;)
          within your HTML will be executed before prior sequential JavaScript custom actions.
        </Alert> : null
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
const stateToProps = state => valueSelector(state, 'language', 'sequential', 'source');

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
