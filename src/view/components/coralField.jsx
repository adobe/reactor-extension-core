import React from 'react';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import { Field } from 'redux-form';
import Button from '@coralui/react-coral/lib/Button';
import ReduxFormAutocompleteSelect from './reduxFormAutocompleteSelect';
import addDataElementToken from '../utils/addDataElementToken';

const eventHandlerRegex = /^on[A-Z]/;

/**
 * If a consumer specifies an event handler (say, onChange), we need to merge it with any handler
 * that redux-form provides for the same event type otherwise it will get overridden by redux-forms
 * handler. We do this by providing a wrapper handler which calls redux-form's handler first,
 * then the consumer-defined handler.
 * @param reduxFormProvidedProps
 * @param consumerProvidedProps
 */
const mergeHandlers = (reduxFormProvidedProps, consumerProvidedProps) => {
  Object.keys(consumerProvidedProps).forEach(consumerProvidedPropName => {
    if (reduxFormProvidedProps[consumerProvidedPropName] &&
      eventHandlerRegex.test(consumerProvidedPropName)) {
      const reduxFormHandler = reduxFormProvidedProps[consumerProvidedPropName];
      const consumerHandler = consumerProvidedProps[consumerProvidedPropName];

      reduxFormProvidedProps[consumerProvidedPropName] = (...args) => {
        reduxFormHandler(...args);
        consumerHandler(...args);
      };

      delete consumerProvidedProps[consumerProvidedPropName];
    }
  });
};

class InputWrapper extends React.Component {
  openCssSelector = () => {
    const {
      input: {
        onChange
      }
    } = this.props;

    window.extensionBridge.openCssSelector(onChange);
  };

  openDataElementSelector = (supportDataElementName = false) => () => {
    const {
      input: {
        onChange,
        value
      }
    } = this.props;

    window.extensionBridge.openDataElementSelector(dataElementName => {
      onChange(
        supportDataElementName ?
        value + dataElementName
          : addDataElementToken(value, dataElementName)
      );
    });
  };

  render() {
    const {
      input,
      meta,
      reactCoralComponent: ReactCoralComponent,
      supportValidation,
      supportDataElement,
      supportDataElementName,
      supportCssSelector,
      className,
      suffixLabel,
      componentClassName,
      ...otherProps
    } = this.props;

    mergeHandlers(input, otherProps);

    // I bet there's a way to cut down on the number of span wrappers.

    let inputComponent;

    // We match the name instead of Component === Autocomplete because that would require us to
    // require in the React-Coral class (and therefore it would end up in the app build)
    // even if we never ended up using the class.
    if (ReactCoralComponent.name === 'Select' || ReactCoralComponent.name === 'Autocomplete') {
      inputComponent = (
        <ReduxFormAutocompleteSelect
          component={ ReactCoralComponent }
          className={ componentClassName }
          { ...otherProps }
          { ...input }
        />
      );
    } else {
      inputComponent = (
        <ReactCoralComponent
          className={ componentClassName }
          { ...otherProps }
          { ...input }
        />
      );
    }

    let result = (
      <span>
        { inputComponent }
        {
          suffixLabel ? <span className="Label u-gapLeft">{ suffixLabel }</span> : null
        }
      </span>
    );

    if (supportDataElement || supportDataElementName) {
      result = (
        <span>
          { result }
          <DataElementSelectorButton
            onClick={ this.openDataElementSelector(supportDataElementName) }
          />
        </span>
      );
    }

    if (supportValidation) {
      result = (
        <ValidationWrapper
          error={ meta.touched && meta.error }
        >
          { result }
        </ValidationWrapper>
      );
    }

    if (supportCssSelector) {
      result = (
        <span>
          { result }
          <Button
            variant="minimal"
            iconSize="S"
            icon="target"
            onClick={ this.openCssSelector }
          />
        </span>
      );
    }

    result = (
      <span className={ className }>
        { result }
      </span>
    );

    return result;
  }
}

const CoralField = ({ component, ...otherProps }) => {
  // Redux-form will only provide a "checked" property if you specify type="radio" or
  // type="checkbox". We'll do that automatically here so we don't have to remember to do it
  // every time we use radio or checkbox.
  // https://github.com/erikras/redux-form/issues/1445
  if (component.name === 'Radio' || component.name === 'Checkbox') {
    otherProps.type = component.name.toLowerCase();
  }

  return (
    <Field
      reactCoralComponent={ component }
      component={ InputWrapper }
      { ...otherProps }
    />
  );
};

export default CoralField;
