import React from 'react';
import { Button, Flex, Text } from '@adobe/react-spectrum';
import Code from '@spectrum-icons/workflow/Code';

const onClick = ({ onChange, value, language }) => {
  const options = {
    code: value
  };

  if (language) {
    options.language = language;
  }

  window.extensionBridge.openCodeEditor(options).then(onChange);
};
export default ({ onChange, value, language, validationState }) => (
  <Flex alignItems="center" gap="size-100">
    <Button
      variant={validationState === 'invalid' ? 'negative' : 'primary'}
      onPress={() => onClick({ onChange, value, language })}
    >
      <Code />
      <Text>Open Editor</Text>
    </Button>
  </Flex>
);
