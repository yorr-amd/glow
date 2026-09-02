import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskItem from './TaskItem';
import { useLanguage } from '../i18n/LanguageContext';

function SortableTaskItem({ item, isChecked, onToggle, shortcutIndex }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <li ref={setNodeRef} style={style} className="list-none">
      <TaskItem
        item={item}
        isChecked={isChecked}
        onToggle={onToggle}
        shortcutIndex={shortcutIndex}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </li>
  );
}

export default function RoutineList({ title, items, checkedItems, onToggle, onReorder, routineMode = 'full' }) {
  const { t, isEn } = useLanguage();
  const doneCount = items.filter(i => checkedItems.includes(i.id)).length;
  const essentialCount = items.filter(i => i.isEssential).length;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder) return;
    const ids = items.map(i => i.id);
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(ids, oldIndex, newIndex));
  };

  return (
    <section className="mb-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-[#3D1F2A] text-2xl font-bold">{title}</h2>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <p className="text-slate-400 text-sm">
              {doneCount} {isEn ? 'of' : 'dari'} {items.length} {t('hero.productsDone', 'produk selesai')}
            </p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              routineMode === 'quick'
                ? 'bg-amber-100 text-amber-700 border-amber-200'
                : 'bg-blush-100 text-blush-700 border-blush-200'
            }`}>
              {routineMode === 'quick' ? '⚡ Quick Mode' : '✨ Full Mode'}
            </span>
            {routineMode === 'quick' && essentialCount > 0 && (
              <span className="text-[10px] text-slate-400">({essentialCount} essential)</span>
            )}
            <span className="hidden lg:inline text-[10px] text-slate-400">{t('routine.dragNotice', 'Geser ⋮⋮ untuk urutan')}</span>
          </div>
        </div>
        <div className="flex gap-1.5 items-center">
          {items.map((item) => (
            <div
              key={item.id}
              title={item.name}
              className={`h-2 rounded-full transition-all duration-300
                ${checkedItems.includes(item.id)
                  ? 'bg-[#D06885] w-5'
                  : 'bg-pink-200 w-2'
                }`}
            />
          ))}
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <SortableTaskItem
                key={item.id}
                item={item}
                isChecked={checkedItems.includes(item.id)}
                onToggle={onToggle}
                shortcutIndex={index}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </section>
  );
}
