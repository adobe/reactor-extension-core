import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';

import Field from '../components/field';
import extensionViewReduxForm from '../extensionViewReduxForm';

const NewReturning = () => (
  <div>
    <Field
      name="visitorType"
      component={ Radio }
      value="new"
    >
      New Visitor
    </Field>
    <Field
      name="visitorType"
      component={ Radio }
      value="returning"
    >
      Returning Visitor
    </Field>
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
