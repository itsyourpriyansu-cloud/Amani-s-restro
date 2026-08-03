import React from 'react';

/**
 * Google Material Symbols Outlined icon.
 * `name` must match a Material Symbols glyph name, e.g. "restaurant", "arrow_forward".
 */
const Icon = ({ name, filled = false, className = '', style, ...rest }) => (
  <span
    className={`material-symbols-outlined${filled ? ' icon-fill' : ''} ${className}`}
    style={style}
    aria-hidden="true"
    {...rest}
  >
    {name}
  </span>
);

export default Icon;
