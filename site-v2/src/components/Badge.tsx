type BadgeProps = {
  children: React.ReactNode;
  tone?: "cyan" | "violet" | "neutral";
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
