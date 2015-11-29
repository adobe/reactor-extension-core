import Bacon from 'baconjs';
import {stateUpdate} from './store';
import {List, Map} from 'immutable';
import createID from './utils/createID';

let init = new Bacon.Bus();

stateUpdate.plug(init.map((config) => {
  return (state) => {
    return state.withMutations((state) => {
      state.set('showElementFilterFields', config.has('elementSelector') ||
        config.has('elementProperties'));

      let elementPropertiesMap = config.get('elementProperties');

      let elementProperties = List();

      elementProperties = elementProperties.withMutations((elementProperties) => {
        if (elementPropertiesMap && elementPropertiesMap.size) {
          elementPropertiesMap.forEach((value, name) => {
            elementProperties.push(Map({
              id: createID(),
              name,
              value
            }));
          });
        } else {
          elementProperties.push(Map({
            id: createID(),
            name: '',
            value: ''
          }));
        }
      });

      config = config.set('elementProperties', elementProperties);

      state.set('config', config);
    });
  };
}));

let setShowElementFilterFields = new Bacon.Bus();

stateUpdate.plug(setShowElementFilterFields.map((showElementFilterFields) => {
  return (state) => {
    return state.set('showElementFilterFields', showElementFilterFields);
  };
}));

let setConfigParts = new Bacon.Bus();

stateUpdate.plug(setConfigParts.map((configParts) => {
  return (state) => {
    return state.withMutations((state) => {
      Object.keys(configParts).forEach((path) => {
        var pathSegments = path.split('.');
        pathSegments.unshift('config');
        state.setIn(pathSegments, configParts[path]);
      });
    });
  };
}));

let deleteConfigParts = new Bacon.Bus();

stateUpdate.plug(deleteConfigParts.map((configParts) => {
  return (state) => {
    return state.withMutations((state) => {
      configParts.forEach((path) => {
        var pathSegments = path.split('.');
        pathSegments.unshift('config');
        state.deleteIn(pathSegments);
      });
    });
  };
}));

//let registerConfigTransformer = new Bacon.Bus();
//
//stateUpdate.plug(registerConfigTransformer.map((transformer) => {
//  return (state) => {
//    let transformers = state.get('configTransformers') || List();
//    transformers = transformers.add(transformer);
//    state.set('configTransformers', transformers);
//  };
//}));
//
//let unregisterConfigTransformer = new Bacon.Bus();
//
//stateUpdate.plug(unregisterConfigTransformer.map((transformer) => {
//  return (state) => {
//    let transformers = state.get('configTransformers') || List();
//    transformers = transformers.delete(transformer);
//    state.set('configTransformers', transformers);
//  };
//}));

export default {
  init,
  setConfigParts,
  deleteConfigParts,
  setShowElementFilterFields
};
