import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";
import { workflowStages as fallbackStages } from "@/lib/placeholder-data";

export async function Workflow() {
	let workflowStages: any[] = [];

	try {
		workflowStages = await prisma.workflowStage.findMany({
			orderBy: { step: "asc" },
		});
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("Workflow query failed, rendering empty state:", error);
		}
	}

    const workflowData = workflowStages.length > 0 ? workflowStages : fallbackStages;

	return (
		<section className="space-y-5" id="workflow">
			<div className="text-center">
				<h2 className="text-2xl font-semibold tracking-tight">
                    <Tx en="Delivery Workflow" fr="Flux de Travail de Livraison" />
                </h2>
				<p className="mt-1 text-sm text-muted-foreground">
                    <Tx
                        en="A practical 5-step process from discovery to long-term support."
                        fr="Un processus pratique en 5 étapes, de la découverte au support à long terme."
                    />
                </p>
			</div>

			<div className="grid gap-3 sm:grid-cols-3 md:grid-cols-5">
				{workflowData.map((stage) => (
					<Card key={stage.step} className="h-full border-border/80">
						<CardHeader className="space-y-2">
							<Badge variant="secondary" className="w-fit rounded-full">
								<Tx en={`Step ${stage.step}`} fr={`Étape ${stage.step}`} />
							</Badge>
							<CardTitle>
                                <Tx en={stage.title} fr={stage.titleFr || stage.title} />
                            </CardTitle>
							<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                <Tx en={stage.subtitle} fr={stage.subtitleFr || stage.subtitle} />
                            </p>
						</CardHeader>
						<CardContent>
							<p className="text-sm leading-6 text-muted-foreground">
                                <Tx en={stage.details} fr={stage.detailsFr || stage.details} />
                            </p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
