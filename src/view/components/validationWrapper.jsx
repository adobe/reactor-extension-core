import React from 'react';
import { TooltipTrigger, Tooltip } from '@adobe/react-spectrum';

export default ({ placement, error, children }) => (
  <TooltipTrigger
    delay={0}
    placement={placement || 'right'}
    isDisabled={!error}
  >
    {children}
    <Tooltip>{error}</Tooltip>
  </TooltipTrigger>
);
