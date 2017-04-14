/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

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
