import reducer, { actionCreators } from '../deviceTypeActions';
import { Map, List } from 'immutable';

describe('device type actions', () => {
  it('selects a device type', () => {
    let state = Map({
      deviceTypes: List()
    });
    state = reducer(state, actionCreators.selectDeviceType('foo'));
    expect(state.get('deviceTypes').toJS()).toEqual(['foo']);
  });

  it('deselects a device type', () => {
    let state = Map({
      deviceTypes: List(['foo', 'bar'])
    });
    state = reducer(state, actionCreators.deselectDeviceType('bar'));
    expect(state.get('deviceTypes').toJS()).toEqual(['foo']);
  });
});
