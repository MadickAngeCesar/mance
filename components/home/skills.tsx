import { Badge } from "@/components/ui/badge";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";



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
	let skills: any[] = [];

	try {
		skills = await prisma.skill.findMany({ orderBy: { displayOrder: "asc" } });
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("Skills section query failed, rendering fallback content:", error);
		}
	}

	const skillsData = skills;

	return (
		<section className="space-y-5">
			<div>
				<h2 className="text-2xl font-semibold tracking-tight">
                    <Tx en="Technical Skills" fr="Compétences Techniques" />
                </h2>
				<p className="mt-1 text-sm text-muted-foreground">
                    <Tx
                        en="Resume-style skill highlights grouped by specialization."
                        fr="Points forts des compétences de style CV regroupés par spécialisation."
                    />
                </p>
			</div>

			<div className="space-y-4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{categories.map((category) => {
					const items = skillsData
						.filter((skill) => skill.category === categoryMap[category]);

					if (!items.length) {
						return null;
					}

					return (
						<div key={category} className="space-y-2 rounded-xl border border-border bg-card p-4">
							<h3 className="text-sm font-semibold tracking-wide text-primary">
                                <Tx
                                    en={category}
                                    fr={
                                        category === "IT Support" ? "Support IT" :
                                        category === "Tools" ? "Outils" :
                                        category === "Languages" ? "Langues" : category
                                    }
                                />
                            </h3>
							<div className="flex flex-wrap gap-2">
								{items.map((skill) => (
									<Badge key={skill.name} variant="secondary" className="flex text-wrap rounded-full">
										<Tx en={skill.name} fr={skill.nameFr || skill.name} />
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
