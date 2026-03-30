import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

const markdownComponents: Components = {
	a({ className, href, children, ...props }) {
		const isExternal = Boolean(href?.startsWith("http://") || href?.startsWith("https://"));
		return (
			<a
				{...props}
				href={href}
				target={isExternal ? "_blank" : undefined}
				rel={isExternal ? "noreferrer noopener" : undefined}
				className={cn("font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary", className)}
			>
				{children}
			</a>
		);
	},
	pre({ className, children, ...props }) {
		return (
			<pre
				{...props}
				className={cn(
					"my-4 w-full overflow-x-auto rounded-lg border border-border/70 bg-muted/40 p-3 text-sm leading-6 text-foreground",
					className,
				)}
			>
				{children}
			</pre>
		);
	},
	code({ className, children, ...props }) {
		const isBlock = Boolean(className?.includes("language-"));
		return (
			<code
				{...props}
				className={cn(
					isBlock
						? "font-mono text-[0.82rem]"
						: "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.82rem] text-foreground",
					className,
				)}
			>
				{children}
			</code>
		);
	},
	table({ className, children, ...props }) {
		return (
			<div className="my-4 w-full overflow-x-auto">
				<table
					{...props}
					className={cn("w-full min-w-lg border-collapse rounded-lg border border-border/70 text-left text-sm", className)}
				>
					{children}
				</table>
			</div>
		);
	},
	th({ className, children, ...props }) {
		return (
			<th
				{...props}
				className={cn("border-b border-border/70 bg-muted/30 px-3 py-2 font-medium text-foreground", className)}
			>
				{children}
			</th>
		);
	},
	td({ className, children, ...props }) {
		return (
			<td {...props} className={cn("border-b border-border/40 px-3 py-2 align-top", className)}>
				{children}
			</td>
		);
	},
	img({ className, alt, ...props }) {
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				{...props}
				alt={alt ?? ""}
				loading="lazy"
				decoding="async"
				className={cn("my-4 h-auto w-full rounded-lg border border-border/70 object-cover", className)}
			/>
		);
	},
};

type MarkdownRendererProps = {
	content?: string | null;
	emptyState?: string;
	className?: string;
};

export function MarkdownRenderer({
	content,
	emptyState = "No content yet.",
	className,
}: MarkdownRendererProps) {
	const value = content?.trim() ? content : emptyState;

	return (
		<div className={cn("markdown-content", className)}>
			<ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
				{value}
			</ReactMarkdown>
		</div>
	);
}
