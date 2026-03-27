import Link from "next/link";
import {
	ExternalLink,
	Facebook,
	Github,
	Linkedin,
	MessageCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactDetails } from "@/lib/placeholder-data";

const subjects = ["Web Development", "IT Support", "Technical Consulting", "Other"];

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
			<path fill="currentColor" d="M12.03 2 8.5 5.53V2H5v7.94h3.5V8.97L12.03 12l3.5-3.03v.97H19V2h-3.47v3.53L12.03 2Zm-7.03 9.94v10h3.5v-6.47h3.03L15.5 19v2.94H19V14h-3.47l-3.5-3.03H5Z"/>
		</svg>
	);
}

function FiverrIcon() {
	return (
		<svg viewBox="0 0 24 24" className="size-4" aria-hidden>
			<path fill="currentColor" d="M14.16 9.22h-2.2V8.1c0-.69.57-1.25 1.27-1.25h.93V4h-.93C11 4 9.05 5.9 9.05 8.2v1.02H7V12h2.05v8h2.9v-8h2.21v-2.78Zm.16-5.22a1.84 1.84 0 1 0 0 3.68 1.84 1.84 0 0 0 0-3.68Z"/>
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

export function Contact() {
	return (
		<section className="space-y-5" id="contact">
			<div>
				<h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
				<p className="mt-1 text-sm text-muted-foreground">Send a message or connect through your preferred platform.</p>
			</div>

			<div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
				<Card>
					<CardHeader>
						<CardTitle>Send a Message</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="grid gap-2">
							<Input name="name" placeholder="Your name" required />
							<Input name="email" type="email" placeholder="Your email" required />
							<select
								name="subject"
								className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
								defaultValue=""
								required
							>
								<option value="" disabled className="bg-background text-foreground">
									Select a subject
								</option>
								{subjects.map((subject) => (
									<option key={subject} value={subject} className="bg-background text-foreground">
										{subject}
									</option>
								))}
							</select>
							<Textarea name="message" placeholder="Tell me about your project" required rows={4} />
							<Button type="submit" className="w-full">
								Send message
							</Button>
						</form>
					</CardContent>
				</Card>

				<div className="grid content-start gap-3">
					<Card>
						<CardHeader>
							<CardTitle>Contact Details</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-1.5 text-sm">
							<p>
								<span className="font-medium">Email:</span> {contactDetails.email}
							</p>
							<p>
								<span className="font-medium">Phone:</span> {contactDetails.phone}
							</p>
							<p>
								<span className="font-medium">Location:</span> {contactDetails.location}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Social Links</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-2 gap-2">
							{contactDetails.socialLinks.map((social) => {
								const Icon = socialIcons[social.platform];
								return (
									<Button key={social.platform} asChild variant="outline" size="sm" className="justify-start gap-2">
										<Link href={social.url} target="_blank" rel="noreferrer noopener">
											<Icon className="size-3.5" />
											{social.platform}
										</Link>
									</Button>
								);
							})}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Freelance Platforms</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-2">
							{contactDetails.freelancePlatforms.map((platform) => (
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
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
