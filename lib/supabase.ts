import { createClient } from "@supabase/supabase-js";

function normalizeEnv(value?: string) {
	return value?.trim().replace(/^"|"$/g, "");
}

const supabaseUrl = normalizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseServiceRoleKey = normalizeEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabaseSecretKey = normalizeEnv(process.env.SUPABASE_SECRET_KEY);
const supabasePublishableKey = normalizeEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY);

export function createSupabaseAdminClient() {
	const serverKey = supabaseSecretKey ?? supabaseServiceRoleKey;

	if (!supabaseUrl || !serverKey) {
		throw new Error(
			"Missing Supabase admin configuration. Please set NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY in your .env file."
		);
	}

	return createClient(supabaseUrl, serverKey, {
		auth: {
			persistSession: false,
		},
	});
}

export function createSupabasePublishableClient() {
	if (!supabaseUrl || !supabasePublishableKey) {
		throw new Error(
			"Missing Supabase publishable configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY in your .env file."
		);
	}

	return createClient(supabaseUrl, supabasePublishableKey, {
		auth: {
			persistSession: false,
		},
	});
}

export const STORAGE_BUCKET = "uploads";
