import React from 'react';
import classNames from 'classnames';
import OverlayTrigger from '@react/react-spectrum/OverlayTrigger';
import Tooltip from '@react/react-spectrum/Tooltip';
import './validationWrapper.styl';

export default (props) => (
  <OverlayTrigger
    placement={ props.placement || 'right' }
    variant="error"
    disabled={ !props.error }
  >
    <div
      className={ classNames(props.className, 'ValidationWrapper') }
    >
      { props.children }
    </div>
    <Tooltip>
      { props.error }
    </Tooltip>
  </OverlayTrigger>
);
