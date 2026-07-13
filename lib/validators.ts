import { z } from "zod";

const queryValue = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (value) => {
      if (value === null || value === "") {
        return undefined;
      }
      return value;
    },
    schema
  );

const isAbsoluteHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const urlOrRootPath = z
  .string()
  .min(1)
  .refine(
    (value) => value.startsWith("/") || isAbsoluteHttpUrl(value),
    "Expected an absolute http(s) URL or a root-relative path"
  );

const optionalUrlOrRootPath = z.preprocess(
  (value) => {
    if (value === null || value === "") {
      return undefined;
    }
    return value;
  },
  z
    .string()
    .refine(
      (value) => value.startsWith("/") || isAbsoluteHttpUrl(value),
      "Expected an absolute http(s) URL or a root-relative path"
    )
    .optional()
);

const optionalDate = z.preprocess(
  (value) => {
    if (value === null || value === "") {
      return undefined;
    }
    return value;
  },
  z.coerce.date().optional()
);

/**
 * Generic API Response wrapper
 */
export const ApiResponseSchema = z.object({
  ok: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & {
  data?: T;
};

/**
 * Messages / Contact Forms
 */
export const MessageCreateSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(1, "Subject is required.").max(200),
  message: z.string().min(1, "Message is required.").max(5000),
  source: z.string().optional().default("web"),
});

export type MessageCreate = z.infer<typeof MessageCreateSchema>;

export const MessageUpdateSchema = MessageCreateSchema.partial().extend({
  id: z.string(),
  isRead: z.boolean().optional(),
});

export type MessageUpdate = z.infer<typeof MessageUpdateSchema>;

export const MessageQuerySchema = z.object({
  page: queryValue(z.coerce.number().int().positive().default(1)),
  limit: queryValue(z.coerce.number().int().min(1).max(100).default(10)),
  sort: queryValue(z.enum(["newest", "oldest", "unread"]).default("newest")),
  isRead: queryValue(z.enum(["all", "read", "unread"]).default("all")),
});

export type MessageQuery = z.infer<typeof MessageQuerySchema>;

/**
 * Subscribers / Newsletter
 */
export const SubscriberCreateSchema = z.object({
  email: z.string().email("Invalid email address."),
  source: z.string().default("web"),
});

export type SubscriberCreate = z.infer<typeof SubscriberCreateSchema>;

export const SubscriberUpdateSchema = SubscriberCreateSchema.partial().extend({
  id: z.string(),
  active: z.boolean().optional(),
});

export type SubscriberUpdate = z.infer<typeof SubscriberUpdateSchema>;

export const SubscriberQuerySchema = z.object({
  page: queryValue(z.coerce.number().int().positive().default(1)),
  limit: queryValue(z.coerce.number().int().min(1).max(100).default(10)),
  active: queryValue(z.enum(["all", "active", "inactive"]).default("all")),
  sort: queryValue(z.enum(["newest", "oldest"]).default("newest")),
});

export type SubscriberQuery = z.infer<typeof SubscriberQuerySchema>;

/**
 * Lab Articles / Blog
 */
export const LabArticleCreateSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  titleFr: z.string().max(200).optional().nullable(),
  slug: z.string().min(1, "Slug is required.").max(200),
  category: z.string().min(1, "Category is required."),
  categoryFr: z.string().optional().nullable(),
  excerpt: z.string().max(500),
  excerptFr: z.string().max(500).optional().nullable(),
  content: z.string(),
  contentFr: z.string().optional().nullable(),
  coverImageUrl: urlOrRootPath,
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  publishedAt: optionalDate,
  likes: z.number().int().nonnegative().default(0),
});

export type LabArticleCreate = z.infer<typeof LabArticleCreateSchema>;

export const LabArticleUpdateSchema = LabArticleCreateSchema.partial().extend({
  id: z.string(),
});

export type LabArticleUpdate = z.infer<typeof LabArticleUpdateSchema>;

