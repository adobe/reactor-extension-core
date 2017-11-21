/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

/* eslint dot-notation: 0 */

import { getFormValues, initialize, change, submit, isValid } from 'redux-form';
import { actionCreators } from './reduxActions/bridgeAdapterActions';

export default (extensionBridge, store, formConfig) => {
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
      const initialValues = formConfig.settingsToFormValues({}, settings, store.getState());
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

      return formConfig.formValuesToSettings({}, values, state.meta);
    },
    validate() {
      // Workaround for https://github.com/erikras/redux-form/issues/1477
      // Without this workaround, if the user hasn't changed the form and by default the form
      // is invalid, it will incorrectly report that it is valid.
      store.dispatch(change('default', '__bogusname__', '__bogusvalue__'));

      store.dispatch(submit('default'));

      return isValid('default')(store.getState());
    }
  });
};
