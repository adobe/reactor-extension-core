import React from 'react';
import classNames from 'classnames';
import InfoIcon from '@react/react-spectrum/Icon/Info';
import Tooltip from '@react/react-spectrum/Tooltip';
import OverlayTrigger from '@react/react-spectrum/OverlayTrigger';

import './infoTip.styl';

export default props => {
  return (
    <div className={ classNames(props.className, 'InfoTip') }>
      <OverlayTrigger placement={ props.placement || 'right' } trigger="hover">
        <InfoIcon className="InfoTip-icon" size="XS" />
        <Tooltip className="InfoTip-tooltip">
          { props.children }
        </Tooltip>
      </OverlayTrigger>
    </div>
  );
};
