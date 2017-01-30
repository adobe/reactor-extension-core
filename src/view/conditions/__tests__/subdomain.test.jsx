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

import { mount } from 'enzyme';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Switch from '@coralui/react-coral/lib/Switch';
import Subdomain from '../subdomain';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const rows = wrapper.find('[data-row]').map(row => ({
    subdomainTextfield: row.find(Textfield).node,
    subdomainErrorTip: row.find(ErrorTip).node,
    subdomainRegexSwitch: row.find(Switch).node
  }));

  return {
    rows
  };
};

const testProps = {
  settings: {
    subdomains: [
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

describe('subdomain view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Subdomain, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init(testProps);

    const { rows } = getReactComponents(instance);

    expect(rows[0].subdomainTextfield.props.value).toBe('foo');
    expect(rows[1].subdomainTextfield.props.value).toBe('bar');
    expect(rows[0].subdomainRegexSwitch.props.checked).toBe(false);
    expect(rows[1].subdomainRegexSwitch.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { rows } = getReactComponents(instance);

    rows[0].subdomainTextfield.props.onChange('goo');
    rows[0].subdomainRegexSwitch.props.onChange({ target: { checked: true } });


    expect(extensionBridge.getSettings()).toEqual({
      subdomains: [
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

    expect(rows[0].subdomainErrorTip).toBeDefined();
  });
});
