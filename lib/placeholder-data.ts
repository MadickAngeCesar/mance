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
	TargetSector,
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
		clientName: "MAC TECH",
		clientNameFr: "MAC TECH",
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
		clientName: "Sarah Jean Partners",
		clientNameFr: "Associés de Sarah Jean",
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
		clientName: "David Pierre Clinic",
		clientNameFr: "Clinique de David Pierre",
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
		likes: 125,
		problem: "Managing portfolio projects, service catalogs, lead capture, and technical blogs across multiple fragmented tools led to high maintenance overhead and disjointed user experiences.",
		problemFr: "La gestion des projets de portfolio, des catalogues de services, de la capture de prospects et des blogs techniques à travers plusieurs outils fragmentés entraînait des coûts de maintenance élevés et des expériences utilisateur décousues.",
		solution: "Developed a unified web platform built on Next.js 15, integrating markdown content processing, dynamic dashboards, structured service listings, and form submission APIs in a single secure application.",
		solutionFr: "Développement d'une plateforme web unifiée basée sur Next.js 15, intégrant le traitement de contenu markdown, des tableaux de bord dynamiques, des listes de services structurées et des API de soumission de formulaires dans une seule application sécurisée.",
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
		likes: 84,
		problem: "Medical administrators spent excessive time manually tracking appointments, patient messages, and operational performance using disjointed legacy software.",
		problemFr: "Les administrateurs médicaux passaient trop de temps à suivre manuellement les rendez-vous, les messages des patients et les performances opérationnelles à l'aide de logiciels patrimoniaux décousus.",
		solution: "Designed a real-time reactive dashboard combining WebSockets with Postgres analytics, featuring immediate notification, visual calendar grids, and streamlined inbox queues.",
		solutionFr: "Conception d'un tableau de bord réactif en temps réel combinant les WebSockets avec des analyses Postgres, doté de notifications immédiates, de grilles de calendrier visuelles et de files d'attente de messagerie rationalisées.",
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
		likes: 42,
		problem: "Relying on manual spreadsheets and emails to manage critical customer financial requests caused delayed responses and high vulnerability to data entry errors.",
		problemFr: "L'utilisation de feuilles de calcul manuelles et d'e-mails pour gérer les demandes financières critiques des clients entraînait des retards de réponse et une grande vulnérabilité aux erreurs de saisie.",
		solution: "Replaced the spreadsheet workflows with a schema-validated, role-based CRM containing multi-step workflow pipelines, automated status reporting, and strict input validation rules.",
		solutionFr: "Remplacement des flux de travail sur tableur par un CRM basé sur des rôles et validé par schéma, contenant des pipelines de flux de travail en plusieurs étapes, des rapports d'état automatisés et des règles de validation de saisie strictes.",
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
		likes: 7,
		problem: "Demonstrating prospective layouts and technical performance before actual project data is populated can stall client onboarding processes.",
		problemFr: "La démonstration de mises en page potentielles et de performances techniques avant que les données réelles du projet ne soient renseignées peut bloquer le processus d'intégration des clients.",
		solution: "Created a robust boilerplate structure mapping mock inputs, showing typography scales, standard responsive spacing, and generic metadata bindings.",
		solutionFr: "Création d'une structure de modèle robuste cartographiant des entrées fictives, affichant des échelles typographiques, des espacements réactifs standard et des liaisons de métadonnées génériques.",
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
		likes: 54,
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
		likes: 38,
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
		likes: 22,
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
		likes: 5,
		featured: false,
		publishedAt: "2026-03-02",
	},
];

