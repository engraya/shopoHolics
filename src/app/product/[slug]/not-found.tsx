import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold text-foreground">Product Not Found</h1>
      <p className="text-muted-foreground max-w-md">
        This product may no longer be available or the link is incorrect.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild>
          <Link href="/products">Browse All Products</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/categories">Shop by Category</Link>
        </Button>
      </div>
    </div>
  );
}
