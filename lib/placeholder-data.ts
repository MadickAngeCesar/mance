import type {
	BookingCta,
	BrandProfile,
	ClientWorkItem,
	ContactDetails,
	EducationItem,
	ExperienceItem,
	LabArticle,
	LabProject,
	MainWorkHighlight,
	MessagePreview,
	Offering,
	SkillItem,
	SubscriberPreview,
	TestimonialItem,
	WorkflowStage,
} from "@/lib/definitions";

export const brandProfile: BrandProfile = {
	currentName: "MAC TECH",
	previousName: "Mac.dev",
	currentDomain: "mance.dev",
	previousDomain: "mac.dev",
	ownerName: "Madick Ange Cesar",
	roleTagline: "Full-Stack JavaScript Developer · IT Specialist",
	headline: "Building digital solutions for businesses, teams, and founders.",
	subTagline:
		"I design and ship practical web platforms with strong engineering, dependable IT operations, and clear communication from kickoff to launch.",
	freelanceAvailabilityLabel: "Freelance projects",
	jobAvailabilityLabel: "Long-term work",
};

export const aboutSummary = {
	biography:
		"I am a Full-Stack JavaScript Developer and IT Specialist focused on building practical digital solutions: business websites, web applications, technical support systems, and automation workflows. I combine modern software engineering with real-world IT operations to help organizations scale with confidence.",
	cvDownloadUrl: "/MadickAngeCesar_FullStack_Resume_EN.pdf",
	linkedinResumeSource: "Profile.pdf metadata: Resume generated from profile (LinkedIn)",
	interests: [
		"Product Engineering",
		"Cloud Infrastructure",
		"Developer Experience",
		"Cybersecurity Basics",
		"Technical Writing",
	],
};

export const education: EducationItem[] = [
	{
		title: "BSc in Computer Science",
		institution: "Universite de Port-au-Prince",
		period: "2018 - 2022",
		location: "Port-au-Prince, HT",
	},
	{
		title: "Full-Stack and IT Practice",
		institution: "LinkedIn Profile Learning Path",
		period: "Ongoing",
		location: "Remote",
	},
	{
		title: "Google IT Support Professional Certificate",
		institution: "Coursera",
		period: "2023",
	},
];

export const experience: ExperienceItem[] = [
	{
		role: "Full-Stack JavaScript Developer",
		company: "MAC TECH",
		period: "2022 - Present",
		summary:
			"Delivering end-to-end client platforms with Next.js, API design, and PostgreSQL data modeling.",
	},
	{
		role: "IT Support Specialist",
		company: "Independent Consultant",
		period: "2020 - Present",
		summary:
			"Setting up secure office networks, troubleshooting systems, and improving workstation reliability.",
	},
];

export const mainWorkHighlights: MainWorkHighlight[] = [
	{
		id: "mw-1",
		title: "Portfolio Platform",
		kind: "project",
		summary:
			"A production-ready portfolio and service platform with dashboard CRUD and inquiry management.",
		href: "/lab/portfolio-platform",
		featured: true,
		imageUrl: "/images/mac_tech_logo.png",
	},
	{
		id: "mw-2",
		title: "Clinic Operations Dashboard",
		kind: "client-work",
		summary:
			"Internal dashboard for appointment tracking, reporting, and patient communication.",
		href: "/lab/clinic-operations-dashboard",
		featured: true,
		imageUrl: "/images/mac_tech_logo.png",
	},
	{
		id: "mw-3",
		title: "Designing Reliable Form Pipelines in Next.js",
		kind: "article",
		summary:
			"How to combine Zod validation, server actions, and clean UX for robust forms.",
		href: "/lab/reliable-form-pipelines-nextjs",
		featured: false,
		imageUrl: "/images/mac_tech_logo.png",
	},
	{
		id: "mw-4",
		title: "Business Website Modernization",
		kind: "project",
		summary:
			"End-to-end redesign focused on conversion, accessibility, and maintainable content workflows.",
		href: "/lab",
		featured: false,
		imageUrl: "/images/mac_tech_logo.png",
	},
	{
		id: "mw-5",
		title: "IT Support Playbook",
		kind: "article",
		summary:
			"Operational checklist for workstation setup, network stability, and incident response baselines.",
		href: "/lab",
		featured: false,
		imageUrl: "/images/mac_tech_logo.png",
	},
	{
		id: "mw-6",
		title: "Service Intake Automation",
		kind: "client-work",
		summary:
			"A structured lead intake flow with validation, routing, and status visibility for delivery teams.",
		href: "/lab",
		featured: true,
		imageUrl: "/images/mac_tech_logo.png",
	},
];

