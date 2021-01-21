/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import { mount } from 'enzyme';
import { TextField } from '@adobe/react-spectrum';
import RegexToggle from '../../components/regexToggle';
import Path, { formConfig } from '../path';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const rows = wrapper.find('div[data-row]').map((row) => ({
    pathTextfield: row.find(TextField),
    pathRegexToggle: row.find(RegexToggle)
  }));

  return {
    rows
  };
};

const testProps = {
  settings: {
    paths: [
      {
        value: 'foo'
      },
      {
        value: 'bar',
        valueIsRegex: true
      }
    ]
  }
};

describe('path condition view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(Path, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init(testProps);

    const { rows } = getReactComponents(instance);

    expect(rows[0].pathTextfield.props().value).toBe('foo');
    expect(rows[1].pathTextfield.props().value).toBe('bar');
    expect(rows[0].pathRegexToggle.props().value).toBe('');
    expect(rows[1].pathRegexToggle.props().value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { rows } = getReactComponents(instance);

    rows[0].pathTextfield.props().onChange('goo');
    rows[0].pathRegexToggle.props().onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      paths: [
        {
          value: 'goo',
          valueIsRegex: true
        }
      ]
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { rows } = getReactComponents(instance);

    expect(rows[0].pathTextfield.props().validationState).toBe('invalid');
  });
});
