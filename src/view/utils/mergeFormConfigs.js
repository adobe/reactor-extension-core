/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

const isFunction = value => typeof value === 'function';

/**
 * Merges multiple form config objects.
 *
 * @param formConfigs Form config objects
 * @returns {Object}
 */
export default (...formConfigs) => {
  const settingsToFormValuesFunctions = formConfigs
    .map(formConfig => formConfig.settingsToFormValues)
    .filter(isFunction);

  const formValuesToSettingsFunctions = formConfigs
    .map(formConfig => formConfig.formValuesToSettings)
    .filter(isFunction);

  const validateFunctions = formConfigs
    .map(formConfig => formConfig.validate)
    .filter(isFunction);

  return {
    settingsToFormValues(values, settings, state) {
      return settingsToFormValuesFunctions.reduce(
        (reducedValues, settingsToFormValues) => settingsToFormValues(
          reducedValues, settings, state
        ),
        values
      );
    },
    formValuesToSettings(settings, values, state) {
      return formValuesToSettingsFunctions.reduce(
        (reducedSettings, formValuesToSettings) => formValuesToSettings(
          reducedSettings, values, state
        ),
        settings
      );
    },
    validate(errors, values, state) {
      return validateFunctions.reduce(
        (reducedErrors, validate) => validate(reducedErrors, values, state),
        errors
      );
    }
  };
};
