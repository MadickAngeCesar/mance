import { ArrowRight, CheckCircle2, CircleDollarSign, Handshake, Users, HelpCircle, Gift } from "lucide-react";
import Link from "next/link";

import { Tx } from "@/components/i18n/tx";
import { Button } from "@/components/ui/button";

export function ReferralSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/60 px-6 py-12 sm:px-10 sm:py-16 mt-16 mb-8">
      {/* Decorative glowing blobs */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.64 0.2 290 / 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.76 0.13 220 / 0.12) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      {/* Grid background overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%239C92AC' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl space-y-12">
        {/* Top Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Gift className="size-3.5 animate-bounce" />
              <Tx en="Referral Program" fr="Programme de Parrainage" />
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            <Tx 
              en={<>Refer a Client, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-400 to-primary">Earn Money!</span></>} 
              fr={<>Parrainez un Client, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-400 to-primary">Gagnez de l'Argent !</span></>} 
            />
          </h2>
          <p className="mx-auto max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            <Tx
              en="Turn your network into opportunities. Do you know a business, school, hotel, clinic, NGO, or company that needs digital solutions? Refer them to MAC TECH and get rewarded when a contract is signed!"
              fr="Transformez votre réseau en opportunités. Connaissez-vous une entreprise, école, hôtel, clinique, ONG ou cabinet qui a besoin de solutions digitales ? Parrainez-les et recevez votre récompense dès la signature du contrat !"
            />
          </p>
        </div>

        {/* Process Section - How It Works */}
        <div className="space-y-6">
          <h3 className="text-center text-lg font-bold uppercase tracking-wider text-primary/80">
            <Tx en="How It Works" fr="Comment ça Marche" />
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <div className="group relative flex flex-col items-center text-center p-6 rounded-2xl border border-border/80 bg-card/25 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 transition-transform group-hover:scale-110">
                <Users className="size-7" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">
                <Tx en="1. You Refer a Client" fr="1. Vous Parrainez un Client" />
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <Tx
                  en="Introduce me to any organization (School, Clinic, NGO, Hotel, SME, Law Firm) that needs digital systems, professional websites, or custom software."
                  fr="Mettez-moi en relation avec toute organisation (École, Clinique, ONG, Hôtel, PME, Cabinet) ayant besoin de sites internet, de progiciels ou de logiciels sur mesure."
                />
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative flex flex-col items-center text-center p-6 rounded-2xl border border-border/80 bg-card/25 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 transition-transform group-hover:scale-110">
                <Handshake className="size-7" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">
                <Tx en="2. MAC TECH Engages" fr="2. MAC TECH s'Engage" />
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <Tx
                  en="We analyze their operational needs, prepare a tailored proposal, and present the ideal digital solutions to optimize their workflows."
                  fr="Nous analysons leurs besoins opérationnels, préparons une proposition sur mesure et présentons les solutions digitales optimales pour optimiser leur activité."
                />
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative flex flex-col items-center text-center p-6 rounded-2xl border border-border/80 bg-card/25 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 transition-transform group-hover:scale-110">
                <CircleDollarSign className="size-7 animate-pulse" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">
                <Tx en="3. Contract & Reward" fr="3. Contrat & Récompense" />
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <Tx
                  en="Once the contract is signed and the project starts, you receive your reward/commission. Payout scale scales directly with the contract value!"
                  fr="Une fois le contrat signé et le projet lancé, vous recevez votre commission. Le montant de la récompense dépend directement de la taille du projet !"
                />
              </p>
            </div>
          </div>
        </div>

        {/* Benefits & Details Grid */}
        <div className="grid gap-6 md:grid-cols-2 pt-4">
          {/* How you are rewarded */}
          <div className="rounded-2xl border border-border/60 bg-card/30 p-6 space-y-4">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <Tx en="How You Are Rewarded" fr="Comment Vous Êtes Récompensé" />
            </h3>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4.5 text-primary shrink-0 mt-0.5" />
                <span>
                  <Tx en="Commission on signed contracts (reward depends on size of project)." fr="Commission sur les contrats signés (la récompense dépend de la taille du projet)." />
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4.5 text-primary shrink-0 mt-0.5" />
                <span>
                  <Tx en="Simple and transparent payout tracking." fr="Suivi des paiements simple et transparent." />
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4.5 text-primary shrink-0 mt-0.5" />
                <span>
                  <Tx en="Payment directly after project collection." fr="Paiement effectué dès la collecte des fonds du projet." />
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4.5 text-primary shrink-0 mt-0.5" />
                <span>
                  <Tx en="No investment or technical skills required." fr="Aucun investissement ni compétence technique requis." />
                </span>
              </li>
            </ul>
          </div>

          {/* Who can participate */}
          <div className="rounded-2xl border border-border/60 bg-card/30 p-6 space-y-4">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <Tx en="Who Can Participate?" fr="Qui Peut Participer ?" />
            </h3>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4.5 text-primary shrink-0 mt-0.5" />
                <span>
                  <Tx en="Students & Teachers looking for side income." fr="Étudiants & Enseignants recherchant un revenu d'appoint." />
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4.5 text-primary shrink-0 mt-0.5" />
                <span>
                  <Tx en="Entrepreneurs & Freelancers expanding their services." fr="Entrepreneurs & Freelances élargissant leur offre de services." />
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4.5 text-primary shrink-0 mt-0.5" />
                <span>
                  <Tx en="Professionals & Sales Representatives." fr="Professionnels & Agents commerciaux." />
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4.5 text-primary shrink-0 mt-0.5" />
                <span>
                  <Tx en="Anyone with a professional or business network." fr="Toute personne disposant d'un réseau professionnel ou commercial." />
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Why Partner with MAC TECH */}
        <div className="rounded-2xl border border-border/60 bg-card/30 p-6 text-center space-y-4">
          <h3 className="font-bold text-lg text-foreground flex items-center justify-center gap-2">
            <HelpCircle className="size-5 text-primary" />
            <Tx en="Why Partner with MAC TECH?" fr="Pourquoi Collaborer avec MAC TECH ?" />
          </h3>
          <div className="grid gap-4 sm:grid-cols-3 text-xs text-muted-foreground leading-relaxed">
            <div>
              <p className="font-semibold text-foreground mb-1"><Tx en="Serious & Professional" fr="Sérieux & Professionnel" /></p>
              <p><Tx en="A trusted digital partner with technical and educational expertise." fr="Un partenaire numérique de confiance doté d'une expertise technique et pédagogique." /></p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1"><Tx en="Tailored to Local Realities" fr="Adapté aux Réalités Locales" /></p>
              <p><Tx en="Solutions built for African realities and international standards." fr="Solutions conçues pour les réalités africaines et les standards internationaux." /></p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1"><Tx en="Guaranteed Payouts" fr="Paiements Garantis" /></p>
              <p><Tx en="Transparent communication and swift reward payments upon signature." fr="Communication transparente et paiement rapide des récompenses après signature." /></p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="pt-4 text-center space-y-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <Tx en="Start Earning Today! Your network can create value." fr="Commencez à Gagner Aujourd'hui ! Votre réseau a de la valeur." />
          </p>
          <Link href="/contact?subject=Referral">
            <Button size="lg" className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform px-8">
              <Tx en="Become a Referral Partner" fr="Devenir Partenaire de Parrainage" />
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
