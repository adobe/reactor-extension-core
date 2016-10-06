import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import SpecificElements, { formConfig as specificElementsFormConfig } from './specificElements';
import mergeFormConfigs from '../../utils/mergeFormConfigs';
import CoralField from '../../components/coralField';

const ElementFilter = ({ ...props }) => {
  const { elementSpecificity } = props;

  return (
    <div>
      <div>
        <CoralField
          name="elementSpecificity"
          component={ Radio }
          value="specific"
        >
          specific elements
        </CoralField>
        <CoralField
          name="elementSpecificity"
          component={ Radio }
          value="any"
        >
          any element
        </CoralField>
      </div>
      {
        elementSpecificity === 'specific' ?
          <SpecificElements fields={ props.fields } /> : null
      }
    </div>
  );
};

const valueSelector = formValueSelector('default');
const stateToProps = state => ({
  elementSpecificity: valueSelector(state, 'elementSpecificity')
});

export default connect(stateToProps)(ElementFilter);

export const formConfig = mergeFormConfigs(
  specificElementsFormConfig,
  {
    settingsToFormValues: (values, settings, state) => {
      const { elementSelector, elementProperties } = settings;

      return {
        ...values,
        elementSpecificity: state.meta.isNew || elementSelector || elementProperties ?
          'specific' : 'any'
      };
    },
    formValuesToSettings: (settings, values) => {
      settings = {
        ...settings
      };

      const { elementSpecificity } = values;

      if (elementSpecificity === 'any') {
        delete settings.elementSelector;
        delete settings.elementProperties;
      }

      delete settings.elementSpecificity;

      return settings;
    },
    validate(errors, values) {
      errors = {
        ...errors
      };

      errors = specificElementsFormConfig.validate(errors, values);
      if (values.elementSpecificity !== 'specific') {
        delete errors.elementSelector;
      }

      return errors;
    }
  }
);
