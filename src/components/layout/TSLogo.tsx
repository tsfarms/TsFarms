import type { FC } from 'react';

interface LogoProps {
  variant?: 'full' | 'monogram';
  color?: string;
  height?: number;
}

const TSLogo: FC<LogoProps> = ({ variant = 'full', color = '#173B28', height = 36 }) => {
  if (variant === 'monogram') {
    return (
      <svg
        width={height}
        height={height}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="TS Mango Farming monogram"
      >
        <path
          d="M14 12 L14 14 L10 14 L10 17 L14 17 L14 19 L10 19 L10 22 L8 22 L8 12 L10 12 Z"
          fill={color}
        />
        <path
          d="M24 12 C20 12 17 13.5 17 15.5 C17 17 18.5 17.8 21 18.2 C23 18.5 24 18.8 24 19.5 C24 20.2 23 20.8 21.5 20.8 C19.8 20.8 18.5 20 18.3 19 L16 20 C16.5 22 18.8 23 21.5 23 C25.5 23 27.5 21.3 27.5 19.3 C27.5 17.5 26 16.7 23 16.3 C21 16 20 15.8 20 15 C20 14.3 21 13.8 22.5 13.8 C24 13.8 25 14.3 25.3 15 L27.5 14 C27 12.7 25.8 12 24 12 Z"
          fill={color}
        />
        <path
          d="M30 10 C33 14 35 18 34.5 23 C34 27 32 30 29 32 C32 31 35 28 36.5 24 C38 20 37 15 34 11.5 Z"
          fill={color}
          opacity="0.5"
        />
      </svg>
    );
  }

  return (
    <svg
      height={height}
      viewBox="0 0 200 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TS Mango Farming"
    >
      <path
        d="M14 12 L14 14 L10 14 L10 17 L14 17 L14 19 L10 19 L10 22 L8 22 L8 12 L10 12 Z"
        fill={color}
      />
      <path
        d="M24 12 C20 12 17 13.5 17 15.5 C17 17 18.5 17.8 21 18.2 C23 18.5 24 18.8 24 19.5 C24 20.2 23 20.8 21.5 20.8 C19.8 20.8 18.5 20 18.3 19 L16 20 C16.5 22 18.8 23 21.5 23 C25.5 23 27.5 21.3 27.5 19.3 C27.5 17.5 26 16.7 23 16.3 C21 16 20 15.8 20 15 C20 14.3 21 13.8 22.5 13.8 C24 13.8 25 14.3 25.3 15 L27.5 14 C27 12.7 25.8 12 24 12 Z"
        fill={color}
      />
      <path
        d="M30 10 C33 14 35 18 34.5 23 C34 27 32 30 29 32 C32 31 35 28 36.5 24 C38 20 37 15 34 11.5 Z"
        fill={color}
        opacity="0.5"
      />
      <text
        x="46"
        y="20"
        fontFamily="'Cormorant Garamond', serif"
        fontSize="18"
        fontWeight="600"
        fill={color}
        letterSpacing="0.5"
      >
        TS MANGO FARMING
      </text>
      <text
        x="46"
        y="33"
        fontFamily="'Manrope', sans-serif"
        fontSize="7"
        fontWeight="500"
        fill={color}
        opacity="0.6"
        letterSpacing="1.8"
      >
        FROM OUR FARM TO YOUR HOME
      </text>
    </svg>
  );
};

export default TSLogo;
