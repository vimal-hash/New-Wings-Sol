// SSG: portfolio pages pre-rendered at build time
import Showcase from '@/components/sections/Showcase';

export const revalidate = 86400;

export default function ShowcasePage() {
  return (
    <main className="relative">
      <Showcase />
    </main>
  );
}
