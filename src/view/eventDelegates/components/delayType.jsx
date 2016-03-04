import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-reduxform';
import ValidationWrapper from '../../components/validationWrapper';

export default class DelayType extends React.Component {
  onDelayTypeClick = () => {
    ReactDOM.findDOMNode(this.refs.delayTextfield).focus();
  };

  onDelayFieldClick = () => {
    this.refs.delayRadio.props.onChange('delay');
  };

  render() {
    const { delayType, delay } = this.props.fields;

    return (
      <div>
        <label>
          <span className="u-label u-gapRight">Trigger</span>
        </label>
        <Coral.Radio
          ref="immediateRadio"
          {...delayType}
          value="immediate"
          checked={delayType.value === 'immediate'}>
          immediately
        </Coral.Radio>
        <Coral.Radio
          ref="delayRadio"
          {...delayType}
          value="delay"
          checked={delayType.value === 'delay'}
          onClick={this.onDelayTypeClick}>
          after
        </Coral.Radio>
        <ValidationWrapper
          ref="delayValidationWrapper"
          error={delay.touched && delay.error}>
          <Coral.Textfield
            ref="delayTextfield"
            {...delay}
            onClick={this.onDelayFieldClick}/>
        </ValidationWrapper>
        <label>
          <span className="u-label u-gapLeft">milliseconds</span>
        </label>
      </div>
    );
  }
}

export const formConfig = {
  fields: [
    'delayType',
    'delay'
  ],
  settingsToFormValues(values, options) {
    return {
      ...values,
      delayType: options.settings.delay > 0 ? 'delay' : 'immediate',
      delay: options.settings.delay > 0 ? options.settings.delay : ''
    };
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };

    if (values.delayType === 'delay') {
      settings.delay = Number(values.delay);
    } else {
      delete settings.delay;
    }

    delete settings.delayType;
    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (values.delayType === 'delay'
      && (isNaN(values.delay) || values.delay < 1)) {
      errors.delay = 'Please specify a positive number';
    }

    return errors;
  }
};
