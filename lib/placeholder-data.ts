import type {
	AcademyResource,
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
	TeamMember,
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
	roleTaglineFr: "Développeur JavaScript Full-Stack · Spécialiste IT",
	headline: "Building digital solutions for businesses, teams, and founders.",
	headlineFr: "Construire des solutions numériques pour les entreprises, les équipes et les fondateurs.",
	subTagline:
		"I design and ship practical web platforms with strong engineering, dependable IT operations, and clear communication from kickoff to launch.",
	subTaglineFr: "Je conçois et livre des plateformes web pratiques avec une ingénierie solide, des opérations IT fiables et une communication claire du coup d'envoi au lancement.",
	freelanceAvailabilityLabel: "Freelance projects",
	freelanceAvailabilityLabelFr: "Projets freelance",
	jobAvailabilityLabel: "Long-term work",
	jobAvailabilityLabelFr: "Travail à long terme",
};

export const aboutSummary = {
	biography:
		"I am a Full-Stack JavaScript Developer and IT Specialist focused on building practical digital solutions: business websites, web applications, technical support systems, and automation workflows. I combine modern software engineering with real-world IT operations to help organizations scale with confidence.",
	biographyFr: "Je suis un développeur JavaScript Full-Stack et un spécialiste IT concentré sur la construction de solutions numériques pratiques : sites web d'entreprise, applications web, systèmes de support technique et workflows d'automatisation. Je combine l'ingénierie logicielle moderne avec des opérations IT réelles pour aider les organisations à évoluer en toute confiance.",
	cvDownloadUrl: "/MadickAngeCesar_FullStack_Resume_EN.pdf",
	linkedinResumeSource: "Profile.pdf metadata: Resume generated from profile (LinkedIn)",
	interests: [
		"Product Engineering",
		"Cloud Infrastructure",
		"Developer Experience",
		"Cybersecurity Basics",
		"Technical Writing",
	],
	interestsFr: [
		"Ingénierie de produit",
		"Infrastructure Cloud",
		"Expérience développeur",
		"Bases de la cybersécurité",
		"Rédaction technique",
	],
};

export const education: EducationItem[] = [
	{
		title: "BSc in Computer Science",
		titleFr: "Licence en Informatique",
		institution: "Universite de Port-au-Prince",
		institutionFr: "Université de Port-au-Prince",
		period: "2018 - 2022",
		location: "Port-au-Prince, HT",
		locationFr: "Port-au-Prince, HT",
	},
	{
		title: "Full-Stack and IT Practice",
		titleFr: "Pratique Full-Stack et IT",
		institution: "LinkedIn Profile Learning Path",
		institutionFr: "Parcours d'apprentissage profil LinkedIn",
		period: "Ongoing",
		location: "Remote",
		locationFr: "À distance",
	},
	{
		title: "Google IT Support Professional Certificate",
		titleFr: "Certificat professionnel Google IT Support",
		institution: "Coursera",
		period: "2023",
	},
];

export const experience: ExperienceItem[] = [
	{
		role: "Full-Stack JavaScript Developer",
		roleFr: "Développeur JavaScript Full-Stack",
		company: "MAC TECH",
		companyFr: "MAC TECH",
		period: "2022 - Present",
		summary:
			"Delivering end-to-end client platforms with Next.js, API design, and PostgreSQL data modeling.",
		summaryFr: "Livraison de plateformes client de bout en bout avec Next.js, conception d'API et modélisation de données PostgreSQL.",
	},
	{
		role: "IT Support Specialist",
		roleFr: "Spécialiste support IT",
		company: "Independent Consultant",
		companyFr: "Consultant indépendant",
		period: "2020 - Present",
		summary:
			"Setting up secure office networks, troubleshooting systems, and improving workstation reliability.",
		summaryFr: "Mise en place de réseaux de bureau sécurisés, dépannage de systèmes et amélioration de la fiabilité des postes de travail.",
	},
];

