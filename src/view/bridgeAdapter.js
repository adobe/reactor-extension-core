import { getValues, reset } from 'redux-form';
import { actionCreators } from './reduxActions/bridgeAdapterActions';
import { handleSubmit } from './extensionViewReduxForm';

export default (extensionBridge, store) => {
  let currentRouteFormSettings;

  extensionBridge.register({
    init(options = {}) {
      options = {
        ...options,
        settings: options.settings || {},
        settingsIsNew: !options.settings
      };

      const initialValues = currentRouteFormSettings.settingsToFormValues({}, options);

      store.dispatch(actionCreators.init({
        propertySettings: options.propertySettings,
        extensionConfigurations: options.extensionConfigurations,

        // initialValues will get set on the state and eventually picked up by redux-form.
        // See extensionViewReduxForm for how they get from the state into redux-form.
        initialValues
      }));

      // Tell redux-form to reset our form to the initialValues provided above. This dispatch
      // must come after the above dispatch.
      store.dispatch(reset('default'));
    },
    getSettings() {
      const values = getValues(store.getState().form.default) || {};
      return currentRouteFormSettings.formValuesToSettings({}, values);
    },
    validate() {
      let valid = false;
      // handleSubmit comes from redux-form. The function passed in will only be called if the
      // form passes validation.
      handleSubmit(() => {
        valid = true;
      })();
      return valid;
    }
  });

  return formSettings => {
    currentRouteFormSettings = formSettings;
  };
};
