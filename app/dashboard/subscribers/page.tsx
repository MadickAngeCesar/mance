import type { Metadata } from "next";

import { SubscribersList } from "@/components/dashboard/subscribers_list";

export const metadata: Metadata = {
	title: "Subscribers | Dashboard",
};

export default function SubscribersDashboardPage() {
	return (
		<section className="space-y-5">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold tracking-tight">Subscribers Management</h1>
				<p className="text-sm text-muted-foreground">
					Track newsletter growth, monitor acquisition channels, and clean stale contacts.
				</p>
			</div>
			<SubscribersList />
		</section>
	);
}
