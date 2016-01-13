'use strict';
import { actionCreators } from './actions/bridgeAdapterActions';
import { handleSubmit } from './extensionViewReduxForm';
import { getValues } from 'redux-form';

export default (extensionBridge, store) => {
  let _reducersForCurrentRoute;

  extensionBridge.init = options => {
    options = {
      ...options,
      config: options.config || {},
      configIsNew: !options.config
    };

    const initialValues = _reducersForCurrentRoute.configToFormValues({}, options);

    store.dispatch(actionCreators.init({
      propertyConfig: options.properyConfig,
      initialValues
    }));
  };

  extensionBridge.getConfig = () => {
    const values = getValues(store.getState().form.default);
    return _reducersForCurrentRoute.formValuesToConfig({}, values);
  };

  extensionBridge.validate = () => {
    let valid = false;
    // handleSubmit comes from redux-form. The function passed in will only be called if the
    // form passes validation.
    handleSubmit(() => valid = true)();
    return valid;
  };

  return reducersForCurrentRoute => {
    _reducersForCurrentRoute = reducersForCurrentRoute;
  }
};
