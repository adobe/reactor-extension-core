import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import CheckboxList from '../checkboxList';
import Coral from 'coralui-support-react';

describe('disclosure button', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(<CheckboxList {...props} />);
  };

  let getParts = component => {
    return {
      checkboxes: TestUtils.scryRenderedComponentsWithType(component, Coral.Checkbox)
    };
  };

  it('displays a checkbox for each item', () => {
    let { checkboxes } = getParts(render({
      items: [
        'foo',
        'bar'
      ]
    }));

    expect(checkboxes.length).toBe(2);
  });

  it('calls select when a checkbox is selected', () => {
    let select = jasmine.createSpy();
    let { checkboxes } = getParts(render({
      items: [
        'foo',
        'bar'
      ],
      select
    }));

    TestUtils.Simulate.change(ReactDOM.findDOMNode(checkboxes[1]), {
      target: {
        value: 'bar',
        checked: true
      }
    });

    expect(select).toHaveBeenCalledWith('bar');
  });

  it('calls deselect when a checkbox is deselected', () => {
    let deselect = jasmine.createSpy();
    let { checkboxes } = getParts(render({
      items: [
        'foo',
        'bar'
      ],
      selectedValues: [
        'foo',
        'bar'
      ],
      deselect
    }));

    TestUtils.Simulate.change(ReactDOM.findDOMNode(checkboxes[1]), {
      target: {
        value: 'bar',
        checked: false
      }
    });

    expect(deselect).toHaveBeenCalledWith('bar');
  });
});
