"use client";

import type { ReactNode } from "react";

import { useLanguage } from "@/components/i18n/language-provider";

type TxProps = {
	en: ReactNode;
	fr: ReactNode;
};

export function Tx({ en, fr }: TxProps) {
	const { language } = useLanguage();
	return <>{language === "FR" ? fr : en}</>;
}
