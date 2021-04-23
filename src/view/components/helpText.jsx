import React from 'react';
import { Flex, Text, View } from '@adobe/react-spectrum';
import Alert from '@spectrum-icons/workflow/Alert';
import './helpText.styl';

const colorToClassName = (color) => {
  const className = `spectrum-semantic-${color}-color-text-small`;
  switch (color) {
    case 'negative':
      return className;
    default:
      return undefined;
  }
};

export default ({ color = 'notice', children, ...containerProps }) => (
  <Flex gap="size-200" {...containerProps}>
    <View
      // for when spectrum views support color slot context...
      color={color}
    >
      <Flex gap="size-100" UNSAFE_className="warning-container-content">
        <Alert
          aria-label="Alert"
          size="S"
          //remove when color slot context is available on View
          color={color}
        />
        <Text
          //remove when color slot context is available on View
          UNSAFE_className={colorToClassName(color)}
        >
          {children}
        </Text>
      </Flex>
    </View>
  </Flex>
);
