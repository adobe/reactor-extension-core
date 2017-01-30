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
import Button from '@coralui/react-coral/lib/Button';

export default ({ fields, renderItem }) => {
  const rows = fields.map((field, index) => (
    <div data-type="row" key={ field }>
      { index !== 0 ? <div className="MultipleItemEditor-orLabel">or</div> : null }
      { renderItem(field) }
      {
        fields.length > 1 ?
          <Button
            className="u-gapLeft"
            icon="close"
            iconSize="XS"
            variant="minimal"
            square
            onClick={ fields.remove.bind(this, index) }
          /> : null
      }
    </div>
  ));

  return (
    <div>
      { rows }
      <div>
        <Button
          className="MultipleItemEditor-addPatternButton"
          onClick={ () => fields.push({}) }
        >
          Add Pattern
        </Button>
      </div>
    </div>
  );
};
