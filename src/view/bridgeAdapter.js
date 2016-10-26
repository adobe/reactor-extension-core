/* eslint dot-notation: 0 */

import { getFormValues, initialize, change } from 'redux-form';
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
      store.dispatch(actionCreators.populateMeta(meta));

      // Tell redux-form to initialize our form to the initialValues provided above.
      const initialValues =
        currentRouteFormSettings.settingsToFormValues({}, settings, store.getState());
      store.dispatch(initialize('default', initialValues));

      // The view won't render until the state says that init is complete so in order to avoid
      // useless renders we want to do this as late as possible (after initializing
      // redux-form values above).
      store.dispatch(actionCreators.markInitComplete());
    },
    getSettings() {
      const state = store.getState();

      // This sometimes returns undefined: https://github.com/erikras/redux-form/issues/2017
      const values = getFormValues('default')(state) || {};

      delete values['__bogusname__'];

      return currentRouteFormSettings.formValuesToSettings({}, values, state);
    },
    validate() {
      // Workaround for https://github.com/erikras/redux-form/issues/1477
      // Without this workaround, if the user hasn't changed the form and by default the form
      // is invalid, it will incorrectly report that it is valid.
      store.dispatch(change('default', '__bogusname__', '__bogusvalue__'));

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