export const skills: SkillItem[] = [
	{ name: "JavaScript", category: "Frontend", proficiency: 5, iconSlug: "javascript", order: 1 },
	{ name: "TypeScript", category: "Frontend", proficiency: 5, iconSlug: "typescript", order: 2 },
	{ name: "React", category: "Frontend", proficiency: 5, iconSlug: "react", order: 3 },
	{ name: "Next.js", category: "Frontend", proficiency: 5, iconSlug: "nextjs", order: 4 },
	{ name: "HTML/CSS", category: "Frontend", proficiency: 5, iconSlug: "html5", order: 5 },
	{ name: "Node.js", category: "Backend", proficiency: 5, iconSlug: "nodejs", order: 6 },
	{ name: "Express", category: "Backend", proficiency: 4, iconSlug: "express", order: 7 },
	{ name: "Prisma", category: "Backend", proficiency: 4, iconSlug: "prisma", order: 8 },
	{ name: "PostgreSQL", category: "Backend", proficiency: 4, iconSlug: "postgresql", order: 9 },
	{ name: "MongoDB", category: "Backend", proficiency: 3, iconSlug: "mongodb", order: 10 },
	{ name: "Git", category: "Tools", proficiency: 5, iconSlug: "git", order: 11 },
	{ name: "GitHub", category: "Tools", proficiency: 5, iconSlug: "github", order: 12 },
	{ name: "VS Code", category: "Tools", proficiency: 5, iconSlug: "vscode", order: 13 },
	{ name: "Windows Administration", category: "IT Support", proficiency: 4, iconSlug: "windows11", order: 14 },
	{ name: "Network Troubleshooting", category: "IT Support", proficiency: 4, iconSlug: "wifi", order: 15 },
	{ name: "System Maintenance", category: "IT Support", proficiency: 4, iconSlug: "wrench", order: 16 },
	{ name: "English", category: "Languages", proficiency: 4, iconSlug: "language", order: 17 },
	{ name: "French", category: "Languages", proficiency: 5, iconSlug: "language", order: 18 },
	{ name: "Haitian Creole", category: "Languages", proficiency: 5, iconSlug: "language", order: 19 },
];

export const contactDetails: ContactDetails = {
	email: "hello@mance.dev",
	phone: "+509 0000 0000",
	location: "Port-au-Prince, Haiti",
	freelancePlatforms: [
		{ name: "Upwork", url: "https://www.upwork.com/freelancers/~mance", handle: "@mance" },
		{ name: "Freelancer", url: "https://www.freelancer.com/u/mance", handle: "@mance" },
		{ name: "Fiverr", url: "https://www.fiverr.com/mance", handle: "@mance" },
	],
	socialLinks: [
		{ platform: "GitHub", label: "github.com/mance-dev", url: "https://github.com/mance-dev" },
		{
			platform: "LinkedIn",
			label: "linkedin.com/in/madick-ange-cesar",
			url: "https://www.linkedin.com/in/madick-ange-cesar",
		},
		{ platform: "WhatsApp", label: "+509 0000 0000", url: "https://wa.me/50900000000" },
		{
			platform: "Facebook",
			label: "facebook.com/mactech",
			url: "https://www.facebook.com/mactech",
		},
	],
};