export const mainWorkHighlights: MainWorkHighlight[] = [
	{
		id: "mw-1",
		title: "Portfolio Platform",
		titleFr: "Plateforme de Portfolio",
		kind: "project",
		summary:
			"A production-ready portfolio and service platform with dashboard CRUD and inquiry management.",
		summaryFr: "Une plateforme de portfolio et de services prête pour la production avec CRUD de tableau de bord et gestion des demandes.",
		href: "/lab/portfolio-platform",
		featured: true,
		imageUrl: "/images/mac_tech_logo.png",
	},
	{
		id: "mw-2",
		title: "Clinic Operations Dashboard",
		titleFr: "Tableau de bord des opérations cliniques",
		kind: "client-work",
		summary:
			"Internal dashboard for appointment tracking, reporting, and patient communication.",
		summaryFr: "Tableau de bord interne pour le suivi des rendez-vous, les rapports et la communication avec les patients.",
		href: "/lab/clinic-operations-dashboard",
		featured: true,
		imageUrl: "/images/mac_tech_logo.png",
	},
	{
		id: "mw-3",
		title: "Designing Reliable Form Pipelines in Next.js",
		titleFr: "Conception de pipelines de formulaires fiables dans Next.js",
		kind: "article",
		summary:
			"How to combine Zod validation, server actions, and clean UX for robust forms.",
		summaryFr: "Comment combiner la validation Zod, les server actions et une UX propre pour des formulaires robustes.",
		href: "/lab/reliable-form-pipelines-nextjs",
		featured: false,
		imageUrl: "/images/mac_tech_logo.png",
	},
	{
		id: "mw-4",
		title: "Business Website Modernization",
		titleFr: "Modernisation de sites web d'entreprise",
		kind: "project",
		summary:
			"End-to-end redesign focused on conversion, accessibility, and maintainable content workflows.",
		summaryFr: "Refonte de bout en bout axée sur la conversion, l'accessibilité et des workflows de contenu maintenables.",
		href: "/lab",
		featured: false,
		imageUrl: "/images/mac_tech_logo.png",
	},
	{
		id: "mw-5",
		title: "IT Support Playbook",
		titleFr: "Guide de support IT",
		kind: "article",
		summary:
			"Operational checklist for workstation setup, network stability, and incident response baselines.",
		summaryFr: "Liste de contrôle opérationnelle pour la configuration des postes de travail, la stabilité du réseau et les bases de réponse aux incidents.",
		href: "/lab",
		featured: false,
		imageUrl: "/images/mac_tech_logo.png",
	},
	{
		id: "mw-6",
		title: "Service Intake Automation",
		titleFr: "Automatisation de l'admission des services",
		kind: "client-work",
		summary:
			"A structured lead intake flow with validation, routing, and status visibility for delivery teams.",
		summaryFr: "Un flux structuré d'admission de leads avec validation, routage et visibilité du statut pour les équipes de livraison.",
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
	{ name: "Windows Administration", nameFr: "Administration Windows", category: "IT Support", proficiency: 4, iconSlug: "windows11", order: 14 },
	{ name: "Network Troubleshooting", nameFr: "Dépannage réseau", category: "IT Support", proficiency: 4, iconSlug: "wifi", order: 15 },
	{ name: "System Maintenance", nameFr: "Maintenance système", category: "IT Support", proficiency: 4, iconSlug: "wrench", order: 16 },
	{ name: "English", nameFr: "Anglais", category: "Languages", proficiency: 4, iconSlug: "language", order: 17 },
	{ name: "French", nameFr: "Français", category: "Languages", proficiency: 5, iconSlug: "language", order: 18 },
	{ name: "Haitian Creole", nameFr: "Créole Haïtien", category: "Languages", proficiency: 5, iconSlug: "language", order: 19 },
];

export const contactDetails: ContactDetails = {
	email: "hello@mance.dev",
	phone: "+509 0000 0000",
	location: "Port-au-Prince, Haiti",
	locationFr: "Port-au-Prince, Haïti",
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
		titleFr: "Développement de Produits Web",
		description:
			"Custom web applications for teams that need performance, reliability, and maintainable code.",
		descriptionFr: "Applications web personnalisées pour les équipes qui ont besoin de performance, de fiabilité et d'un code maintenable.",
		features: [
			"Next.js architecture and setup",
			"API and database integration",
			"Auth, roles, and dashboard features",
		],
		featuresFr: [
			"Architecture et configuration Next.js",
			"Intégration d'API et de bases de données",
			"Fonctionnalités d'authentification, de rôles et de tableau de bord",
		],
		ctaText: "Start a web project",
		ctaTextFr: "Démarrer un projet web",
		ctaUrl: "/services#booking",
	},
	{
		id: "it-support-operations",
		title: "IT Support and Operations",
		titleFr: "Support IT et Opérations",
		description:
			"Operational support for devices, networks, and collaboration tools in growing teams.",
		descriptionFr: "Support opérationnel pour les appareils, les réseaux et les outils de collaboration dans les équipes en croissance.",
		features: [
			"System diagnostics and maintenance",
			"Network setup and hardening",
			"Process documentation and team onboarding",
		],
		featuresFr: [
			"Diagnostics et maintenance du système",
			"Configuration et sécurisation du réseau",
			"Documentation des processus et intégration de l'équipe",
		],
		ctaText: "Book IT support",
		ctaTextFr: "Réserver un support IT",
		ctaUrl: "/services#booking",
	},
	{
		id: "digital-transformation",
		title: "Digital Transformation",
		titleFr: "Transformation Numérique",
		description:
			"Business automation and platform modernization for teams moving from manual workflows to scalable systems.",
		descriptionFr: "Automatisation des affaires et modernisation des plateformes pour les équipes passant de workflows manuels à des systèmes évolutifs.",
		features: [
			"Business process mapping and automation",
			"Custom software planning and implementation",
		],
		featuresFr: [
			"Cartographie et automatisation des processus métier",
			"Planification et mise en œuvre de logiciels personnalisés",
		],
		ctaText: "Plan digital transformation",
		ctaTextFr: "Planifier une transformation numérique",
		ctaUrl: "/services#booking",
	},
    {
		id: "technical-writing",
		title: "Technical Writing",
		titleFr: "Rédaction Technique",
		description: "Clear and effective documentation, blog posts, and tutorials for your technical products.",
		descriptionFr: "Documentation, articles de blog et tutoriels clairs et efficaces pour vos produits techniques.",
		features: [
			"Product documentation and API references",
			"Technical blog posts and tutorials",
			"Internal team runbooks and guides"
		],
		featuresFr: [
			"Documentation produit et références API",
			"Articles de blog technique et tutoriels",
			"Runbooks et guides d'équipe internes"
		],
		ctaText: "Get technical writing",
		ctaTextFr: "Obtenir une rédaction technique",
		ctaUrl: "/services#booking"
	}
];

