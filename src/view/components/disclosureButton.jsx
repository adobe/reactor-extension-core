import React from 'react';
import Icon from '@coralui/react-coral/lib/Icon';

export default ({ ...props }) => {
  const iconClass = props.selected ? 'chevronDown' : 'chevronRight';

  return (
    <button className="u-buttonReset" onClick={ props.onClick }>
      <Icon className="DisclosureButton-icon u-gapRight" icon={ iconClass } />
      { props.label }
    </button>
  );
};
