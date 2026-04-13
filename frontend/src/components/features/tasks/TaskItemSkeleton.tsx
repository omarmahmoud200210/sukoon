import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SKELETON_WIDTHS = ["60%", "75%", "55%", "80%", "65%"];

interface TaskItemSkeletonProps {
  count?: number;
}

export default function TaskItemSkeleton({ count = 5 }: TaskItemSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative flex items-center gap-4 p-3 rounded-xl mb-2 bg-surface-container-lowest border border-outline-variant/10"
        >
          {/* Checkbox */}
          <Skeleton
            width={20}
            height={20}
            borderRadius={8}
            baseColor="var(--color-surface-container-high)"
            highlightColor="var(--color-surface-container-highest)"
          />

          {/* Title */}
          <div className="flex-1">
            <Skeleton
              width={SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}
              height={14}
              borderRadius={6}
              baseColor="var(--color-surface-container-high)"
              highlightColor="var(--color-surface-container-highest)"
            />
          </div>

          {/* Tag badges */}
          <div className="flex items-center gap-1.5">
            <Skeleton
              width={48}
              height={18}
              borderRadius={999}
              baseColor="var(--color-surface-container-high)"
              highlightColor="var(--color-surface-container-highest)"
            />
          </div>

          {/* Date + actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Skeleton
              width={20}
              height={20}
              borderRadius={6}
              baseColor="var(--color-surface-container-high)"
              highlightColor="var(--color-surface-container-highest)"
            />
          </div>
        </div>
      ))}
    </>
  );
}
