interface SectionLabelProps {
  icon: string;
  label: string;
}

export function SectionLabel({ icon, label }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-2 pb-3 pt-6">
      <span className="text-sm">{icon}</span>
      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-dim">
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
    </div>
  );
}
