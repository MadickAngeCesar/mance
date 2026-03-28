"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/client-api";

type ProfilePayload = {
	brandProfile: {
		currentName: string;
		currentDomain: string;
		headline: string;
		roleTagline: string;
	};
	aboutSummary: {
		biography: string;
		cvDownloadUrl: string;
	};
	contactDetails: {
		email: string;
		phone: string;
		location: string;
	};
};

type EducationItem = {
	id: string;
	title: string;
	institution: string;
	period: string;
	location?: string | null;
};

type ExperienceItem = {
	id: string;
	role: string;
	company: string;
	period: string;
	summary: string;
};

type SkillItem = {
	id: string;
	name: string;
	category: "FRONTEND" | "BACKEND" | "DEVOPS" | "IT_SUPPORT" | "TOOLS" | "LANGUAGES";
	proficiency: number;
	iconSlug?: string;
};

type SocialLinkItem = {
	id: string;
	platform: "GITHUB" | "LINKEDIN" | "WHATSAPP" | "FACEBOOK";
	label: string;
	url: string;
};

type FreelancePlatformItem = {
	id: string;
	name: "UPWORK" | "FREELANCER" | "FIVERR";
	url: string;
	handle?: string;
};

type ProfileReferenceResponse = {
	education: EducationItem[];
	experience: ExperienceItem[];
	skills: SkillItem[];
	socialLinks: SocialLinkItem[];
	freelancePlatforms: FreelancePlatformItem[];
};

const skillCategoryOptions: Array<{ value: SkillItem["category"]; label: string }> = [
	{ value: "FRONTEND", label: "Frontend" },
	{ value: "BACKEND", label: "Backend" },
	{ value: "DEVOPS", label: "DevOps" },
	{ value: "IT_SUPPORT", label: "IT Support" },
	{ value: "TOOLS", label: "Tools" },
	{ value: "LANGUAGES", label: "Languages" },
];

const socialPlatformOptions: Array<{ value: SocialLinkItem["platform"]; label: string }> = [
	{ value: "GITHUB", label: "GitHub" },
	{ value: "LINKEDIN", label: "LinkedIn" },
	{ value: "WHATSAPP", label: "WhatsApp" },
	{ value: "FACEBOOK", label: "Facebook" },
];

const freelancePlatformOptions: Array<{ value: FreelancePlatformItem["name"]; label: string }> = [
	{ value: "UPWORK", label: "Upwork" },
	{ value: "FREELANCER", label: "Freelancer" },
	{ value: "FIVERR", label: "Fiverr" },
];

