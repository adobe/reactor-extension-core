/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

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
        (reducedValues, settingsToFormValues) =>
          settingsToFormValues(reducedValues, settings, state)
        , values);
    },
    formValuesToSettings(settings, values, state) {
      return formValuesToSettingsFunctions.reduce(
        (reducedSettings, formValuesToSettings) =>
          formValuesToSettings(reducedSettings, values, state)
        , settings);
    },
    validate(errors, values, state) {
      return validateFunctions.reduce(
        (reducedErrors, validate) => validate(reducedErrors, values, state)
        , errors);
    }
  };
};
