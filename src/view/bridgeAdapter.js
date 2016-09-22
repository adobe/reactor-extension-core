import { getValues, reset } from 'redux-form';
import { actionCreators } from './reduxActions/bridgeAdapterActions';
import { handleSubmit } from './extensionViewReduxForm';

export default (extensionBridge, store) => {
  let currentRouteFormSettings;

  extensionBridge.register({
    init(options = {}) {
      let {
        settings,
        ...meta
      } = options;

      meta.isNew = !settings;
      settings = settings || {};

      // Populate the state with all the metadata coming in. This includes things like
      // extension configurations, tokens, org ID, etc. We need to populate state with this
      // information before passing it to settingsToFormValues below.
      store.dispatch(actionCreators.reset());
      store.dispatch(actionCreators.populateMeta(meta));

      const initialValues =
        currentRouteFormSettings.settingsToFormValues({}, settings, store.getState());

      store.dispatch(actionCreators.init({
        // initialValues will get set on the state and eventually picked up by redux-form.
        // See extensionViewReduxForm for how they get from the state into redux-form.
        initialValues
      }));

      // Tell redux-form to reset our form to the initialValues provided above. This dispatch
      // must come after the above dispatch.
      store.dispatch(reset('default'));
    },
    getSettings() {
      const state = store.getState();
      const values = getValues(store.getState().form.default) || {};
      return currentRouteFormSettings.formValuesToSettings({}, values, state);
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
