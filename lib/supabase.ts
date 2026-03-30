import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export function createSupabaseAdminClient() {
	if (!supabaseUrl || !supabaseServiceRoleKey) {
		throw new Error(
			"Missing Supabase admin configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file."
		);
	}

	return createClient(supabaseUrl, supabaseServiceRoleKey, {
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