export const LabArticleQuerySchema = z.object({
  page: queryValue(z.coerce.number().int().positive().default(1)),
  limit: queryValue(z.coerce.number().int().min(1).max(100).default(10)),
  category: queryValue(z.string().optional()),
  featured: queryValue(z.enum(["all", "featured", "unfeatured"]).default("all")),
  sort: queryValue(z.enum(["newest", "oldest", "views"]).default("newest")),
  published: queryValue(z.enum(["all", "published", "draft"]).default("published")),
});

export type LabArticleQuery = z.infer<typeof LabArticleQuerySchema>;

/**
 * Lab Projects
 */
export const LabProjectCreateSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  titleFr: z.string().max(200).optional().nullable(),
  slug: z.string().min(1, "Slug is required.").max(200),
  summary: z.string().max(500),
  summaryFr: z.string().max(500).optional().nullable(),
  content: z.string(),
  contentFr: z.string().optional().nullable(),
  stack: z.array(z.string()).default([]),
  coverImageUrl: urlOrRootPath,
  screenshotUrls: z.array(urlOrRootPath).default([]),
  demoUrl: optionalUrlOrRootPath,
  repoUrl: optionalUrlOrRootPath,
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  publishedAt: optionalDate,
  likes: z.number().int().nonnegative().default(0),
  problem: z.string().optional().nullable(),
  problemFr: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  solutionFr: z.string().optional().nullable(),
});

export type LabProjectCreate = z.infer<typeof LabProjectCreateSchema>;

export const LabProjectUpdateSchema = LabProjectCreateSchema.partial().extend({
  id: z.string(),
});

export type LabProjectUpdate = z.infer<typeof LabProjectUpdateSchema>;

export const LabProjectQuerySchema = z.object({
  page: queryValue(z.coerce.number().int().positive().default(1)),
  limit: queryValue(z.coerce.number().int().min(1).max(100).default(10)),
  featured: queryValue(z.enum(["all", "featured", "unfeatured"]).default("all")),
  sort: queryValue(z.enum(["newest", "oldest", "views"]).default("newest")),
  published: queryValue(z.enum(["all", "published", "draft"]).default("published")),
  tag: queryValue(z.string().optional()),
});

export type LabProjectQuery = z.infer<typeof LabProjectQuerySchema>;

/**
 * Client Work / Projects
 */
export const ClientWorkCreateSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  titleFr: z.string().max(200).optional().nullable(),
  slug: z.string().min(1, "Slug is required.").max(200),
  description: z.string().max(1000),
  descriptionFr: z.string().max(1000).optional().nullable(),
  imageUrl: urlOrRootPath,
  projectUrl: optionalUrlOrRootPath,
  clientName: z.string().optional().nullable(),
  clientNameFr: z.string().optional().nullable(),
  stack: z.array(z.string()).default([]),
  content: z.string().optional(),
  contentFr: z.string().optional().nullable(),
  publishedAt: optionalDate,
});

export type ClientWorkCreate = z.infer<typeof ClientWorkCreateSchema>;

export const ClientWorkUpdateSchema = ClientWorkCreateSchema.partial().extend({
  id: z.string(),
});

export type ClientWorkUpdate = z.infer<typeof ClientWorkUpdateSchema>;

export const ClientWorkQuerySchema = z.object({
  page: queryValue(z.coerce.number().int().positive().default(1)),
  limit: queryValue(z.coerce.number().int().min(1).max(100).default(10)),
  sort: queryValue(z.enum(["newest", "oldest"]).default("newest")),
  published: queryValue(z.enum(["all", "published", "draft"]).default("published")),
});

export type ClientWorkQuery = z.infer<typeof ClientWorkQuerySchema>;

/**
 * Academy Resources
 */
export const AcademyResourceCreateSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  titleFr: z.string().optional().nullable(),
  slug: z.string().min(1, "Slug is required.").max(200),
  description: z.string().max(2000),
  descriptionFr: z.string().optional().nullable(),
  content: z.string().default(""),
  contentFr: z.string().optional().nullable(),
  type: z.enum(["ARTICLE", "GUIDE", "BOOK", "COURSE"]).default("ARTICLE"),
  coverImageUrl: urlOrRootPath,
  tags: z.array(z.string()).default([]),
  publishedAt: optionalDate,
});

