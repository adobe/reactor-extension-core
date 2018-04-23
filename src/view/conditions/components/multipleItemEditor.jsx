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
import Button from '@coralui/react-coral/lib/Button';

import './multipleItemEditor.styl';

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
          Add Another
        </Button>
      </div>
    </div>
  );
};
