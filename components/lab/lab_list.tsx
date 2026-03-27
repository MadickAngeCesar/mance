import { LabCard } from "@/components/lab/lab_card";
import { Separator } from "@/components/ui/separator";
import { labArticles, labProjects } from "@/lib/placeholder-data";

export function LabList() {
	const featuredProjects = labProjects.filter((project) => project.featured);

	return (
		<section className="space-y-8">
			<div className="space-y-5">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">Featured Projects</h2>
					<p className="mt-1 text-sm text-muted-foreground">A shortlist of projects with clear outcomes and production context.</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					{featuredProjects.map((project) => (
						<LabCard
							key={project.id}
							title={project.title}
							summary={project.summary}
							href={`/lab/${project.slug}`}
							coverImageUrl={project.coverImageUrl}
							tags={project.tags}
							kind="project"
							featured={project.featured}
							views={project.views}
							meta="Project"
						/>
					))}
				</div>
			</div>

			<Separator />

			<div className="space-y-5">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">All Projects</h2>
					<p className="mt-1 text-sm text-muted-foreground">Architecture, implementation decisions, and delivery notes.</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{labProjects.map((project) => (
						<LabCard
							key={project.id}
							title={project.title}
							summary={project.summary}
							href={`/lab/${project.slug}`}
							coverImageUrl={project.coverImageUrl}
							tags={project.tags}
							kind="project"
							featured={project.featured}
							views={project.views}
							meta="Project"
						/>
					))}
				</div>
			</div>

			<div className="space-y-5">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">Articles</h2>
					<p className="mt-1 text-sm text-muted-foreground">Engineering notes, case studies, and platform migration lessons.</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{labArticles.map((article) => (
						<LabCard
							key={article.id}
							title={article.title}
							summary={article.excerpt}
							href={`/lab/${article.slug}`}
							coverImageUrl={article.coverImageUrl}
							tags={article.tags}
							kind="article"
							views={article.views}
							meta={article.category}
						/>
					))}
				</div>
			</div>
		</section>
	);
}