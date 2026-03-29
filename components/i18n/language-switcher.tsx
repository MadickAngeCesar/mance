"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Languages } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
	const { language, setLanguage } = useLanguage();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="outline" size="sm" className="gap-1.5" type="button">
				<Languages className="size-3.5" />
				EN
				<ChevronDown className="size-3.5" />
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="gap-1.5">
					<Languages className="size-3.5" />
					{language}
					<ChevronDown className="size-3.5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-36">
				<DropdownMenuItem onSelect={() => setLanguage("EN")}>English</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => setLanguage("FR")}>Francais</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
