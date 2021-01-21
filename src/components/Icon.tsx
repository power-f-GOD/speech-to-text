import React from 'react';

const FAIcon = (props: {
  name: string;
  className?: string;
  color?: string;
  fontSize?: string;
  variant?: 'solid' | 'outlined';
}) => {
  const { className, color, fontSize, variant, name } = props;

  return (
    <i
      className={`${
        variant === 'outlined' ? 'far' : 'fas'
      } fa-${name} ${className} icon`}
      style={{ color, fontSize }}></i>
  );
};

export default FAIcon;
