import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { mapStateToProps, DeviceType } from '../deviceType';
import { fromJS, List } from 'immutable';
import { actionCreators } from '../actions/deviceTypeActions';
import CheckboxList from '../../components/checkboxList';

describe('device type view', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(
      <DeviceType {...props} />
    );
  };

  let getParts = component => {
    return {
      checkboxList: TestUtils.findRenderedComponentWithType(component, CheckboxList)
    };
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      deviceTypes: ['foo', 'bar']
    }));

    expect(props.deviceTypes.toJS()).toEqual(['foo', 'bar']);
  });

  describe('checkbox list', () => {
    it('is provided a list of items', () => {
      let { checkboxList } = getParts(render());

      expect(checkboxList.props.items)
    });

    it('is provided selected values', () => {
      let { checkboxList } = getParts(render({
        deviceTypes: List(['foo', 'bar'])
      }));

      expect(checkboxList.props.selectedValues.toJS()).toEqual(['foo', 'bar']);
    });

    it('dispatches an action when an item is selected', () => {
      let dispatch = jasmine.createSpy();
      let { checkboxList } = getParts(render({
        deviceTypes: List(),
        dispatch
      }));

      checkboxList.props.select('foo');

      let matchAction = actionCreators.setDeviceTypes(List(['foo']));

      let action = dispatch.calls.argsFor(0)[0];
      expect(action.type).toEqual(matchAction.type);
      expect(action.payload.toJS()).toEqual(matchAction.payload.toJS());
    });

    it('dispatches an action when an item is deselected', () => {
      let dispatch = jasmine.createSpy();
      let { checkboxList } = getParts(render({
        deviceTypes: List(['foo', 'bar']),
        dispatch
      }));

      checkboxList.props.deselect('foo');

      let matchAction = actionCreators.setDeviceTypes(List(['bar']));

      let action = dispatch.calls.argsFor(0)[0];
      expect(action.type).toEqual(matchAction.type);
      expect(action.payload.toJS()).toEqual(matchAction.payload.toJS());
    });
  });
});
