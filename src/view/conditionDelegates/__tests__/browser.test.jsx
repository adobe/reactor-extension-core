import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { mapStateToProps, Browser } from '../browser';
import { fromJS, List } from 'immutable';
import { actionCreators } from '../actions/browserActions';
import CheckboxList from '../../components/checkboxList';

describe('browser view', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(
      <Browser {...props} />
    );
  };

  let getParts = component => {
    return {
      checkboxList: TestUtils.findRenderedComponentWithType(component, CheckboxList)
    };
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      browsers: ['Chrome', 'IE']
    }));

    expect(props.browsers.toJS()).toEqual(['Chrome', 'IE']);
  });

  describe('checkbox list', () => {
    it('is provided a list of items', () => {
      let { checkboxList } = getParts(render());

      expect(checkboxList.props.items.length).toBeGreaterThan(0);
    });

    it('is provided selected values', () => {
      let { checkboxList } = getParts(render({
        browsers: List(['foo', 'bar'])
      }));

      expect(checkboxList.props.selectedValues.toJS()).toEqual(['foo', 'bar']);
    });

    it('dispatches an action when an item is selected', () => {
      let dispatch = jasmine.createSpy();
      let { checkboxList } = getParts(render({
        dispatch
      }));

      checkboxList.props.select('foo');

      expect(dispatch).toHaveBeenCalledWith(actionCreators.selectBrowser('foo'));
    });

    it('dispatches an action when an item is deselected', () => {
      let dispatch = jasmine.createSpy();
      let { checkboxList } = getParts(render({
        dispatch
      }));

      checkboxList.props.deselect('foo');

      expect(dispatch).toHaveBeenCalledWith(actionCreators.deselectBrowser('foo'));
    });
  });
});
