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
import Radio from '@coralui/react-coral/lib/Radio';
import Protocol from '../protocol';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const radios = wrapper.find(Radio);

  const httpRadio = radios.filterWhere(n => n.prop('value') === 'http:').node;
  const httpsRadio = radios.filterWhere(n => n.prop('value') === 'https:').node;

  return {
    httpRadio,
    httpsRadio
  };
};

describe('protocol view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Protocol, extensionBridge));
  });

  it('sets http radio as checked by default', () => {
    extensionBridge.init();

    const { httpRadio, httpsRadio } = getReactComponents(instance);

    expect(httpRadio.props.checked).toBe(true);
    expect(httpsRadio.props.checked).toBe(false);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        protocol: 'https:'
      }
    });

    const { httpRadio, httpsRadio } = getReactComponents(instance);

    expect(httpRadio.props.checked).toBe(false);
    expect(httpsRadio.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { httpsRadio } = getReactComponents(instance);

    httpsRadio.props.onChange('https:');

    expect(extensionBridge.getSettings()).toEqual({
      protocol: 'https:'
    });
  });
});
