/* eslint arrow-body-style: 0, no-shadow: 0 */
/**
 * Merges multiple form configurations into one.
 */
module.exports = (...formConfigs) => {
  const fields = [];

  formConfigs.forEach(formConfig => {
    formConfig.fields.forEach(field => {
      if (fields.indexOf(field) === -1) {
        fields.push(field);
      }
    });
  });

  return {
    fields,
    settingsToFormValues(values, settings, state) {
      return formConfigs.reduce((values, formConfig) => {
        return formConfig.settingsToFormValues ?
          formConfig.settingsToFormValues(values, settings, state) :
          values;
      }, values);
    },
    formValuesToSettings(settings, values, state) {
      return formConfigs.reduce((settings, formConfig) => {
        return formConfig.formValuesToSettings ?
          formConfig.formValuesToSettings(settings, values, state) :
          settings;
      }, settings);
    },
    validate(errors, values) {
      return formConfigs.reduce((errors, formConfig, state) => {
        return formConfig.validate ?
          formConfig.validate(errors, values, state) :
          errors;
      }, errors);
    }
  };
};
