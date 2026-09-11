import React from 'react';

interface SectionGradientProps {
  direction?:
    | 'black-to-white'
    | 'white-to-black'
    | 'black-to-light'
    | 'light-to-black'
    | 'white-to-light'
    | 'light-to-white'
    | 'custom';
  fromColor?: string;
  toColor?: string;
  className?: string;
  heightClass?: string;
  children?: React.ReactNode;
}

/**
 * SectionGradient
 * Creates an ultra-smooth atmospheric gradient between any two sections
 * with different background colors, eliminating harsh borders and hard lines.
 */
export function SectionGradient({
  direction = 'black-to-white',
  fromColor,
  toColor,
  className = '',
  heightClass,
  children,
}: SectionGradientProps) {
  let gradientStyle = '';
  let defaultHeight = 'h-44 sm:h-60 lg:h-72';

  if (fromColor && toColor) {
    gradientStyle = `linear-gradient(180deg, ${fromColor} 0%, ${toColor} 100%)`;
    defaultHeight = 'h-20 sm:h-32';
  } else {
    switch (direction) {
      case 'black-to-white':
        gradientStyle =
          'linear-gradient(180deg, #000000 0%, #000000 10%, #010203 18%, #040608 26%, #090c12 34%, #121620 42%, #1f2533 50%, #313a4d 58%, #4b5770 66%, #6c7a97 74%, #94a1bf 82%, #bfc8dc 90%, #e8ecf4 96%, #ffffff 100%)';
        defaultHeight = 'h-48 sm:h-64 lg:h-72';
        break;

      case 'white-to-black':
        gradientStyle =
          'linear-gradient(180deg, #ffffff 0%, #e8ecf4 4%, #bfc8dc 10%, #94a1bf 18%, #6c7a97 26%, #4b5770 34%, #313a4d 42%, #1f2533 50%, #121620 58%, #090c12 66%, #040608 74%, #010203 82%, #000000 90%, #000000 100%)';
        defaultHeight = 'h-48 sm:h-64 lg:h-72';
        break;

      case 'black-to-light':
        gradientStyle =
          'linear-gradient(180deg, #000000 0%, #000000 10%, #010203 18%, #040608 26%, #090c12 34%, #121620 42%, #1f2533 50%, #313a4d 58%, #4b5770 66%, #6c7a97 74%, #94a1bf 82%, #bfc8dc 90%, #e8ecf4 96%, #F8F9FB 100%)';
        defaultHeight = 'h-48 sm:h-64 lg:h-72';
        break;

      case 'light-to-black':
        gradientStyle =
          'linear-gradient(180deg, #F8F9FB 0%, #e8ecf4 4%, #bfc8dc 10%, #94a1bf 18%, #6c7a97 26%, #4b5770 34%, #313a4d 42%, #1f2533 50%, #121620 58%, #090c12 66%, #040608 74%, #010203 82%, #000000 90%, #000000 100%)';
        defaultHeight = 'h-48 sm:h-64 lg:h-72';
        break;

      case 'white-to-light':
        gradientStyle =
          'linear-gradient(180deg, #ffffff 0%, #fbfbfc 30%, #f9fafb 60%, #F8F9FB 100%)';
        defaultHeight = 'h-16 sm:h-24';
        break;

      case 'light-to-white':
        gradientStyle =
          'linear-gradient(180deg, #F8F9FB 0%, #f9fafb 40%, #fbfbfc 70%, #ffffff 100%)';
        defaultHeight = 'h-16 sm:h-24';
        break;
    }
  }

  const finalHeight = heightClass || defaultHeight;

  return (
    <div
      className={`w-full relative select-none pointer-events-none ${finalHeight} ${className}`}
      style={{ background: gradientStyle }}
      aria-hidden="true"
    >
      {children && (
        <div className="absolute inset-0 pointer-events-auto flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

export default SectionGradient;
