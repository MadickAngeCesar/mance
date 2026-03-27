import type { Metadata } from "next";

import { Tx } from "@/components/i18n/tx";
import { ArticleForm } from "@/components/dashboard/article_form";
import { ArticleList } from "@/components/dashboard/article_list";

export const metadata: Metadata = {
	title: "Blogs | Dashboard",
};

export default function BlogsDashboardPage() {
	return (
		<section className="space-y-5">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight"><Tx en="Blog Content Management" fr="Gestion des articles" /></h1>
					<p className="text-sm text-muted-foreground">
						<Tx en="Create, edit, and organize technical articles for the lab section." fr="Creez, modifiez et organisez les articles techniques pour la section Lab." />
					</p>
				</div>
				<ArticleForm />
			</div>

			<ArticleList />
		</section>
	);
}
