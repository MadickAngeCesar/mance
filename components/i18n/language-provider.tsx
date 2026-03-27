"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type AppLanguage = "EN" | "FR";

type LanguageContextValue = {
	language: AppLanguage;
	setLanguage: (language: AppLanguage) => void;
};

const LANGUAGE_STORAGE_KEY = "mac-tech-language";

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const [language, setLanguageState] = useState<AppLanguage>(() => {
		if (typeof window === "undefined") {
			return "EN";
		}

		const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
		return stored === "EN" || stored === "FR" ? stored : "EN";
	});

	const setLanguage = (nextLanguage: AppLanguage) => {
		setLanguageState(nextLanguage);
		window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
	};

	const value = useMemo(() => ({ language, setLanguage }), [language]);

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within LanguageProvider");
	}
	return context;
}
