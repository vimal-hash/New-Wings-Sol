import { render } from '@testing-library/react';
import {
  SkeletonCard,
  SkeletonText,
  SkeletonGrid,
} from '@/components/ui/Skeleton';

describe('Skeleton', () => {
  it('SkeletonCard renders with the expected classes', () => {
    const { container } = render(<SkeletonCard />);
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('animate-pulse', 'rounded-2xl', 'bg-soft', 'h-48', 'w-full');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('SkeletonText renders with the expected classes', () => {
    const { container } = render(<SkeletonText width="w-3/4" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('animate-pulse', 'rounded-md', 'bg-soft', 'w-3/4');
  });

  it('SkeletonGrid renders the requested number of cards', () => {
    const { container } = render(<SkeletonGrid count={5} />);
    // Each card carries the animate-pulse class; the grid wrapper does not.
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(5);
  });
});
