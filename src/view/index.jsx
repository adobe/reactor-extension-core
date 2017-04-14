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

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';

import './style.pattern';
import bridgeAdapter from './bridgeAdapter';
import reducer from './reduxActions/reducer';
import createRouter from './createRouter';

const finalCreateStore = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = finalCreateStore(reducer, {});
const setFormConfigForCurrentRoute = bridgeAdapter(window.extensionBridge || {}, store);
const router = createRouter(setFormConfigForCurrentRoute);

ReactDOM.render((
  <div>
    <Provider store={ store }>
      { router }
    </Provider>
  </div>
), document.getElementById('content'));

