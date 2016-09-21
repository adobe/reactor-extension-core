import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';

import extensionViewReduxForm from '../extensionViewReduxForm';

const NewReturning = ({ ...props }) => {
  const { visitorType } = props.fields;

  return (
    <div>
      <Radio
        { ...visitorType }
        value="new"
        checked={ visitorType.value === 'new' }
      >
        New Visitor
      </Radio>
      <Radio
        { ...visitorType }
        value="returning"
        checked={ visitorType.value === 'returning' }
      >
        Returning Visitor
      </Radio>
    </div>
  );
};

const formConfig = {
  fields: [
    'visitorType'
  ],
  settingsToFormValues(values, options) {
    return {
      ...values,
      visitorType: options.settingsIsNew || options.settings.isNewVisitor ? 'new' : 'returning'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      isNewVisitor: values.visitorType === 'new'
    };
  }
};

export default extensionViewReduxForm(formConfig)(NewReturning);