export type AcademyResourceCreate = z.infer<typeof AcademyResourceCreateSchema>;

export const AcademyResourceUpdateSchema = AcademyResourceCreateSchema.partial().extend({
  id: z.string(),
});

export type AcademyResourceUpdate = z.infer<typeof AcademyResourceUpdateSchema>;

export const AcademyResourceQuerySchema = z.object({
  page: queryValue(z.coerce.number().int().positive().default(1)),
  limit: queryValue(z.coerce.number().int().min(1).max(100).default(10)),
  type: queryValue(z.enum(["all", "ARTICLE", "GUIDE", "BOOK", "COURSE"]).default("all")),
  sort: queryValue(z.enum(["newest", "oldest", "views"]).default("newest")),
  published: queryValue(z.enum(["all", "published", "draft"]).default("all")),
});

export type AcademyResourceQuery = z.infer<typeof AcademyResourceQuerySchema>;

/**
 * Settings / Profile
 */
export const SettingsUpdateSchema = z.object({
  displayName: z.string().optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().min(8).optional(),
  newPassword: z.string().min(8).optional(),
});

export type SettingsUpdate = z.infer<typeof SettingsUpdateSchema>;

/**
 * Services / Offerings
 */
export const ServiceCreateSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  titleFr: z.string().max(200).optional().nullable(),
  description: z.string().max(1000),
  descriptionFr: z.string().max(1000).optional().nullable(),
  features: z.array(z.string()).default([]),
  featuresFr: z.array(z.string()).default([]),
  ctaText: z.string().max(100),
  ctaTextFr: z.string().max(100).optional().nullable(),
  ctaUrl: optionalUrlOrRootPath,
});

export type ServiceCreate = z.infer<typeof ServiceCreateSchema>;

export const ServiceUpdateSchema = ServiceCreateSchema.partial().extend({
  id: z.string(),
});

export type ServiceUpdate = z.infer<typeof ServiceUpdateSchema>;

export const ServiceQuerySchema = z.object({
  page: queryValue(z.coerce.number().int().positive().default(1)),
  limit: queryValue(z.coerce.number().int().min(1).max(100).default(10)),
});

export type ServiceQuery = z.infer<typeof ServiceQuerySchema>;

export const TargetSectorCreateSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  titleFr: z.string().max(200).optional().nullable(),
  description: z.string().min(1, "Description is required.").max(1000),
  descriptionFr: z.string().max(1000).optional().nullable(),
  iconSlug: z.string().min(1, "Icon is required.").max(100),
  challenges: z.array(z.string()).default([]),
  challengesFr: z.array(z.string()).default([]),
  solutions: z.array(z.string()).default([]),
  solutionsFr: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  benefitsFr: z.array(z.string()).default([]),
  displayOrder: z.coerce.number().int().default(0),
});

export type TargetSectorCreate = z.infer<typeof TargetSectorCreateSchema>;

export const TargetSectorUpdateSchema = TargetSectorCreateSchema.partial().extend({
  id: z.string(),
});

export type TargetSectorUpdate = z.infer<typeof TargetSectorUpdateSchema>;

export const TargetSectorQuerySchema = z.object({
  page: queryValue(z.coerce.number().int().positive().default(1)),
  limit: queryValue(z.coerce.number().int().min(1).max(100).default(10)),
});

export type TargetSectorQuery = z.infer<typeof TargetSectorQuerySchema>;


export const WorkflowStageCreateSchema = z.object({
  step: z.coerce.number().int().positive(),
  title: z.string().min(1, "Title is required.").max(200),
  titleFr: z.string().max(200).optional().nullable(),
  subtitle: z.string().min(1, "Subtitle is required.").max(200),
  subtitleFr: z.string().max(200).optional().nullable(),
  details: z.string().min(1, "Details are required.").max(2000),
  detailsFr: z.string().max(2000).optional().nullable(),
});

