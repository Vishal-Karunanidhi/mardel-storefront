import { useState } from 'react';
import arrowStyles from '@Styles/components/slider/slider.module.scss';
import colors from '@Lib/common/colors';

export const CarouselIcon = ({
  id,
  iconDivClass,
  onClick,
  opacity = undefined,
  visibility = undefined,
  arrowPosition = undefined,
  rotation,
  ariaLabel
}) => {
  const [focused, setFocused] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  return (
    <div
      id={id}
      className={`${arrowStyles.arrowContainer} ${iconDivClass}`}
      style={{
        outline: focused ? 'dashed 2px #003087' : 'none',
        visibility: visibility,
        opacity: opacity,
        top: arrowPosition
      }}
    >
      <button
        onFocus={() => !mouseDown && setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
        onClick={onClick}
        className={arrowStyles.arrow}
        data-testid="slider-arrow"
        aria-label={ariaLabel}
      >
        <svg
          width="27"
          height="16"
          viewBox="0 0 27 16"
          fill="black"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: `rotate(${rotation}deg)`
          }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.2024 0.929612L26.5664 7.29357C26.9569 7.6841 26.9569 8.31726 26.5664 8.70779L20.2024 15.0717C19.8119 15.4623 19.1788 15.4623 18.7882 15.0717C18.3977 14.6812 18.3977 14.0481 18.7882 13.6575L23.4451 9.00068H0.14502V7.00068H23.4451L18.7882 2.34383C18.3977 1.9533 18.3977 1.32014 18.7882 0.929612C19.1788 0.539088 19.8119 0.539088 20.2024 0.929612Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
};
