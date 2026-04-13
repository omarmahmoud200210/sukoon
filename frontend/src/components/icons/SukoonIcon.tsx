interface SukoonIconProps {
  className?: string;
  color?: string;
  innerColor?: string;
  withBackground?: boolean;
  bgClassName?: string;
}

export default function SukoonIcon({
  className = "size-6",
  color = "white",
  innerColor = "#F5F2ED",
  withBackground = true,
  bgClassName = "bg-primary rounded-lg",
}: SukoonIconProps) {
  const svg = (
    <svg
      className={withBackground ? "w-[60%] h-[60%]" : className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sukoon"
    >
      <path
        d="M50,20 C50,20 20,45 20,65 C20,85 50,85 50,85 C50,85 80,85 80,65 C80,45 50,20 50,20 Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M50,35 C50,35 35,50 35,65 C35,75 50,75 50,75 C50,75 65,75 65,65 C65,50 50,35 50,35 Z"
        fill={innerColor}
      />
    </svg>
  );

  if (!withBackground) return <span className={className}>{svg}</span>;

  return (
    <span className={`${bgClassName} ${className} inline-flex items-center justify-center`}>
      {svg}
    </span>
  );
}
