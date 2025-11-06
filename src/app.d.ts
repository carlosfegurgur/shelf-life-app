import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Cookies } from '@sveltejs/kit';

// Custom User interface
interface UserProfile {
	id: string;
	email: string;
	username: string | null;
}

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
			userProfile: UserProfile | null;
			cookies?: Cookies;
		}
		interface PageData {
			session: Session | null;
			user: User | null;
			userProfile: UserProfile | null;
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
