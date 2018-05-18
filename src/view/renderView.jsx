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

import React from 'react';
import ReactDOM from 'react-dom';
import Provider from '@react/react-spectrum/Provider';
import bootstrap from './bootstrap';

import './global.styl';

export default (View, formConfig) => {
  ReactDOM.render((
    <Provider theme="lightest">
      { bootstrap(View, formConfig) }
    </Provider>
  ), document.getElementById('content'));
};
