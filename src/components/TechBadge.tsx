import Link from "next/link";

interface TechBadgeProps {
  name: string;
  icon?: string; // SVG path data or emoji
  linkedProject?: string; // slug to link to
  variant?: "default" | "learning";
}

export default function TechBadge({
  name,
  icon,
  linkedProject,
  variant = "default",
}: TechBadgeProps) {
  const badge = (
    <span
      className={`tech-badge group ${
        variant === "learning"
          ? "border-dashed border-navy-400/40 text-gray-500"
          : ""
      }`}
    >
      {icon && <span className="text-base">{icon}</span>}
      <span>{name}</span>
    </span>
  );

  if (linkedProject) {
    return (
      <div className="flex flex-col items-center gap-1">
        {badge}
        <Link
          href={`/projects/${linkedProject}`}
          className="text-[10px] text-gray-600 hover:text-electric-400 transition-colors"
        >
          → see project
        </Link>
      </div>
    );
  }

  return badge;
}
