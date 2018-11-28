import React from 'react';
import { Field } from 'redux-form';
import Button from '@react/react-spectrum/Button';
import RadioGroup from '@react/react-spectrum/RadioGroup';
import Select from '@react/react-spectrum/Select';
import Checkbox from '@react/react-spectrum/Checkbox';
import Data from '@react/react-spectrum/Icon/Data';
import ValidationWrapper from './validationWrapper';

const addDataElementToken = (value, dataElementToken) => `${value || ''}${dataElementToken}`;

class DecoratedInput extends React.Component {
  openDataElementSelector = (tokenize = false) => () => {
    const {
      input: {
        onChange,
        value
      }
    } = this.props;

    // Whenever we're dealing with a data element token, we add it to whatever the existing value
    // is. If we're not dealing with a token, we replace the value entirely. This is just due
    // to how we want the UX to flow.
    window.extensionBridge.openDataElementSelector({
      tokenize
    }).then((dataElement) => {
      onChange(tokenize ? addDataElementToken(value, dataElement) : dataElement);
    });
  };

  render() {
    const {
      fieldComponent: FieldComponent,
      className,
      componentClassName,
      input,
      meta,
      children,
      supportDataElement,
      supportDataElementName,
      errorTooltipPlacement,
      ...rest
    } = this.props;

    // The underlying DOM component for Select is a button. When input.onBlur was called,
    // the event.target.value had a value, because the button was receiving all the react component
    // properties. Beginning with v.2.12.0, the DOM button was receiving only the react component
    // properties related to accessibility. So the event.target.value will always be empty. We
    // take the value from the input and we add it to the event so everything still works.
    // Without this fix, whenever a blur was triggered on a Select, the Select value would be reset.
    if (FieldComponent === Select) {
      const { onBlur, value } = input;

      input.onBlur = (e) => {
        e.target.value = value;
        onBlur(e);
      };
    }

    // Unlike other components, RadioGroup's "value" prop is named "selectedValue". :/
    if (FieldComponent === RadioGroup) {
      input.selectedValue = input.value;
    }

    const fieldComponentsProps = {
      ...input,
      ...rest
    };

    if (meta.touched && meta.invalid) {
      fieldComponentsProps.validationState = 'invalid';
    }

    // This code that only sets className if it's truthy is just to get around
    // https://jira.corp.adobe.com/browse/RSP-269
    // Once that's fixed, we should be able to always set the className prop.
    if (componentClassName) {
      fieldComponentsProps.className = componentClassName;
    }

    return (
      <ValidationWrapper
        className={className}
        error={meta.touched && meta.error}
        placement={errorTooltipPlacement}
      >
        <FieldComponent {...fieldComponentsProps}>
          {children}
        </FieldComponent>
        {
          supportDataElement || supportDataElementName ?
            (
              <Button
                variant="action"
                quiet
                icon={<Data />}
                onClick={this.openDataElementSelector(supportDataElement)}
              />
            ) : null
        }
      </ValidationWrapper>
    );
  }
}

export default ({ component: Component, ...rest }) => {
  const fieldProps = {
    component: DecoratedInput,
    fieldComponent: Component,
    ...rest
  };

  if (Component === Checkbox) {
    // redux-form uses this to determine whether it should set the "checked" prop
    // on the actual checkbox.
    fieldProps.type = 'checkbox';
  }
  return (
    <Field {...fieldProps} />
  );
};
