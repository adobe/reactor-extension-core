/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import { createAction, handleActions } from 'redux-actions';

const POPULATE_META = 'bridgeAdapter/POPULATE_META';
const MARK_INIT_COMPLETE = 'bridgeAdapter/MARK_INIT_COMPLETE';

export const actionCreators = {
  populateMeta: createAction(POPULATE_META),
  markInitComplete: createAction(MARK_INIT_COMPLETE)
};

export default handleActions(
  {
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
  },
  {
    initializedByBridge: false,
    meta: {}
  }
);
