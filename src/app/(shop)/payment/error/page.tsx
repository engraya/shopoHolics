import React from 'react'
import PageContainer from '@/components/layout/PageContainer'
import Link from "next/link"
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

function ErrorPage() {
  return (
    <PageContainer>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex max-w-md w-full flex-col items-center gap-6 rounded-xl border border-border bg-card p-10 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Payment Unsuccessful</h2>
            <p className="text-muted-foreground">
              Your payment was not completed. Your cart has been kept, so you can try again.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Button asChild size="lg">
              <Link href="/cart">Back to Cart</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default ErrorPage;
