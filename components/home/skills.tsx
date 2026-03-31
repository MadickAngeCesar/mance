import { Badge } from "@/components/ui/badge";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

const categories = ["Frontend", "Backend", "DevOps", "IT Support", "Tools", "Languages"] as const;

const categoryMap: Record<(typeof categories)[number], string> = {
	Frontend: "FRONTEND",
	Backend: "BACKEND",
	DevOps: "DEVOPS",
	"IT Support": "IT_SUPPORT",
	Tools: "TOOLS",
	Languages: "LANGUAGES",
};

export async function Skills() {
	let skills: Array<{ name: string; category: string }> = [];

	try {
		skills = await prisma.skill.findMany({ orderBy: { displayOrder: "asc" } });
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("Skills section query failed, rendering fallback content:", error);
		}
	}

	return (
		<section className="space-y-5">
			<div>
				<h2 className="text-2xl font-semibold tracking-tight">Technical Skills</h2>
				<p className="mt-1 text-sm text-muted-foreground">Resume-style skill highlights grouped by specialization.</p>
			</div>

			<div className="space-y-4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{categories.map((category) => {
					const items = skills
						.filter((skill) => skill.category === categoryMap[category]);

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
