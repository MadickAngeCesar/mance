"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Heart, Sparkles, AlertCircle, CheckCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tx } from "@/components/i18n/tx";
import { cn } from "@/lib/utils";

type LabCardProps = {
	id: string;
	title: string;
	titleFr?: string;
	summary: string;
	summaryFr?: string;
	href: string;
	coverImageUrl: string;
	tags: string[];
	kind: "project" | "article";
	featured?: boolean;
	views: number;
	likes?: number;
	meta: string;
	publishedAt?: string;
	problem?: string | null;
	problemFr?: string | null;
	solution?: string | null;
	solutionFr?: string | null;
	matchScore?: number;
};

export function LabCard({
	id,
	title,
	titleFr,
	summary,
	summaryFr,
	href,
	coverImageUrl,
	tags,
	kind,
	featured = false,
	views,
	likes = 0,
	meta,
	publishedAt,
	problem,
	problemFr,
	solution,
	solutionFr,
	matchScore,
}: LabCardProps) {
	const [currentLikes, setCurrentLikes] = useState(likes);
	const [hasLiked, setHasLiked] = useState(false);

	useEffect(() => {
		const likedItems = JSON.parse(localStorage.getItem("mance_liked_items") || "[]");
		if (likedItems.includes(id)) {
			setHasLiked(true);
		}
	}, [id]);

	const handleLike = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (hasLiked) return;

		// Optimistic update
		setCurrentLikes((prev) => prev + 1);
		setHasLiked(true);

		const likedItems = JSON.parse(localStorage.getItem("mance_liked_items") || "[]");
		likedItems.push(id);
		localStorage.setItem("mance_liked_items", JSON.stringify(likedItems));

		try {
			const res = await fetch("/api/likes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, kind }),
			});
			const data = await res.json();
			if (data.ok && typeof data.likes === "number") {
				setCurrentLikes(data.likes);
			}
		} catch (err) {
			console.error("Failed to register like:", err);
		}
	};

	const normalizedCoverImageUrl = (() => {
		if (!coverImageUrl) {
			return "/images/Profile.jpg";
		}

		if (coverImageUrl.startsWith("/")) {
			return coverImageUrl;
		}

		try {
			const parsed = new URL(coverImageUrl);
			if (
				parsed.hostname === "localhost" ||
				parsed.hostname === "127.0.0.1" ||
				parsed.hostname === "mance.dev" ||
				parsed.hostname === "www.mance.dev"
			) {
				return `${parsed.pathname}${parsed.search}`;
			}
		} catch {
			return coverImageUrl;
		}

		return coverImageUrl;
	})();

	const formattedDate = publishedAt
		? new Date(publishedAt).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				timeZone: "UTC",
			})
		: null;

	return (
		<Card className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
			{/* Match Score Badge (Vector Search HUD) */}
			{matchScore !== undefined && matchScore > 0 && (
				<div className="absolute top-3 left-3 z-20 flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-950/80 px-2.5 py-0.5 text-[11px] font-semibold text-violet-300 backdrop-blur-md animate-pulse shadow-md shadow-violet-950/50">
					<Sparkles className="size-3 text-violet-400" />
					<span>{matchScore}% Vector Match</span>
				</div>
			)}

			<div className="relative h-48 w-full overflow-hidden border-b border-border/50 bg-muted/20">
				<Image
					src={normalizedCoverImageUrl}
					alt={`${title} cover image`}
					fill
					sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
					className="object-cover transition-transform duration-500 group-hover:scale-105"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
			</div>

			<CardHeader className="space-y-3 pb-3">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex flex-wrap gap-1.5">
						<Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-xs font-normal capitalize bg-primary/5 text-primary border-primary/20">
							<Tx en={kind} fr={kind === "project" ? "projet" : "article"} />
						</Badge>
						{featured && (
							<Badge className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-sm">
								<Tx en="Featured" fr="Mis en avant" />
							</Badge>
						)}
					</div>
					
					{/* Like Heart Button */}
					<button
						onClick={handleLike}
						disabled={hasLiked}
						type="button"
						className={cn(
							"flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-all duration-200 border",
							hasLiked
								? "border-red-500/30 bg-red-500/10 text-red-400"
								: "border-border hover:border-red-500/50 hover:bg-red-500/5 text-muted-foreground hover:text-red-400 active:scale-95"
						)}
						aria-label="Like this content"
					>
						<Heart
							className={cn("size-3.5 transition-transform duration-200", hasLiked && "fill-current scale-110 text-red-500")}
						/>
						<span className="font-medium">{currentLikes}</span>
					</button>
				</div>

				<CardTitle className="text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
					<Tx en={title} fr={titleFr || title} />
				</CardTitle>

				<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<span className="font-medium text-foreground/80">{meta}</span>
					{formattedDate && (
						<>
							<span>·</span>
							<span>{formattedDate}</span>
						</>
					)}
					<span>·</span>
					<span>{views.toLocaleString()} <Tx en="views" fr="vues" /></span>
				</div>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col justify-between space-y-4">
				{/* Description Block */}
				<div className="flex-1 space-y-3">
					{problem || solution ? (
						<div className="space-y-3 border-l-2 border-primary/20 pl-3.5 my-1 text-sm leading-relaxed">
							{problem && (
								<div className="space-y-1">
									<div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-400/90">
										<AlertCircle className="size-3" />
										<Tx en="Problem" fr="Problème" />
									</div>
									<p className="text-muted-foreground text-xs leading-5">
										<Tx en={problem} fr={problemFr || problem} />
									</p>
								</div>
							)}
							{solution && (
								<div className="space-y-1">
									<div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400/90">
										<CheckCircle className="size-3" />
										<Tx en="Solution" fr="Solution" />
									</div>
									<p className="text-muted-foreground text-xs leading-5">
										<Tx en={solution} fr={solutionFr || solution} />
									</p>
								</div>
							)}
						</div>
					) : (
						<p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
							<Tx en={summary} fr={summaryFr || summary} />
						</p>
					)}
				</div>

				{/* Tech Tags */}
				<div className="flex flex-wrap gap-1.5 pt-1">
					{tags.map((tag) => (
						<Badge key={`${id}-${tag}`} variant="secondary" className="rounded-full px-2 py-0 text-[10px] bg-secondary/30 text-secondary-foreground/90 font-mono">
							#{tag}
						</Badge>
					))}
				</div>

				{/* Footer View Button */}
				<div className="pt-2">
					<Button asChild className="w-full justify-between group/btn bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 transition-all duration-300">
						<Link href={href}>
							<span className="font-semibold text-xs tracking-wide uppercase">
								<Tx en="Explore Case Study" fr="Explorer l'Étude" />
							</span>
							<ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
