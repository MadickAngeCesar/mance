import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full border-border/80 bg-card/60">
        <CardHeader className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Error 404</p>
          <CardTitle className="text-2xl sm:text-3xl">Page Not Found</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            The page you requested does not exist or may have been moved.
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/lab">Explore Lab</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/services">View Services</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}