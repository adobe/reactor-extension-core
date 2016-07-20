import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { ValidationWrapper, InfoTip, ErrorTip } from '@reactor/react-components';
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
    let scriptField = this.props.fields.source;
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
        <ValidationWrapper ref="nameWrapper" error={name.touched && name.error}>
          <label>
            <span className="u-label">Name</span>
            <Coral.Textfield ref="nameField" {...name}/>
          </label>
        </ValidationWrapper>

        <fieldset>
          <legend className="u-inlineBlock">
            <span className="u-label u-gapRight">Language</span>
          </legend>
          <Coral.Radio
            ref="javaScriptLanguageRadio"
            {...language}
            value={LANGUAGES.JAVASCRIPT}
            checked={language.value === LANGUAGES.JAVASCRIPT}>
            JavaScript
          </Coral.Radio>
          <Coral.Radio
            ref="htmlLanguageRadio"
            {...language}
            value={LANGUAGES.HTML}
            checked={language.value === LANGUAGES.HTML}>
            HTML
          </Coral.Radio>
        </fieldset>

        <div>
          <Coral.Checkbox ref="sequentialCheckbox" {...sequential}>
            Sequential
          </Coral.Checkbox>
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
              <Coral.Checkbox ref="globalCheckbox" {...global}>
                Execute globally
              </Coral.Checkbox>
              <InfoTip className="CustomAction-checkboxErrorTip">
                Global execution is only necessary when the script needs its
                own variables to be globally visible. Enabling this will disable binding of
                the variables "this", "event", and "target" within the script.
              </InfoTip>
            </div> : null
        }

        {
          language.value === LANGUAGES.HTML && sequential.value ?
            <Coral.Alert ref="sequentialHtmlAlert" variant="warning">
              <Coral.Alert.Content>
                Please note that sequential HTML will only work for rules that fire before the
                page's HTML document has been loaded and parsed. Such rules typically use either
                the Top of Page or Bottom of Page event.
              </Coral.Alert.Content>
            </Coral.Alert> : null
        }

        {
          // Remove when we drop IE9 support.
          language.value === LANGUAGES.HTML && sequential.value &&
              containsInlineScriptRegex.test(source.value) ?
            <Coral.Alert ref="inlineScriptAlert" variant="warning">
              <Coral.Alert.Content>
                Please note that if this rule is fired in Internet Explorer 9 before the page's
                HTML document has been loaded and parsed, any inline script
                (e.g., &lt;script&gt;console.log('test');&lt;script&gt;)
                within your HTML will be executed before prior sequential JavaScript custom actions.
              </Coral.Alert.Content>
            </Coral.Alert> : null
        }

        <div className="u-gapTop">
          <Coral.Button
            ref="openEditorButton"
            icon="code"
            onClick={this.onOpenEditor}>
            Open Editor
          </Coral.Button>
          {source.touched && source.error ?
            <ErrorTip ref="scriptErrorIcon" message={source.error}/> : null
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
  settingsToFormValues(values, options) {
    values = {
      ...values
    };

    if (!values.language) {
      values.language = LANGUAGES.JAVASCRIPT;
    }

    return values;
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
