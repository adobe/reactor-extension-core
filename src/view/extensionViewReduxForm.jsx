/* eslint import/no-mutable-exports: 0 */
import React from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';

/**
 * The handleSubmit function for the most recently updated form. This is exposed as a workaround
 * for the redux-form issue https://github.com/erikras/redux-form/issues/202. In order to validate
 * a form, the handleSubmit function must be called. handleSubmit is passed by redux-form to the
 * form component as a prop. Since the the parent window is in charge of triggering validation
 * and saving of forms and not the component, we have to expose the function here.
 */
export let handleSubmit;

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
  class ViewWrapper extends React.Component {
    componentDidUpdate() {
      handleSubmit = this.props.handleSubmit;
    }

    render() {
      // This has a ref so we can access it from tests.
      return this.props.initializedByBridge ? <View { ...this.props } /> : null;
    }
  }

  const ReduxView = connect(
    ({ initializedByBridge }) => ({ initializedByBridge })
  )(ViewWrapper);

  const ReduxForm = reduxForm({
    form: 'default',
    validate: config.validate ? values => config.validate({}, values) : undefined
  })(ReduxView);

  // Saved on the component class so that bridgeAdapter can get access to settingsToFormValues and
  // formValuesToSettings.
  ReduxForm.formConfig = config;

  return ReduxForm;
};
