import React from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';

/**
 * Decorator for extension view forms. This configures the extension form for use with redux-form.
 * @param config {Object} These are the same config options that are supported by redux-form
 * (@see http://erikras.github.io/redux-form/#/api/reduxForm) with a few changes:
 * (1) config.validate must be a reducer that receives both an error object and
 * a formValues object. config.validate should return a new error object.
 * (2) config.formValuesToSettings should be specified when the view needs to save form values to
 * the config object.
 * (3) config.settingsToFormValues should be specified when the view needs to populate form values
 * from the config object.
 * @returns {Function}
 */
export default config => (View) => {
  const ViewWrapper = props => (props.initializedByBridge ? <View { ...props } /> : null);

  const ReduxView = connect(
    ({ initializedByBridge }) => ({ initializedByBridge })
  )(ViewWrapper);

  const ReduxForm = reduxForm({
    form: 'default',
    validate: config.validate ? values => config.validate({}, values) : undefined,
    // ReduxForm will complain with we try to "submit" the form and don't have onSubmit defined.
    onSubmit: () => {}
  })(ReduxView);

  // Saved on the component class so that bridgeAdapter can get access to settingsToFormValues and
  // formValuesToSettings.
  ReduxForm.formConfig = config;

  return ReduxForm;
};