export type WorkflowStageCreate = z.infer<typeof WorkflowStageCreateSchema>;

export const WorkflowStageUpdateSchema = WorkflowStageCreateSchema.partial().extend({
  id: z.string(),
});

export type WorkflowStageUpdate = z.infer<typeof WorkflowStageUpdateSchema>;

export const WorkflowStageQuerySchema = z.object({
  page: queryValue(z.coerce.number().int().positive().default(1)),
  limit: queryValue(z.coerce.number().int().min(1).max(100).default(10)),
});

export type WorkflowStageQuery = z.infer<typeof WorkflowStageQuerySchema>;

/**
 * Profile / Brand Settings
 */
export const BrandProfileUpdateSchema = z.object({
  currentName: z.string().optional(),
  currentDomain: z.string().optional(),
  roleTagline: z.string().optional(),
  roleTaglineFr: z.string().optional().nullable(),
  headline: z.string().optional(),
  headlineFr: z.string().optional().nullable(),
  subTagline: z.string().optional(),
  subTaglineFr: z.string().optional().nullable(),
  freelanceAvailabilityLabel: z.string().optional(),
  freelanceAvailabilityLabelFr: z.string().optional().nullable(),
  jobAvailabilityLabel: z.string().optional(),
  jobAvailabilityLabelFr: z.string().optional().nullable(),
});

export type BrandProfileUpdate = z.infer<typeof BrandProfileUpdateSchema>;

export const AboutSummaryUpdateSchema = z.object({
  biography: z.string().optional(),
  biographyFr: z.string().optional().nullable(),
  cvDownloadUrl: optionalUrlOrRootPath,
  linkedinResumeSource: z.string().optional(),
  interests: z.array(z.string()).optional(),
  interestsFr: z.array(z.string()).optional(),
});

export type AboutSummaryUpdate = z.infer<typeof AboutSummaryUpdateSchema>;

export const ContactDetailsUpdateSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  locationFr: z.string().optional().nullable(),
});

export type ContactDetailsUpdate = z.infer<typeof ContactDetailsUpdateSchema>;

/**
 * Overview / Dashboard Stats
 */
export const OverviewStatsSchema = z.object({
  totalMessages: z.number(),
  unreadMessages: z.number(),
  totalSubscribers: z.number(),
  activeSubscribers: z.number(),
  totalArticles: z.number(),
  publishedArticles: z.number(),
  totalProjects: z.number(),
  publishedProjects: z.number(),
  totalCampaignsSent: z.number(),
});

export type OverviewStats = z.infer<typeof OverviewStatsSchema>;

/**
 * Auth / Authentication
 */
export const AuthSignInSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional().default(false),
});

export type AuthSignIn = z.infer<typeof AuthSignInSchema>;

export const AuthRefreshSchema = z.object({
  refreshToken: z.string(),
});

export type AuthRefresh = z.infer<typeof AuthRefreshSchema>;

export const AuthTokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresIn: z.number(),
  tokenType: z.string().default("Bearer"),
});

export type AuthToken = z.infer<typeof AuthTokenSchema>;

export const AuthUserResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  displayName: z.string().nullable(),
  role: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
});

export type AuthUserResponse = z.infer<typeof AuthUserResponseSchema>;

/**
 * Team Members / Collaborators
 */
export const TeamMemberCreateSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100),
  role: z.string().min(1, "Role is required.").max(100),
  roleFr: z.string().optional().nullable(),
  speciality: z.string().min(1, "Speciality is required.").max(100),
  specialityFr: z.string().optional().nullable(),
  imageUrl: z.string().min(1, "Image URL is required."),
  linkedIn: z.string().optional().nullable(),
  whatsApp: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(1),
});

export type TeamMemberCreate = z.infer<typeof TeamMemberCreateSchema>;

export const TeamMemberUpdateSchema = TeamMemberCreateSchema.partial().extend({
  id: z.string(),
});

export type TeamMemberUpdate = z.infer<typeof TeamMemberUpdateSchema>;

