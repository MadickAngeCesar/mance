import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsLetter() {
	return (
		<section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-8">
			<div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
			<div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-6">
				<div className="space-y-2">
					<p className="text-xs font-medium uppercase tracking-wide text-primary">Newsletter</p>
					<h2 className="text-2xl font-semibold tracking-tight">Get New Lab Posts in Your Inbox</h2>
					<p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
						A short update when I publish a new case study, technical article, or implementation note.
					</p>
				</div>

				<form className="grid w-full gap-3 sm:grid-cols-[1fr_auto] lg:min-w-107.5" action="#" method="post">
					<Input
						type="email"
						name="email"
						required
						placeholder="you@example.com"
						aria-label="Email address"
						className="h-11"
					/>
					<Button type="submit" className="h-11 px-6">
						Subscribe
					</Button>
				</form>
			</div>
		</section>
	);
}
