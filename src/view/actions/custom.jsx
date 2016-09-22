import React from 'react';
import { ValidationWrapper, InfoTip, ErrorTip } from '@reactor/react-components';
import Alert from '@coralui/react-coral/lib/Alert';
import Button from '@coralui/react-coral/lib/Button';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Radio from '@coralui/react-coral/lib/Radio';
import Textfield from '@coralui/react-coral/lib/Textfield';
import extensionViewReduxForm from '../extensionViewReduxForm';

const LANGUAGES = {
  JAVASCRIPT: 'javascript',
  HTML: 'html'
};

// When tested against a string, it will return true if an opening script tag is found without
// a src attribute.
const containsInlineScriptRegex = /<script(?![^>]*\bsrc\b)/i;

class Custom extends React.Component {
  onOpenEditor = () => {
    const scriptField = this.props.fields.source;
    window.extensionBridge.openCodeEditor(scriptField.value, scriptField.onChange);
  };

  render() {
    const {
      name,
      language,
      sequential,
      global,
      source
    } = this.props.fields;

    return (
      <div>
        <ValidationWrapper error={ name.touched && name.error }>
          <label>
            <span className="u-label">Name</span>
            <Textfield { ...name } />
          </label>
        </ValidationWrapper>

        <fieldset>
          <legend className="u-inlineBlock">
            <span className="u-label u-gapRight">Language</span>
          </legend>
          <Radio
            { ...language }
            value={ LANGUAGES.JAVASCRIPT }
            checked={ language.value === LANGUAGES.JAVASCRIPT }
          >
            JavaScript
          </Radio>
          <Radio
            { ...language }
            value={ LANGUAGES.HTML }
            checked={ language.value === LANGUAGES.HTML }
          >
            HTML
          </Radio>
        </fieldset>

        <div>
          <Checkbox { ...sequential }>
            Sequential
          </Checkbox>
          <InfoTip className="CustomAction-checkboxErrorTip">
            When sequential is enabled, the code in this action will be executed sequentially in
            relation to other custom actions that have sequential enabled. For example, if custom
            action A is sequential, B is not sequential, and C is sequential, A is guaranteed to be
            executed before C while B may be executed first, second, or third.
          </InfoTip>
        </div>

        {
          language.value === LANGUAGES.JAVASCRIPT ?
            <div>
              <Checkbox { ...global }>
                Execute globally
              </Checkbox>
              <InfoTip className="CustomAction-checkboxErrorTip">
                Global execution is only necessary when the script needs its
                own variables to be globally visible. Enabling this will disable binding of
                the variables "this", "event", and "target" within the script.
              </InfoTip>
            </div> : null
        }

        {
          language.value === LANGUAGES.HTML && sequential.value ?
            <Alert variant="warning" type="sequential">
              Please note that sequential HTML will only work for rules that fire before the
              page's HTML document has been loaded and parsed. Such rules typically use either
              the Top of Page or Bottom of Page event.
            </Alert> : null
        }

        {
          // Remove when we drop IE9 support.
          language.value === LANGUAGES.HTML && sequential.value &&
              containsInlineScriptRegex.test(source.value) ?
            <Alert variant="warning" type="inline">
              Please note that if this rule is fired in Internet Explorer 9 before the page's
              HTML document has been loaded and parsed, any inline script
              (e.g., &lt;script&gt;console.log('test');&lt;script&gt;)
              within your HTML will be executed before prior sequential JavaScript custom actions.
            </Alert> : null
        }

        <div className="u-gapTop">
          <Button
            icon="code"
            onClick={ this.onOpenEditor }
          >
            Open Editor
          </Button>
          { source.touched && source.error ?
            <ErrorTip>{ source.error }</ErrorTip> : null
          }
        </div>
      </div>
    );
  }
}

const formConfig = {
  fields: [
    'name',
    'language',
    'sequential',
    'global',
    'source'
  ],
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

export default extensionViewReduxForm(formConfig)(Custom);
