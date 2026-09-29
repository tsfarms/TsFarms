import type { FC } from 'react';

interface LogoProps {
  height?: number;
}

const TSLogo: FC<LogoProps> = ({ height = 48 }) => {
  return (
    <img
      src="/logo.png"
      alt="TS Farms"
      width={height}
      height={height}
      decoding="async"
      style={{
        height,
        width: height,
        display: 'block',
        borderRadius: '50%',
        objectFit: 'cover',
      }}
    />
  );
};

export default TSLogo;
