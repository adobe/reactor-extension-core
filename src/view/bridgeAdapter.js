'use strict';
import { actionCreators } from './actions/createBridgeAdapterActions';
import { handleSubmit } from './extensionViewReduxForm';
import { getValues } from 'redux-form';

export default (getBridgeAdapterReducers, extensionBridge, store) => {
  extensionBridge.init = options => {
    store.dispatch(actionCreators.setConfig({
      ...options,
      config: options.config || {},
      configIsNew: !options.config
    }));
  };

  extensionBridge.getConfig = () => {
    const bridgeAdapterReducers = getBridgeAdapterReducers();
    const values = getValues(store.getState().form.default);
    return bridgeAdapterReducers.formValuesToConfig({}, values);
  };

  extensionBridge.validate = () => {
    let valid = false;
    // handleSubmit comes from redux-form. The function passed in will only be called if the
    // form passes validation.
    handleSubmit(() => valid = true)();
    return valid;
  };

};
