export type BrandProfile = {
	currentName: string;
	previousName: string;
	currentDomain: string;
	previousDomain: string;
	ownerName: string;
	roleTagline: string;
	headline: string;
	subTagline: string;
	freelanceAvailabilityLabel: string;
	jobAvailabilityLabel: string;
};

export type EducationItem = {
	title: string;
	institution: string;
	period: string;
	location?: string;
};

export type ExperienceItem = {
	role: string;
	company: string;
	period: string;
	summary: string;
};

export type SkillCategory =
	| "Frontend"
	| "Backend"
	| "DevOps"
	| "IT Support"
	| "Tools"
	| "Languages";

export type SkillItem = {
	name: string;
	category: SkillCategory;
	proficiency: 1 | 2 | 3 | 4 | 5;
	iconSlug: string;
	order: number;
};

export type SocialLink = {
	platform: "GitHub" | "LinkedIn" | "WhatsApp" | "Facebook";
	label: string;
	url: string;
};

export type ContactDetails = {
	email: string;
	phone: string;
	location: string;
	freelancePlatforms: FreelancePlatform[];
	socialLinks: SocialLink[];
};

export type FreelancePlatform = {
	name: "Upwork" | "Freelancer" | "Fiverr";
	url: string;
	handle: string;
};

export type MainWorkHighlight = {
	id: string;
	title: string;
	kind: "project" | "client-work" | "article";
	summary: string;
	href: string;
	featured: boolean;
	imageUrl: string;
};

export type Offering = {
	id: string;
	title: string;
	description: string;
	features: string[];
	ctaText: string;
	ctaUrl: string;
};

export type WorkflowStage = {
	step: number;
	title: string;
	subtitle: string;
	details: string;
};

export type ClientWorkItem = {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	projectUrl?: string;
	stack: string[];
	publishedAt?: string;
	slug?: string;
	content?: string;
};

export type TestimonialItem = {
	id: string;
	clientName: string;
	clientRoleCompany: string;
	text: string;
	avatarUrl?: string;
	rating: 1 | 2 | 3 | 4 | 5;
	projectReference: string;
	date: string;
};

export type BookingCta = {
	title: string;
	description: string;
	ctaText: string;
	ctaUrl: string;
};

export type LabProject = {
	id: string;
	title: string;
	slug: string;
	summary: string;
	content: string;
	stack: string[];
	coverImageUrl: string;
	screenshotUrls: string[];
	demoUrl?: string;
	repoUrl?: string;
	featured: boolean;
	views: number;
	tags: string[];
	publishedAt?: string;
};

export type LabArticle = {
	id: string;
	title: string;
	slug: string;
	category: string;
	excerpt: string;
	content: string;
	coverImageUrl: string;
	tags: string[];
	views: number;
	featured?: boolean;
	publishedAt?: string;
};

export type MessagePreview = {
	id: string;
	name: string;
	email: string;
	subject: string;
	message: string;
	receivedAt: string;
	isRead: boolean;
};

export type SubscriberPreview = {
	id: string;
	email: string;
	source: string;
	subscribedAt: string;
};

