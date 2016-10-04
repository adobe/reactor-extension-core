/**
 * Merges multiple form configurations into one.
 */

const isFunction = value => typeof value === 'function';

module.exports = (...formConfigs) => {
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
    validate(errors, values) {
      return validateFunctions.reduce(
        (reducedErrors, validate) => validate(reducedErrors, values)
        , errors);
    }
  };
};
