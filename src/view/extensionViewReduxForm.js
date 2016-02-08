import React from 'react';
import { reduxForm, getValues } from 'redux-form';
import reduceReducers from 'reduce-reducers';

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
 * @param config
 * @param [mapStateToProps] If specified, the component will subscribe to Redux store updates. Any
 * time it updates, mapStateToProps will be called. Its result must be a plain object*, and it
 * will be merged into the component’s props. If you omit it, the component will not be subscribed
 * to the Redux store. If ownProps is specified as a second argument, its value will be the props
 * passed to your component, and mapStateToProps will be re-invoked whenever the component receives
 * new props.
 * @param [mapDispatchToProps] If an object is passed, each function inside it will be assumed to be
 * a Redux action creator. An object with the same function names, but bound to a Redux store, will
 * be merged into the component’s props. If a function is passed, it will be given dispatch. It’s up
 * to you to return an object that somehow uses dispatch to bind action creators in your own way.
 * (Tip: you may use the bindActionCreators() helper from Redux.) If you omit it, the default
 * implementation just injects dispatch into your component’s props. If ownProps is specified as a
 * second argument, its value will be the props passed to your component, and mapDispatchToProps
 * will be re-invoked whenever the component receives new props.
 * @param [mergeProps] If specified, it is passed the result of mapStateToProps(),
 * mapDispatchToProps(), and the parent props.
 * @param [options] If specified, further customizes the behavior of the connector.
 * @returns {Function}
 */
export default (config, mapStateToProps, mapDispatchToProps, mergeProps, options) => {
  const reduxFormConfig = {
    form: 'default',
    fields: config.fields,
    validate: config.validate
  };

  const internalMapStateToProps = state => {
    const props = mapStateToProps ? mapStateToProps(state) : {};
    // redux-form picks up initial form values from props.initialValues. We need to copy
    // initialValues from the state.
    props.initialValues = state.initialValues;
    return props;
  };

  return WrappedComponent => {
    class ProgrammaticallySubmittableForm extends React.Component {
      componentDidUpdate() {
        handleSubmit = this.props.handleSubmit;
      }

      render() {
        return <WrappedComponent ref="extensionViewWrappedComponent" {...this.props}/>;
      }
    }

    return reduxForm(
      reduxFormConfig,
      internalMapStateToProps,
      mapDispatchToProps,
      mergeProps,
      options
    )(ProgrammaticallySubmittableForm);
  };
};
