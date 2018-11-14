import React from 'react';
import classNames from 'classnames';
import OverlayTrigger from '@react/react-spectrum/OverlayTrigger';
import Tooltip from '@react/react-spectrum/Tooltip';
import './validationWrapper.styl';

export default ({
  placement, error, className, children
}) => (
  <OverlayTrigger
    placement={placement || 'right'}
    variant="error"
    disabled={!error}
  >
    <div
      className={classNames(className, 'ValidationWrapper')}
    >
      { children }
    </div>
    <Tooltip>
      { error }
    </Tooltip>
  </OverlayTrigger>
);
