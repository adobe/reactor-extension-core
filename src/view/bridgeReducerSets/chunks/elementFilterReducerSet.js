import createID from '../../utils/createID';
import Immutable from 'immutable';

let configToState = (state, action) => {
  let { config, isNewConfig } = action.payload;
  return state.withMutations(state => {
    state.set('showSpecificElementsFilter',
      Boolean(isNewConfig || config.elementSelector || config.elementProperties));
    state.set('showElementPropertiesFilter', Boolean(config.elementProperties));
    state.set('elementSelector', config.elementSelector);

    var elementProperties = config.elementProperties || [];

    var elementPropertiesByID = elementProperties.reduce((indexedById, elementProperty) => {
      let id = createID();
      elementProperty.id = id;
      indexedById[id] = elementProperty;
      return indexedById;
    }, {});

    // Make sure there's always at least one element property. This is just so the view
    // always shows at least one row.
    if (!elementProperties.length) {
      let id = createID();
      elementPropertiesByID[id] = {
        id: id,
        name: '',
        value: ''
      };
    }

    state.set('elementProperties', Immutable.fromJS(elementPropertiesByID));
  });
};

let stateToConfig = (config, state) => {
  if (state.get('showSpecificElementsFilter')) {
    var elementSelector = state.get('elementSelector');

    if (elementSelector) {
      config.elementSelector = elementSelector;
    }

    if (state.get('showElementPropertiesFilter')) {
      let elementPropertiesByID = state.get('elementProperties');

      if (elementPropertiesByID) {
        let elementProperties = elementPropertiesByID
          .filter(elementProperty => elementProperty.get('name'))
          .map(elementProperty => elementProperty.delete('id'))
          .toArray();

        if (elementProperties.length) {
          config.elementProperties = elementProperties;
        }
      }
    }
  }

  return config;
};

let validate = state => {
  let selectorInvalid = Boolean(
    state.get('showSpecificElementsFilter') && !state.get('elementSelector')
  );

  return state.setIn(['errors', 'selectorInvalid'], selectorInvalid);
};

export default {
  configToState,
  stateToConfig,
  validate
};
