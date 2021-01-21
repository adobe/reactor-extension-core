import React from 'react';
import { ActionButton, Tooltip, TooltipTrigger } from '@adobe/react-spectrum';
import Info from '@spectrum-icons/workflow/Info';

export default ({ placement, children }) => (
  <>
    <TooltipTrigger delay={0} placement={placement || 'right'}>
      <ActionButton isQuiet aria-label="Info">
        <Info size="S" />
      </ActionButton>
      <Tooltip>{children}</Tooltip>
    </TooltipTrigger>
  </>
);
