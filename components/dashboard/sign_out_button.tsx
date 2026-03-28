"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

import { Tx } from "@/components/i18n/tx";
import { Button } from "@/components/ui/button";
import { apiRequest, clearPersistedAuthTokens } from "@/lib/client-api";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    if (isPending) {
      return;
    }

    setIsPending(true);
    try {
      await apiRequest<{ message: string }>("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // Clear local auth state even when the server session has already expired.
    } finally {
      clearPersistedAuthTokens();
      router.replace("/sign-in");
      router.refresh();
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={isPending}
      aria-label="Sign out"
    >
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      <Tx en="Sign out" fr="Se deconnecter" />
    </Button>
  );
}