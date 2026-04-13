import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface TafreeghCardSkeletonProps {
  count?: number;
}

export default function TafreeghCardSkeleton({ count = 6 }: TafreeghCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl border border-outline-variant/20 bg-surface"
        >
          <div className="flex items-start justify-between mb-4">
            <Skeleton
              width={40}
              height={40}
              borderRadius={12}
              baseColor="var(--color-surface-container-high)"
              highlightColor="var(--color-surface-container-highest)"
            />
            <Skeleton
              width={40}
              height={14}
              borderRadius={6}
              baseColor="var(--color-surface-container-high)"
              highlightColor="var(--color-surface-container-highest)"
            />
          </div>

          <Skeleton
            width="70%"
            height={16}
            borderRadius={6}
            baseColor="var(--color-surface-container-high)"
            highlightColor="var(--color-surface-container-highest)"
            className="mb-2"
          />

          <div className="space-y-1.5">
            <Skeleton
              height={12}
              borderRadius={4}
              baseColor="var(--color-surface-container-high)"
              highlightColor="var(--color-surface-container-highest)"
            />
            <Skeleton
              height={12}
              borderRadius={4}
              baseColor="var(--color-surface-container-high)"
              highlightColor="var(--color-surface-container-highest)"
            />
            <Skeleton
              width="60%"
              height={12}
              borderRadius={4}
              baseColor="var(--color-surface-container-high)"
              highlightColor="var(--color-surface-container-highest)"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
