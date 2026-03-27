import type { Metadata } from "next";
import { Inbox, Newspaper, Rocket, Users } from "lucide-react";

import { Tx } from "@/components/i18n/tx";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  labArticles,
  labProjects,
  messagePreviews,
  subscriberPreviews,
} from "@/lib/placeholder-data";

export const metadata: Metadata = {
  title: "Overview | Dashboard",
};

const metrics = [
  {
    title: "Published Articles",
    value: labArticles.length,
    icon: Newspaper,
    trend: "+12% this quarter",
  },
  {
    title: "Portfolio Projects",
    value: labProjects.length,
    icon: Rocket,
    trend: "+2 launched recently",
  },
  {
    title: "Inbox Messages",
    value: messagePreviews.length,
    icon: Inbox,
    trend: `${messagePreviews.filter((item) => !item.isRead).length} unread`,
  },
  {
    title: "Subscribers",
    value: subscriberPreviews.length,
    icon: Users,
    trend: "Steady growth",
  },
];

export default function DashboardOverviewPage() {
  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight"><Tx en="Dashboard Overview" fr="Apercu du tableau de bord" /></h1>
        <p className="text-sm text-muted-foreground">
          <Tx en="Quick snapshot of content, leads, and audience growth." fr="Vue rapide du contenu, des prospects et de la croissance d'audience." />
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 border-b border-border/70 pb-3">
                <div>
                  <CardDescription>{metric.title}</CardDescription>
                  <CardTitle className="mt-1 text-2xl">{metric.value}</CardTitle>
                </div>
                <Icon className="size-4 text-primary" />
              </CardHeader>
              <CardContent className="pt-3 text-xs text-muted-foreground">{metric.trend}</CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b border-border/70 pb-3">
            <CardTitle className="text-base"><Tx en="Top Content" fr="Contenu le plus consulte" /></CardTitle>
            <CardDescription><Tx en="Most viewed portfolio entries." fr="Elements du portfolio les plus consultes." /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {[...labArticles, ...labProjects]
              .sort((a, b) => b.views - a.views)
              .slice(0, 3)
              .map((entry) => (
                <div key={entry.id} className="rounded-lg border border-border/70 bg-card/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{entry.title}</p>
                    <Badge variant="outline">{entry.views.toLocaleString()} views</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{"slug" in entry ? `/${entry.slug}` : "Published content"}</p>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border/70 pb-3">
            <CardTitle className="text-base"><Tx en="Inbox Snapshot" fr="Apercu de la boite de reception" /></CardTitle>
            <CardDescription><Tx en="Most recent lead messages to triage." fr="Messages prospects recents a traiter." /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {messagePreviews.slice(0, 3).map((message) => (
              <div key={message.id} className="rounded-lg border border-border/70 bg-card/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{message.subject}</p>
                  <Badge variant={message.isRead ? "outline" : "default"}>{message.isRead ? "Read" : "New"}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{message.name} · {message.email}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
