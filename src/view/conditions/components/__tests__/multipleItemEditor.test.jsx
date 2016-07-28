import { mount } from 'enzyme';
import React from 'react';
import Button from '@coralui/react-coral/lib/Button';
import MultipleItemEditor from '../multipleItemEditor';

const getReactComponents = (wrapper) => {
  const rows = wrapper.find('div[data-type="row"]').nodes;
  const removeButtons = wrapper.find(Button).filterWhere(n => n.prop('icon') === 'close').nodes;
  const addButton = wrapper.find(Button).filterWhere(n => n.prop('icon') === 'addCircle').node;

  return {
    rows,
    removeButtons,
    addButton
  };
};

const getTestProps = () => ({
  items: [
    { id: 'a', label: 'foo' },
    { id: 'b', label: 'bar' }
  ],
  renderItem: jasmine.createSpy().and.callFake(item => <span>{ item.label }</span>),
  getKey: jasmine.createSpy().and.callFake(item => item.id),
  onAddItem: jasmine.createSpy(),
  onRemoveItem: jasmine.createSpy()
});

const render = props => mount(<MultipleItemEditor { ...props } />);

describe('multiple item editor', () => {
  it('renders a row for each item', () => {
    const props = getTestProps();
    const { rows } = getReactComponents(render(props));
    expect(props.getKey).toHaveBeenCalledTimes(2);
    expect(props.renderItem).toHaveBeenCalledTimes(2);
    expect(rows[0]).toBeDefined();
    expect(rows[1]).toBeDefined();
    expect(rows[0]).not.toBe(rows[1]);
  });

  it('calls onAddItem when add button is clicked', () => {
    const props = getTestProps();
    const { addButton } = getReactComponents(render(props));

    addButton.props.onClick();

    expect(props.onAddItem).toHaveBeenCalled();
  });

  it('calls onRemoveItem when remove button is clicked for a row', () => {
    const props = getTestProps();
    const { removeButtons } = getReactComponents(render(props));

    removeButtons[1].props.onClick();

    expect(props.onRemoveItem).toHaveBeenCalledWith(1);
  });
});
