import ScrollReveal from "./ScrollReveal";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  return (
    <ScrollReveal>
      <div className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-3">
          {title}
        </h2>
        <div
          className={`h-1 w-16 bg-gradient-to-r from-electric-500 to-electric-400 rounded-full mb-4 ${
            align === "center" ? "mx-auto" : ""
          }`}
        />
        {subtitle && (
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
