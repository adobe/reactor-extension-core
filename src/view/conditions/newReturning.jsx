import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';

import CoralField from '../components/coralField';
import extensionViewReduxForm from '../extensionViewReduxForm';

const NewReturning = () => (
  <div>
    <CoralField
      name="visitorType"
      component={ Radio }
      value="new"
    >
      New Visitor
    </CoralField>
    <CoralField
      name="visitorType"
      component={ Radio }
      value="returning"
    >
      Returning Visitor
    </CoralField>
  </div>
);

const formConfig = {
  settingsToFormValues(values, settings, state) {
    return {
      ...values,
      visitorType: state.meta.isNew || settings.isNewVisitor ? 'new' : 'returning'
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
