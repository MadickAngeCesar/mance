import { Plus, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { aboutSummary, brandProfile, contactDetails, education, experience, skills } from "@/lib/placeholder-data";

export function ProfileForm() {
	return (
		<Card>
			<CardHeader className="border-b border-border/70 pb-4">
				<CardTitle className="text-base">Portfolio Profile Settings</CardTitle>
				<CardDescription>
					Edit personal brand details, static content sections, and contact channels for public pages.
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-4">
				<Tabs defaultValue="identity" className="gap-4">
					<TabsList>
						<TabsTrigger value="identity">Identity</TabsTrigger>
						<TabsTrigger value="experience">Experience</TabsTrigger>
						<TabsTrigger value="skills">Skills</TabsTrigger>
						<TabsTrigger value="contact">Contact</TabsTrigger>
					</TabsList>

					<TabsContent value="identity" className="space-y-3">
						<div className="grid gap-3 md:grid-cols-2">
							<div className="space-y-1.5">
								<label htmlFor="current-name" className="text-xs font-medium text-muted-foreground">
									Current Brand Name
								</label>
								<Input id="current-name" defaultValue={brandProfile.currentName} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="domain" className="text-xs font-medium text-muted-foreground">
									Current Domain
								</label>
								<Input id="domain" defaultValue={brandProfile.currentDomain} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="headline" className="text-xs font-medium text-muted-foreground">
									Headline
								</label>
								<Input id="headline" defaultValue={brandProfile.headline} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="tagline" className="text-xs font-medium text-muted-foreground">
									Role Tagline
								</label>
								<Input id="tagline" defaultValue={brandProfile.roleTagline} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="bio" className="text-xs font-medium text-muted-foreground">
									Biography
								</label>
								<Textarea id="bio" rows={6} defaultValue={aboutSummary.biography} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="resume" className="text-xs font-medium text-muted-foreground">
									Resume URL
								</label>
								<Input id="resume" defaultValue={aboutSummary.cvDownloadUrl} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="avatar" className="text-xs font-medium text-muted-foreground">
									Profile Image URL
								</label>
								<Input id="avatar" placeholder="/images/profile/headshot.jpg" />
							</div>
						</div>
					</TabsContent>

					<TabsContent value="experience" className="space-y-3">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<h3 className="text-sm font-medium">Experience</h3>
								<Button variant="outline" size="sm" type="button">
									<Plus className="size-4" />
									Add Entry
								</Button>
							</div>
							{experience.map((entry) => (
								<div key={`${entry.company}-${entry.period}`} className="rounded-lg border border-border/70 p-3">
									<div className="grid gap-2 md:grid-cols-2">
										<Input defaultValue={entry.role} aria-label="Role" />
										<Input defaultValue={entry.company} aria-label="Company" />
										<Input defaultValue={entry.period} aria-label="Period" />
										<Button variant="ghost" size="sm" type="button" className="justify-self-start">
											<Trash2 className="size-4" />
											Remove
										</Button>
									</div>
									<Textarea defaultValue={entry.summary} className="mt-2" rows={3} aria-label="Summary" />
								</div>
							))}
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<h3 className="text-sm font-medium">Education & Certifications</h3>
								<Button variant="outline" size="sm" type="button">
									<Plus className="size-4" />
									Add Entry
								</Button>
							</div>
							{education.map((entry) => (
								<div key={`${entry.title}-${entry.period}`} className="rounded-lg border border-border/70 p-3">
									<div className="grid gap-2 md:grid-cols-2">
										<Input defaultValue={entry.title} aria-label="Title" />
										<Input defaultValue={entry.institution} aria-label="Institution" />
										<Input defaultValue={entry.period} aria-label="Period" />
										<Input defaultValue={entry.location ?? ""} aria-label="Location" />
									</div>
								</div>
							))}
						</div>
					</TabsContent>

					<TabsContent value="skills" className="space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-medium">Skills Matrix</h3>
							<Button variant="outline" size="sm" type="button">
								<Plus className="size-4" />
								Add Skill
							</Button>
						</div>
						<div className="grid gap-2">
							{skills.slice(0, 10).map((skill) => (
								<div key={skill.name} className="grid gap-2 rounded-lg border border-border/70 p-2 md:grid-cols-[1fr_150px_80px_auto]">
									<Input defaultValue={skill.name} aria-label="Skill" />
									<Input defaultValue={skill.category} aria-label="Category" />
									<Input defaultValue={String(skill.proficiency)} aria-label="Proficiency" />
									<Button variant="ghost" size="sm" type="button">
										<Trash2 className="size-4" />
										Remove
									</Button>
								</div>
							))}
						</div>
					</TabsContent>

					<TabsContent value="contact" className="space-y-3">
						<div className="grid gap-3 md:grid-cols-3">
							<div className="space-y-1.5">
								<label htmlFor="contact-email" className="text-xs font-medium text-muted-foreground">
									Email
								</label>
								<Input id="contact-email" defaultValue={contactDetails.email} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="contact-phone" className="text-xs font-medium text-muted-foreground">
									Phone
								</label>
								<Input id="contact-phone" defaultValue={contactDetails.phone} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="contact-location" className="text-xs font-medium text-muted-foreground">
									Location
								</label>
								<Input id="contact-location" defaultValue={contactDetails.location} />
							</div>
						</div>

						<div className="grid gap-2">
							{contactDetails.socialLinks.map((link) => (
								<div key={link.platform} className="grid gap-2 rounded-lg border border-border/70 p-2 md:grid-cols-[120px_1fr_1fr]">
									<Input defaultValue={link.platform} aria-label="Platform" />
									<Input defaultValue={link.label} aria-label="Label" />
									<Input defaultValue={link.url} aria-label="URL" />
								</div>
							))}
						</div>
					</TabsContent>
				</Tabs>

				<div className="mt-4 flex justify-end">
					<Button type="button">
						<Save className="size-4" />
						Save Profile Settings
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}