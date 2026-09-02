import { Check, GripVertical } from 'lucide-react';
import PAOBadge from './PAOBadge';

const categoryIcons = {
  face: '🧴',
  body: '🫧',
  lip:  '💋',
  decorative: '💄',
};

const categoryColors = {
  face: 'bg-pink-50 text-pink-600 border-pink-100',
  body: 'bg-sky-50 text-sky-600 border-sky-100',
  lip:  'bg-rose-50 text-rose-600 border-rose-100',
  decorative: 'bg-purple-50 text-purple-600 border-purple-100',
};

const categoryRingColors = {
  face: 'ring-pink-300',
  body: 'ring-sky-300',
  lip:  'ring-rose-300',
  decorative: 'ring-purple-300',
};

export default function TaskItem({
  item,
  isChecked,
  onToggle,
  shortcutIndex,
  dragHandleProps,
  isDragging,
}) {
  const icon = categoryIcons[item.category] ?? '✦';
  const badgeColor = categoryColors[item.category] ?? 'bg-gray-50 text-gray-500 border-gray-100';
  const ringColor = categoryRingColors[item.category] ?? 'ring-gray-300';
  const tip = item.tip || item.desc;

  return (
    <div
      onClick={() => onToggle(item.id)}
      className={`relative group cursor-pointer select-none
        rounded-2xl border p-4 transition-all duration-300
        backdrop-blur-md bg-white/70 border-white/40 shadow-sm
        hover:shadow-lg hover:border-white/60 hover:-translate-y-0.5 active:scale-[0.98]
        ${isChecked
          ? 'bg-blush-50/80 border-blush-200/80 opacity-75 ring-2 ring-blush-300/50'
          : 'hover:ring-1 ' + ringColor
        }
        ${isDragging ? 'shadow-2xl ring-2 ring-[#D06885] opacity-90 scale-[1.02]' : ''}`}
    >
      {shortcutIndex != null && shortcutIndex < 6 && (
        <span className="hidden lg:flex absolute -top-2 -left-2 z-10 w-5 h-5 items-center justify-center
          rounded-full bg-[#3D1F2A] text-white text-[10px] font-mono font-bold shadow-sm">
          {shortcutIndex + 1}
        </span>
      )}

      {tip && (
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] z-30
          hidden lg:block opacity-0 invisible translate-y-1
          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
          transition-all duration-200">
          <div className="relative bg-[#3D1F2A] text-white text-xs rounded-xl px-3 py-2 shadow-xl w-[220px] text-center leading-relaxed">
            {tip}
            <span className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-[#3D1F2A] rotate-45 -mt-1" />
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        {dragHandleProps && (
          <button
            type="button"
            aria-label="Geser urutan"
            className="hidden lg:flex flex-shrink-0 mt-3 text-pink-200 hover:text-[#D06885] cursor-grab active:cursor-grabbing touch-none"
            onClick={(e) => e.stopPropagation()}
            {...dragHandleProps}
          >
            <GripVertical size={16} />
          </button>
        )}

        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl
          transition-all duration-300
          ${isChecked ? 'bg-green-100/80 ring-2 ring-green-300/50' : 'bg-blush-50/80'}`}>
          {isChecked ? '✓' : icon}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 mb-1">
            <p className={`font-semibold text-sm leading-snug
              ${isChecked ? 'line-through text-slate-400' : 'text-[#3D1F2A]'}`}>
              {item.name}
            </p>
            {item.isEssential && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 border border-amber-200">
                Essential
              </span>
            )}
            {item.isCustom && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-600 border border-purple-200">
                Custom
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-2">{item.desc}</p>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider
              px-2 py-0.5 rounded-full border ${badgeColor}`}>
              {item.category}
            </span>
            {item.pao && <PAOBadge pao={item.pao} compact />}
          </div>
        </div>

        <div className="flex-shrink-0">
          <button
            type="button"
            aria-label={isChecked ? 'Uncheck item' : 'Check item'}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
              transition-all duration-200
              ${isChecked
                ? 'bg-[#D06885] border-[#D06885] shadow-lg shadow-blush-500/30'
                : 'border-pink-200 bg-white/80 hover:border-[#D06885] hover:bg-blush-50/50 backdrop-blur-sm'
              }`}
          >
            {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
          </button>
        </div>
      </div>

      {isChecked && (
        <div className="absolute top-3 left-3 animate-bounce-in">
          <span className="text-green-500 text-xs font-semibold">✓ Done</span>
        </div>
      )}
    </div>
  );
}
