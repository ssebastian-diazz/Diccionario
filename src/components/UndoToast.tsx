interface Props {
  mensaje: string
  onDeshacer: () => void
}

export function UndoToast({ mensaje, onDeshacer }: Props) {
  return (
    <div
      role="status"
      className="animate-pop-in flex items-center gap-3 rounded-full bg-ink/90 px-4 py-2.5 text-[13px] text-white shadow-lg shadow-ink/30 backdrop-blur"
    >
      <span>{mensaje}</span>
      <button
        type="button"
        onClick={onDeshacer}
        className="shrink-0 font-semibold text-accent-dim transition-colors hover:text-white"
      >
        Deshacer
      </button>
    </div>
  )
}
