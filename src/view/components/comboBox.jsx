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
import SpectrumComboBox from '@react/react-spectrum/ComboBox';

// Adds support for "contains" matching.
// https://jira.corp.adobe.com/browse/RSP-306
export default class ComboBox extends SpectrumComboBox {
  constructor() {
    super();
    this.getCompletions = this.getCompletions.bind(this);
  }

  getCompletions(text) {
    if (this.shouldFilter(text)) {
      return this.props.options.filter(o => o.toLowerCase().includes(text.toLowerCase()));
    }

    return this.props.options;
  }
}
