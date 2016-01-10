import { Map, fromJS } from 'immutable';
import testPassThroughAction from '../../../../__tests__/helpers/testPassThroughAction';
import reducer, { actionCreators } from '../elementFilterActions';

describe('element filter actions', () => {
  it('sets showSpecificElementsFilter', () => {
    testPassThroughAction(reducer, actionCreators.setShowSpecificElementsFilter, 'showSpecificElementsFilter');
  });

  it('sets showSpecificElementsFilter', () => {
    testPassThroughAction(reducer, actionCreators.setShowElementPropertiesFilter, 'showElementPropertiesFilter');
  });

  it('sets elementSelector', () => {
    testPassThroughAction(reducer, actionCreators.setElementSelector, 'elementSelector');
  });

  it('adds an element property', () => {
    let state = Map();

    let action = actionCreators.addElementProperty({
      name: 'innerHTML',
      value: 'foo'
    });

    state = reducer(state, action);

    let elementProperties = state.get('elementProperties');
    expect(elementProperties.size).toEqual(1);

    let id = elementProperties.keySeq().first();
    expect(typeof id).toBe('string');

    let elementProperty = elementProperties.get(id);
    expect(elementProperty.get('name')).toBe('innerHTML');
    expect(elementProperty.get('value')).toBe('foo');
  });

  it('removes an element property', () => {
    let state = fromJS({
      elementProperties: {
        'abc': {
          id: 'abc',
          name: 'innerHTML',
          value: 'foo'
        },
        'def': {
          id: 'def',
          name: 'className',
          value: 'bar'
        }
      }
    });

    let action = actionCreators.removeElementProperty('abc');

    state = reducer(state, action);

    let elementProperties = state.get('elementProperties');
    expect(elementProperties.size).toBe(1);
    expect(elementProperties.keySeq().first()).toBe('def');
  });

  it('edits an element property', () => {
    let state = fromJS({
      elementProperties: {
        'abc': {
          id: 'abc',
          name: 'innerHTML',
          value: 'foo'
        },
        'def': {
          id: 'def',
          name: 'className',
          value: 'bar'
        }
      }
    });

    let action = actionCreators.editElementProperty({
      id: 'def',
      value: 'changedValue'
    });

    state = reducer(state, action);

    let elementProperty = state.get('elementProperties').get('def');

    expect(elementProperty.get('name')).toBe('className'); // assert no change
    expect(elementProperty.get('value')).toBe('changedValue');
  });
});
