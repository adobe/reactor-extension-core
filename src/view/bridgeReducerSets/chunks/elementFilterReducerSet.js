import createID from '../../utils/createID';
import Immutable from 'immutable';

let configToState = (state, config, isNewConfig) => {
  return state.withMutations(state => {
    state.set('showSpecificElementsFilter',
      Boolean(isNewConfig || config.elementSelector || config.elementProperties));
    state.set('showElementPropertiesFilter', Boolean(config.elementProperties));
    state.set('elementSelector', config.elementSelector);

    var elementProperties = config.elementProperties || [];

    // Make sure there's always at least one element property. This is just so the view
    // always shows at least one row.
    if (!elementProperties.length) {
      elementProperties.push({
        name: '',
        value: ''
      });
    }

    // Each element property needs an ID so it can be used as a key when rendering each property.
    elementProperties.forEach(elementProperty => {
      elementProperty.id = createID();
    });

    state.set('elementProperties', Immutable.fromJS(elementProperties));
  });
};

let stateToConfig = (config, state) => {
  if (state.get('showSpecificElementsFilter')) {
    var elementSelector = state.get('elementSelector');

    if (elementSelector) {
      config.elementSelector = elementSelector;
    }

    if (state.get('showElementPropertiesFilter')) {
      var elementProperties = state.get('elementProperties');

      if (elementProperties) {
        elementProperties = elementProperties.toJS();

        for (var i = elementProperties.length - 1; i >= 0; i--) {
          var elementProperty = elementProperties[i];
          // If the element property has a name, we'll keep it around. If it doesn't, then the object
          // is not purposeful and we can remove it.
          if (elementProperty.name) {
            // Delete the ID generated on ingress since it was only used for
            // view rendering purposes.
            delete elementProperty.id;
          } else {
            elementProperties.splice(i, 1);
          }
        }

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
