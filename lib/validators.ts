import { z } from "zod";

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
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(["newest", "oldest", "unread"]).default("newest"),
  isRead: z.enum(["all", "read", "unread"]).default("all"),
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
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  active: z.enum(["all", "active", "inactive"]).default("all"),
  sort: z.enum(["newest", "oldest"]).default("newest"),
});

export type SubscriberQuery = z.infer<typeof SubscriberQuerySchema>;

/**
 * Lab Articles / Blog
 */
export const LabArticleCreateSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  slug: z.string().min(1, "Slug is required.").max(200),
  category: z.string().min(1, "Category is required."),
  excerpt: z.string().max(500),
  content: z.string(),
  coverImageUrl: z.string().url(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  publishedAt: z.date().optional(),
});

export type LabArticleCreate = z.infer<typeof LabArticleCreateSchema>;

export const LabArticleUpdateSchema = LabArticleCreateSchema.partial().extend({
  id: z.string(),
});

export type LabArticleUpdate = z.infer<typeof LabArticleUpdateSchema>;

export const LabArticleQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  category: z.string().optional(),
  featured: z.enum(["all", "featured", "unfeatured"]).default("all"),
  sort: z.enum(["newest", "oldest", "views"]).default("newest"),
  published: z.enum(["all", "published", "draft"]).default("published"),
});

export type LabArticleQuery = z.infer<typeof LabArticleQuerySchema>;

/**
 * Lab Projects
 */
export const LabProjectCreateSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  slug: z.string().min(1, "Slug is required.").max(200),
  summary: z.string().max(500),
  content: z.string(),
  stack: z.array(z.string()).default([]),
  coverImageUrl: z.string().url(),
  screenshotUrls: z.array(z.string().url()).default([]),
  demoUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  publishedAt: z.date().optional(),
});

export type LabProjectCreate = z.infer<typeof LabProjectCreateSchema>;

export const LabProjectUpdateSchema = LabProjectCreateSchema.partial().extend({
  id: z.string(),
});

export type LabProjectUpdate = z.infer<typeof LabProjectUpdateSchema>;

export const LabProjectQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  featured: z.enum(["all", "featured", "unfeatured"]).default("all"),
  sort: z.enum(["newest", "oldest", "views"]).default("newest"),
  published: z.enum(["all", "published", "draft"]).default("published"),
  tag: z.string().optional(),
});

export type LabProjectQuery = z.infer<typeof LabProjectQuerySchema>;

/**
 * Client Work / Projects
 */
export const ClientWorkCreateSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  slug: z.string().min(1, "Slug is required.").max(200),
  description: z.string().max(1000),
  imageUrl: z.string().url(),
  projectUrl: z.string().url().optional(),
  stack: z.array(z.string()).default([]),
  content: z.string().optional(),
  publishedAt: z.date().optional(),
});

export type ClientWorkCreate = z.infer<typeof ClientWorkCreateSchema>;

export const ClientWorkUpdateSchema = ClientWorkCreateSchema.partial().extend({
  id: z.string(),
});

export type ClientWorkUpdate = z.infer<typeof ClientWorkUpdateSchema>;

export const ClientWorkQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.enum(["newest", "oldest"]).default("newest"),
  published: z.enum(["all", "published", "draft"]).default("published"),
});

export type ClientWorkQuery = z.infer<typeof ClientWorkQuerySchema>;

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
  description: z.string().max(1000),
  features: z.array(z.string()).default([]),
  ctaText: z.string().max(100),
  ctaUrl: z.string().url(),
});

export type ServiceCreate = z.infer<typeof ServiceCreateSchema>;

export const ServiceUpdateSchema = ServiceCreateSchema.partial().extend({
  id: z.string(),
});

export type ServiceUpdate = z.infer<typeof ServiceUpdateSchema>;

export const ServiceQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type ServiceQuery = z.infer<typeof ServiceQuerySchema>;

/**
 * Profile / Brand Settings
 */
export const BrandProfileUpdateSchema = z.object({
  currentName: z.string().optional(),
  roleTagline: z.string().optional(),
  headline: z.string().optional(),
  subTagline: z.string().optional(),
  freelanceAvailabilityLabel: z.string().optional(),
  jobAvailabilityLabel: z.string().optional(),
});

export type BrandProfileUpdate = z.infer<typeof BrandProfileUpdateSchema>;

export const AboutSummaryUpdateSchema = z.object({
  biography: z.string().optional(),
  cvDownloadUrl: z.string().url().optional(),
  linkedinResumeSource: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export type AboutSummaryUpdate = z.infer<typeof AboutSummaryUpdateSchema>;

export const ContactDetailsUpdateSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
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
