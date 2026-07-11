"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Facebook,
  Github,
  Loader2,
  Linkedin,
  MessageCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/client-api";
import { useLanguage } from "@/components/i18n/language-provider";

const subjects = [
  { EN: "Web Development", FR: "Développement Web" },
  { EN: "IT Support", FR: "Support IT" },
  { EN: "Technical Consulting", FR: "Conseil Technique" },
  { EN: "Other", FR: "Autre" },
];

const socialIcons = {
  GitHub: Github,
  LinkedIn: Linkedin,
  WhatsApp: MessageCircle,
  Facebook: Facebook,
} as const;

function UpworkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M16.016 5.016c-1.875 0-3.516.984-4.453 2.484-.656-1.125-1.125-2.25-1.359-3.375H7.641v8.625a1.758 1.758 0 0 1-1.734 1.734 1.758 1.758 0 0 1-1.734-1.734V4.125H1.5v8.625a4.398 4.398 0 0 0 4.406 4.406 4.398 4.398 0 0 0 4.406-4.406v-.141c.375.563.797 1.078 1.266 1.5l-1.078 5.063h2.625l.797-3.75c.656.234 1.359.375 2.094.375 3.656 0 6.656-3 6.656-6.656 0-3.656-3-6.656-6.656-6.656Zm0 10.641c-.469 0-.938-.094-1.359-.281l.984-4.641 2.719 2.016.984-2.016-2.766-1.969.094-.469a3.998 3.998 0 0 1 5.344 3.75 4.003 4.003 0 0 1-4 4.016Z"
      />
    </svg>
  );
}

function FreelancerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M12.03 2 8.5 5.53V2H5v7.94h3.5V8.97L12.03 12l3.5-3.03v.97H19V2h-3.47v3.53L12.03 2Zm-7.03 9.94v10h3.5v-6.47h3.03L15.5 19v2.94H19V14h-3.47l-3.5-3.03H5Z"
      />
    </svg>
  );
}

function FiverrIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M14.16 9.22h-2.2V8.1c0-.69.57-1.25 1.27-1.25h.93V4h-.93C11 4 9.05 5.9 9.05 8.2v1.02H7V12h2.05v8h2.9v-8h2.21v-2.78Zm.16-5.22a1.84 1.84 0 1 0 0 3.68 1.84 1.84 0 0 0 0-3.68Z"
      />
    </svg>
  );
}

const platformStyles: Record<string, string> = {
  Upwork: "bg-[#14A800]/10 text-[#14A800] border-[#14A800]/30",
  Freelancer: "bg-[#29B2FE]/10 text-[#29B2FE] border-[#29B2FE]/30",
  Fiverr: "bg-[#1DBF73]/10 text-[#1DBF73] border-[#1DBF73]/30",
};

const platformIcons = {
  Upwork: UpworkIcon,
  Freelancer: FreelancerIcon,
  Fiverr: FiverrIcon,
} as const;

type ContactInfo = {
  email: string;
  phone: string;
  location: string;
  locationFr: string;
  socialLinks: Array<{ platform: "GitHub" | "LinkedIn" | "WhatsApp" | "Facebook"; label: string; url: string }>;
  freelancePlatforms: Array<{ name: "Upwork" | "Freelancer" | "Fiverr"; url: string; handle?: string }>;
};

const fallbackContact: ContactInfo = {
  email: "hello@mance.dev",
  phone: "+237687635233",
  location: "Yaounde, Cameroon",
  locationFr: "Yaoundé, Cameroun",
  socialLinks: [],
  freelancePlatforms: [],
};

function normalizePlatform(value: string): ContactInfo["socialLinks"][number]["platform"] | null {
  const normalized = value.toUpperCase();
  if (normalized === "GITHUB") return "GitHub";
  if (normalized === "LINKEDIN") return "LinkedIn";
  if (normalized === "WHATSAPP") return "WhatsApp";
  if (normalized === "FACEBOOK") return "Facebook";
  return null;
}

function normalizeFreelanceName(value: string): ContactInfo["freelancePlatforms"][number]["name"] | null {
  const normalized = value.toUpperCase();
  if (normalized === "UPWORK") return "Upwork";
  if (normalized === "FREELANCER") return "Freelancer";
  if (normalized === "FIVERR") return "Fiverr";
  return null;
}

