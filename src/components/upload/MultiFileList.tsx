import { GripVertical, ArrowUp, ArrowDown, X, FileText } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface MultiFileListProps {
  files: File[]
  onRemove: (index: number) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function SortableItem({ file, index, onRemove, onMoveUp, onMoveDown, isFirst, isLast }: { 
  file: File, index: number, onRemove: () => void, 
  onMoveUp: () => void, onMoveDown: () => void,
  isFirst: boolean, isLast: boolean 
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: file.name + index })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg mb-2 shadow-sm group">
      <button {...attributes} {...listeners} className="p-1 text-gray-400 cursor-grab active:cursor-grabbing hover:text-gray-700 dark:hover:text-gray-300 outline-none">
        <GripVertical className="w-5 h-5" />
      </button>
      <FileText className="w-8 h-8 text-red-500 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button disabled={isFirst} onClick={onMoveUp} className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 outline-none">
          <ArrowUp className="w-4 h-4" />
        </button>
        <button disabled={isLast} onClick={onMoveDown} className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 outline-none">
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
      <button onClick={onRemove} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-2 outline-none">
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}

export function MultiFileList({ files, onRemove, onReorder }: MultiFileListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex((f, i) => f.name + i === active.id)
      const newIndex = files.findIndex((f, i) => f.name + i === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex)
      }
    }
  }

  const totalSize = files.reduce((acc, file) => acc + file.size, 0)

  return (
    <div className="w-full">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={files.map((f, i) => f.name + i)} strategy={verticalListSortingStrategy}>
          {files.map((file, index) => (
            <SortableItem
              key={file.name + index}
              file={file}
              index={index}
              isFirst={index === 0}
              isLast={index === files.length - 1}
              onRemove={() => onRemove(index)}
              onMoveUp={() => onReorder(index, index - 1)}
              onMoveDown={() => onReorder(index, index + 1)}
            />
          ))}
        </SortableContext>
      </DndContext>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-sm text-gray-500">
        <span>{files.length} file{files.length !== 1 && 's'}</span>
        <span>Total: {formatBytes(totalSize)}</span>
      </div>
    </div>
  )
}
