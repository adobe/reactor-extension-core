/* eslint import/no-mutable-exports: 0 */
import React from 'react';
import { reduxForm } from 'redux-form';

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
 * @param [mapStateToProps] {Function} If specified, the component will subscribe to Redux store
 * updates. Any time it updates, mapStateToProps will be called. Its result must be a plain object,
 * and it will be merged into the component’s props. If you omit it, the component will not be
 * subscribed to the Redux store. If ownProps is specified as a second argument, its value will be
 * the props passed to your component, and mapStateToProps will be re-invoked whenever the
 * component receives new props.
 * @param [mapDispatchToProps] {Function} If an object is passed, each function inside it will be
 * assumed to be a Redux action creator. An object with the same function names, but bound to a
 * Redux store, will be merged into the component’s props. If a function is passed, it will be
 * given dispatch. It’s up to you to return an object that somehow uses dispatch to bind action
 * creators in your own way. (Tip: you may use the bindActionCreators() helper from Redux.) If you
 * omit it, the default implementation just injects dispatch into your component’s props. If
 * ownProps is specified as a second argument, its value will be the props passed to your
 * component, and mapDispatchToProps will be re-invoked whenever the component receives new props.
 * @param [mergeProps] {Function} If specified, it is passed the result of mapStateToProps(),
 * mapDispatchToProps(), and the parent props.
 * @param [options] {Object} If specified, further customizes the behavior of the connector.
 * @returns {Function}
 */
export default (config, mapStateToProps, mapDispatchToProps, mergeProps, options) => {
  const reduxFormConfig = {
    form: 'default',
    fields: config.fields,
    // Proxy the provided validate reducer using a function that matches what redux-form expects.
    // Note that there's no technical reason why config.validate must be a reducer. It does
    // maintain some consistency with settingsToFormValues and formValuesToSettings.
    validate: config.validate ? values => config.validate({}, values) : undefined
  };

  const internalMapStateToProps = state => {
    const props = mapStateToProps ? mapStateToProps(state) : {};
    // redux-form picks up initial form values from props.initialValues. We need to copy
    // initialValues from the state.
    props.initialValues = state.initialValues;
    return props;
  };

  // Necessary to store handleSubmit
  return WrappedComponent => {
    class ProgrammaticallySubmittableForm extends React.Component {
      componentDidUpdate() {
        handleSubmit = this.props.handleSubmit;
      }

      render() {
        // This has a ref so we can access it from tests.
        return <WrappedComponent { ...this.props } />;
      }
    }

    const ReduxForm = reduxForm(
      reduxFormConfig,
      internalMapStateToProps,
      mapDispatchToProps,
      mergeProps,
      options
    )(ProgrammaticallySubmittableForm);

    // Saved on the component class so that bridgeAdapter can get access to settingsToFormValues and
    // formValuesToSettings.
    ReduxForm.formConfig = config;

    return ReduxForm;
  };
};
