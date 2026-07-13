import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";



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

	const workflowData = workflowStages;

	return (
		<section className="space-y-6" id="workflow">
			<div className="text-center space-y-2">
				<h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
					<Tx en="Delivery Workflow" fr="Flux de Travail de Livraison" />
				</h2>
				<p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
					<Tx
						en="A structured, collaborative process designed to keep your project aligned, secure, and delivered on time."
						fr="Un processus structuré et collaboratif conçu pour maintenir votre projet aligné, sécurisé et livré à temps."
					/>
				</p>
			</div>

			<div className="relative grid gap-4 sm:grid-cols-3 md:grid-cols-5">
				{workflowData.map((stage, idx) => (
					<Card
						key={stage.step}
						className="group relative h-full flex flex-col justify-between overflow-hidden border border-border/80 bg-card/20 backdrop-blur-md transition-all duration-350 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
					>
						{/* Background Giant Step Indicator */}
						<div className="absolute top-2 right-4 -z-10 select-none font-mono text-5xl font-extrabold opacity-[0.05] transition-all group-hover:opacity-10 group-hover:scale-105 text-primary">
							0{stage.step}
						</div>

						<CardHeader className="space-y-2 pb-2">
							<Badge className="w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wide">
								<Tx en={`Step 0${stage.step}`} fr={`Étape 0${stage.step}`} />
							</Badge>
							<CardTitle className="text-base font-bold tracking-tight text-foreground">
								<Tx en={stage.title} fr={stage.titleFr || stage.title} />
							</CardTitle>
							<p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
								<Tx en={stage.subtitle} fr={stage.subtitleFr || stage.subtitle} />
							</p>
						</CardHeader>
						
						<CardContent className="pt-2 flex-1">
							<p className="text-xs leading-relaxed text-muted-foreground">
								<Tx en={stage.details} fr={stage.detailsFr || stage.details} />
							</p>
						</CardContent>

						{/* Bottom connecting bar line */}
						{idx < workflowData.length - 1 && (
							<div className="absolute right-0 top-1/2 hidden h-px w-6 bg-border/50 md:block translate-x-full z-20" />
						)}
					</Card>
				))}
			</div>
		</section>
	);
}
