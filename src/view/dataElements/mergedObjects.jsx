/***************************************************************************************
 * Copyright 2021 Adobe. All rights reserved.
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
import { Flex, TextField, View } from '@adobe/react-spectrum';
import { FieldArray } from 'redux-form';
import WrappedField from '../components/wrappedField';
import MultipleItemEditor from '../components/multipleItemEditor';
import { isDataElementToken } from '../utils/validators';

const createItem = () => '';

const renderItem = field => (
  <View flex data-row>
    <WrappedField
      label="Object"
      width="100%"
      name={field}
      component={TextField}
      isRequired
      supportDataElement
    />
  </View>
);

const MergedObjects = () => (
  <div>
    <View maxWidth="700px">
      <p>
        Select data elements below that will each provide an object. These
        objects will be deeply (recursively) merged together to produce a new
        object. The source objects will not be modified. If a specific property
        exists on multiple objects, the value from the latter object will be
        used. If the value from each objects is an array, however, the arrays
        will be concatenated.
      </p>
    </View>
    {
      // marginEnd is to leave room for validation tooltips
    }
    <Flex
      gap="size-100"
      direction="column"
      minWidth="size-6000"
      marginEnd="size-1600"
    >
      <FieldArray
        name="objects"
        renderItem={renderItem}
        component={MultipleItemEditor}
        createItem={createItem}
      />
    </Flex>
  </div>
);

export default MergedObjects;

export const formConfig = {
  settingsToFormValues(values, settings) {
    values = {
      ...values,
      ...settings
    };

    if (!values.objects) {
      values.objects = [];
    }

    if (!values.objects.length) {
      values.objects.push(createItem());
    }

    return values;
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    const objectsErrors = (values.objects || []).map(object => {
      return isDataElementToken(object)
        ? undefined
        : 'Please specify a data element';
    });

    errors.objects = objectsErrors;

    return errors;
  }
};
