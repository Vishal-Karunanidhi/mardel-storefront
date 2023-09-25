import { useState } from 'react';
import arrowStyles from '@Styles/components/slider/slider.module.scss';

function CarouselIconSmall({
  id,
  iconDivClass,
  onClick,
  opacity = undefined,
  visibility = undefined,
  arrowPosition = undefined,
  rotation
}) {
  const [focused, setFocused] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  return (
    <div
      id={id}
      className={`${arrowStyles.arrowContainerSmall} ${iconDivClass}`}
      style={{
        border: focused ? 'dashed 1.5px #003087' : 'none',
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
        className={arrowStyles.arrowSmall}
        data-testid="slider-arrow-small"
      >
        <svg
          width="16"
          height="15"
          viewBox="0 0 16 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: `rotate(${rotation}deg)`
          }}
        >
          <path
            d="M14.8576 8.14595C15.2481 7.75543 15.2481 7.12226 14.8576 6.73174L8.49359 0.367775C8.10307 -0.0227494 7.4699 -0.0227494 7.07938 0.367775C6.68886 0.758299 6.68886 1.39146 7.07938 1.78199L12.7362 7.43884L7.07938 13.0957C6.68886 13.4862 6.68886 14.1194 7.07938 14.5099C7.4699 14.9004 8.10307 14.9004 8.49359 14.5099L14.8576 8.14595ZM0.299805 8.43884H14.1504V6.43884H0.299805V8.43884Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
}

export default CarouselIconSmall;
