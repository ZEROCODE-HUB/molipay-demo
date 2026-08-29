import logoSrc from "@/assets/molly-logo.png";

export function MollyLogo({
  className = "",
  variant = "dark",
  size = 32,
}: {
  className?: string;
  variant?: "dark" | "light";
  size?: number;
}) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="Moli"
        style={{ height: size, width: "auto", display: "block" }}
      />
    </div>
  );
}