export function ProfileForm() {
	const [form, setForm] = useState<ProfilePayload>({
		brandProfile: {
			currentName: "",
			currentDomain: "",
			headline: "",
			roleTagline: "",
		},
		aboutSummary: {
			biography: "",
			cvDownloadUrl: "",
		},
		contactDetails: {
			email: "",
			phone: "",
			location: "",
		},
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const [profileImageUrl, setProfileImageUrl] = useState("/images/Profile.jpg");
	const [education, setEducation] = useState<EducationItem[]>([]);
	const [experience, setExperience] = useState<ExperienceItem[]>([]);
	const [skills, setSkills] = useState<SkillItem[]>([]);
	const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);
	const [freelancePlatforms, setFreelancePlatforms] = useState<FreelancePlatformItem[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleProfileImageUpload = async (file: File | null) => {
		if (!file) {
			return;
		}

		setIsUploadingImage(true);
		setError(null);
		setSuccess(null);

		try {
			const uploadData = new FormData();
			uploadData.append("file", file);
			uploadData.append("kind", "profile");

			const response = await apiRequest<{ url: string }>("/api/uploads", {
				method: "POST",
				auth: true,
				body: uploadData,
			});

			const nextUrl = response.data?.url ?? "/images/Profile.jpg";
			setProfileImageUrl(nextUrl);
			setSuccess("Profile image uploaded successfully.");
		} catch (uploadError) {
			setError(uploadError instanceof Error ? uploadError.message : "Unable to upload profile image.");
		} finally {
			setIsUploadingImage(false);
		}
	};

	useEffect(() => {
		let isMounted = true;

		async function loadProfile() {
			setIsLoading(true);
			setError(null);
			try {
				const [profileResponse, referenceResponse] = await Promise.all([
					apiRequest<any>("/api/profile", { auth: true }),
					apiRequest<ProfileReferenceResponse>("/api/profile/reference", { auth: true }),
				]);

				const data = profileResponse.data;

				if (!isMounted || !data) {
					return;
				}

				setForm({
					brandProfile: {
						currentName: data.currentName ?? "",
						currentDomain: data.currentDomain ?? "",
						headline: data.headline ?? "",
						roleTagline: data.roleTagline ?? "",
					},
					aboutSummary: {
						biography: data.aboutSummary?.biography ?? "",
						cvDownloadUrl: data.aboutSummary?.cvDownloadUrl ?? "",
					},
					contactDetails: {
						email: data.contactDetails?.email ?? "",
						phone: data.contactDetails?.phone ?? "",
						location: data.contactDetails?.location ?? "",
					},
				});

				setEducation(referenceResponse.data?.education ?? []);
				setExperience(referenceResponse.data?.experience ?? []);
				setSkills(referenceResponse.data?.skills ?? []);
				setSocialLinks(referenceResponse.data?.socialLinks ?? data.contactDetails?.socialLinks ?? []);
				setFreelancePlatforms(referenceResponse.data?.freelancePlatforms ?? data.contactDetails?.freelancePlatforms ?? []);
			} catch (loadError) {
				if (!isMounted) {
					return;
				}
				setError(loadError instanceof Error ? loadError.message : "Unable to load profile settings.");
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		void loadProfile();

		return () => {
			isMounted = false;
		};
	}, []);

	const handleSave = async () => {
		setIsSaving(true);
		setError(null);
		setSuccess(null);

		try {
			await Promise.all([
				apiRequest("/api/profile", {
					method: "PATCH",
					auth: true,
					body: JSON.stringify(form),
				}),
				apiRequest("/api/profile/reference", {
					method: "PATCH",
					auth: true,
					body: JSON.stringify({
						education: education
							.map((entry) => ({
								title: entry.title.trim(),
								institution: entry.institution.trim(),
								period: entry.period.trim(),
								location: entry.location?.trim() || null,
							}))
							.filter((entry) => entry.title && entry.institution && entry.period),
						experience: experience
							.map((entry) => ({
								role: entry.role.trim(),
								company: entry.company.trim(),
								period: entry.period.trim(),
								summary: entry.summary.trim(),
							}))
							.filter((entry) => entry.role && entry.company && entry.period && entry.summary),
						skills: skills
							.map((entry) => ({
								name: entry.name.trim(),
								category: entry.category,
								proficiency: Math.min(5, Math.max(1, Number(entry.proficiency) || 1)),
								iconSlug: entry.iconSlug?.trim() || undefined,
							}))
							.filter((entry) => entry.name),
						socialLinks: socialLinks
							.map((entry) => ({
								platform: entry.platform,
								label: entry.label.trim(),
								url: entry.url.trim(),
							}))
							.filter((entry) => entry.label && entry.url),
						freelancePlatforms: freelancePlatforms
							.map((entry) => ({
								name: entry.name,
								url: entry.url.trim(),
								handle: entry.handle?.trim() || undefined,
							}))
							.filter((entry) => entry.url),
					}),
				}),
			]);
			setSuccess("Profile settings saved.");
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : "Unable to save profile settings.");
		} finally {
			setIsSaving(false);
		}
	};

	const addExperience = () => {
		setExperience((current) => [...current, { id: crypto.randomUUID(), role: "", company: "", period: "", summary: "" }]);
	};

	const addEducation = () => {
		setEducation((current) => [...current, { id: crypto.randomUUID(), title: "", institution: "", period: "", location: "" }]);
	};

	const addSkill = () => {
		setSkills((current) => [
			...current,
			{ id: crypto.randomUUID(), name: "", category: "FRONTEND", proficiency: 3, iconSlug: "" },
		]);
	};

	const addSocialLink = () => {
		setSocialLinks((current) => [
			...current,
			{ id: crypto.randomUUID(), platform: "GITHUB", label: "", url: "" },
		]);
	};

	const addFreelancePlatform = () => {
		setFreelancePlatforms((current) => [
			...current,
			{ id: crypto.randomUUID(), name: "UPWORK", url: "", handle: "" },
		]);
	};

	return (
		<Card>
			<CardHeader className="border-b border-border/70 pb-4">
				<CardTitle className="text-base">Portfolio Profile Settings</CardTitle>
				<CardDescription>
					Edit personal brand details, static content sections, and contact channels for public pages.
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-4">
				{isLoading ? <p className="mb-3 text-sm text-muted-foreground">Loading profile settings...</p> : null}
				{error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}
				{success ? <p className="mb-3 text-sm text-green-600">{success}</p> : null}
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
								<Input
									id="current-name"
									placeholder="MAC TECH"
									value={form.brandProfile.currentName}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											brandProfile: { ...current.brandProfile, currentName: event.target.value },
										}))
									}
								/>
							</div>
							<div className="space-y-1.5">
								<label htmlFor="domain" className="text-xs font-medium text-muted-foreground">
									Current Domain
								</label>
								<Input
									id="domain"
									placeholder="mance.dev"
									value={form.brandProfile.currentDomain}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											brandProfile: { ...current.brandProfile, currentDomain: event.target.value },
										}))
									}
								/>
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="headline" className="text-xs font-medium text-muted-foreground">
									Headline
								</label>
								<Input
									id="headline"
									placeholder="Building practical digital products"
									value={form.brandProfile.headline}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											brandProfile: { ...current.brandProfile, headline: event.target.value },
										}))
									}
								/>
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="tagline" className="text-xs font-medium text-muted-foreground">
									Role Tagline
								</label>
								<Input
									id="tagline"
									placeholder="Technology and digital solutions"
									value={form.brandProfile.roleTagline}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											brandProfile: { ...current.brandProfile, roleTagline: event.target.value },
										}))
									}
								/>
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="bio" className="text-xs font-medium text-muted-foreground">
									Biography
								</label>
								<Textarea
									id="bio"
									placeholder="Write a short professional biography..."
									rows={6}
									value={form.aboutSummary.biography}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											aboutSummary: { ...current.aboutSummary, biography: event.target.value },
										}))
									}
								/>
							</div>
							<div className="space-y-1.5">
								<label htmlFor="resume" className="text-xs font-medium text-muted-foreground">
									Resume URL
								</label>
								<Input
									id="resume"
									placeholder="/MadickAngeCesar_FullStack_Resume_EN.pdf"
									value={form.aboutSummary.cvDownloadUrl}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											aboutSummary: { ...current.aboutSummary, cvDownloadUrl: event.target.value },
										}))
									}
								/>
							</div>
							<div className="space-y-1.5">
								<label htmlFor="avatar" className="text-xs font-medium text-muted-foreground">
									Profile Image URL
								</label>
								<Input id="avatar" value={profileImageUrl} readOnly />
								<Input
									id="avatar-file"
									type="file"
									accept="image/*"
									onChange={(event) => {
										const file = event.target.files?.[0] ?? null;
										void handleProfileImageUpload(file);
									}}
								/>
								<p className="text-xs text-muted-foreground">
									{isUploadingImage ? "Uploading image..." : "Uploaded image is served from /images/Profile.jpg"}
								</p>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="experience" className="space-y-3">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<h3 className="text-sm font-medium">Experience</h3>
								<Button variant="outline" size="sm" type="button" onClick={addExperience}>
									<Plus className="size-4" />
									Add Entry
								</Button>
							</div>
								{experience.map((entry, index) => (
								<div key={`${entry.company}-${entry.period}`} className="rounded-lg border border-border/70 p-3">
									<div className="grid gap-2 md:grid-cols-2">
										<Input
											placeholder="Full Stack Developer"
											value={entry.role}
											onChange={(event) =>
												setExperience((current) =>
													current.map((item, itemIndex) =>
														itemIndex === index ? { ...item, role: event.target.value } : item
													)
												)
											}
											aria-label="Role"
										/>
										<Input
											placeholder="Acme Inc"
											value={entry.company}
											onChange={(event) =>
												setExperience((current) =>
													current.map((item, itemIndex) =>
														itemIndex === index ? { ...item, company: event.target.value } : item
													)
												)
											}
											aria-label="Company"
										/>
										<Input
											placeholder="2022 - Present"
											value={entry.period}
											onChange={(event) =>
												setExperience((current) =>
													current.map((item, itemIndex) =>
														itemIndex === index ? { ...item, period: event.target.value } : item
													)
												)
											}
											aria-label="Period"
										/>
										<Button
											variant="ghost"
											size="sm"
											type="button"
											className="justify-self-start"
											onClick={() => setExperience((current) => current.filter((_, itemIndex) => itemIndex !== index))}
										>
											<Trash2 className="size-4" />
											Remove
										</Button>
									</div>
									<Textarea
										placeholder="Describe responsibilities and impact..."
										value={entry.summary}
										onChange={(event) =>
											setExperience((current) =>
												current.map((item, itemIndex) =>
													itemIndex === index ? { ...item, summary: event.target.value } : item
												)
											)
										}
										className="mt-2"
										rows={3}
										aria-label="Summary"
									/>
								</div>
							))}
								{experience.length === 0 ? <p className="text-sm text-muted-foreground">No experience entries yet.</p> : null}
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<h3 className="text-sm font-medium">Education & Certifications</h3>
								<Button variant="outline" size="sm" type="button" onClick={addEducation}>
									<Plus className="size-4" />
									Add Entry
								</Button>
							</div>
							{education.map((entry, index) => (
								<div key={`${entry.title}-${entry.period}`} className="rounded-lg border border-border/70 p-3">
									<div className="grid gap-2 md:grid-cols-2">
										<Input
											placeholder="BSc Computer Science"
											value={entry.title}
											onChange={(event) =>
												setEducation((current) =>
													current.map((item, itemIndex) =>
														itemIndex === index ? { ...item, title: event.target.value } : item
													)
												)
											}
											aria-label="Title"
										/>
										<Input
											placeholder="State University"
											value={entry.institution}
											onChange={(event) =>
												setEducation((current) =>
													current.map((item, itemIndex) =>
														itemIndex === index ? { ...item, institution: event.target.value } : item
													)
												)
											}
											aria-label="Institution"
										/>
										<Input
											placeholder="2018 - 2022"
											value={entry.period}
											onChange={(event) =>
												setEducation((current) =>
													current.map((item, itemIndex) =>
														itemIndex === index ? { ...item, period: event.target.value } : item
													)
												)
											}
											aria-label="Period"
										/>
										<Input
											placeholder="Montreal, QC"
											value={entry.location ?? ""}
											onChange={(event) =>
												setEducation((current) =>
													current.map((item, itemIndex) =>
														itemIndex === index ? { ...item, location: event.target.value } : item
													)
												)
											}
											aria-label="Location"
										/>
										<Button
											variant="ghost"
											size="sm"
											type="button"
											onClick={() => setEducation((current) => current.filter((_, itemIndex) => itemIndex !== index))}
										>
											<Trash2 className="size-4" />
											Remove
										</Button>
									</div>
								</div>
							))}
							{education.length === 0 ? <p className="text-sm text-muted-foreground">No education entries yet.</p> : null}
						</div>
					</TabsContent>

					<TabsContent value="skills" className="space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-medium">Skills Matrix</h3>
							<Button variant="outline" size="sm" type="button" onClick={addSkill}>
								<Plus className="size-4" />
								Add Skill
							</Button>
						</div>
						<div className="grid gap-2">
							{skills.map((skill, index) => (
								<div key={skill.name} className="grid gap-2 rounded-lg border border-border/70 p-2 md:grid-cols-[1fr_150px_80px_auto]">
									<Input
										placeholder="Next.js"
										value={skill.name}
										onChange={(event) =>
											setSkills((current) =>
												current.map((item, itemIndex) =>
													itemIndex === index ? { ...item, name: event.target.value } : item
												)
											)
										}
										aria-label="Skill"
									/>
									<select
										value={skill.category}
										onChange={(event) =>
											setSkills((current) =>
												current.map((item, itemIndex) =>
													itemIndex === index
														? { ...item, category: event.target.value as SkillItem["category"] }
														: item
												)
											)
										}
										className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm"
										aria-label="Category"
									>
										{skillCategoryOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
									<Input
										type="number"
										placeholder="3"
										min={1}
										max={5}
										value={String(skill.proficiency)}
										onChange={(event) =>
											setSkills((current) =>
												current.map((item, itemIndex) =>
													itemIndex === index
														? { ...item, proficiency: Number(event.target.value) || 1 }
														: item
												)
											)
										}
										aria-label="Proficiency"
									/>
									<Button
										variant="ghost"
										size="sm"
										type="button"
										onClick={() => setSkills((current) => current.filter((_, itemIndex) => itemIndex !== index))}
									>
										<Trash2 className="size-4" />
										Remove
									</Button>
								</div>
							))}
							{skills.length === 0 ? <p className="text-sm text-muted-foreground">No skills configured yet.</p> : null}
						</div>
					</TabsContent>

					<TabsContent value="contact" className="space-y-3">
						<div className="grid gap-3 md:grid-cols-3">
							<div className="space-y-1.5">
								<label htmlFor="contact-email" className="text-xs font-medium text-muted-foreground">
									Email
								</label>
								<Input
									id="contact-email"
									placeholder="hello@mance.dev"
									value={form.contactDetails.email}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											contactDetails: { ...current.contactDetails, email: event.target.value },
										}))
									}
								/>
							</div>
							<div className="space-y-1.5">
								<label htmlFor="contact-phone" className="text-xs font-medium text-muted-foreground">
									Phone
								</label>
								<Input
									id="contact-phone"
									placeholder="+1 555 123 4567"
									value={form.contactDetails.phone}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											contactDetails: { ...current.contactDetails, phone: event.target.value },
										}))
									}
								/>
							</div>
							<div className="space-y-1.5">
								<label htmlFor="contact-location" className="text-xs font-medium text-muted-foreground">
									Location
								</label>
								<Input
									id="contact-location"
									placeholder="Montreal, Canada"
									value={form.contactDetails.location}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											contactDetails: { ...current.contactDetails, location: event.target.value },
										}))
									}
								/>
							</div>
						</div>

						<div className="grid gap-2">
							<div className="flex items-center justify-between">
								<h3 className="text-sm font-medium">Social Links</h3>
								<Button variant="outline" size="sm" type="button" onClick={addSocialLink}>
									<Plus className="size-4" />
									Add Social Link
								</Button>
							</div>
							{socialLinks.map((link, index) => (
								<div key={link.id} className="grid gap-2 rounded-lg border border-border/70 p-2 md:grid-cols-[160px_1fr_1fr_auto]">
									<select
										value={link.platform}
										onChange={(event) =>
											setSocialLinks((current) =>
												current.map((item, itemIndex) =>
													itemIndex === index
														? { ...item, platform: event.target.value as SocialLinkItem["platform"] }
														: item
												)
											)
										}
										className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm"
										aria-label="Platform"
									>
										{socialPlatformOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
									<Input
										placeholder="GitHub Profile"
										value={link.label}
										onChange={(event) =>
											setSocialLinks((current) =>
												current.map((item, itemIndex) =>
													itemIndex === index ? { ...item, label: event.target.value } : item
												)
											)
										}
										aria-label="Label"
									/>
									<Input
										placeholder="https://github.com/username"
										value={link.url}
										onChange={(event) =>
											setSocialLinks((current) =>
												current.map((item, itemIndex) =>
													itemIndex === index ? { ...item, url: event.target.value } : item
												)
											)
										}
										aria-label="URL"
									/>
									<Button
										variant="ghost"
										size="sm"
										type="button"
										onClick={() => setSocialLinks((current) => current.filter((_, itemIndex) => itemIndex !== index))}
									>
										<Trash2 className="size-4" />
										Remove
									</Button>
								</div>
							))}
							{socialLinks.length === 0 ? <p className="text-sm text-muted-foreground">No social links configured yet.</p> : null}

							<div className="mt-3 flex items-center justify-between">
								<h3 className="text-sm font-medium">Freelance Platforms</h3>
								<Button variant="outline" size="sm" type="button" onClick={addFreelancePlatform}>
									<Plus className="size-4" />
									Add Platform
								</Button>
							</div>
							{freelancePlatforms.map((platform, index) => (
								<div key={platform.id} className="grid gap-2 rounded-lg border border-border/70 p-2 md:grid-cols-[160px_1fr_1fr_auto]">
									<select
										value={platform.name}
										onChange={(event) =>
											setFreelancePlatforms((current) =>
												current.map((item, itemIndex) =>
													itemIndex === index
														? { ...item, name: event.target.value as FreelancePlatformItem["name"] }
														: item
												)
											)
										}
										className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm"
									>
										{freelancePlatformOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
									<Input
										placeholder="https://www.upwork.com/freelancers/~example"
										value={platform.url}
										onChange={(event) =>
											setFreelancePlatforms((current) =>
												current.map((item, itemIndex) =>
													itemIndex === index ? { ...item, url: event.target.value } : item
												)
											)
										}
										aria-label="Platform URL"
									/>
									<Input
										placeholder="@username"
										value={platform.handle ?? ""}
										onChange={(event) =>
											setFreelancePlatforms((current) =>
												current.map((item, itemIndex) =>
													itemIndex === index ? { ...item, handle: event.target.value } : item
												)
											)
										}
										aria-label="Handle"
									/>
									<Button
										variant="ghost"
										size="sm"
										type="button"
										onClick={() =>
											setFreelancePlatforms((current) => current.filter((_, itemIndex) => itemIndex !== index))
										}
									>
										<Trash2 className="size-4" />
										Remove
									</Button>
								</div>
							))}
							{freelancePlatforms.length === 0 ? <p className="text-sm text-muted-foreground">No freelance platforms configured yet.</p> : null}
						</div>
					</TabsContent>
				</Tabs>

				<div className="mt-4 flex justify-end">
					<Button type="button" onClick={() => void handleSave()} disabled={isSaving || isLoading}>
						<Save className="size-4" />
						{isSaving ? "Saving..." : "Save Profile Settings"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}