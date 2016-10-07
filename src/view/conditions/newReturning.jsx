import React from 'react';
import Radio from '@coralui/redux-form-react-coral/lib/Radio';
import { Field } from 'redux-form';

import extensionViewReduxForm from '../extensionViewReduxForm';

const NewReturning = () => (
  <div>
    <Field
      name="visitorType"
      component={ Radio }
      type="radio"
      value="new"
    >
      New Visitor
    </Field>
    <Field
      name="visitorType"
      component={ Radio }
      type="radio"
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