export const academyResources: AcademyResourceExtended[] = [
	// ── ARTICLES ──────────────────────────────────────────────────────────────
	{
		id: "ar-nextjs-server-components",
		title: "Mastering Next.js Server Components",
		titleFr: "Maîtriser les Server Components de Next.js",
		description:
			"A deep dive into React Server Components in Next.js 14+: rendering strategies, data fetching patterns, and performance implications for production apps.",
		descriptionFr:
			"Une plongée dans les React Server Components dans Next.js 14+ : stratégies de rendu, patterns de récupération de données et implications sur les performances.",
		content: "",
		contentFr: "",
		type: "ARTICLE",
		slug: "nextjs-server-components",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["nextjs", "react", "performance"],
		views: 1240,
		publishedAt: "2026-05-20",
		isFree: true,
		downloadUrl: "#",
		likes: 87,
		difficulty: "Intermediate",
	},
	{
		id: "ar-typescript-generics",
		title: "TypeScript Generics Explained",
		titleFr: "Les Génériques TypeScript Expliqués",
		description:
			"From basic constraints to advanced conditional types — master generics to write reusable, type-safe utilities that your entire team will love.",
		descriptionFr:
			"Des contraintes de base aux types conditionnels avancés — maîtrisez les génériques pour écrire des utilitaires réutilisables et type-safe.",
		content: "",
		contentFr: "",
		type: "ARTICLE",
		slug: "typescript-generics",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["typescript", "generics", "types"],
		views: 892,
		publishedAt: "2026-04-12",
		isFree: true,
		downloadUrl: "#",
		likes: 64,
		difficulty: "Intermediate",
	},
	{
		id: "ar-postgresql-indexing",
		title: "PostgreSQL Indexing Strategies",
		titleFr: "Stratégies d'Indexation PostgreSQL",
		description:
			"Understand B-tree, GIN, BRIN, and partial indexes. Learn how to read EXPLAIN output and eliminate slow queries in your production database.",
		descriptionFr:
			"Comprenez les index B-tree, GIN, BRIN et partiels. Apprenez à lire la sortie EXPLAIN et à éliminer les requêtes lentes.",
		content: "",
		contentFr: "",
		type: "ARTICLE",
		slug: "postgresql-indexing",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["postgresql", "database", "performance"],
		views: 543,
		publishedAt: "2026-03-08",
		isFree: false,
		price: 9,
		buyUrl: "#",
		likes: 41,
		difficulty: "Advanced",
	},
	{
		id: "ar-docker-essentials",
		title: "Docker for JavaScript Developers",
		titleFr: "Docker pour les Développeurs JavaScript",
		description:
			"Containerize Node.js and Next.js apps with confidence. Covers multi-stage builds, compose setups, and best practices for lean production images.",
		descriptionFr:
			"Conteneurisez vos apps Node.js et Next.js avec confiance. Multi-stage builds, configurations Compose et bonnes pratiques pour des images légères.",
		content: "",
		contentFr: "",
		type: "ARTICLE",
		slug: "docker-for-js-devs",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["docker", "devops", "nodejs"],
		views: 720,
		publishedAt: "2026-02-25",
		isFree: true,
		downloadUrl: "#",
		likes: 55,
		difficulty: "Beginner",
	},
	{
		id: "ar-api-design-rest",
		title: "Designing REST APIs That Last",
		titleFr: "Concevoir des API REST Durables",
		description:
			"Versioning, error handling, pagination, and security patterns for REST APIs that scale gracefully. Based on real-world production experience.",
		descriptionFr:
			"Versionnement, gestion des erreurs, pagination et patterns de sécurité pour des API REST qui évoluent avec grâce.",
		content: "",
		contentFr: "",
		type: "ARTICLE",
		slug: "designing-rest-apis",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["api", "rest", "backend"],
		views: 660,
		publishedAt: "2026-01-18",
		isFree: false,
		price: 7,
		buyUrl: "#",
		likes: 48,
		difficulty: "Intermediate",
	},

	// ── CHEAT SHEETS (GUIDE) ──────────────────────────────────────────────────
	{
		id: "ar-git-cheatsheet",
		title: "Git Commands Cheat Sheet",
		titleFr: "Aide-mémoire des Commandes Git",
		description:
			"Every Git command you actually need — branching, rebasing, stashing, bisect, and recovery recipes — on one printable reference card.",
		descriptionFr:
			"Toutes les commandes Git dont vous avez besoin — branches, rebase, stash, bisect et recettes de récupération — sur une carte de référence imprimable.",
		content: "",
		contentFr: "",
		type: "GUIDE",
		slug: "git-cheatsheet",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["git", "version-control", "cli"],
		views: 3400,
		publishedAt: "2026-06-01",
		isFree: true,
		downloadUrl: "#",
		likes: 214,
		difficulty: "Beginner",
	},
	{
		id: "ar-css-flexbox-grid",
		title: "CSS Flexbox & Grid Cheat Sheet",
		titleFr: "Aide-mémoire CSS Flexbox & Grid",
		description:
			"A visual reference for every Flexbox and CSS Grid property with working examples. Download as PDF and stop googling the same things twice.",
		descriptionFr:
			"Référence visuelle pour chaque propriété Flexbox et CSS Grid avec des exemples. Téléchargez en PDF et arrêtez de chercher les mêmes choses.",
		content: "",
		contentFr: "",
		type: "GUIDE",
		slug: "css-flexbox-grid-cheatsheet",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["css", "flexbox", "grid"],
		views: 2870,
		publishedAt: "2026-05-10",
		isFree: true,
		downloadUrl: "#",
		likes: 176,
		difficulty: "Beginner",
	},
	{
		id: "ar-typescript-cheatsheet",
		title: "TypeScript Quick Reference",
		titleFr: "Référence Rapide TypeScript",
		description:
			"Utility types, mapped types, template literals, decorators, and module patterns distilled into a single-page cheat sheet for busy developers.",
		descriptionFr:
			"Types utilitaires, types mappés, littéraux de gabarit, décorateurs et patterns de modules distillés en une feuille de référence d'une page.",
		content: "",
		contentFr: "",
		type: "GUIDE",
		slug: "typescript-quick-reference",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["typescript", "reference"],
		views: 1950,
		publishedAt: "2026-04-22",
		isFree: false,
		price: 5,
		buyUrl: "#",
		likes: 129,
		difficulty: "Intermediate",
	},
	{
		id: "ar-sql-cheatsheet",
		title: "SQL Mastery Cheat Sheet",
		titleFr: "Aide-mémoire Maîtrise SQL",
		description:
			"Joins, window functions, CTEs, transactions, and EXPLAIN syntax — everything you need to write confident SQL in any interview or project.",
		descriptionFr:
			"Jointures, fonctions fenêtre, CTEs, transactions et syntaxe EXPLAIN — tout ce dont vous avez besoin pour écrire du SQL en toute confiance.",
		content: "",
		contentFr: "",
		type: "GUIDE",
		slug: "sql-mastery-cheatsheet",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["sql", "database", "reference"],
		views: 1620,
		publishedAt: "2026-03-15",
		isFree: true,
		downloadUrl: "#",
		likes: 98,
		difficulty: "Intermediate",
	},
	{
		id: "ar-linux-cli-cheatsheet",
		title: "Linux CLI Power User Cheat Sheet",
		titleFr: "Aide-mémoire Utilisateur Linux CLI",
		description:
			"File permissions, process management, networking commands, cron syntax, and shell scripting tricks — an essential reference for every developer.",
		descriptionFr:
			"Permissions de fichiers, gestion des processus, commandes réseau, syntaxe cron et astuces shell — une référence essentielle pour chaque développeur.",
		content: "",
		contentFr: "",
		type: "GUIDE",
		slug: "linux-cli-cheatsheet",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["linux", "cli", "devops"],
		views: 1380,
		publishedAt: "2026-02-08",
		isFree: false,
		price: 5,
		buyUrl: "#",
		likes: 83,
		difficulty: "Advanced",
	},

	// ── BOOKS ─────────────────────────────────────────────────────────────────
	{
		id: "ar-book-fullstack-nextjs",
		title: "Full-Stack Next.js: From Zero to Production",
		titleFr: "Full-Stack Next.js : De Zéro à la Production",
		description:
			"A comprehensive 280-page guide covering authentication, database design with Prisma, API routes, deployment on Vercel, and monitoring your live app.",
		descriptionFr:
			"Un guide complet de 280 pages couvrant l'authentification, la conception de bases de données avec Prisma, les routes API, le déploiement sur Vercel et le monitoring.",
		content: "",
		contentFr: "",
		type: "BOOK",
		slug: "fullstack-nextjs-production",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["nextjs", "fullstack", "prisma", "vercel"],
		views: 2100,
		publishedAt: "2026-06-10",
		isFree: false,
		price: 29,
		buyUrl: "#",
		likes: 158,
		difficulty: "Intermediate",
	},
	{
		id: "ar-book-typescript-mastery",
		title: "TypeScript Mastery: A Practical Guide",
		titleFr: "Maîtrise TypeScript : Un Guide Pratique",
		description:
			"Go beyond the basics with advanced type manipulation, domain modeling, monorepo architecture, and writing test-friendly TypeScript at scale.",
		descriptionFr:
			"Allez au-delà des bases avec la manipulation avancée des types, la modélisation de domaine, l'architecture monorepo et TypeScript testable à grande échelle.",
		content: "",
		contentFr: "",
		type: "BOOK",
		slug: "typescript-mastery-practical",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["typescript", "architecture", "testing"],
		views: 1780,
		publishedAt: "2026-04-30",
		isFree: false,
		price: 24,
		buyUrl: "#",
		likes: 112,
		difficulty: "Advanced",
	},
	{
		id: "ar-book-web-security",
		title: "Web Security for Developers",
		titleFr: "Sécurité Web pour les Développeurs",
		description:
			"OWASP Top 10, JWT pitfalls, CSRF, XSS, SQL injection, rate limiting, and HTTPS configuration — understand and defend against every common web attack.",
		descriptionFr:
			"OWASP Top 10, pièges JWT, CSRF, XSS, injection SQL, limitation de taux et configuration HTTPS — comprenez et défendez-vous contre chaque attaque courante.",
		content: "",
		contentFr: "",
		type: "BOOK",
		slug: "web-security-developers",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["security", "owasp", "backend"],
		views: 980,
		publishedAt: "2026-03-20",
		isFree: false,
		price: 19,
		buyUrl: "#",
		likes: 74,
		difficulty: "Intermediate",
	},
	{
		id: "ar-book-cs-fundamentals-free",
		title: "Computer Science Fundamentals",
		titleFr: "Fondamentaux de l'Informatique",
		description:
			"A free introductory e-book covering algorithms, data structures, complexity analysis, and the core concepts every developer should know.",
		descriptionFr:
			"Un e-book d'introduction gratuit couvrant les algorithmes, les structures de données, l'analyse de complexité et les concepts fondamentaux.",
		content: "",
		contentFr: "",
		type: "BOOK",
		slug: "cs-fundamentals-free",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["cs", "algorithms", "data-structures"],
		views: 3200,
		publishedAt: "2026-01-05",
		isFree: true,
		downloadUrl: "#",
		likes: 231,
		difficulty: "Beginner",
	},
	{
		id: "ar-book-devops-handbook",
		title: "DevOps Handbook for JS Teams",
		titleFr: "Manuel DevOps pour les Équipes JS",
		description:
			"CI/CD pipelines, Docker, Kubernetes basics, observability, and incident response — a practical handbook tailored for JavaScript and Node.js teams.",
		descriptionFr:
			"Pipelines CI/CD, Docker, bases de Kubernetes, observabilité et gestion des incidents — un manuel pratique pour les équipes JavaScript.",
		content: "",
		contentFr: "",
		type: "BOOK",
		slug: "devops-handbook-js-teams",
		coverImageUrl: "/images/mac_tech_logo.png",
		tags: ["devops", "docker", "cicd"],
		views: 1450,
		publishedAt: "2026-05-05",
		isFree: false,
		price: 22,
		buyUrl: "#",
		likes: 96,
		difficulty: "Advanced",
	},
];

