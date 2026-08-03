import React from 'react';
import 'iconsax';

/**
 * React wrapper component for the native <iconsax-icon> Web Component.
 * Supports types: 'linear' | 'bold' | 'bulk' | 'twotone' | 'outline' | 'broken'
 */
export const IconSax = ({
  name,
  type = 'linear',
  size = '24',
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => {
  return (
    <iconsax-icon
      name={name}
      type={type}
      size={String(size)}
      color={color}
      class={className}
      style={style}
      {...props}
    />
  );
};

export default IconSax;
