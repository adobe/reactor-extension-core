import React from 'react';
import ReactDOM from 'react-dom';
import Coral from '../../reduxFormCoralUI';
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
  configToFormValues(values, options) {
    return {
      ...values,
      delayType: options.config.delay > 0 ? 'delay' : 'immediate',
      delay: options.config.delay > 0 ? options.config.delay : ''
    };
  },
  formValuesToConfig(config, values) {
    config = {
      ...config
    };

    if (values.delayType === 'delay') {
      config.delay = Number(values.delay);
    } else {
      delete config.delay;
    }

    delete config.delayType;
    return config;
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