export function Contact() {
  const { language } = useLanguage();
  const [contact, setContact] = useState<ContactInfo>(fallbackContact);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await apiRequest<{ data?: { contactDetails?: { email?: string; phone?: string; location?: string; locationFr?: string; socialLinks?: { platform?: string; label?: string; url?: string }[]; freelancePlatforms?: { name?: string; handle?: string; url?: string }[] } } }>("/api/profile");
        const details = response.data?.contactDetails;

        if (!details || !isMounted) {
          return;
        }

        const socialLinks = (details.socialLinks ?? [])
          .map((entry: { platform?: string; label?: string; url?: string; name?: string; handle?: string }) => {
            const platform = normalizePlatform(String(entry.platform ?? ""));
            if (!platform) return null;
            return {
              platform,
              label: String(entry.label ?? platform),
              url: String(entry.url ?? "#"),
            };
          })
          .filter(Boolean) as ContactInfo["socialLinks"];

        const freelancePlatforms = (details.freelancePlatforms ?? [])
          .map((entry: { platform?: string; label?: string; url?: string; name?: string; handle?: string }) => {
            const name = normalizeFreelanceName(String(entry.name ?? ""));
            if (!name) return null;
            return {
              name,
              url: String(entry.url ?? "#"),
              handle: entry.handle ? String(entry.handle) : undefined,
            };
          })
          .filter(Boolean) as ContactInfo["freelancePlatforms"];

        setContact({
          email: String(details.email ?? fallbackContact.email),
          phone: String(details.phone ?? fallbackContact.phone),
          location: String(details.location ?? fallbackContact.location),
          locationFr: String(details.locationFr ?? details.location ?? fallbackContact.locationFr),
          socialLinks,
          freelancePlatforms,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setLoadError(error instanceof Error ? error.message : "Unable to load contact details.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const socialLinks = useMemo(() => contact.socialLinks, [contact.socialLinks]);
  const freelancePlatforms = useMemo(() => contact.freelancePlatforms, [contact.freelancePlatforms]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitState("submitting");
    setSubmitError(null);

    try {
      await apiRequest("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          subject: String(formData.get("subject") ?? ""),
          message: String(formData.get("message") ?? ""),
          source: "public-contact",
        }),
      });

      form.reset();
      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
      setSubmitError(error instanceof Error ? error.message : "Unable to send your message.");
    }
  };

  return (
    <section className="space-y-5" id="contact">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{language === "FR" ? "Contact" : "Contact"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {language === "FR" ? "Envoyez un message ou connectez-vous via votre plateforme préférée." : "Send a message or connect through your preferred platform."}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>{language === "FR" ? "Envoyer un Message" : "Send a Message"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex h-full flex-col justify-between gap-4" onSubmit={handleSubmit}>
              <Input name="name" aria-label={language === "FR" ? "Votre nom" : "Your name"} placeholder={language === "FR" ? "Votre nom" : "Your name"} required />
              <Input
                name="email"
                aria-label={language === "FR" ? "Votre email" : "Your email"}
                type="email"
                placeholder={language === "FR" ? "Votre email" : "Your email"}
                required
              />
              <select
                name="subject"
                aria-label={language === "FR" ? "Sujet" : "Subject"}
                className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                defaultValue=""
                required
              >
                <option
                  value=""
                  disabled
                  className="bg-background text-foreground"
                >
                  {language === "FR" ? "Choisir un sujet" : "Select a subject"}
                </option>
                {subjects.map((subject) => (
                  <option
                    key={subject.EN}
                    value={subject.EN}
                    className="bg-background text-foreground"
                  >
                    {language === "FR" ? subject.FR : subject.EN}
                  </option>
                ))}
              </select>
              <Textarea
                name="message"
                aria-label={language === "FR" ? "Message" : "Message"}
                placeholder={language === "FR" ? "Parlez-moi de votre projet" : "Tell me about your project"}
                required
                rows={4}
              />
              <Button type="submit" className="w-full" disabled={submitState === "submitting"}>
                {submitState === "submitting" && <Loader2 className="mr-2 size-4 animate-spin" />}
                {submitState === "submitting"
                    ? (language === "FR" ? "Envoi en cours..." : "Sending...")
                    : (language === "FR" ? "Envoyer le message" : "Send message")
                }
              </Button>
              {submitState === "success" ? (
                <p className="text-sm text-green-600">{language === "FR" ? "Message envoyé avec succès." : "Message sent successfully."}</p>
              ) : null}
              {submitState === "error" ? (
                <p className="text-sm text-destructive">{submitError ?? (language === "FR" ? "Impossible d'envoyer le message." : "Unable to send message.")}</p>
              ) : null}
            </form>
          </CardContent>
        </Card>

        <div className="grid content-start gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>{language === "FR" ? "Coordonnées" : "Contact Details"}</CardTitle>
            </CardHeader>
            <CardContent className="grid xl:grid-cols-3 gap-1.5 text-sm">
              {isLoading ? <p className="text-muted-foreground">{language === "FR" ? "Chargement des coordonnées..." : "Loading contact details..."}</p> : null}
              {loadError ? <p className="text-destructive">{loadError}</p> : null}
              <p>
                <span className="font-medium">Email:</span>{" "} <br/>
                {contact.email || (language === "FR" ? "Non configuré" : "Not configured")}
              </p>
              <p>
                <span className="font-medium">{language === "FR" ? "Téléphone" : "Phone"}:</span>{" "} <br/>
                {contact.phone || (language === "FR" ? "Non configuré" : "Not configured")}
              </p>
              <p>
                <span className="font-medium">{language === "FR" ? "Lieu" : "Location"}:</span>{" "} <br/>
                {(language === "FR" ? contact.locationFr : contact.location) || (language === "FR" ? "Non configuré" : "Not configured")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === "FR" ? "Réseaux Sociaux" : "Social Links"}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-1 xl:grid-cols-2 gap-2">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.platform];
                return (
                  <Button
                    key={social.platform}
                    asChild
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2"
                  >
                    <Link
                      href={social.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <Icon className="size-3.5" />
                      {social.platform}
                    </Link>
                  </Button>
                );
              })}
              {socialLinks.length === 0 ? (
                <p className="text-xs text-muted-foreground">{language === "FR" ? "Aucun lien social disponible." : "No social links available."}</p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === "FR" ? "Plateformes Freelance" : "Freelance Platforms"}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2  xl:grid-cols-3">
              {freelancePlatforms.map((platform) => (
                <Link
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors hover:bg-muted/40 ${platformStyles[platform.name]}`}
                >
                  <span className="inline-flex items-center gap-2">
                    {(() => {
                      const Icon = platformIcons[platform.name];
                      return <Icon />;
                    })()}
                    {platform.name}
                  </span>
                  <ExternalLink className="size-3" />
                </Link>
              ))}
              {freelancePlatforms.length === 0 ? (
                <p className="text-xs text-muted-foreground">{language === "FR" ? "Aucun lien freelance disponible." : "No freelance links available."}</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
