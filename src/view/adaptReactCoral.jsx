/* eslint no-unused-vars: 0 */

import React from 'react';

const eventHandlerRegex = /^on[A-Z]/;

/**
 * If a consumer specifies an event handler (say, onChange), we need to merge it with any handler
 * that redux-form provides for the same event type otherwise it will get overridden by redux-forms
 * handler. We do this by providing a wrapper handler which calls redux-form's handler first,
 * then the consumer-defined handler.
 * @param reduxFormProvidedProps
 * @param consumerProvidedProps
 */
const mergeHandlers = (reduxFormProvidedProps, consumerProvidedProps) => {
  Object.keys(consumerProvidedProps).forEach(consumerProvidedPropName => {
    if (reduxFormProvidedProps[consumerProvidedPropName] &&
      eventHandlerRegex.test(consumerProvidedPropName)) {
      const reduxFormHandler = reduxFormProvidedProps[consumerProvidedPropName];
      const consumerHandler = consumerProvidedProps[consumerProvidedPropName];

      reduxFormProvidedProps[consumerProvidedPropName] = (...args) => {
        reduxFormHandler(...args);
        consumerHandler(...args);
      };

      delete consumerProvidedProps[consumerProvidedPropName];
    }
  });
};


// Map where the key is a ReactCoral component class and the value is the adapted component
// class.
const componentMap = new Map();

export default function(Component) {
  // We must re-use the same adapted component rather than re-creating it each time.
  // See https://github.com/erikras/redux-form/issues/961 and the "breaking change" documented in
  // https://github.com/erikras/redux-form/releases/tag/v6.0.0-alpha.14
  let AdaptedComponent = componentMap.get(Component);

  if (!AdaptedComponent) {
    // We match the name instead of Component === Autocomplete because that would require us to
    // require in the React-Coral class (and therefore it would end up in the app build)
    // even if we never ended up using the class.
    if (Component.name === 'Select' || Component.name === 'Autocomplete') {
      AdaptedComponent = ({ input, meta, ...rest }) => {
        mergeHandlers(input, rest);

        const onBlur = () => {
          input.onBlur(input.value);
        };

        const onChange = options => {
          if (options) {
            input.onChange(rest.multiple ? options.map(option => option.value) : options.value);
          } else {
            input.onChange(null);
          }
        };

        return (
          <Component
            { ...rest }
            { ...input }
            onBlur={ onBlur }
            onChange={ onChange }
          />
        );
      };
    } else {
      AdaptedComponent = ({ input, meta, ...rest }) => {
        mergeHandlers(input, rest);
        return <Component { ...rest } { ...input } />;
      };
    }
    componentMap.set(Component, AdaptedComponent);
  }

  return AdaptedComponent;
}
