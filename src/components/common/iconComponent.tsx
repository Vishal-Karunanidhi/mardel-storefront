const ErrorInfoIcon = ({ width = 20, height = 20 }) => {
  return (
    <img
      src="/icons/account/infoIcon.svg"
      alt="Info"
      width={width}
      height={height}
      aria-label="error"
    />
  );
};

// TODO: Move all other commonly used icons to this file

export { ErrorInfoIcon };
