/**
 * Merges multiple form configurations into one.
 */

const isDefined = value => typeof value !== 'undefined'

module.exports = (...formConfigs) => {
  const settingsToFormValuesFunctions = formConfigs
    .map(formConfig => formConfig.settingsToFormValues)
    .filter(isDefined);

  const formValuesToSettingsFunctions = formConfigs
    .map(formConfig => formConfig.formValuesToSettings)
    .filter(isDefined);

  const validateFunctions = formConfigs
    .map(formConfig => formConfig.validate)
    .filter(isDefined);

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
