import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { mapStateToProps, Domain } from '../domain';
import { fromJS, List } from 'immutable';
import { actionCreators } from '../actions/domainActions';
import CheckboxList from '../../components/checkboxList';

describe('domain view', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(
      <Domain {...props} />
    );
  };

  let getParts = component => {
    return {
      checkboxList: TestUtils.findRenderedComponentWithType(component, CheckboxList)
    };
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      selectedDomains: ['foo'],
      availableDomains: ['foo', 'bar']
    }));

    expect(props.selectedDomains.toJS()).toEqual(['foo']);
    expect(props.availableDomains.toJS()).toEqual(['foo', 'bar']);
  });

  describe('checkbox list', () => {
    it('is provided a list of items', () => {
      let { checkboxList } = getParts(render({
        availableDomains: List(['foo', 'bar'])
      }));

      expect(checkboxList.props.items.toJS()).toEqual(['foo', 'bar']);
    });

    it('is provided selected values', () => {
      let { checkboxList } = getParts(render({
        selectedDomains: List(['foo', 'bar'])
      }));

      expect(checkboxList.props.selectedValues.toJS()).toEqual(['foo', 'bar']);
    });

    it('dispatches an action when an item is selected', () => {
      let dispatch = jasmine.createSpy();
      let { checkboxList } = getParts(render({
        dispatch
      }));

      checkboxList.props.select('foo');

      expect(dispatch).toHaveBeenCalledWith(actionCreators.selectDomain('foo'));
    });

    it('dispatches an action when an item is deselected', () => {
      let dispatch = jasmine.createSpy();
      let { checkboxList } = getParts(render({
        dispatch
      }));

      checkboxList.props.deselect('foo');

      expect(dispatch).toHaveBeenCalledWith(actionCreators.deselectDomain('foo'));
    });
  });
});