export const offerings: Offering[] = [
	{
		id: "web-product-development",
		title: "Web Product Development",
		description:
			"Custom web applications for teams that need performance, reliability, and maintainable code.",
		features: [
			"Next.js architecture and setup",
			"API and database integration",
			"Auth, roles, and dashboard features",
		],
		ctaText: "Start a web project",
		ctaUrl: "/services#booking",
	},
	{
		id: "it-support-operations",
		title: "IT Support and Operations",
		description:
			"Operational support for devices, networks, and collaboration tools in growing teams.",
		features: [
			"System diagnostics and maintenance",
			"Network setup and hardening",
			"Process documentation and team onboarding",
		],
		ctaText: "Book IT support",
		ctaUrl: "/services#booking",
	},
	{
		id: "technical-consulting",
		title: "Technical Consulting",
		description:
			"Advisory sessions to reduce technical risk and set a clear roadmap before development.",
		features: [
			"Architecture review",
			"MVP planning",
			"Delivery and hiring guidance",
		],
		ctaText: "Schedule consultation",
		ctaUrl: "/services#booking",
	},
];

export const workflowStages: WorkflowStage[] = [
	{
		step: 1,
		title: "Consultation",
		subtitle: "Discovery Call",
		details: "We clarify goals, constraints, and what success looks like.",
	},
	{
		step: 2,
		title: "Proposal",
		subtitle: "Project Plan",
		details: "You receive clear scope, milestones, deliverables, and cost.",
	},
	{
		step: 3,
		title: "Development",
		subtitle: "Execution",
		details: "Incremental delivery with regular demos and fast feedback loops.",
	},
	{
		step: 4,
		title: "Delivery",
		subtitle: "Launch",
		details: "Final QA, deployment, and transfer of ownership.",
	},
	{
		step: 5,
		title: "Support",
		subtitle: "Maintenance",
		details: "Post-launch monitoring, fixes, and iterative improvements.",
	},
];

export const clientWork: ClientWorkItem[] = [
	{
		id: "cw-portfolio-platform",
		title: "Portfolio Platform",
		description:
			"A modular platform to present services, portfolio, and client inquiries in one place.",
		imageUrl: "/images/client-work/portfolio-platform.jpg",
		projectUrl: "/lab/portfolio-platform",
		stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
	},
	{
		id: "cw-learning-hub",
		title: "Learning Hub Dashboard",
		description:
			"Admin interface for course publishing, user messaging, and content analytics.",
		imageUrl: "/images/client-work/learning-hub.jpg",
		stack: ["React", "Node.js", "Prisma", "PostgreSQL"],
	},
	{
		id: "cw-ops-monitor",
		title: "Operations Monitor",
		description:
			"Internal monitoring panel for IT incidents and service uptime.",
		imageUrl: "/images/client-work/operations-monitor.jpg",
		stack: ["Next.js", "Zod", "Redis", "Docker"],
	},
];

export const testimonials: TestimonialItem[] = [
	{
		id: "t-1",
		clientName: "Sarah Jean",
		clientRoleCompany: "Founder, BrightPath Studio",
		text: "MAC TECH translated our rough idea into a complete platform with clean UX and strong performance.",
		rating: 5,
		projectReference: "Project: Service Business Platform",
		date: "January 2025",
	},
	{
		id: "t-2",
		clientName: "David Pierre",
		clientRoleCompany: "Operations Manager, MediDesk",
		text: "The delivery process was clear from day one. We launched on time and support after launch was excellent.",
		rating: 5,
		projectReference: "Project: Clinic Operations Dashboard",
		date: "April 2025",
	},
	{
		id: "t-3",
		clientName: "Nadia Louis",
		clientRoleCompany: "Director, EduTech Connect",
		text: "Strong technical leadership, thoughtful architecture, and fast iterations with our team.",
		rating: 4,
		projectReference: "Project: Learning Hub Dashboard",
		date: "September 2025",
	},
];