export const workflowStages: WorkflowStage[] = [
	{
		step: 1,
		title: "Consultation",
		titleFr: "Consultation",
		subtitle: "Discovery Call",
		subtitleFr: "Appel de découverte",
		details: "We clarify goals, constraints, and what success looks like.",
		detailsFr: "Nous clarifions les objectifs, les contraintes et ce à quoi ressemble le succès.",
	},
	{
		step: 2,
		title: "Proposal",
		titleFr: "Proposition",
		subtitle: "Project Plan",
		subtitleFr: "Plan de projet",
		details: "You receive clear scope, milestones, deliverables, and cost.",
		detailsFr: "Vous recevez une portée claire, des jalons, des livrables et le coût.",
	},
	{
		step: 3,
		title: "Development",
		titleFr: "Développement",
		subtitle: "Execution",
		subtitleFr: "Exécution",
		details: "Incremental delivery with regular demos and fast feedback loops.",
		detailsFr: "Livraison incrémentielle avec des démos régulières et des boucles de rétroaction rapides.",
	},
	{
		step: 4,
		title: "Delivery",
		titleFr: "Livraison",
		subtitle: "Launch",
		subtitleFr: "Lancement",
		details: "Final QA, deployment, and transfer of ownership.",
		detailsFr: "AQ finale, déploiement et transfert de propriété.",
	},
	{
		step: 5,
		title: "Support",
		titleFr: "Support",
		subtitle: "Maintenance",
		subtitleFr: "Maintenance",
		details: "Post-launch monitoring, fixes, and iterative improvements.",
		detailsFr: "Suivi post-lancement, corrections et améliorations itératives.",
	},
];

