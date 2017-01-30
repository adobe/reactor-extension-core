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
import NewReturning from '../newReturning';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const radios = wrapper.find(Radio);

  const newVisitorRadio = radios.filterWhere(n => n.prop('value') === 'new').node;
  const returningVisitorRadio = radios.filterWhere(n => n.prop('value') === 'returning').node;

  return {
    newVisitorRadio,
    returningVisitorRadio
  };
};

describe('new/returning visitor view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(NewReturning, extensionBridge));
  });

  it('sets new visitor radio as checked by default', () => {
    extensionBridge.init();

    const { newVisitorRadio, returningVisitorRadio } = getReactComponents(instance);

    expect(newVisitorRadio.props.checked).toBe(true);
    expect(returningVisitorRadio.props.checked).toBe(false);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        isNewVisitor: false
      }
    });

    const { newVisitorRadio, returningVisitorRadio } = getReactComponents(instance);

    expect(newVisitorRadio.props.checked).toBe(false);
    expect(returningVisitorRadio.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { returningVisitorRadio } = getReactComponents(instance);

    returningVisitorRadio.props.onChange('returning');

    expect(extensionBridge.getSettings()).toEqual({
      isNewVisitor: false
    });
  });
});
