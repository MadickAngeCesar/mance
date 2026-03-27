import type { Metadata } from "next";

import { ProfileForm } from "@/components/dashboard/profile_form";

export const metadata: Metadata = {
  title: "Settings | Dashboard",
};

export default function SettingsDashboardPage() {
	return (
		<section className="space-y-5">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold tracking-tight">Profile and Site Settings</h1>
				<p className="text-sm text-muted-foreground">
					Configure personal branding, static portfolio content, and contact channels.
				</p>
			</div>
			<ProfileForm />
		</section>
	);
}
