interface Props {
  mensaje: string
  onDeshacer: () => void
}

export function UndoToast({ mensaje, onDeshacer }: Props) {
  return (
    <div
      role="status"
      className="animate-fade-up flex items-center gap-4 rounded-lg border border-ink/10 bg-ink px-4 py-3 text-sm text-paper shadow-lg shadow-ink/20"
    >
      <span>{mensaje}</span>
      <button
        type="button"
        onClick={onDeshacer}
        className="shrink-0 rounded px-1.5 py-0.5 font-semibold text-accent-soft transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
      >
        Deshacer
      </button>
    </div>
  )
}
