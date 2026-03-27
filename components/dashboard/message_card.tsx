import { MailOpen, Reply, Trash2 } from "lucide-react";

import type { MessagePreview } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MessageCardProps = {
	message: MessagePreview;
};

export function MessageCard({ message }: MessageCardProps) {
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
						<Button variant="ghost" size="sm" type="button">
							<MailOpen className="size-4" />
							Open
						</Button>
						<Button variant="ghost" size="sm" type="button">
							<Reply className="size-4" />
							Reply
						</Button>
						<Button variant="ghost" size="sm" type="button">
							<Trash2 className="size-4" />
							Delete
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}