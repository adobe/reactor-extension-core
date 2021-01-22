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
import React from 'react';
import { ActionButton, Button } from '@adobe/react-spectrum';
import MultipleItemEditor from '../multipleItemEditor';

const getReactComponents = (wrapper) => {
  wrapper.update();
  const rows = wrapper.find('div[data-type="row"]').map((row) => ({
    element: row,
    removeButton: row.find(ActionButton)
  }));
  const addButton = wrapper.find(Button).last();

  return {
    rows,
    addButton
  };
};

const getTestProps = () => ({
  fields: {
    map: (fn) => [0, 1].map((index) => fn(`props[${index}]`, index)),
    push: jasmine.createSpy('push'),
    remove: jasmine.createSpy('remove'),
    length: 2
  },
  renderItem: jasmine
    .createSpy('renderItem')
    .and.callFake((item) => <span>{item.label}</span>)
});

const render = (props) => mount(<MultipleItemEditor {...props} />);

describe('multiple item editor', () => {
  it('renders a row for each item', () => {
    const props = getTestProps();
    const { rows } = getReactComponents(render(props));
    expect(props.renderItem).toHaveBeenCalledTimes(2);
    expect(rows[0]).toBeDefined();
    expect(rows[1]).toBeDefined();
    expect(rows[0].element).not.toBe(rows[1].element);
  });

  it('calls onAddItem when add button is clicked', () => {
    const props = getTestProps();
    const { addButton } = getReactComponents(render(props));

    addButton.props().onPress();
    expect(props.fields.push).toHaveBeenCalled();
  });

  it('calls onRemoveItem when remove button is clicked for a row', () => {
    const props = getTestProps();
    const { rows } = getReactComponents(render(props));

    rows[1].removeButton.props().onPress();
    expect(props.fields.remove).toHaveBeenCalledWith(1);
  });
});
