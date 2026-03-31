import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tx } from "@/components/i18n/tx";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

export async function Workflow() {
	let workflowStages: Array<{ step: number; title: string; subtitle: string; details: string }> = [];

	try {
		workflowStages = await prisma.workflowStage.findMany({
			orderBy: { step: "asc" },
		});
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("Workflow query failed, rendering empty state:", error);
		}
	}

	return (
		<section className="space-y-5" id="workflow">
			<div className="text-center">
				<h2 className="text-2xl font-semibold tracking-tight"><Tx en="Delivery Workflow" fr="Workflow de delivery" /></h2>
				<p className="mt-1 text-sm text-muted-foreground"><Tx en="A practical 5-step process from discovery to long-term support." fr="Un processus pratique en 5 etapes, de la decouverte au support long terme." /></p>
			</div>

			<div className="grid gap-3 sm:grid-cols-3 md:grid-cols-5">
				{workflowStages.length === 0 ? (
					<p className="text-sm text-muted-foreground md:col-span-5"><Tx en="No workflow stages configured yet." fr="Aucune etape de workflow configuree pour le moment." /></p>
				) : null}
				{workflowStages.map((stage) => (
					<Card key={stage.step} className="h-full border-border/80">
						<CardHeader className="space-y-2">
							<Badge variant="secondary" className="w-fit rounded-full">
								<Tx en={`Step ${stage.step}`} fr={`Etape ${stage.step}`} />
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
