import { Badge } from "@/components/ui/badge";
import { skills } from "@/lib/placeholder-data";

const categories = ["Frontend", "Backend", "DevOps", "IT Support", "Tools", "Languages"] as const;

export function Skills() {
	return (
		<section className="space-y-5">
			<div>
				<h2 className="text-2xl font-semibold tracking-tight">Technical Skills</h2>
				<p className="mt-1 text-sm text-muted-foreground">Resume-style skill highlights grouped by specialization.</p>
			</div>

			<div className="space-y-4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{categories.map((category) => {
					const items = skills
						.filter((skill) => skill.category === category)
						.sort((a, b) => a.order - b.order);

					if (!items.length) {
						return null;
					}

					return (
						<div key={category} className="space-y-2 rounded-xl border border-border bg-card p-4">
							<h3 className="text-sm font-semibold tracking-wide text-primary">{category}</h3>
							<div className="flex flex-wrap gap-2">
								{items.map((skill) => (
									<Badge key={skill.name} variant="secondary" className="flex text-wrap rounded-full">
										{skill.name}
									</Badge>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
