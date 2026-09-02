import React from 'react';

/**
 * 🌸 Cece Yori Glassmorphic Card Container
 * Used for all widgets, routine items, stats, and sidebars
 */
export function Card({
  children,
  variant = 'glass',
  className = '',
  hoverable = true,
  ...props
}) {
  const variantClasses = {
    glass: 'bg-white/70 backdrop-blur-md border border-white/40 shadow-sm',
    solid: 'bg-white border border-pink-100/80 shadow-sm',
    hero: 'bg-white/20 backdrop-blur-sm border border-white/30 text-white shadow-lg',
    dark: 'bg-[#1a0f2e]/80 backdrop-blur-md border border-violet-500/20 text-white shadow-xl',
  };

  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-300 relative overflow-hidden
        ${variantClasses[variant] || variantClasses.glass}
        ${hoverable ? 'hover:shadow-md hover:border-white/60' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
