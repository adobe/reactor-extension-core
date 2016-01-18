import React from 'react';
import Coral from 'coralui-support-react';
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

const getParts = instance => {
  return {
    row0: instance.refs.row0,
    row1: instance.refs.row1,
    removeButton0: instance.refs.removeButton1,
    removeButton1: instance.refs.removeButton2,
    addButton: instance.refs.addButton
  };
};

describe('multiple item editor', () => {
  it('renders a row for each item', () => {
    const props = getTestProps();
    const { row0, row1 } = getParts(render(props));
    expect(props.getKey).toHaveBeenCalledTimes(2);
    expect(props.renderItem).toHaveBeenCalledTimes(2);
    expect(row0).toBeDefined();
    expect(row1).toBeDefined();
    expect(row0).not.toBe(row1);
  });

  it('calls onAddItem when add button is clicked', () => {
    const props = getTestProps();
    const { addButton } = getParts(render(props));

    addButton.props.onClick();

    expect(props.onAddItem).toHaveBeenCalled();
  });

  it('calls onRemoveItem when remove button is clicked for a row', () => {
    const props = getTestProps();
    const { removeButton0 } = getParts(render(props));

    removeButton0.props.onClick();

    expect(props.onRemoveItem).toHaveBeenCalledWith(1);
  });
});
