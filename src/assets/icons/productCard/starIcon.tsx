import colors from '@Lib/common/colors';

function StarIcon({
  starType,
  className
}: {
  starType: 'whole' | 'half' | 'empty';
  className: string;
}) {
  const empty =
    'M17.3332 6.70033L11.3415 6.18366L8.99984 0.666992L6.65817 6.19199L0.666504 6.70033L5.2165 10.642L3.84984 16.5003L8.99984 13.392L14.1498 16.5003L12.7915 10.642L17.3332 6.70033ZM8.99984 11.8337L5.8665 13.7253L6.69984 10.1587L3.93317 7.75866L7.58317 7.44199L8.99984 4.08366L10.4248 7.45033L14.0748 7.76699L11.3082 10.167L12.1415 13.7337L8.99984 11.8337Z';
  const whole =
    'M8.99984 13.391L14.1498 16.4993L12.7832 10.641L17.3332 6.69935L11.3415 6.19102L8.99984 0.666016L6.65817 6.19102L0.666504 6.69935L5.2165 10.641L3.84984 16.4993L8.99984 13.391Z';
  const half =
    'M17.3332 6.69935L11.3415 6.18268L8.99984 0.666016L6.65817 6.19102L0.666504 6.69935L5.2165 10.641L3.84984 16.4993L8.99984 13.391L14.1498 16.4993L12.7915 10.641L17.3332 6.69935ZM8.99984 11.8327V4.08268L10.4248 7.44935L14.0748 7.76602L11.3082 10.166L12.1415 13.7327L8.99984 11.8327Z';

  return (
    <div
      style={{
        display: 'inline'
      }}
    >
      <svg
        // width="18"
        // height="17"
        viewBox="0 5 18 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d={
            starType === 'whole'
              ? whole
              : starType === 'empty'
              ? empty
              : starType === 'half'
              ? half
              : ''
          }
          fill={colors.hlRed}
        />
      </svg>
    </div>
  );
}

export default StarIcon;
