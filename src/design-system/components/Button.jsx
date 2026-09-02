import React from 'react';

/**
 * 🌸 Cece Yori Standard Button Component
 * Variants: primary, secondary, ghost, danger, pill
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  disabled = false,
  onClick,
  ...props
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-4 py-2.5 text-xs font-semibold rounded-xl gap-2',
    lg: 'px-5 py-3 text-sm font-semibold rounded-2xl gap-2.5',
    pill: 'px-3 py-1 text-xs rounded-full gap-1.5',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blush-400 to-rose-400 text-white font-medium hover:from-blush-500 hover:to-rose-500 shadow-md shadow-blush-400/25 active:scale-95 transition-all',
    secondary: 'bg-blush-100 text-blush-700 hover:bg-blush-200 border border-blush-200/60 font-medium active:scale-95 transition-colors',
    ghost: 'bg-white/80 hover:bg-white text-slate-600 border border-pink-100/80 shadow-sm active:scale-95 transition-all',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-medium active:scale-95 transition-colors',
    outline: 'border border-dashed border-pink-200 text-pink-400 hover:border-[#D06885] hover:text-[#D06885] transition-all',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none
        ${sizeClasses[size] || sizeClasses.md}
        ${variantClasses[variant] || variantClasses.primary}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
}

export default Button;
