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
import Button from '@coralui/react-coral/lib/Button';
import MultipleItemEditor from '../multipleItemEditor';

const getReactComponents = (wrapper) => {
  const rows = wrapper.find('div[data-type="row"]').nodes;
  const removeButtons = wrapper.find(Button).filterWhere(n => n.prop('icon') === 'close').nodes;
  const addButton = wrapper.find(Button)
    .filterWhere(n => n.prop('className') === 'MultipleItemEditor-addPatternButton').node;

  return {
    rows,
    removeButtons,
    addButton
  };
};

const getTestProps = () => ({
  fields: {
    map: fn => [0, 1].map(index => fn(`props[${index}]`, index)),
    push: jasmine.createSpy('push'),
    remove: jasmine.createSpy('remove'),
    length: 2
  },
  renderItem: jasmine.createSpy('renderItem').and.callFake(item => <span>{ item.label }</span>)
});

const render = props => mount(<MultipleItemEditor { ...props } />);

describe('multiple item editor', () => {
  it('renders a row for each item', () => {
    const props = getTestProps();
    const { rows } = getReactComponents(render(props));
    expect(props.renderItem).toHaveBeenCalledTimes(2);
    expect(rows[0]).toBeDefined();
    expect(rows[1]).toBeDefined();
    expect(rows[0]).not.toBe(rows[1]);
  });

  it('calls onAddItem when add button is clicked', () => {
    const props = getTestProps();
    const { addButton } = getReactComponents(render(props));

    addButton.props.onClick();

    expect(props.fields.push).toHaveBeenCalled();
  });

  it('calls onRemoveItem when remove button is clicked for a row', () => {
    const props = getTestProps();
    const { removeButtons } = getReactComponents(render(props));

    removeButtons[1].props.onClick();

    expect(props.fields.remove).toHaveBeenCalledWith(1);
  });
});
