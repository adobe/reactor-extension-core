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

import React from 'react';
import { fireEvent, render as rtlRender, screen } from '@testing-library/react';
import DisclosureButton from '../disclosureButton';

const render = (props) => rtlRender(<DisclosureButton {...props} />);

describe('disclosure button', () => {
  it('shows down chevron when selected', () => {
    render({
      selected: true
    });

    expect(screen.getByTestId('chevron-down')).toBeTruthy();
    expect(screen.queryByTestId('chevron-right')).toBeFalsy();
  });

  it('shows right chevron when not selected', () => {
    render({
      selected: false
    });

    expect(screen.queryByTestId('chevron-down')).toBeFalsy();
    expect(screen.getByTestId('chevron-right')).toBeTruthy();
  });

  it('calls onClick when clicked', () => {
    const onClick = jasmine.createSpy();
    render({
      onClick
    });

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
