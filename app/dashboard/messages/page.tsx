import type { Metadata } from "next";

import { MessageList } from "@/components/dashboard/message_list";

export const metadata: Metadata = {
	title: "Messages | Dashboard",
};

export default function MessagesDashboardPage() {
	return (
		<section className="space-y-5">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold tracking-tight">Inbox Management</h1>
				<p className="text-sm text-muted-foreground">
					Review inquiries, reply quickly, and keep your lead pipeline organized.
				</p>
			</div>
			<MessageList />
		</section>
	);
}
