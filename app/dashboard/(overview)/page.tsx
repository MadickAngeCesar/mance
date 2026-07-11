import type { Metadata } from "next";
import { BookOpen, Briefcase, GraduationCap, Inbox, Rocket, Users } from "lucide-react";

import { Tx } from "@/components/i18n/tx";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Overview | Dashboard",
};

export default async function DashboardOverviewPage() {
  const [
    totalArticles,
    totalProjects,
    totalClientWorks,
    totalAcademyResources,
    totalMessages,
    unreadMessages,
    totalSubscribers,
    topProjects,
    recentMessages,
    recentSubscribers,
  ] = await Promise.all([
    prisma.labArticle.count(),
    prisma.labProject.count(),
    prisma.clientWork.count(),
    prisma.academyResource.count(),
    prisma.message.count(),
    prisma.message.count({ where: { isRead: false } }),
    prisma.subscriber.count({ where: { active: true } }),
    prisma.labProject.findMany({
      select: { id: true, title: true, slug: true, views: true, publishedAt: true },
      orderBy: { views: "desc" },
      take: 5,
    }),
    prisma.message.findMany({
      select: { id: true, subject: true, name: true, email: true, isRead: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.subscriber.findMany({
      select: { id: true, email: true, createdAt: true, active: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const metrics = [
    {
      title: "Lab Projects",
      titleFr: "Projets Lab",
      value: totalProjects,
      icon: Rocket,
      trend: `${totalArticles} articles`,
      color: "text-primary",
      bg: "bg-primary/5",
    },
    {
      title: "Client Works",
      titleFr: "Projets Clients",
      value: totalClientWorks,
      icon: Briefcase,
      trend: "Delivered projects",
      color: "text-violet-400",
      bg: "bg-violet-500/5",
    },
    {
      title: "Academy",
      titleFr: "Académie",
      value: totalAcademyResources,
      icon: GraduationCap,
      trend: "Articles, guides & books",
      color: "text-cyan-400",
      bg: "bg-cyan-500/5",
    },
    {
      title: "Inbox",
      titleFr: "Messages",
      value: totalMessages,
      icon: Inbox,
      trend: `${unreadMessages} unread`,
      color: "text-amber-400",
      bg: "bg-amber-500/5",
    },
    {
      title: "Subscribers",
      titleFr: "Abonnés",
      value: totalSubscribers,
      icon: Users,
      trend: "Active newsletter audience",
      color: "text-emerald-400",
      bg: "bg-emerald-500/5",
    },
    {
      title: "Blogs",
      titleFr: "Articles",
      value: totalArticles,
      icon: BookOpen,
      trend: "Published + draft articles",
      color: "text-rose-400",
      bg: "bg-rose-500/5",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          <Tx en="Dashboard Overview" fr="Apercu du tableau de bord" />
        </h1>
        <p className="text-sm text-muted-foreground">
          <Tx
            en="Quick snapshot of content, leads, and audience growth."
            fr="Vue rapide du contenu, des prospects et de la croissance d'audience."
          />
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between gap-3 border-b border-border/70 pb-3">
                <div>
                  <CardDescription>
                    <Tx en={metric.title} fr={metric.titleFr} />
                  </CardDescription>
                  <CardTitle className="mt-1 text-3xl font-bold">{metric.value}</CardTitle>
                </div>
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 ${metric.bg}`}>
                  <Icon className={`size-4.5 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-3 text-xs text-muted-foreground">{metric.trend}</CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {/* Top Projects by views */}
        <Card className="xl:col-span-2">
          <CardHeader className="border-b border-border/70 pb-3">
            <CardTitle className="text-base">
              <Tx en="Top Lab Projects" fr="Projets Lab les plus consultés" />
            </CardTitle>
            <CardDescription>
              <Tx en="Most viewed portfolio entries." fr="Éléments du portfolio les plus consultés." />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-4">
            {topProjects.map((project, index) => (
              <div key={project.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-card/50 px-3 py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{project.title}</p>
                    <p className="truncate text-xs text-muted-foreground">/{project.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs">{project.views.toLocaleString()} views</Badge>
                  {project.publishedAt
                    ? <Badge className="text-xs">Published</Badge>
                    : <Badge variant="outline" className="text-xs">Draft</Badge>}
                </div>
              </div>
            ))}
            {topProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No published projects yet.</p>
            ) : null}
          </CardContent>
        </Card>

        {/* Recent Subscribers */}
        <Card>
          <CardHeader className="border-b border-border/70 pb-3">
            <CardTitle className="text-base">
              <Tx en="Recent Subscribers" fr="Nouveaux abonnés" />
            </CardTitle>
            <CardDescription>
              <Tx en="Latest newsletter sign-ups." fr="Dernières inscriptions à la newsletter." />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-4">
            {recentSubscribers.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-card/50 px-3 py-2">
                <p className="truncate text-xs font-medium">{sub.email}</p>
                <Badge variant={sub.active ? "default" : "outline"} className="text-[10px] shrink-0">
                  {sub.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
            {recentSubscribers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No subscribers yet.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Inbox Snapshot */}
      <Card>
        <CardHeader className="border-b border-border/70 pb-3">
          <CardTitle className="text-base">
            <Tx en="Inbox Snapshot" fr="Apercu de la boîte de réception" />
          </CardTitle>
          <CardDescription>
            <Tx en="Most recent lead messages to triage." fr="Messages prospects récents à traiter." />
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 pt-4 sm:grid-cols-2">
          {recentMessages.map((message) => (
            <div key={message.id} className="rounded-lg border border-border/70 bg-card/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium">{message.subject}</p>
                <Badge variant={message.isRead ? "outline" : "default"} className="shrink-0 text-[10px]">
                  {message.isRead ? "Read" : "New"}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{message.name} · {message.email}</p>
            </div>
          ))}
          {recentMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No inbox messages yet.</p>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
