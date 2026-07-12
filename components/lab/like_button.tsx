"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

type LikeButtonProps = {
  id: string;
  initialLikes: number;
  kind: "project" | "article";
};

export function LikeButton({ id, initialLikes, kind }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = async () => {
    if (isLiking || hasLiked) return;
    setIsLiking(true);
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, kind }),
      });
      const data = await res.json();
      if (data.ok && typeof data.likes === "number") {
        setLikes(data.likes);
        setHasLiked(true);
      }
    } catch (err) {
      console.error("Failed to like:", err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLike}
      disabled={isLiking}
      className={`group relative flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-300 ${
        hasLiked
          ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
          : "border-border/70 hover:border-rose-500/30 hover:bg-rose-500/5 hover:text-rose-400"
      }`}
    >
      <Heart
        className={`size-4 transition-transform duration-300 group-hover:scale-110 ${
          hasLiked ? "fill-current scale-110" : ""
        }`}
      />
      <span className="text-xs font-medium tracking-wide">
        {likes.toLocaleString()}
      </span>
      {hasLiked && (
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white animate-ping" />
      )}
    </Button>
  );
}
