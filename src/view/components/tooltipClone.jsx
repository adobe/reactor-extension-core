import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './tooltipClone.styl';

const determineToolTipPosition = (targetElement, tooltipElement, placement) => {
  const triggerRect = targetElement?.getBoundingClientRect?.() || {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0
  };

  const spacing = 15;
  const spacingSM = 5;

  const getLeftCalc = () => ({
    top:
      triggerRect.top +
      (targetElement.offsetHeight - tooltipElement?.offsetHeight) / 2,
    left: triggerRect.left - tooltipElement?.offsetWidth - spacing,
    width: tooltipElement?.offsetWidth,
    placement: 'left'
  });
  const getRightCalc = () => ({
    top:
      triggerRect.top +
      (targetElement.offsetHeight - tooltipElement?.offsetHeight) / 2,
    left: triggerRect.right + spacing,
    width: tooltipElement?.offsetWidth,
    placement: 'right'
  });
  const getTopCalc = () => ({
    // the label adds some to the height, so subtract the spacing from that height first
    top: triggerRect.top - (tooltipElement.offsetHeight - spacing) - spacingSM,
    left:
      triggerRect.left +
      (targetElement.offsetWidth - tooltipElement?.offsetWidth) / 2,
    height: tooltipElement?.offsetHeight,
    placement: 'top'
  });
  const getBottomCalc = () => ({
    top: triggerRect.bottom + spacing,
    left:
      triggerRect.left +
      (targetElement.offsetWidth - tooltipElement?.offsetWidth) / 2,
    height: tooltipElement?.offsetHeight,
    placement: 'bottom'
  });

  if (placement === 'left') {
    const left = getLeftCalc();
    if (left.left + left.width <= document.body.clientWidth) {
      return getRightCalc();
    }
    return left;
  }
  if (placement === 'right') {
    const right = getRightCalc();
    if (right.left + right.width > document.body.clientWidth) {
      return getLeftCalc();
    }
    return right;
  }
  if (placement === 'top') {
    const top = getTopCalc();
    if (top.top < 0) {
      return getBottomCalc();
    }
    return top;
  }

  const bottom = getBottomCalc();
  if (bottom.top + bottom.height > document.body.clientHeight) {
    return getTopCalc();
  }
  return bottom;
};

function ToolTipWithRef({ isOpen, placement, children }, ref) {
  return (
    <div
      role="tooltip"
      className={`tooltip-placement-${placement} spectrum-alternative-ToolTip${
        isOpen ? ' is-open' : ''
      }`}
      ref={ref}
    >
      {children}
      <span className={`arrow arrow-placement-${placement}`} />
    </div>
  );
}
export const CoreExtensionToolTip = React.forwardRef(ToolTipWithRef);

export const CoreExtensionToolTipTrigger = ({
  isDisabled = true,
  children,
  placement: suggestedPlacement = 'right'
}) => {
  // set up a div for tooltips to portal into
  const TOOLTIP_ID = 'spectrum-alternative-ToolTip-Root';
  if (!document.getElementById(TOOLTIP_ID)) {
    const toolTipDiv = document.createElement('div');
    toolTipDiv.id = TOOLTIP_ID;
    if (document.getElementById('content')) {
      document
        .getElementById('content')
        .firstElementChild.appendChild(toolTipDiv);
    } else {
      document.body.appendChild(toolTipDiv);
    }
  }

  const [isHovered, setIsHovered] = useState(false);
  const [placement, setPlacement] = useState(suggestedPlacement);
  // The FormInput is a Spectrum TextField, Checkbox, etc
  const [FormInput, TooltipContent, ...otherChildren] = React.Children.toArray(
    children
  );
  const formInputRef = useRef();
  const tooltipRef = useRef();
  // re-define the FormInput as a TooltipTrigger (onHover)
  const ToolTipTrigger = React.cloneElement(FormInput, {
    ref: formInputRef
  });

  function onMouseEnter(e) {
    const portalDivRef = document.getElementById(TOOLTIP_ID);
    const { top, left, placement: usedPlacement } = determineToolTipPosition(
      e?.currentTarget,
      tooltipRef?.current,
      suggestedPlacement
    );
    portalDivRef.style.top = `${top}px`;
    portalDivRef.style.left = `${left}px`;
    setPlacement(usedPlacement);
    setIsHovered(true);
  }
  function onMouseLeave() {
    setIsHovered(false);
  }

  useEffect(() => {
    formInputRef?.current
      ?.UNSAFE_getDOMNode?.()
      ?.addEventListener?.('mouseenter', onMouseEnter);
    formInputRef?.current
      ?.UNSAFE_getDOMNode?.()
      ?.addEventListener?.('mouseleave', onMouseLeave);

    return function cleanupListeners() {
      formInputRef?.current
        ?.UNSAFE_getDOMNode?.()
        ?.removeEventListener?.('mouseenter', onMouseEnter);
      formInputRef?.current
        ?.UNSAFE_getDOMNode?.()
        ?.removeEventListener?.('mouseleave', onMouseLeave);
    };
  }, []);

  return [
    ToolTipTrigger,
    isDisabled
      ? null
      : ReactDOM.createPortal(
          React.cloneElement(TooltipContent, {
            isOpen: isHovered,
            placement,
            ref: tooltipRef
          }),
          document.getElementById(TOOLTIP_ID)
        ),
    ...otherChildren
  ];
};
