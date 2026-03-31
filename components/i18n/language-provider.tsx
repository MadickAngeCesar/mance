"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppLanguage = "EN" | "FR";

type LanguageContextValue = {
	language: AppLanguage;
	setLanguage: (language: AppLanguage) => void;
};

const LANGUAGE_STORAGE_KEY = "mac-tech-language";
const LANGUAGE_COOKIE_KEY = "mac-tech-language";

function isAppLanguage(value: string | null): value is AppLanguage {
	return value === "EN" || value === "FR";
}

function applyDocumentLanguage(language: AppLanguage) {
	document.documentElement.lang = language === "FR" ? "fr" : "en";
}

function persistLanguage(language: AppLanguage) {
	window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
	document.cookie = `${LANGUAGE_COOKIE_KEY}=${language}; path=/; max-age=31536000; SameSite=Lax`;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const [language, setLanguageState] = useState<AppLanguage>("EN");

	useEffect(() => {
		const fromCookie = document.cookie
			.split("; ")
			.find((item) => item.startsWith(`${LANGUAGE_COOKIE_KEY}=`))
			?.split("=")[1] ?? null;
		const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
		const nextLanguage = isAppLanguage(stored)
			? stored
			: isAppLanguage(fromCookie)
				? fromCookie
				: "EN";

		setLanguageState(nextLanguage);
		applyDocumentLanguage(nextLanguage);
		persistLanguage(nextLanguage);

		const syncFromStorage = (event: StorageEvent) => {
			if (event.key && event.key !== LANGUAGE_STORAGE_KEY) {
				return;
			}

			if (isAppLanguage(event.newValue)) {
				setLanguageState(event.newValue);
				applyDocumentLanguage(event.newValue);
				persistLanguage(event.newValue);
			}
		};

		window.addEventListener("storage", syncFromStorage);

		return () => {
			window.removeEventListener("storage", syncFromStorage);
		};
	}, []);

	useEffect(() => {
		applyDocumentLanguage(language);
		persistLanguage(language);
	}, [language]);

	const setLanguage = (nextLanguage: AppLanguage) => {
		if (nextLanguage === language) {
			return;
		}
		setLanguageState(nextLanguage);
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