export type AcademyResourceExtended = AcademyResource & {
	isFree: boolean;
	likes: number;
	difficulty: "Beginner" | "Intermediate" | "Advanced";
	downloadUrl?: string;
	price?: number;
	buyUrl?: string;
};

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

export const targetSectors: TargetSector[] = [
	{
		id: "sec-hospitality",
		slug: "hospitality",
		title: "Hospitality & Hotel",
		titleFr: "Hôtellerie & Hébergement",
		description: "Operations dashboards, room and booking management systems, and guest experience portals for modern hotels.",
		descriptionFr: "Tableaux de bord opérationnels, systèmes de gestion des chambres et réservations, et portails d'expérience client pour les hôtels modernes.",
		iconSlug: "Hotel",
		challenges: [
			"Disorganized booking requests and manual room management",
			"Loss of critical guest profiles and booking history",
			"Difficulty tracking payments, invoices, and deposits",
			"Low online visibility and high commission on third-party channels"
		],
		challengesFr: [
			"Réservations mal organisées et gestion manuelle des chambres",
			"Perte de profils clients critiques et d'historique de réservation",
			"Difficulté à suivre les paiements, factures et dépôts",
			"Faible visibilité en ligne et commissions élevées sur les canaux tiers"
		],
		solutions: [
			"Bespoke professional website with integrated booking inquiry forms",
			"Centralized room management and availability tracking system",
			"Automated invoicing, payment tracking, and secure deposit processing",
			"Cloud backups, IT support, and secure local client databases"
		],
		solutionsFr: [
			"Site web professionnel sur mesure avec formulaires de réservation intégrés",
			"Système centralisé de gestion des chambres et de suivi des disponibilités",
			"Facturation automatisée, suivi des paiements et traitement sécurisé des dépôts",
			"Sauvegardes cloud, support informatique et base de données clients sécurisée"
		],
		benefits: [
			"Increase in direct bookings and customer retention",
			"Reduction in double-bookings and scheduling errors",
			"Improved guest experience and faster check-in/out workflows",
			"Consolidated business dashboard for occupancy and revenue analytics"
		],
		benefitsFr: [
			"Augmentation des réservations directes et fidélisation client",
			"Réduction des doubles réservations et des erreurs de planification",
			"Amélioration de l'expérience client et accélération des arrivées/départs",
			"Tableau de bord consolidé pour l'analyse de l'occupation et des revenus"
		],
		displayOrder: 1
	},
	{
		id: "sec-cabinets",
		slug: "professional-services",
		title: "Professional Services & Consulting",
		titleFr: "Cabinets de Conseil & Services",
		description: "Custom workflow automation, secure client portals, and document management for accounting, legal, and consulting firms.",
		descriptionFr: "Automatisation de workflows, portails clients sécurisés et gestion documentaire pour cabinets juridiques, comptables et conseil.",
		iconSlug: "Briefcase",
		challenges: [
			"Scattered business documents and manual file tracking",
			"Exposure of sensitive client files and compliance risks",
			"Time lost on repetitive admin and client communication",
			"Lack of structured collaboration between internal team members"
		],
		challengesFr: [
			"Documents professionnels dispersés et suivi manuel des dossiers",
			"Exposition de dossiers clients sensibles et risques de conformité",
			"Temps perdu dans les tâches administratives et communications clients répétitives",
			"Manque de collaboration structurée entre les membres de l'équipe"
		],
		solutions: [
			"Secure client portals for file exchange and project updates",
			"Centralized document management systems with access control",
			"Process automation workflows for billing, reminders, and intake",
			"Tailored business software solutions integrated with cloud backups"
		],
		solutionsFr: [
			"Portails clients sécurisés pour l'échange de fichiers et les mises à jour",
			"Systèmes de gestion documentaire centralisés avec contrôle d'accès",
			"Workflows d'automatisation des processus pour factures, rappels et accueil",
			"Solutions logicielles métier personnalisées intégrées aux sauvegardes cloud"
		],
		benefits: [
			"Enhanced operational productivity and lower overhead costs",
			"Secure client data compliance with advanced access controls",
			"Unified internal database eliminating double-entry and manual tracking",
			"More professional brand image with client-facing portals"
		],
		benefitsFr: [
			"Productivité opérationnelle accrue et réduction des coûts",
			"Conformité des données clients avec contrôles d'accès avancés",
			"Base de données interne unifiée éliminant la double saisie et le suivi manuel",
			"Image de marque plus professionnelle grâce aux portails clients"
		],
		displayOrder: 2
	},
	{
		id: "sec-healthcare",
		slug: "healthcare-hospitals",
		title: "Healthcare & Hospitals",
		titleFr: "Santé & Hôpitaux",
		description: "Electronic health records, patient scheduling, and secure data interfaces designed for clinics and clinical administration.",
		descriptionFr: "Dossiers de santé électroniques, planification de rendez-vous et interfaces de données sécurisées pour cliniques et administration clinique.",
		iconSlug: "Activity",
		challenges: [
			"Dependence on paper patient charts causing slow access and errors",
			"Disorganized appointment calendars leading to double-bookings",
			"Scattered patient health records across different departments",
			"Limited patient tracking, long wait times, and communication gaps"
		],
		challengesFr: [
			"Dépendance aux dossiers patients papier entraînant lenteur et erreurs",
			"Calendriers de rendez-vous désorganisés provoquant des doubles réservations",
			"Dossiers de santé éparpillés entre différents services hospitaliers",
			"Suivi limité des patients, longs temps d'attente et manque de communication"
		],
		solutions: [
			"Electronic Health Records (EHR) with instant access and high security",
			"Automated appointment scheduling system with SMS/Email reminders",
			"Centralized operations platform connecting clinics, labs, and pharmacies",
			"Interactive dashboards for clinical administration and performance tracking"
		],
		solutionsFr: [
			"Dossiers médicaux électroniques (DME) avec accès instantané et haute sécurité",
			"Système de planification automatique des rendez-vous avec rappels SMS/E-mail",
			"Plateforme d'opérations centralisée reliant cliniques, labos et pharmacies",
			"Tableaux de bord interactifs pour l'administration clinique et le suivi"
		],
		benefits: [
			"Significant improvement in patient care quality and response times",
			"Optimized time allocation for medical staff and admin personnel",
			"Reduced operational costs via paperless and automated workflows",
			"Ensured compliance with medical data security regulations"
		],
		benefitsFr: [
			"Amélioration significative de la qualité des soins et des temps de réponse",
			"Optimisation du temps pour le personnel médical et administratif",
			"Réduction des coûts opérationnels grâce aux flux dématérialisés",
			"Conformité assurée avec les réglementations de sécurité des données médicales"
		],
		displayOrder: 3
	},
	{
		id: "sec-ngo",
		slug: "ngos-associations",
		title: "NGOs & Associations",
		titleFr: "ONG & Associations",
		description: "Member management portals, digital project tracking, and donor outreach platforms for non-profits and foundations.",
		descriptionFr: "Portails de gestion des membres, suivi de projets numériques et plateformes de donateurs pour les associations et fondations.",
		iconSlug: "Users",
		challenges: [
			"Inefficient member communication and manual contact tracking",
			"Scattered data across spreadsheets making reporting complex",
			"Low online visibility making it hard to attract donors and sponsors",
			"Difficulty tracking project progress, budgets, and field operations"
		],
		challengesFr: [
			"Communication inefficace avec les membres et suivi manuel des contacts",
			"Données éparpillées sur tableurs rendant les rapports complexes",
			"Faible visibilité en ligne rendant difficile l'attraction de donateurs",
			"Difficulté à suivre l'avancement des projets, budgets et opérations terrain"
		],
		solutions: [
			"Integrated member portals with directories and email automation",
			"Centralized database for donor records, grants, and campaign metrics",
			"Interactive website showcasing impact reports and donation channels",
			"Collaborative project management tools for field coordinators"
		],
		solutionsFr: [
			"Portails membres intégrés avec annuaires et automatisation d'e-mails",
			"Base de données centralisée pour les donateurs, subventions et campagnes",
			"Site web interactif présentant les rapports d'impact et canaux de dons",
			"Outils collaboratifs de gestion de projet pour coordinateurs de terrain"
		],
		benefits: [
			"Enhanced community engagement and volunteer coordination",
			"Streamlined donor reporting and transparent budget tracking",
			"Time saved by replacing manual sheets with central cloud tools",
			"Strengthened professional reputation with corporate sponsors and international donors"
		],
		benefitsFr: [
			"Engagement communautaire et coordination des bénévoles renforcés",
			"Rapports aux donateurs simplifiés et suivi budgétaire transparent",
			"Gain de temps en remplaçant les feuilles de calcul manuelles",
			"Réputation professionnelle renforcée auprès des sponsors et donateurs"
		],
		displayOrder: 4
	},
	{
		id: "sec-smes",
		slug: "smes-local-businesses",
		title: "SMEs & Local Businesses",
		titleFr: "PMEs & Commerces Locaux",
		description: "Inventory management, local POS integrations, custom CRM portals, and bookkeeping automations.",
		descriptionFr: "Gestion des stocks, intégrations de caisses locales, portails CRM personnalisés et automatisation de la comptabilité.",
		iconSlug: "Store",
		challenges: [
			"Manual receipt tracking and billing errors",
			"Difficulties maintaining customer relationships",
			"Inefficient inventory and supply chain tracking"
		],
		challengesFr: [
			"Suivi manuel des reçus et erreurs de facturation",
			"Difficultés à maintenir les relations clients",
			"Suivi inefficace des stocks et de la chaîne d'approvisionnement"
		],
		solutions: [
			"Custom client management portals",
			"Integrated online payment processing and automated invoicing",
			"Automated stock tracking systems"
		],
		solutionsFr: [
			"Portails personnalisés de gestion de clients",
			"Traitement intégré des paiements en ligne et facturation automatique",
			"Systèmes automatisés de suivi des stocks"
		],
		benefits: [
			"Reduced checkout and invoice processing time",
			"Accurate supply chain forecasting",
			"Stronger retention via structured client records"
		],
		benefitsFr: [
			"Réduction du temps de traitement des factures",
			"Prévisions précises de la chaîne d'approvisionnement",
			"Meilleure fidélisation grâce aux dossiers clients"
		],
		displayOrder: 5
	},
	{
		id: "sec-edutech",
		slug: "edutech-learning-hubs",
		title: "EduTech & Learning Hubs",
		titleFr: "EduTech & Hubs d'Apprentissage",
		description: "LMS integrations, training portals, course completion tracking, and downloadable resource libraries.",
		descriptionFr: "Intégrations LMS, portails de formation, suivi d'achèvement des cours et bibliothèques de ressources téléchargeables.",
		iconSlug: "GraduationCap",
		challenges: [
			"Difficulty tracking student progress and grading manually",
			"Fragmented learning materials and PDF distribution",
			"Low student engagement on static web pages"
		],
		challengesFr: [
			"Difficulté à suivre les progrès des élèves et notation manuelle",
			"Matériel d'apprentissage fragmenté et distribution de PDF",
			"Faible engagement des élèves sur des pages web statiques"
		],
		solutions: [
			"Interactive learner dashboards with completion tracking",
			"Unified course repository and resource library hubs",
			"Automated feedback systems and certificate generation"
		],
		solutionsFr: [
			"Tableaux de bord apprenant interactifs avec suivi d'achèvement",
			"Dépôt de cours unifié et bibliothèque de ressources",
			"Systèmes de retour d'information automatisés et génération de certificats"
		],
		benefits: [
			"Increased course completion rates",
			"Streamlined teacher administrative workload",
			"Scalable digital delivery of academic content"
		],
		benefitsFr: [
			"Augmentation des taux d'achèvement des cours",
			"Allègement de la charge administrative des enseignants",
			"Diffusion numérique évolutive du contenu académique"
		],
		displayOrder: 6
	},
	{
		id: "sec-it",
		slug: "it-tech-services",
		title: "IT & Tech Services",
		titleFr: "Services Informatiques & Tech",
		description: "API integrations, dashboard metrics, system monitoring utilities, and cloud pipeline automations.",
		descriptionFr: "Intégrations d'API, indicateurs de tableaux de bord, utilitaires de surveillance de systèmes et automatisations cloud.",
		iconSlug: "Laptop",
		challenges: [
			"High software licensing fees and complex workflows",
			"Security threats and lack of automated backups",
			"Siloed developer pipelines and system downtime"
		],
		challengesFr: [
			"Frais de licence élevés et flux complexes",
			"Menaces de sécurité et manque de sauvegardes automatisées",
			"Pipelines de développement cloisonnés et temps d'arrêt"
		],
		solutions: [
			"Custom dashboard monitors with real-time metrics",
			"Hardened server configurations and automated backups",
			"Custom scripting and API middleware integrations"
		],
		solutionsFr: [
			"Moniteurs de tableaux de bord avec indicateurs en temps réel",
			"Configurations de serveur sécurisées et sauvegardes automatiques",
			"Scripts personnalisés et intégrations de middleware API"
		],
		benefits: [
			"99.9% system uptime and operational security",
			"Reduced operational software overhead costs",
			"Streamlined and automated deployment cycles"
		],
		benefitsFr: [
			"Disponibilité du système à 99,9% et sécurité opérationnelle",
			"Réduction des coûts de logiciels opérationnels",
			"Cycles de déploiement simplifiés et automatisés"
		],
		displayOrder: 7
	}
];

