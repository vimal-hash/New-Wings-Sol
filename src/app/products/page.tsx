// ISR: product catalogue refreshes every 30 minutes
import Products from '@/components/sections/Products';

export const revalidate = 1800;

export default function ProductsPage() {
  return (
    <main className="relative">
      <Products />
    </main>
  );
}
