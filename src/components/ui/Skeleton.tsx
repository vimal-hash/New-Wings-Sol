/**
 * Skeleton loading placeholders.
 * Tailwind-only, no external dependencies.
 * `bg-soft` is the project's surface token (var(--bg-soft)) defined in globals.css.
 */

interface SkeletonCardProps {
  /** Tailwind height class — defaults to h-48 */
  height?: string;
  /** Tailwind width class — defaults to w-full */
  width?: string;
  className?: string;
}

export function SkeletonCard({
  height = 'h-48',
  width = 'w-full',
  className = '',
}: SkeletonCardProps) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-soft border border-soft ${height} ${width} ${className}`}
      aria-hidden="true"
    />
  );
}

interface SkeletonTextProps {
  /** Tailwind width class — e.g. "w-3/4". Defaults to w-full */
  width?: string;
  /** Tailwind height class for the line thickness — defaults to h-4 */
  height?: string;
  className?: string;
}

export function SkeletonText({
  width = 'w-full',
  height = 'h-4',
  className = '',
}: SkeletonTextProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-soft ${height} ${width} ${className}`}
      aria-hidden="true"
    />
  );
}

interface SkeletonGridProps {
  /** Number of skeleton cards to render — defaults to 6 */
  count?: number;
  /** Number of columns on large screens (1-4 supported) — defaults to 3 */
  cols?: 1 | 2 | 3 | 4;
  /** Tailwind height class passed to each card */
  cardHeight?: string;
  className?: string;
}

const COL_CLASSES: Record<NonNullable<SkeletonGridProps['cols']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export function SkeletonGrid({
  count = 6,
  cols = 3,
  cardHeight = 'h-48',
  className = '',
}: SkeletonGridProps) {
  return (
    <div
      className={`grid gap-6 ${COL_CLASSES[cols]} ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} height={cardHeight} />
      ))}
    </div>
  );
}

export default SkeletonGrid;
