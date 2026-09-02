import React from 'react';

/**
 * 🌸 Cece Yori Category & Status Badges
 */
export function Badge({
  children,
  variant = 'blush',
  icon: Icon,
  className = '',
  ...props
}) {
  const variantClasses = {
    blush: 'bg-blush-100 text-blush-700 border-blush-200',
    rose: 'bg-rose-100 text-rose-700 border-rose-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    sky: 'bg-sky-100 text-sky-800 border-sky-200',
    violet: 'bg-violet-100 text-violet-800 border-violet-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    muted: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border
        ${variantClasses[variant] || variantClasses.blush}
        ${className}`}
      {...props}
    >
      {Icon && <Icon size={11} />}
      {children}
    </span>
  );
}

export default Badge;
