import React from 'react';
import classNames from 'classnames';
import InfoIcon from '@react/react-spectrum/Icon/Info';
import Tooltip from '@react/react-spectrum/Tooltip';
import OverlayTrigger from '@react/react-spectrum/OverlayTrigger';

import './infoTip.styl';

export default ({ className, placement, children }) => (
  <div className={classNames(className, 'InfoTip')}>
    <OverlayTrigger placement={placement || 'right'} trigger="hover">
      <span>
        <InfoIcon className="InfoTip-icon" size="XS" />
      </span>
      <Tooltip className="InfoTip-tooltip">
        { children }
      </Tooltip>
    </OverlayTrigger>
  </div>
);
