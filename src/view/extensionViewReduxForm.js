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
    props.initialValues = state.initialValues;
    return props;
  };

  return WrappedComponent => {
    class ProgrammaticallySubmittableForm extends React.Component {
      componentDidUpdate() {
        handleSubmit = this.props.handleSubmit;
      }

      render() {
        return <WrappedComponent {...this.props}/>
      }
    }

    return reduxForm(
      reduxFormConfig,
      internalMapStateToProps,
      mapDispatchToProps,
      mergeProps,
      options
    )(ProgrammaticallySubmittableForm);
  }
};