export const clientWork: ClientWorkItem[] = [
	{
		id: "cw-portfolio-platform",
		title: "Portfolio Platform",
		titleFr: "Plateforme de Portfolio",
		description:
			"A modular platform to present services, portfolio, and client inquiries in one place.",
		descriptionFr: "Une plateforme modulaire pour présenter les services, le portfolio et les demandes des clients en un seul endroit.",
		imageUrl: "/images/mac_tech_logo.png",
		projectUrl: "/lab/portfolio-platform",
		stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
		publishedAt: "2025-11-20",
	},
	{
		id: "cw-finance-crm",
		title: "Finance CRM Modernization",
		titleFr: "Modernisation du CRM Finance",
		description:
			"Client migration from spreadsheet workflows to a role-based CRM with reporting dashboards.",
		descriptionFr: "Migration client des workflows de tableurs vers un CRM basé sur les rôles avec des tableaux de bord de rapport.",
		imageUrl: "/images/mac_tech_logo.png",
		projectUrl: "/lab/finance-crm-modernization",
		stack: ["Next.js", "Prisma", "PostgreSQL", "Zod"],
		publishedAt: "2026-01-18",
	},
	{
		id: "cw-placeholder-service-ops",
		title: "Placeholder Service Operations Portal",
		titleFr: "Portail des opérations de service fictif",
		description:
			"Preview entry for testing client-work presentation and navigation in the lab detail route.",
		descriptionFr: "Entrée d'aperçu pour tester la présentation du travail client et la navigation dans la route de détail du lab.",
		imageUrl: "/images/mac_tech_logo.png",
		projectUrl: "/lab/placeholder-client-work-portal",
		stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
		publishedAt: "2026-03-01",
		slug: "placeholder-client-work-portal",
		content:
			"This placeholder represents a client operations portal with service requests, ticket statuses, and admin reporting. Replace with real client context and screenshots later.",
		contentFr: "Cet espace réservé représente un portail d'opérations client avec des demandes de service, des statuts de ticket et des rapports administratifs. Remplacez par le contexte client réel et des captures d'écran plus tard.",
	},
];

export const testimonials: TestimonialItem[] = [
	{
		id: "t-1",
		clientName: "Sarah Jean",
		clientRoleCompany: "Founder, BrightPath Studio",
		clientRoleCompanyFr: "Fondatrice, BrightPath Studio",
		text: "MAC TECH translated our rough idea into a complete platform with clean UX and strong performance.",
		textFr: "MAC TECH a traduit notre idée brute en une plateforme complète avec une UX propre et de fortes performances.",
		rating: 5,
		projectReference: "Project: Service Business Platform",
		projectReferenceFr: "Projet : Plateforme d'entreprise de services",
		date: "January 2025",
		dateFr: "Janvier 2025",
	},
	{
		id: "t-2",
		clientName: "David Pierre",
		clientRoleCompany: "Operations Manager, MediDesk",
		clientRoleCompanyFr: "Responsable des opérations, MediDesk",
		text: "The delivery process was clear from day one. We launched on time and support after launch was excellent.",
		textFr: "Le processus de livraison était clair dès le premier jour. Nous avons lancé à temps et le support après le lancement a été excellent.",
		rating: 5,
		projectReference: "Project: Clinic Operations Dashboard",
		projectReferenceFr: "Projet : Tableau de bord des opérations cliniques",
		date: "April 2025",
		dateFr: "Avril 2025",
	},
	{
		id: "t-3",
		clientName: "Nadia Louis",
		clientRoleCompany: "Director, EduTech Connect",
		clientRoleCompanyFr: "Directrice, EduTech Connect",
		text: "Strong technical leadership, thoughtful architecture, and fast iterations with our team.",
		textFr: "Un leadership technique solide, une architecture réfléchie et des itérations rapides avec notre équipe.",
		rating: 4,
		projectReference: "Project: Learning Hub Dashboard",
		projectReferenceFr: "Projet : Tableau de bord du hub d'apprentissage",
		date: "September 2025",
		dateFr: "Septembre 2025",
	},
];

