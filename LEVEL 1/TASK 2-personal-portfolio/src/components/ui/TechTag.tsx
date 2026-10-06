export function TechTag({ children }: { children: string }) {
  return (
    <span className="font-mono text-[0.65rem] tracking-wider uppercase px-2.5 py-1 border border-line text-ink-muted rounded-sm">
      {children}
    </span>
  )
}
