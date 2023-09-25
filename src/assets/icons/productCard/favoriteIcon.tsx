import colors from '../../../lib/common/colors';

function FavoriteIcon({ style, toggled, onClick }) {
  return (
    <svg
      className={style}
      onClick={onClick}
      // width="30"
      // height="28"
      viewBox="0 0 30 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-testid="productcard-favorite-icon"
    >
      <path
        d="M13.4982 25.0431L13.4967 25.0418C9.61412 21.521 6.47259 18.6701 4.28968 16.0013C2.11824 13.3465 1 10.9941 1 8.48755C1 4.41983 4.18228 1.23755 8.25 1.23755C10.5572 1.23755 12.7872 2.31648 14.2386 4.02089L15 4.91495L15.7614 4.02089C17.2128 2.31648 19.4428 1.23755 21.75 1.23755C25.8177 1.23755 29 4.41983 29 8.48755C29 10.9941 27.8818 13.3466 25.7101 16.0034C23.5279 18.6732 20.3882 21.5264 16.5077 25.0527L16.5046 25.0555L16.5025 25.0575L15.0026 26.4126L13.4982 25.0431Z"
        fill={toggled ? colors.hlRed : colors.hlWhite}
        stroke={toggled ? colors.hlRed : colors.hlGray}
        strokeWidth="2"
      />
    </svg>
  );
}

export default FavoriteIcon;
