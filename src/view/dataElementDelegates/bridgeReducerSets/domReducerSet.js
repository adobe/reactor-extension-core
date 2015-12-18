const ELEMENT_PROPERTY_PRESETS = [
  {
    value: 'id',
    label: 'id'
  },
  {
    value: 'href',
    label: 'href'
  },
  {
    value: 'class',
    label: 'class'
  },
  {
    value: 'src',
    label: 'src'
  },
  {
    value: 'alt',
    label: 'alt'
  },
  {
    value: 'innerHTML',
    label: 'HTML'
  },
  {
    value: 'text',
    label: 'text'
  },
  {
    value: 'name',
    label: 'name'
  },
  {
    value: 'value',
    label: 'value'
  },
  {
    value: 'type',
    label: 'type'
  },
  {
    value: 'custom',
    label: 'other attribute'
  }
];

export let configToState = (state, action) => {
  let { elementSelector, elementProperty } = action.payload.config;

  let elementPropertyIsPreset =
    ELEMENT_PROPERTY_PRESETS.some(preset => preset.value === elementProperty);

  let selectedElementPropertyPreset;
  let customElementProperty;

  if (elementProperty === undefined) {
    selectedElementPropertyPreset = 'id';
  } else if (elementPropertyIsPreset && elementProperty !== 'custom') {
    selectedElementPropertyPreset = elementProperty;
  } else {
    selectedElementPropertyPreset = 'custom';
    customElementProperty = elementProperty;
  }

  return state.merge({
    elementSelector,
    selectedElementPropertyPreset,
    customElementProperty,
    elementPropertyPresets: ELEMENT_PROPERTY_PRESETS
  });
};

export let stateToConfig = (config, state) => {
  config.elementSelector = state.get('elementSelector');

  let selectedElementPropertyPreset = state.get('selectedElementPropertyPreset');
  let customElementProperty = state.get('customElementProperty');

  if (selectedElementPropertyPreset === 'custom') {
    config.elementProperty = customElementProperty;
  } else {
    config.elementProperty = selectedElementPropertyPreset;
  }

  return config;
};

export let validate = state => {
  return state.withMutations(state => {
    state.setIn(['errors', 'elementSelectorInvalid'], !state.get('elementSelector'));

    let elementPropertyInvalid = state.get('selectedElementPropertyPreset') === 'custom' &&
      !state.get('customElementProperty');
    state.setIn(['errors', 'elementPropertyInvalid'], elementPropertyInvalid);
  });
};

export default {
  configToState,
  stateToConfig,
  validate
};