export const bookingCta: BookingCta = {
	title: "Hire me for your next project",
	titleFr: "Embauchez-moi pour votre prochain projet",
	description:
		"Book a call and we will map your idea into a practical delivery plan with timeline and milestones.",
	descriptionFr: "Réservez un appel et nous transformerons votre idée en un plan de livraison pratique avec un calendrier et des jalons.",
	ctaText: "Hire me",
	ctaTextFr: "Embauchez-moi",
	ctaUrl: "/services#booking",
};

export const labProjects: LabProject[] = [
	{
		id: "p-portfolio-platform",
		title: "Portfolio Platform",
		titleFr: "Plateforme de Portfolio",
		slug: "portfolio-platform",
		summary: "Personal branding and service platform built for MAC TECH.",
		summaryFr: "Branding personnel et plateforme de services construits pour MAC TECH.",
		content:
			"This platform consolidates personal brand presentation, lead capture, and portfolio publishing in one modern stack.",
		contentFr: "Cette plateforme consolide la présentation de la marque personnelle, la capture de leads et la publication de portfolio dans une pile moderne.",
		stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
		coverImageUrl: "/images/mac_tech_logo.png",
		screenshotUrls: [
			"/images/lab/portfolio-platform-1.jpg",
			"/images/lab/portfolio-platform-2.jpg",
		],
		demoUrl: "https://mance.dev",
		repoUrl: "https://github.com/mance-dev/portfolio-platform",
		featured: true,
		views: 842,
		tags: ["portfolio", "branding", "nextjs"],
		publishedAt: "2025-12-01",
	},
	{
		id: "p-clinic-ops",
		title: "Clinic Operations Dashboard",
		titleFr: "Tableau de bord des opérations cliniques",
		slug: "clinic-operations-dashboard",
		summary: "Dashboard for scheduling, communication, and operational reporting.",
		summaryFr: "Tableau de bord pour la planification, la communication et les rapports opérationnels.",
		content:
			"Built to help administrators track appointments, message flows, and daily operational indicators.",
		contentFr: "Conçu pour aider les administrateurs à suivre les rendez-vous, les flux de messages et les indicateurs opérationnels quotidiens.",
		stack: ["React", "Node.js", "Prisma", "PostgreSQL"],
		coverImageUrl: "/images/mac_tech_logo.png",
		screenshotUrls: ["/images/lab/clinic-ops-1.jpg"],
		featured: false,
		views: 563,
		tags: ["healthcare", "dashboard", "saas"],
		publishedAt: "2025-09-07",
	},
	{
		id: "p-finance-crm-modernization",
		title: "Finance CRM Modernization",
		titleFr: "Modernisation du CRM Finance",
		slug: "finance-crm-modernization",
		summary:
			"CRM modernization focused on replacing manual spreadsheets with reliable workflows.",
		summaryFr: "Modernisation du CRM axée sur le remplacement des tableurs manuels par des workflows fiables.",
		content:
			"A migration project covering data model redesign, role-based dashboards, validation-first forms, and reporting pipelines for operations leadership.",
		contentFr: "Un projet de migration couvrant la refonte du modèle de données, des tableaux de bord basés sur les rôles, des formulaires axés sur la validation et des pipelines de rapports pour la direction des opérations.",
		stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
		coverImageUrl: "/images/mac_tech_logo.png",
		screenshotUrls: ["/images/lab/portfolio-platform-1.jpg"],
		demoUrl: "https://mance.dev",
		repoUrl: "https://github.com/mance-dev/portfolio-platform",
		featured: false,
		views: 301,
		tags: ["crm", "case-study", "operations"],
		publishedAt: "2026-01-18",
	},
	{
		id: "p-placeholder-project-showcase",
		title: "Placeholder Project Showcase",
		titleFr: "Vitrine de projet fictive",
		slug: "placeholder-project-showcase",
		summary:
			"Placeholder project entry to preview project detail presentation on the lab slug page.",
		summaryFr: "Entrée de projet fictive pour prévisualiser la présentation des détails du projet sur la page slug du lab.",
		content:
			"This placeholder project demonstrates the expected structure for new portfolio entries: context, challenge, implementation summary, and technical outcomes.",
		contentFr: "Ce projet fictif démontre la structure attendue pour les nouvelles entrées de portfolio : contexte, défi, résumé de la mise en œuvre et résultats techniques.",
		stack: ["Next.js", "TypeScript", "Tailwind CSS"],
		coverImageUrl: "/images/mac_tech_logo.png",
		screenshotUrls: ["/images/lab/portfolio-platform-2.jpg"],
		demoUrl: "https://mance.dev",
		repoUrl: "https://github.com/mance-dev/portfolio-platform",
		featured: false,
		views: 120,
		tags: ["placeholder", "project", "preview"],
		publishedAt: "2026-03-03",
	},
];

