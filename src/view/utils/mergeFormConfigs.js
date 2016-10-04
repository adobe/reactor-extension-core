/* eslint arrow-body-style: 0 */
/**
 * Merges multiple form configurations into one.
 */
module.exports = (...formConfigs) => ({
  settingsToFormValues(values, settings, state) {
    return formConfigs.reduce((reducedValues, formConfig) => {
      return formConfig.settingsToFormValues ?
        formConfig.settingsToFormValues(reducedValues, settings, state) :
        reducedValues;
    }, values);
  },
  formValuesToSettings(settings, values, state) {
    return formConfigs.reduce((reducedSettings, formConfig) => {
      return formConfig.formValuesToSettings ?
        formConfig.formValuesToSettings(reducedSettings, values, state) :
        reducedSettings;
    }, settings);
  },
  validate(errors, values) {
    return formConfigs.reduce((reducedErrors, formConfig, state) => {
      return formConfig.validate ?
        formConfig.validate(reducedErrors, values, state) :
        reducedErrors;
    }, errors);
  }
});
