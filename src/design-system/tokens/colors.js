/**
 * 🌸 Cece Yori Glow Tracker - Color Tokens
 * Master color palette for 4-phase skincare routines & design system
 */

export const colors = {
  // Brand Primary: Romantic Blush & Rose
  brand: {
    bg: '#FDF5F7',            // Soft pastel blush canvas
    text: '#3D1F2A',          // Deep plum text
    textMuted: '#8C6F7C',     // Soft muted mauve
    border: 'rgba(245, 208, 220, 0.6)',
  },
  
  blush: {
    50:  '#FDF5F7',
    100: '#FAEAEF',
    200: '#F5D0DC',
    300: '#EDB0C2',
    400: '#E08AA4',
    500: '#D06885',           // Primary Accent
    600: '#B84E6A',
    700: '#9B4B62',
    800: '#762D41',
    900: '#5A2232',
  },

  // 4 Mode Themes & Atmospheric Gradients
  modes: {
    pagi: {
      id: 'pagi',
      label: 'Pagi',
      icon: '☀️',
      timeRange: '05:00 - 10:59',
      gradient: 'from-[#F59E0B] via-[#F97316] to-[#E11D48]',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      accent: '#F59E0B',
      lightBg: 'bg-amber-50/70',
    },
    siang: {
      id: 'siang',
      label: 'Siang',
      icon: '🌤️',
      timeRange: '11:00 - 14:59',
      gradient: 'from-[#0284C7] via-[#0EA5E9] to-[#0D9488]',
      badge: 'bg-sky-100 text-sky-800 border-sky-200',
      accent: '#0EA5E9',
      lightBg: 'bg-sky-50/70',
    },
    sore: {
      id: 'sore',
      label: 'Sore',
      icon: '🌇',
      timeRange: '15:00 - 18:59',
      gradient: 'from-[#C97B8E] via-[#B86478] to-[#9B4B62]',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      accent: '#D06885',
      lightBg: 'bg-rose-50/70',
    },
    malam: {
      id: 'malam',
      label: 'Malam',
      icon: '🌙',
      timeRange: '19:00 - 04:59',
      gradient: 'from-[#7B6C8E] via-[#6A5480] to-[#4E3866]',
      badge: 'bg-violet-100 text-violet-800 border-violet-200',
      accent: '#8B5CF6',
      lightBg: 'bg-violet-50/70',
    },
  },

  // Category Colors
  categories: {
    face: { label: 'Wajah', icon: '🧴', color: 'bg-pink-100 text-pink-700 border-pink-200' },
    body: { label: 'Badan', icon: '🫧', color: 'bg-sky-100 text-sky-700 border-sky-200' },
    lip:  { label: 'Bibir', icon: '💋', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    decorative: { label: 'Decorative', icon: '💄', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  },

  // Glassmorphism Token Presets
  glass: {
    card: 'bg-white/70 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md',
    nav: 'bg-white/75 backdrop-blur-md border-b border-pink-100 shadow-sm',
    heroCard: 'bg-white/20 backdrop-blur-sm border border-white/30 text-white',
    dark: 'bg-[#1a0f2e]/80 backdrop-blur-md border border-violet-500/20 text-white',
  }
};