export const labArticles: LabArticle[] = [
	{
		id: "a-reliable-forms-nextjs",
		title: "Designing Reliable Form Pipelines in Next.js",
		titleFr: "Conception de pipelines de formulaires fiables dans Next.js",
		slug: "reliable-form-pipelines-nextjs",
		category: "Engineering",
		categoryFr: "Ingénierie",
		excerpt:
			"Patterns for combining schema validation, server actions, and clean user feedback in modern web apps.",
		excerptFr: "Modèles pour combiner la validation de schéma, les server actions et un retour utilisateur propre dans les applications web modernes.",
		content:
			"This article walks through practical form architecture with Zod, robust error handling, and user-first UX patterns.",
		contentFr: "Cet article présente l'architecture pratique des formulaires avec Zod, une gestion robuste des erreurs et des modèles d'UX axés sur l'utilisateur.",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["nextjs", "zod", "forms"],
		views: 412,
		featured: true,
		publishedAt: "2026-02-10",
	},
	{
		id: "a-brand-architecture",
		title: "Migrating a Personal Brand from Mac.dev to MAC TECH",
		titleFr: "Migration d'une marque personnelle de Mac.dev à MAC TECH",
		slug: "migrating-personal-brand-macdev-to-mac-tech",
		category: "Case Study",
		categoryFr: "Étude de cas",
		excerpt:
			"How to rename a technical brand, migrate domains, and keep SEO continuity.",
		excerptFr: "Comment renommer une marque technique, migrer des domaines et maintenir la continuité SEO.",
		content:
			"A behind-the-scenes review of naming strategy, domain changes from mac.dev to mance.dev, and content updates.",
		contentFr: "Une revue en coulisses de la stratégie de nommage, des changements de domaine de mac.dev à mance.dev et des mises à jour de contenu.",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["branding", "seo", "domain"],
		views: 277,
		featured: false,
		publishedAt: "2025-08-22",
	},
	{
		id: "a-it-support-runbook",
		title: "Building an IT Support Runbook for Small Teams",
		titleFr: "Construire un runbook de support IT pour les petites équipes",
		slug: "building-it-support-runbook-small-teams",
		category: "IT Support",
		categoryFr: "Support IT",
		excerpt:
			"A practical framework for incident response, escalation paths, and maintenance routines in small organizations.",
		excerptFr: "Un cadre pratique pour la réponse aux incidents, les chemins d'escalade et les routines de maintenance dans les petites organisations.",
		content:
			"This reflection outlines how to design support workflows, define SLAs, and document repeatable troubleshooting checklists for long-term reliability.",
		contentFr: "Cette réflexion souligne comment concevoir des workflows de support, définir des SLA et documenter des listes de contrôle de dépannage répétables pour une fiabilité à long terme.",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["it-support", "operations", "documentation"],
		views: 198,
		featured: false,
		publishedAt: "2026-01-05",
	},
	{
		id: "a-placeholder-article-preview",
		title: "Placeholder Technical Article Preview",
		titleFr: "Aperçu d'article technique fictif",
		slug: "placeholder-technical-article-preview",
		category: "Placeholder",
		categoryFr: "Espace réservé",
		excerpt:
			"Placeholder article entry to preview typography, cover media, and content structure on the lab slug page.",
		excerptFr: "Entrée d'article fictive pour prévisualiser la typographie, les médias de couverture et la structure du contenu sur la page slug du lab.",
		content:
			"Use this as a draft template for future technical writing. Replace this content with final sections, examples, and references once the article is ready.",
		contentFr: "Utilisez ceci comme modèle de brouillon pour vos futurs écrits techniques. Remplacez ce contenu par des sections finales, des exemples et des références une fois l'article prêt.",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["placeholder", "article", "preview"],
		views: 94,
		featured: false,
		publishedAt: "2026-03-02",
	},
];

