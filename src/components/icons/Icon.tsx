type IconProps = {
  id: string;
  size?: number;
  className?: string;
};

export function Icon({ id, size = 13, className }: IconProps) {
  return (
    <svg
      className={className}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <use href={`#${id}`} />
    </svg>
  );
}
