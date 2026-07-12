"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, HeartHandshake, Lightbulb, Users, X, Copy, Check, Send, Coffee } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tx } from "@/components/i18n/tx";

type ModalType = "none" | "participate" | "support" | "propose";

export function CtaSection() {
	const [activeModal, setActiveModal] = useState<ModalType>("none");
	const [copiedCrypto, setCopiedCrypto] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Form States
	const [participateForm, setParticipateForm] = useState({
		name: "",
		email: "",
		profileUrl: "",
		project: "portfolio-platform",
		motivation: "",
	});

	const [proposeForm, setProposeForm] = useState({
		name: "",
		email: "",
		title: "",
		stack: "",
		problem: "",
		solution: "",
	});

	const handleCopyAddress = (address: string) => {
		navigator.clipboard.writeText(address);
		setCopiedCrypto(true);
		toast.success("Address copied to clipboard!");
		setTimeout(() => setCopiedCrypto(false), 2000);
	};

	const handleParticipateSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!participateForm.name || !participateForm.email || !participateForm.motivation) {
			toast.error("Please fill in all required fields.");
			return;
		}

		setIsSubmitting(true);
		try {
			const projectLabels: Record<string, string> = {
				"portfolio-platform": "Portfolio Platform",
				"clinic-operations-dashboard": "Clinic Operations Dashboard",
				"finance-crm-modernization": "Finance CRM Modernization",
				"general-collaboration": "General Open-Source Collaboration",
			};

			const messageBody = `
Name: ${participateForm.name}
Email: ${participateForm.email}
GitHub/LinkedIn: ${participateForm.profileUrl || "N/A"}
Selected Project: ${projectLabels[participateForm.project] || participateForm.project}

Motivation:
${participateForm.motivation}
			`.trim();

			const res = await fetch("/api/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: participateForm.name,
					email: participateForm.email,
					subject: `[Lab Application] Participate in ${projectLabels[participateForm.project]}`,
					message: messageBody,
					source: "lab_participate_modal",
				}),
			});

			const data = await res.json();
			if (res.ok && data.ok) {
				toast.success("Application submitted successfully!");
				setActiveModal("none");
				setParticipateForm({
					name: "",
					email: "",
					profileUrl: "",
					project: "portfolio-platform",
					motivation: "",
				});
			} else {
				toast.error(data.error || "Failed to submit application.");
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleProposeSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!proposeForm.name || !proposeForm.email || !proposeForm.title || !proposeForm.problem || !proposeForm.solution) {
			toast.error("Please fill in all required fields.");
			return;
		}

		setIsSubmitting(true);
		try {
			const messageBody = `
Proposer Name: ${proposeForm.name}
Proposer Email: ${proposeForm.email}
Proposed Project Title: ${proposeForm.title}
Suggested Tech Stack: ${proposeForm.stack || "N/A"}

Problem Statement:
${proposeForm.problem}

Proposed Solution Concept:
${proposeForm.solution}
			`.trim();

			const res = await fetch("/api/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: proposeForm.name,
					email: proposeForm.email,
					subject: `[Lab Proposal] New Project Idea: ${proposeForm.title}`,
					message: messageBody,
					source: "lab_propose_modal",
				}),
			});

			const data = await res.json();
			if (res.ok && data.ok) {
				toast.success("Project proposal submitted successfully!");
				setActiveModal("none");
				setProposeForm({
					name: "",
					email: "",
					title: "",
					stack: "",
					problem: "",
					solution: "",
				});
			} else {
				toast.error(data.error || "Failed to submit proposal.");
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const modalVariants = {
		hidden: { opacity: 0, scale: 0.92, y: 20 },
		visible: { 
			opacity: 1, 
			scale: 1, 
			y: 0, 
			transition: { 
				type: "spring", 
				stiffness: 280, 
				damping: 24 
			} 
		},
		exit: { 
			opacity: 0, 
			scale: 0.95, 
			y: 15, 
			transition: { 
				duration: 0.18, 
				ease: "easeInOut" 
			} 
		},
	} as const;

	const overlayVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.25 } },
		exit: { opacity: 0, transition: { duration: 0.2 } },
	} as const;

	return (
		<>
			<section className="py-8">
				<div className="grid gap-6 sm:grid-cols-3">
					{/* Card 1: Participate */}
					<Card className="flex flex-col border-border/70 bg-card/40 hover:border-primary/40 transition-colors duration-300 text-center">
						<CardHeader>
							<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
								<Users className="size-6 text-primary" />
							</div>
							<CardTitle className="text-xl">
								<Tx en="Participate" fr="Participer" />
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col flex-1 gap-6">
							<p className="text-sm text-muted-foreground flex-1 leading-relaxed">
								<Tx
									en="Apply to participate in an ongoing open-source or lab project."
									fr="Postulez pour participer à un projet open-source ou de laboratoire en cours."
								/>
							</p>
							<Button onClick={() => setActiveModal("participate")} variant="outline" className="w-full group hover:border-primary/50 hover:bg-primary/5 text-foreground transition-all duration-200">
								<Tx en="Apply Now" fr="Postuler" />
								<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
							</Button>
						</CardContent>
					</Card>

					{/* Card 2: Support */}
					<Card className="flex flex-col border-border/70 bg-card/40 hover:border-primary/40 transition-colors duration-300 text-center">
						<CardHeader>
							<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
								<HeartHandshake className="size-6 text-primary" />
							</div>
							<CardTitle className="text-xl">
								<Tx en="Support" fr="Soutenir" />
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col flex-1 gap-6">
							<p className="text-sm text-muted-foreground flex-1 leading-relaxed">
								<Tx
									en="Donate to support the development and hosting of these projects."
									fr="Faites un don pour soutenir le développement et l'hébergement de ces projets."
								/>
							</p>
							<Button onClick={() => setActiveModal("support")} variant="outline" className="w-full group hover:border-primary/50 hover:bg-primary/5 text-foreground transition-all duration-200">
								<Tx en="Donate" fr="Faire un don" />
								<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
							</Button>
						</CardContent>
					</Card>

					{/* Card 3: Propose */}
					<Card className="flex flex-col border-border/70 bg-card/40 hover:border-primary/40 transition-colors duration-300 text-center">
						<CardHeader>
							<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
								<Lightbulb className="size-6 text-primary" />
							</div>
							<CardTitle className="text-xl">
								<Tx en="Propose" fr="Proposer" />
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col flex-1 gap-6">
							<p className="text-sm text-muted-foreground flex-1 leading-relaxed">
								<Tx
									en="Have a great idea? Propose a project to work on together."
									fr="Vous avez une excellente idée ? Proposez un projet sur lequel travailler ensemble."
								/>
							</p>
							<Button onClick={() => setActiveModal("propose")} variant="outline" className="w-full group hover:border-primary/50 hover:bg-primary/5 text-foreground transition-all duration-200">
								<Tx en="Propose Idea" fr="Proposer une idée" />
								<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
							</Button>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Modal Overlay Manager */}
			<AnimatePresence>
				{activeModal !== "none" && (
					<motion.div
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={overlayVariants}
						className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
						onClick={() => setActiveModal("none")}
					>
						<motion.div
							variants={modalVariants}
							className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 dark:border-white/5 bg-card/90 backdrop-blur-xl p-8 shadow-2xl shadow-primary/10"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Top Accent Bar */}
							<div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

							{/* Close Button */}
							<button
								onClick={() => setActiveModal("none")}
								type="button"
								className="absolute top-6 right-6 rounded-full p-2 text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-all duration-200 active:scale-90"
								aria-label="Close modal"
							>
								<X className="size-4" />
							</button>

							{/* --- PARTICIPATE MODAL --- */}
							{activeModal === "participate" && (
								<form onSubmit={handleParticipateSubmit} className="space-y-6">
									<div className="flex items-center gap-3 pr-8">
										<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
											<Users className="size-5" />
										</div>
										<div>
											<h2 className="text-xl font-bold tracking-tight text-foreground">
												<Tx en="Apply to Participate" fr="Postuler pour Participer" />
											</h2>
											<p className="text-xs text-muted-foreground mt-0.5">
												<Tx
													en="Collaborate with me on active projects to build your experience."
													fr="Collaborer avec moi sur des projets actifs pour développer votre expérience."
												/>
											</p>
										</div>
									</div>

									<div className="space-y-4">
										<div className="space-y-1.5">
											<label className="text-xs font-semibold tracking-wider text-muted-foreground/90 uppercase">
												<Tx en="Full Name" fr="Nom Complet" /> *
											</label>
											<input
												type="text"
												value={participateForm.name}
												onChange={(e) => setParticipateForm({ ...participateForm, name: e.target.value })}
												required
												placeholder="John Doe"
												className="w-full rounded-xl border border-border/70 bg-background/40 hover:bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40"
											/>
										</div>

										<div className="space-y-1.5">
											<label className="text-xs font-semibold tracking-wider text-muted-foreground/90 uppercase">
												<Tx en="Email Address" fr="Adresse E-mail" /> *
											</label>
											<input
												type="email"
												value={participateForm.email}
												onChange={(e) => setParticipateForm({ ...participateForm, email: e.target.value })}
												required
												placeholder="john@example.com"
												className="w-full rounded-xl border border-border/70 bg-background/40 hover:bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40"
											/>
										</div>

										<div className="space-y-1.5">
											<label className="text-xs font-semibold tracking-wider text-muted-foreground/90 uppercase">
												<Tx en="GitHub / LinkedIn Link" fr="Lien GitHub / LinkedIn" />
											</label>
											<input
												type="url"
												value={participateForm.profileUrl}
												onChange={(e) => setParticipateForm({ ...participateForm, profileUrl: e.target.value })}
												placeholder="https://github.com/username"
												className="w-full rounded-xl border border-border/70 bg-background/40 hover:bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40"
											/>
										</div>

										<div className="space-y-1.5">
											<label className="text-xs font-semibold tracking-wider text-muted-foreground/90 uppercase">
												<Tx en="Select Lab Project" fr="Sélectionner le Projet" />
											</label>
											<select
												value={participateForm.project}
												onChange={(e) => setParticipateForm({ ...participateForm, project: e.target.value })}
												className="w-full rounded-xl border border-border/70 bg-background/40 hover:bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
											>
												<option value="portfolio-platform">Portfolio Platform</option>
												<option value="clinic-operations-dashboard">Clinic Operations Dashboard</option>
												<option value="finance-crm-modernization">Finance CRM Modernization</option>
												<option value="general-collaboration">General Open Source</option>
											</select>
										</div>

										<div className="space-y-1.5">
											<label className="text-xs font-semibold tracking-wider text-muted-foreground/90 uppercase">
												<Tx en="Motivation & Skills" fr="Motivation et Compétences" /> *
											</label>
											<textarea
												rows={4}
												value={participateForm.motivation}
												onChange={(e) => setParticipateForm({ ...participateForm, motivation: e.target.value })}
												required
												placeholder="Why do you want to collaborate on this project and what is your tech experience?"
												className="w-full rounded-xl border border-border/70 bg-background/40 hover:bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40 resize-none"
											/>
										</div>
									</div>

									<Button 
										type="submit" 
										disabled={isSubmitting} 
										className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/75 text-primary-foreground font-bold shadow-lg shadow-primary/10 transition-all active:scale-[0.98] py-2.5 flex items-center justify-center"
									>
										{isSubmitting ? (
											<Tx en="Submitting..." fr="Envoi..." />
										) : (
											<>
												<Tx en="Submit Application" fr="Soumettre la Candidature" />
												<Send className="ml-2 size-4" />
											</>
										)}
									</Button>
								</form>
							)}

							{/* --- SUPPORT / DONATE MODAL --- */}
							{activeModal === "support" && (
								<div className="space-y-6">
									<div className="flex items-center gap-3 pr-8">
										<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
											<HeartHandshake className="size-5" />
										</div>
										<div>
											<h2 className="text-xl font-bold tracking-tight text-foreground">
												<Tx en="Support My Lab Work" fr="Soutenir mon Travail" />
											</h2>
											<p className="text-xs text-muted-foreground mt-0.5">
												<Tx
													en="Contributions keep these projects hosted, open-source, and active."
													fr="Vos contributions permettent d'héberger, de maintenir open-source et actifs ces projets."
												/>
											</p>
										</div>
									</div>

									<div className="space-y-4">
										{/* Ko-fi Direct Link */}
										<a
											href="https://ko-fi.com/angecesarmadick"
											target="_blank"
											rel="noopener noreferrer"
											className="group flex items-center justify-between rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-500/40 hover:bg-rose-500/10 hover:shadow-lg hover:shadow-rose-500/5"
										>
											<div className="flex items-center gap-3">
												<div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white font-bold transition-transform duration-300 group-hover:scale-110">
													<Coffee className="size-5 transition-transform duration-300 group-hover:rotate-12" />
												</div>
												<div className="text-left">
													<p className="text-sm font-semibold text-rose-200">
														<Tx en="Support on Ko-fi" fr="Soutenir sur Ko-fi" />
													</p>
													<p className="text-xs text-muted-foreground">
														<Tx en="Support via standard card, PayPal, Apple Pay" fr="Soutenir par carte, PayPal, Apple Pay" />
													</p>
												</div>
											</div>
											<ArrowRight className="size-4 text-rose-400 transition-transform duration-300 group-hover:translate-x-1" />
										</a>

										{/* Ethereum / USDT Crypto Address */}
										<div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-2">
											<div className="flex items-center justify-between">
												<div className="text-left">
													<p className="text-xs font-semibold text-violet-300 uppercase tracking-wide">USDT / Ethereum Address</p>
													<p className="text-[10px] text-muted-foreground">Supports ERC20 network tokens</p>
												</div>
												<button
													type="button"
													onClick={() => handleCopyAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")}
													className="rounded-lg border border-border bg-card p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-95"
												>
													{copiedCrypto ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
												</button>
											</div>
											<p className="font-mono text-xs select-all break-all bg-background/50 rounded-lg p-2 border border-border/50 text-foreground/80">
												0x71C7656EC7ab88b098defB751B7401B5f6d8976F
											</p>
										</div>

										{/* General Support Note */}
										<div className="text-xs text-muted-foreground text-center py-2">
											<p>
												<Tx
													en="Want to setup custom project funding or corporate sponsorships?"
													fr="Vous souhaitez mettre en place un financement de projet sur mesure ?"
												/>
											</p>
											<button
												onClick={() => setActiveModal("propose")}
												className="text-primary underline mt-1 hover:text-primary/80 transition-colors font-medium"
											>
												<Tx en="Get in touch" fr="Prendre contact" />
											</button>
										</div>
									</div>
								</div>
							)}

							{/* --- PROPOSE MODAL --- */}
							{activeModal === "propose" && (
								<form onSubmit={handleProposeSubmit} className="space-y-6">
									<div className="flex items-center gap-3 pr-8">
										<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
											<Lightbulb className="size-5" />
										</div>
										<div>
											<h2 className="text-xl font-bold tracking-tight text-foreground">
												<Tx en="Propose a Project" fr="Proposer un Projet" />
											</h2>
											<p className="text-xs text-muted-foreground mt-0.5">
												<Tx
													en="Share your digital application idea. Let's design and ship it together."
													fr="Partagez votre idée d'application numérique. Concevons et publions-la ensemble."
												/>
											</p>
										</div>
									</div>

									<div className="space-y-4">
										<div className="grid gap-3 sm:grid-cols-2">
											<div className="space-y-1.5">
												<label className="text-xs font-semibold tracking-wider text-muted-foreground/90 uppercase">
													<Tx en="Your Name" fr="Votre Nom" /> *
												</label>
												<input
													type="text"
													value={proposeForm.name}
													onChange={(e) => setProposeForm({ ...proposeForm, name: e.target.value })}
													required
													placeholder="Jane Doe"
													className="w-full rounded-xl border border-border/70 bg-background/40 hover:bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40"
												/>
											</div>
											<div className="space-y-1.5">
												<label className="text-xs font-semibold tracking-wider text-muted-foreground/90 uppercase">
													<Tx en="Your Email" fr="Votre E-mail" /> *
												</label>
												<input
													type="email"
													value={proposeForm.email}
													onChange={(e) => setProposeForm({ ...proposeForm, email: e.target.value })}
													required
													placeholder="jane@example.com"
													className="w-full rounded-xl border border-border/70 bg-background/40 hover:bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40"
												/>
											</div>
										</div>

										<div className="space-y-1.5">
											<label className="text-xs font-semibold tracking-wider text-muted-foreground/90 uppercase">
												<Tx en="Project Title" fr="Titre du Projet" /> *
											</label>
											<input
												type="text"
												value={proposeForm.title}
												onChange={(e) => setProposeForm({ ...proposeForm, title: e.target.value })}
												required
												placeholder="e.g. Smart IoT Dashboard"
												className="w-full rounded-xl border border-border/70 bg-background/40 hover:bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40"
											/>
										</div>

										<div className="space-y-1.5">
											<label className="text-xs font-semibold tracking-wider text-muted-foreground/90 uppercase">
												<Tx en="Suggested Stack" fr="Stack Suggérée" />
											</label>
											<input
												type="text"
												value={proposeForm.stack}
												onChange={(e) => setProposeForm({ ...proposeForm, stack: e.target.value })}
												placeholder="e.g. Next.js, FastAPI, Docker"
												className="w-full rounded-xl border border-border/70 bg-background/40 hover:bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40"
											/>
										</div>

										<div className="space-y-1.5">
											<label className="text-xs font-semibold tracking-wider text-muted-foreground/90 uppercase">
												<Tx en="What problem does this solve?" fr="Quel problème cela résout-il ?" /> *
											</label>
											<textarea
												rows={2}
												value={proposeForm.problem}
												onChange={(e) => setProposeForm({ ...proposeForm, problem: e.target.value })}
												required
												placeholder="Describe the challenge or pain point..."
												className="w-full rounded-xl border border-border/70 bg-background/40 hover:bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40 resize-none"
											/>
										</div>

										<div className="space-y-1.5">
											<label className="text-xs font-semibold tracking-wider text-muted-foreground/90 uppercase">
												<Tx en="What is your proposed solution?" fr="Quelle est la solution proposée ?" /> *
											</label>
											<textarea
												rows={2}
												value={proposeForm.solution}
												onChange={(e) => setProposeForm({ ...proposeForm, solution: e.target.value })}
												required
												placeholder="How should the software solve this problem?"
												className="w-full rounded-xl border border-border/70 bg-background/40 hover:bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40 resize-none"
											/>
										</div>
									</div>

									<Button 
										type="submit" 
										disabled={isSubmitting} 
										className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/75 text-primary-foreground font-bold shadow-lg shadow-primary/10 transition-all active:scale-[0.98] py-2.5 flex items-center justify-center"
									>
										{isSubmitting ? (
											<Tx en="Submitting..." fr="Envoi..." />
										) : (
											<>
												<Tx en="Propose Project Idea" fr="Proposer l'Idée de Projet" />
												<Send className="ml-2 size-4" />
											</>
										)}
									</Button>
								</form>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
