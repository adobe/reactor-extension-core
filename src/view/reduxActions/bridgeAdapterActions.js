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

import { createAction, handleActions } from 'redux-actions';

const POPULATE_META = 'bridgeAdapter/POPULATE_META';
const MARK_INIT_COMPLETE = 'bridgeAdapter/MARK_INIT_COMPLETE';

export const actionCreators = {
  populateMeta: createAction(POPULATE_META),
  markInitComplete: createAction(MARK_INIT_COMPLETE)
};

export default handleActions({
  [POPULATE_META]: (state, action) => ({
    ...state,
    meta: {
      ...action.payload
    }
  }),
  [MARK_INIT_COMPLETE]: state => ({
    ...state,
    initializedByBridge: true
  })
});