export const academyResources: AcademyResource[] = [
	{
		id: "ar-cs-basics",
		title: "Computer Science Basics",
		titleFr: "Bases de l'informatique",
		description: "A comprehensive guide to the fundamentals of computer science.",
		descriptionFr: "Un guide complet sur les fondamentaux de l'informatique.",
		content: "Content about CS basics...",
		contentFr: "Contenu sur les bases de l'informatique...",
		type: "GUIDE",
		slug: "cs-basics",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["cs", "fundamentals"],
		views: 120,
		publishedAt: "2026-01-10",
	},
	{
		id: "ar-web-dev-course",
		title: "Modern Web Development",
		titleFr: "Développement Web Moderne",
		description: "Learn to build modern web applications with React and Next.js.",
		descriptionFr: "Apprenez à construire des applications web modernes avec React et Next.js.",
		content: "Course content for web development...",
		contentFr: "Contenu du cours pour le développement web...",
		type: "COURSE",
		slug: "modern-web-dev",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["web", "react", "nextjs"],
		views: 450,
		publishedAt: "2026-02-15",
	},
];

export const teamMembers: TeamMember[] = [
	{
		name: "Madick Ange Cesar",
		role: "Founder & Lead Developer",
		roleFr: "Fondateur & Développeur Principal",
		speciality: "Full-Stack Development, IT Operations",
		specialityFr: "Développement Full-Stack, Opérations IT",
		imageUrl: "/images/Profile.jpg",
		linkedIn: "https://www.linkedin.com/in/madick-ange-cesar",
		whatsApp: "https://wa.me/50900000000",
		email: "hello@mance.dev",
		website: "https://mance.dev",
		displayOrder: 1,
	},
	{
		name: "Nde Dilan",
		role: "IT Specialist",
		roleFr: "Spécialiste IT",
		speciality: "Network Security, System Administration",
		specialityFr: "Sécurité réseau, Administration système",
		imageUrl: "/images/mac_tech_logo.png",
		linkedIn: "#",
		whatsApp: "#",
		email: "dilan@mance.dev",
		displayOrder: 2,
	},
	{
		name: "Carole Josepha Mengue",
		role: "Technical Writer & QA",
		roleFr: "Rédactrice technique & AQ",
		speciality: "Documentation, Quality Assurance",
		specialityFr: "Documentation, Assurance Qualité",
		imageUrl: "/images/mac_tech_logo.png",
		linkedIn: "#",
		whatsApp: "#",
		email: "carole@mance.dev",
		displayOrder: 3,
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
