import { Map, fromJS } from 'immutable';
import testBooleanAction from './helpers/testBooleanAction';
import testStringAction from './helpers/testStringAction';
import reducer, {
  setShowSpecificElementsFilter,
  setShowElementPropertiesFilter,
  setElementSelector,
  addElementProperty,
  removeElementProperty,
  editElementProperty
} from '../elementFilterActions';

describe('element filter actions', () => {
  it('sets showSpecificElementsFilter', () => {
    testBooleanAction(reducer, setShowSpecificElementsFilter, 'showSpecificElementsFilter');
  });

  it('sets showSpecificElementsFilter', () => {
    testBooleanAction(reducer, setShowElementPropertiesFilter, 'showElementPropertiesFilter');
  });

  it('sets elementSelector', () => {
    testStringAction(reducer, setElementSelector, 'elementSelector');
  });

  it('adds an element property', () => {
    let state = Map();

    let action = addElementProperty({
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

    let action = removeElementProperty('abc');

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

    let action = editElementProperty({
      id: 'def',
      value: 'changedValue'
    });

    state = reducer(state, action);

    let elementProperty = state.get('elementProperties').get('def');

    expect(elementProperty.get('name')).toBe('className'); // assert no change
    expect(elementProperty.get('value')).toBe('changedValue');
  });
});
