import { Mail, MessageSquare, Linkedin, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Tx } from "@/components/i18n/tx";
import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/api-utils";

export async function TeamSection() {
  let teamMembers: any[] = [];
  try {
    teamMembers = await prisma.teamMember.findMany({
      orderBy: { displayOrder: "asc" },
    });
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
        console.error("Team section query failed:", error);
    }
  }

  if (teamMembers.length === 0) return null;

  return (
    <section className="space-y-8" id="team">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          <Tx en="Our Team" fr="Notre Équipe" />
        </h2>
        <p className="mt-4 text-muted-foreground">
          <Tx
            en="Meet the experts behind MAC TECH dedicated to your success."
            fr="Découvrez les experts derrière MAC TECH dédiés à votre succès."
          />
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <div key={member.name} className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border border-border/70 bg-card/40">
            <div className="relative size-32 overflow-hidden rounded-full border-2 border-primary/20">
              <Image
                src={member.imageUrl || "/images/Profile.jpg"}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-medium">{member.name}</h3>
              <p className="text-sm font-medium text-primary">
                <Tx en={member.role} fr={member.roleFr || member.role} />
              </p>
              <p className="text-xs text-muted-foreground">
                <Tx en={member.speciality} fr={member.specialityFr || member.speciality} />
              </p>
            </div>
            <div className="flex items-center gap-4">
              {member.linkedIn && member.linkedIn !== "#" && (
                <Link href={member.linkedIn} target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="size-5" />
                </Link>
              )}
              {member.whatsApp && member.whatsApp !== "#" && (
                <Link href={member.whatsApp} target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                  <MessageSquare className="size-5" />
                </Link>
              )}
              {member.email && (
                <Link href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="size-5" />
                </Link>
              )}
              {member.website && (
                <Link href={member.website} target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                  <Globe className="size-5" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
