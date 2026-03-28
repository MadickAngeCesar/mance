"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useLanguage } from "@/components/i18n/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest, persistAuthTokens } from "@/lib/client-api";

const loginSchema = z.object({
	email: z
		.email({ message: "Enter a valid email address." })
		.min(1, { message: "Email is required." }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters." }),
	rememberMe: z.boolean().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
	brandName: string;
	supportEmail: string;
};

export function LoginForm({ brandName, supportEmail }: LoginFormProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors, isValid, isDirty },
	} = useForm<LoginValues>({
		mode: "onChange",
		defaultValues: {
			email: "",
			password: "",
			rememberMe: true,
		},
	});

	const canSubmit = useMemo(() => !isSubmitting && isDirty && isValid, [isDirty, isSubmitting, isValid]);

	const onSubmit = async (values: LoginValues) => {
		clearErrors("root");
		setIsSubmitting(true);

		const parsed = loginSchema.safeParse(values);
		if (!parsed.success) {
			for (const issue of parsed.error.issues) {
				const fieldName = issue.path[0];
				if (fieldName === "email" || fieldName === "password" || fieldName === "rememberMe") {
					setError(fieldName, {
						type: "manual",
						message: issue.message,
					});
				}
			}
			setIsSubmitting(false);
			return;
		}

		try {
			const response = await apiRequest<{
				token: {
					accessToken: string;
					refreshToken?: string;
				};
			}>("/api/auth/sign-in", {
				method: "POST",
				body: JSON.stringify({
					email: parsed.data.email,
					password: parsed.data.password,
					rememberMe: Boolean(parsed.data.rememberMe),
				}),
			});

			if (response.data?.token?.accessToken) {
				persistAuthTokens({
					accessToken: response.data.token.accessToken,
					refreshToken: response.data.token.refreshToken,
				});
			}

			router.push("/dashboard");
			router.refresh();
		} catch (error) {
			setError("root", {
				type: "manual",
				message:
					error instanceof Error
						? error.message
						: language === "FR"
							? "Connexion impossible. Verifiez vos identifiants."
							: "Unable to sign in. Check your credentials.",
			});
		}

		setIsSubmitting(false);
	};

	return (
		<Card className="border border-border/60 bg-card/85 shadow-xl backdrop-blur-sm">
			<CardHeader className="space-y-3 border-b border-border/60 pb-4">
				<Badge variant="outline" className="w-fit border-accent/40 text-accent">
					{language === "FR" ? "Acces Dashboard" : "Dashboard Access"}
				</Badge>
				<div className="space-y-1">
					<CardTitle className="text-xl">{language === "FR" ? "Se connecter a" : "Sign in to"} {brandName}</CardTitle>
					<CardDescription>
						{language === "FR"
							? "Gerez en toute securite les messages, projets, services et contenus depuis un seul espace."
							: "Securely manage messages, projects, services, and content from one workspace."}
					</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="pt-4">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
					<div className="space-y-1.5">
						<label htmlFor="email" className="text-xs font-medium text-muted-foreground">
							{language === "FR" ? "Adresse email" : "Email address"}
						</label>
						<div className="relative">
							<Mail className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="email"
								type="email"
								autoComplete="email"
								placeholder="madickangecesar59@gmail.com"
								className="h-10 pl-8"
								aria-invalid={Boolean(errors.email)}
								{...register("email", {
									validate: (value) => {
										const result = loginSchema.shape.email.safeParse(value);
										return result.success || result.error.issues[0]?.message || "Enter a valid email address.";
									},
								})}
							/>
						</div>
						{errors.email ? (
							<p className="text-xs text-destructive">{errors.email.message}</p>
						) : null}
					</div>

					<div className="space-y-1.5">
						<label htmlFor="password" className="text-xs font-medium text-muted-foreground">
							{language === "FR" ? "Mot de passe" : "Password"}
						</label>
						<div className="relative">
							<LockKeyhole className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								placeholder="Enter your password"
								className="h-10 pl-8 pr-10"
								aria-invalid={Boolean(errors.password)}
								{...register("password", {
									validate: (value) => {
										const result = loginSchema.shape.password.safeParse(value);
										return result.success || result.error.issues[0]?.message || "Password is required.";
									},
								})}
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								className="absolute top-1/2 right-1.5 -translate-y-1/2"
								onClick={() => setShowPassword((current) => !current)}
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
							</Button>
						</div>
						{errors.password ? (
							<p className="text-xs text-destructive">{errors.password.message}</p>
						) : null}
					</div>

					<div className="flex items-center justify-between gap-3 text-xs">
						<label className="inline-flex cursor-pointer items-center gap-2 text-muted-foreground">
							<input
								type="checkbox"
								className="size-3.5 rounded border-border bg-transparent accent-primary"
								{...register("rememberMe")}
							/>
							{language === "FR" ? "Se souvenir de cet appareil" : "Remember this device"}
						</label>
						<Link href="mailto:madickangecesar59@gmail.com" className="text-primary hover:underline">
							{language === "FR" ? "Mot de passe oublie ?" : "Forgot password?"}
						</Link>
					</div>

					<Button type="submit" className="h-10 w-full" disabled={!canSubmit}>
						{isSubmitting ? (
							<>
								<Loader2 className="size-4 animate-spin" />
								{language === "FR" ? "Connexion..." : "Signing in..."}
							</>
						) : (
							language === "FR" ? "Se connecter" : "Sign in"
						)}
					</Button>

					{errors.root?.message ? (
						<p className="text-xs text-destructive">{errors.root.message}</p>
					) : null}
				</form>

				<div className="mt-3 rounded-lg border border-border/70 bg-muted/40 p-3 text-xs text-muted-foreground">
					<p className="font-medium text-foreground">{language === "FR" ? "Besoin d'aide pour l'acces ?" : "Need access support?"}</p>
					<p className="mt-1">
						{language === "FR" ? "Contactez" : "Contact"} <a href={`mailto:${supportEmail}`} className="text-primary hover:underline">{supportEmail}</a> {language === "FR" ? "pour la recuperation de compte ou un nouvel acces contributeur." : "for account recovery or new contributor access."}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
