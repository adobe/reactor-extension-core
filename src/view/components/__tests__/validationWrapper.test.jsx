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

import { mount } from 'enzyme';
import React from 'react';
import OverlayTrigger from '@react/react-spectrum/OverlayTrigger';
import Tooltip from '@react/react-spectrum/Tooltip';
import ValidationWrapper from '../validationWrapper';

const render = props => mount(<ValidationWrapper { ...props } />);

const getReactComponents = (wrapper) => {
  const overlayTrigger = wrapper.find(OverlayTrigger).node;
  const tooltip = wrapper.find(Tooltip).node;

  return {
    overlayTrigger,
    tooltip
  };
};

describe('validation wrapper', () => {
  it('enables trigger when there\'s an error', () => {
    const { overlayTrigger } = getReactComponents(render({
      error: 'Bad things'
    }));

    expect(overlayTrigger.props.disabled).toBe(false);
  });

  it('disables trigger when there\'s no error', () => {
    const { overlayTrigger } = getReactComponents(render({}));

    expect(overlayTrigger.props.disabled).toBe(true);
  });
});
