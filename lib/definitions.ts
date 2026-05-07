export type BrandProfile = {
	currentName: string;
	previousName: string;
	currentDomain: string;
	previousDomain: string;
	ownerName: string;
	roleTagline: string;
	roleTaglineFr?: string | null;
	headline: string;
	headlineFr?: string | null;
	subTagline: string;
	subTaglineFr?: string | null;
	freelanceAvailabilityLabel: string;
	freelanceAvailabilityLabelFr?: string | null;
	jobAvailabilityLabel: string;
	jobAvailabilityLabelFr?: string | null;
};

export type EducationItem = {
	title: string;
	titleFr?: string | null;
	institution: string;
	institutionFr?: string | null;
	period: string;
	location?: string | null;
	locationFr?: string | null;
};

export type ExperienceItem = {
	role: string;
	roleFr?: string | null;
	company: string;
	companyFr?: string | null;
	period: string;
	summary: string;
	summaryFr?: string | null;
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
	nameFr?: string | null;
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
	locationFr?: string | null;
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
	titleFr?: string | null;
	kind: "project" | "client-work" | "article";
	summary: string;
	summaryFr?: string | null;
	href: string;
	featured: boolean;
	imageUrl: string;
};

export type Offering = {
	id: string;
	title: string;
	titleFr?: string | null;
	description: string;
	descriptionFr?: string | null;
	features: string[];
	featuresFr?: string[];
	ctaText: string;
	ctaTextFr?: string | null;
	ctaUrl: string;
};

export type WorkflowStage = {
	step: number;
	title: string;
	titleFr?: string | null;
	subtitle: string;
	subtitleFr?: string | null;
	details: string;
	detailsFr?: string | null;
};

export type ClientWorkItem = {
	id: string;
	title: string;
	titleFr?: string | null;
	description: string;
	descriptionFr?: string | null;
	imageUrl: string;
	projectUrl?: string;
	stack: string[];
	publishedAt?: string;
	slug?: string | null;
	content?: string | null;
	contentFr?: string | null;
};

export type TestimonialItem = {
	id: string;
	clientName: string;
	clientRoleCompany: string;
	clientRoleCompanyFr?: string | null;
	text: string;
	textFr?: string | null;
	avatarUrl?: string;
	rating: 1 | 2 | 3 | 4 | 5;
	projectReference: string;
	projectReferenceFr?: string | null;
	date: string;
	dateFr?: string | null;
};

export type BookingCta = {
	title: string;
	titleFr?: string | null;
	description: string;
	descriptionFr?: string | null;
	ctaText: string;
	ctaTextFr?: string | null;
	ctaUrl: string;
};

export type LabProject = {
	id: string;
	title: string;
	titleFr?: string | null;
	slug: string;
	summary: string;
	summaryFr?: string | null;
	content: string;
	contentFr?: string | null;
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
	titleFr?: string | null;
	slug: string;
	category: string;
	categoryFr?: string | null;
	excerpt: string;
	excerptFr?: string | null;
	content: string;
	contentFr?: string | null;
	coverImageUrl: string;
	tags: string[];
	views: number;
	featured?: boolean | null;
	publishedAt?: string;
};

export type AcademyResource = {
	id: string;
	title: string;
	titleFr?: string | null;
	description: string;
	descriptionFr?: string | null;
	content: string;
	contentFr?: string | null;
	type: "ARTICLE" | "GUIDE" | "BOOK" | "COURSE";
	slug: string;
	coverImageUrl: string;
	tags: string[];
	views: number;
	publishedAt?: string;
};

export type TeamMember = {
	name: string;
	role: string;
	roleFr?: string | null;
	speciality: string;
	specialityFr?: string | null;
	imageUrl: string;
	linkedIn?: string | null;
	whatsApp?: string | null;
	email?: string | null;
	website?: string | null;
	displayOrder: number;
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
