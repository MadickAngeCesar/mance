import { useState } from "react";
import { MailOpen, Reply, Trash2 } from "lucide-react";

import type { MessagePreview } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type MessageCardProps = {
	message: MessagePreview;
	onToggleRead: (id: string, nextRead: boolean) => Promise<void>;
	onReply: (id: string, payload: { subject?: string; body: string }) => Promise<void>;
	onDelete: (id: string) => Promise<void>;
	isPending?: boolean;
};

export function MessageCard({ message, onToggleRead, onReply, onDelete, isPending = false }: MessageCardProps) {
	const [replyOpen, setReplyOpen] = useState(false);
	const [replySubject, setReplySubject] = useState(`Re: ${message.subject}`);
	const [replyBody, setReplyBody] = useState("");

	const submitReply = async () => {
		if (!replyBody.trim()) {
			return;
		}

		await onReply(message.id, {
			subject: replySubject.trim() || undefined,
			body: replyBody.trim(),
		});

		setReplyBody("");
		setReplyOpen(false);
	};

	return (
		<Card className="border border-border/70 bg-card/80">
			<CardHeader className="flex flex-row items-start justify-between gap-3 border-b border-border/70 pb-3">
				<div className="space-y-1">
					<CardTitle className="text-sm">{message.subject}</CardTitle>
					<p className="text-xs text-muted-foreground">
						{message.name} · {message.email}
					</p>
				</div>
				<Badge variant={message.isRead ? "outline" : "default"}>{message.isRead ? "Read" : "New"}</Badge>
			</CardHeader>
			<CardContent className="space-y-3 pt-3">
				<p className="text-sm text-muted-foreground">{message.message}</p>
				<div className="flex flex-wrap items-center justify-between gap-2">
					<p className="text-xs text-muted-foreground">
						Received {new Date(message.receivedAt).toLocaleString()}
					</p>
					<div className="flex gap-1">
						<Button
							variant="ghost"
							size="sm"
							type="button"
							onClick={() => void onToggleRead(message.id, !message.isRead)}
							disabled={isPending}
						>
							<MailOpen className="size-4" />
							{message.isRead ? "Mark unread" : "Mark read"}
						</Button>
						<Dialog open={replyOpen} onOpenChange={setReplyOpen}>
							<DialogTrigger asChild>
								<Button variant="ghost" size="sm" type="button" disabled={isPending}>
									<Reply className="size-4" />
									Reply
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Reply to {message.name}</DialogTitle>
									<DialogDescription>
										Your reply will be sent to {message.email}.
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-3">
									<div className="space-y-1.5">
										<label className="text-xs font-medium text-muted-foreground">Subject</label>
										<Input
											value={replySubject}
											onChange={(event) => setReplySubject(event.target.value)}
											placeholder="Re: Your request"
										/>
									</div>
									<div className="space-y-1.5">
										<label className="text-xs font-medium text-muted-foreground">Message</label>
										<Textarea
											rows={6}
											value={replyBody}
											onChange={(event) => setReplyBody(event.target.value)}
											placeholder="Write your reply..."
										/>
									</div>
								</div>
								<DialogFooter>
									<Button type="button" onClick={() => void submitReply()} disabled={isPending || !replyBody.trim()}>
										Send Reply
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
						<Button
							variant="ghost"
							size="sm"
							type="button"
							onClick={() => void onDelete(message.id)}
							disabled={isPending}
						>
							<Trash2 className="size-4" />
							Delete
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}