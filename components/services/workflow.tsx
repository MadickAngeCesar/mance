import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { workflowStages } from "@/lib/placeholder-data";

export function Workflow() {
	return (
		<section className="space-y-5" id="workflow">
			<div className="text-center">
				<h2 className="text-2xl font-semibold tracking-tight">Delivery Workflow</h2>
				<p className="mt-1 text-sm text-muted-foreground">A practical 5-step process from discovery to long-term support.</p>
			</div>

			<div className="grid gap-3 sm:grid-cols-3 md:grid-cols-5">
				{workflowStages.map((stage) => (
					<Card key={stage.step} className="h-full border-border/80">
						<CardHeader className="space-y-2">
							<Badge variant="secondary" className="w-fit rounded-full">
								Step {stage.step}
							</Badge>
							<CardTitle>{stage.title}</CardTitle>
							<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stage.subtitle}</p>
						</CardHeader>
						<CardContent>
							<p className="text-sm leading-6 text-muted-foreground">{stage.details}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
