import React from 'react';
import TestUtils from 'react-addons-test-utils';

import MultipleItemEditor from '../multipleItemEditor';

const getTestProps = () => {
  return {
    items: [
      { id: 'a', label: 'foo' },
      { id: 'b', label: 'bar' }
    ],
    renderItem: jasmine.createSpy().and.callFake(item => <span>{item.label}</span>),
    getKey: jasmine.createSpy().and.callFake(item => item.id),
    onAddItem: jasmine.createSpy(),
    onRemoveItem: jasmine.createSpy()
  };
};

const render = props => {
  return TestUtils.renderIntoDocument(<MultipleItemEditor {...props}/>);
};

describe('multiple item editor', () => {
  it('renders a row for each item', () => {
    const props = getTestProps();
    const { row0, row1 } = render(props).refs;
    expect(props.getKey).toHaveBeenCalledTimes(2);
    expect(props.renderItem).toHaveBeenCalledTimes(2);
    expect(row0).toBeDefined();
    expect(row1).toBeDefined();
    expect(row0).not.toBe(row1);
  });

  it('calls onAddItem when add button is clicked', () => {
    const props = getTestProps();
    const { addButton } = render(props).refs;

    addButton.props.onClick();

    expect(props.onAddItem).toHaveBeenCalled();
  });

  it('calls onRemoveItem when remove button is clicked for a row', () => {
    const props = getTestProps();
    const { removeButton1 } = render(props).refs;

    removeButton1.props.onClick();

    expect(props.onRemoveItem).toHaveBeenCalledWith(1);
  });
});
