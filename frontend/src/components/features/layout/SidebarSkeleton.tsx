import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface SidebarSkeletonProps {
  count?: number;
}

export default function SidebarSkeleton({ count = 3 }: SidebarSkeletonProps) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-2.5">
          <Skeleton
            width={16}
            height={16}
            borderRadius={4}
            baseColor="var(--color-surface-container-high)"
            highlightColor="var(--color-surface-container-highest)"
          />
          <Skeleton
            width={`${60 + (i % 3) * 15}%`}
            height={12}
            borderRadius={6}
            baseColor="var(--color-surface-container-high)"
            highlightColor="var(--color-surface-container-highest)"
          />
        </div>
      ))}
    </div>
  );
}