export const bookingCta: BookingCta = {
	title: "Ready to Build with MAC TECH?",
	description:
		"Book a call and we will map your idea into a practical delivery plan with timeline and milestones.",
	ctaText: "Book a discovery call",
	ctaUrl: "/services#booking",
};

export const labProjects: LabProject[] = [
	{
		id: "p-portfolio-platform",
		title: "Portfolio Platform",
		slug: "portfolio-platform",
		summary: "Personal branding and service platform built for MAC TECH.",
		content:
			"This platform consolidates personal brand presentation, lead capture, and portfolio publishing in one modern stack.",
		stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
		coverImageUrl: "/images/lab/portfolio-platform-cover.jpg",
		screenshotUrls: [
			"/images/lab/portfolio-platform-1.jpg",
			"/images/lab/portfolio-platform-2.jpg",
		],
		demoUrl: "https://mance.dev",
		repoUrl: "https://github.com/mance-dev/portfolio-platform",
		featured: true,
		views: 842,
		tags: ["portfolio", "branding", "nextjs"],
	},
	{
		id: "p-clinic-ops",
		title: "Clinic Operations Dashboard",
		slug: "clinic-operations-dashboard",
		summary: "Dashboard for scheduling, communication, and operational reporting.",
		content:
			"Built to help administrators track appointments, message flows, and daily operational indicators.",
		stack: ["React", "Node.js", "Prisma", "PostgreSQL"],
		coverImageUrl: "/images/lab/clinic-ops-cover.jpg",
		screenshotUrls: ["/images/lab/clinic-ops-1.jpg"],
		featured: false,
		views: 563,
		tags: ["healthcare", "dashboard", "saas"],
	},
];

export const labArticles: LabArticle[] = [
	{
		id: "a-reliable-forms-nextjs",
		title: "Designing Reliable Form Pipelines in Next.js",
		slug: "reliable-form-pipelines-nextjs",
		category: "Engineering",
		excerpt:
			"Patterns for combining schema validation, server actions, and clean user feedback in modern web apps.",
		content:
			"This article walks through practical form architecture with Zod, robust error handling, and user-first UX patterns.",
		coverImageUrl: "/images/lab/articles/reliable-forms.jpg",
		tags: ["nextjs", "zod", "forms"],
		views: 412,
	},
	{
		id: "a-brand-architecture",
		title: "Migrating a Personal Brand from Mac.dev to MAC TECH",
		slug: "migrating-personal-brand-macdev-to-mac-tech",
		category: "Case Study",
		excerpt:
			"How to rename a technical brand, migrate domains, and keep SEO continuity.",
		content:
			"A behind-the-scenes review of naming strategy, domain changes from mac.dev to mance.dev, and content updates.",
		coverImageUrl: "/images/lab/articles/brand-migration.jpg",
		tags: ["branding", "seo", "domain"],
		views: 277,
	},
];

export const messagePreviews: MessagePreview[] = [
	{
		id: "m-1",
		name: "Ariana Noel",
		email: "ariana@example.com",
		subject: "Need a quote for an MVP",
		message: "I need a web MVP for booking and payments. Can we schedule a call?",
		receivedAt: "2026-02-11T14:25:00.000Z",
		isRead: false,
	},
	{
		id: "m-2",
		name: "Michael Simon",
		email: "michael@example.com",
		subject: "IT support retainer",
		message: "Looking for monthly support for 12 workstations and shared network devices.",
		receivedAt: "2026-02-05T10:10:00.000Z",
		isRead: true,
	},
];

export const subscriberPreviews: SubscriberPreview[] = [
	{
		id: "s-1",
		email: "jane@startup.com",
		source: "Lab newsletter footer",
		subscribedAt: "2026-01-15T08:45:00.000Z",
	},
	{
		id: "s-2",
		email: "kevin@agency.io",
		source: "Home contact form",
		subscribedAt: "2026-02-01T17:02:00.000Z",
	},
];
