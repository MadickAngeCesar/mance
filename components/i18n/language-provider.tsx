"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppLanguage = "EN" | "FR";

type LanguageContextValue = {
	language: AppLanguage;
	setLanguage: (language: AppLanguage) => void;
};

const LANGUAGE_STORAGE_KEY = "mac-tech-language";

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const [language, setLanguageState] = useState<AppLanguage>("EN");

	useEffect(() => {
		const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
		if (stored === "EN" || stored === "FR") {
			setLanguageState(stored);
		}
	}, []);

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
