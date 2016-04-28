import { actionCreators } from './reduxActions/bridgeAdapterActions';
import { handleSubmit } from './extensionViewReduxForm';
import { getValues, reset } from 'redux-form';
import reduceReducers from 'reduce-reducers';

/**
 * Assigns everything inside settings to state.
 */
const settingsToFormValuesBaseReducer = (values, options) => {
  const { settings } = options;
  return {
    ...values,
    ...settings
  };
};

/**
 * Assigns everything inside state to settings.
 */
const formValuesToSettingsBaseReducer = (settings, values) => {
  return {
    ...settings,
    ...values
  };
};

export default (extensionBridge, store) => {
  let reducersForRoute;

  extensionBridge.register({
    init(options = {}) {
      options = {
        ...options,
        settings: options.settings || {},
        settingsIsNew: !options.settings
      };

      const initialValues = reducersForRoute.settingsToFormValues({}, options);

      store.dispatch(actionCreators.init({
        propertySettings: options.propertySettings,

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
      return reducersForRoute.formValuesToSettings({}, values);
    },
    validate() {
      let valid = false;
      // handleSubmit comes from redux-form. The function passed in will only be called if the
      // form passes validation.
      handleSubmit(() => valid = true)();
      return valid;
    }
  });

  return formSettings => {
    const settingsToFormValuesReducers = [ settingsToFormValuesBaseReducer ];

    if (formSettings.settingsToFormValues) {
      settingsToFormValuesReducers.push(formSettings.settingsToFormValues);
    }

    const formValuesToSettingsReducers = [ formValuesToSettingsBaseReducer ];

    if (formSettings.formValuesToSettings) {
      formValuesToSettingsReducers.push(formSettings.formValuesToSettings);
    }

    reducersForRoute = {
      settingsToFormValues: reduceReducers(...settingsToFormValuesReducers),
      formValuesToSettings: reduceReducers(...formValuesToSettingsReducers)
    };
  };
};
